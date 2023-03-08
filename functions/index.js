const functions = require("firebase-functions");
const admin = require('firebase-admin');
const TwitterApi = require('twitter-api-v2').default;
admin.initializeApp();
// Database reference
const dbRef = admin.firestore().doc('tokens/nft');

// Take the text parameter passed to this HTTP endpoint and insert it into 
// Firestore under the path /messages/:documentId/original
exports.addMessage = functions.https.onRequest(async (req, res) => {
    // Grab the text parameter.
    const original = req.query.text;
    // Push the new message into Firestore using the Firebase Admin SDK.
    const writeResult = await admin.firestore().collection('messages').add({original: original});
    // Send back a message that we've successfully written the message
    res.json({result: `Message with ID: ${writeResult.id} added.`});
  });

  // Listens for new messages added to /messages/:documentId/original and creates an
// uppercase version of the message to /messages/:documentId/uppercase
exports.makeUppercase = functions.firestore.document('/messages/{documentId}')
.onCreate((snap, context) => {
  // Grab the current value of what was written to Firestore.
  const original = snap.data().original;

  // Access the parameter `{documentId}` with `context.params`
  functions.logger.log('Uppercasing', context.params.documentId, original);
  
  const uppercase = original.toUpperCase();
  
  // You must return a Promise when performing asynchronous tasks inside a Functions such as
  // writing to Firestore.
  // Setting an 'uppercase' field in Firestore document returns a Promise.
  return snap.ref.set({uppercase}, {merge: true});
});

// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// Twitter API init

const twitterClient = new TwitterApi({
    clientId: 'b0JUQ1J0cDZsVHhJR2t2bXhubWY6MTpjaQ',
    clientSecret: 'sG_PqioSuY9HhrxxlLF-kRDEkCuR6VYx5sHoadczm3Gf10hl5V',
});

const callbackURL = 'http://127.0.0.1:5000/twitterbot-f1dbe/us-central1/callback';

exports.auth = functions.https.onRequest(async (request, response) => {

    const { url, codeVerifier, state } = twitterClient.generateOAuth2AuthLink(
        callbackURL,
        { scope: ['tweet.read', 'tweet.write', 'users.read', 'offline.access'] }
    );

    // store verifier
    await dbRef.set({ codeVerifier, state });

    response.redirect(url);
})

// STEP 2 - Verify callback code, store access_token 
exports.callback = functions.https.onRequest(async (request, response) => {
    const { state, code } = request.query;

    const dbSnapshot = await dbRef.get();
    const { codeVerifier, state: storedState } = dbSnapshot.data();

    if (state !== storedState) {
        return response.status(400).send('Stored tokens do not match!');
    }

    const {
        client: loggedClient,
        accessToken,
        refreshToken,
    } = await twitterClient.loginWithOAuth2({
        code,
        codeVerifier,
        redirectUri: callbackURL,
    });

    await dbRef.set({ accessToken, refreshToken });

    // const { data } = await loggedClient.v2.me(); // start using the client if you want
    response.sendStatus(200);

    // response.send(data);
});

// const mediaUrl = 'https://ipfs.io/ipfs/bafybeiff5cvyz26apodov36t3pkthach2y2j5clclq6v3z5236ydno4tcy/8.png';

// // Download the image from the URL
// request(mediaUrl).pipe(fs.createWriteStream('image.png')).on('close', async function () {
//     try {
//         // Upload the image to Twitter
//         const mediaUpload = await twitterClient.v1.uploadMedia("./image.png");
//         const media_id = mediaUpload.media_id_string;
//         mediaId = media_id
//     } catch (error) {
//         console.error(error);
//     }
// });

// STEP 3 - Refresh tokens and post tweets
exports.tweet = functions.https.onRequest(async (request, response) => {
    try {

        const contractName = request.query.contractName
        const tokenId = request.query.tokenId
        const twitterUsername = request.query.twitterUsername
        const image_url = request.query.image_url

        const { refreshToken } = (await dbRef.get()).data();

        const {
            client: refreshedClient,
            accessToken,
            refreshToken: newRefreshToken,
        } = await twitterClient.refreshOAuth2Token(refreshToken);

        await dbRef.set({ accessToken, refreshToken: newRefreshToken });


        // Post a tweet with the uploaded image
        const { data } = await refreshedClient.v2.tweet(
            `${contractName} ${tokenId} reported stolen by @${twitterUsername}\nNFT_URL:${image_url}`
        );

        //console.log(`Tweet posted with ID ${tweet.id_str}`);


        response.send(data);

    } catch (error) {
        console.error(error);
    }
});
