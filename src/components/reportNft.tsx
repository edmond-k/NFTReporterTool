import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useEthers, useNotifications } from "@usedapp/core";
import {
  Container,
  Box,
  Button,
  CircularProgress,
  Snackbar,
  Alert
} from "@mui/material";
import type {} from "@mui/lab/themeAugmentation";
import { Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import { Reports } from "../hooks/report";

export const ReportNFT = () => {
  const { notifications } = useNotifications();
  const [contractAddress, setContractAddress] = useState<string>("0x");
  const [tokenID, setTokenID] = useState<number>(0);
  const [username, setUsername] = useState<string>("");

  const { account } = useEthers();
  const {makeReport, transactState} = Reports()
  const isConnected = account !== undefined;


  const handleContractChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newAddress = event.target.value === "" ? "" : String(event.target.value);
    setContractAddress(newAddress);
  };

  const handleTokenChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTokenID = Number(event.target.value);
    setTokenID(newTokenID);
  };

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newUsername = event.target.value === "" ? "" : String(event.target.value);
    setUsername(newUsername);
  };

  const sendInfo = () => {
    makeReport(contractAddress, tokenID);
    getNFTInfo()
  };
  
  const isMining = transactState.status === "Mining";

  const [addDataSuccess, setAddDataSuccess] = useState(false);

  useEffect(() => {
    if (
      notifications.filter(
        (notification) =>
          notification.type === "transactionSucceed" &&
          notification.transactionName === "makeReport"
      ).length > 0
    ) {
      setAddDataSuccess(true);
    }
  }, [notifications, addDataSuccess]);

  const handleCloseSnack = () => {
    setAddDataSuccess(false);
  };

  const getNFTInfo = async() => {
    const response = await axios.get(`https://api.covalenthq.com/v1/250/tokens/${contractAddress}/nft_metadata/${tokenID}/?key=${process.env.REACT_APP_API_KEY}`,
    );
    let contractName = response.data.data.items[0].contract_name;
    let image_url = response.data.data.items[0].nft_data[0].external_data.image_1024

    const tweet_id = await axios.get(`https://us-central1-twitterbot-f1dbe.cloudfunctions.net/tweet?contractName=${contractName}&tokenId=${tokenID}&twitterUsername=${username}&image_url=${image_url}`)
    console.log(tweet_id)
  }


  return (
    <Container
      maxWidth="lg"
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        justifyContent: "center"
      }}
    >
      <Box>
        <Typography
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 13,
            fontWeight: "bold",
            fontSize: 26,
            fontFamily: "Audiowide"
          }}
          color="white"
        >
          REPORT YOUR STOLEN NFT
        </Typography>
        <Box
          sx={{
            bgcolor: "transparent",
            alignItems: "left",
            flexDirection: "column",
            minHeight: 400,
            minWidth: { sx: "auto", md: 400 },
            marginRight: "auto",
            marginLeft: "auto",
            justifyContent: "center",
            marginTop: 3
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              m: 3,
              mt: 7
            }}
          >
            <TextField
              inputProps={{ style: { color: "white" } }}
              InputLabelProps={{ style: { color: "white" } }}
              FormHelperTextProps={{ style: { color: "white" } }}
              sx={{ fontWeight: "bold", mb: 2, "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                borderColor: "blue"
              }}}
              required={true}
              id="outlined-required"
              placeholder="NFT Contract Address"
              helperText="Contract Address"
              label="Required"
              onChange={handleContractChange}
            />
            <TextField
              inputProps={{ style: { color: "white" } }}
              InputLabelProps={{ style: { color: "white" } }}
              FormHelperTextProps={{ style: { color: "white" } }}
              sx={{ fontWeight: "bold", mb: 2, "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                borderColor: "blue"
              } }}
              required={true}
              id="outlined-required"
              label="Required"
              placeholder="NFT TokenID"
              helperText="Token ID"
              onChange={handleTokenChange}
            />
            <TextField
              inputProps={{ style: { color: "white" } }}
              InputLabelProps={{ style: { color: "white" } }}
              FormHelperTextProps={{ style: { color: "white" } }}
              sx={{ fontWeight: "bold", "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                borderColor: "blue"
              } }}
              required={true}
              id="outlined-required"
              label="Required"
              placeholder="Your Twitter Username"
              helperText="Twitter username"
              onChange={handleUsernameChange}
            />
            <Box
              sx={{
                alignItems: "center",
                flexDirection: "column",
                justifyContent: "center"
              }}
            >
              
              {isConnected ? (
                <Button
                  sx={{ mt: 8 }}
                  color="primary"
                  variant="contained"
                  onClick={sendInfo}
                  disabled={isMining}
                >
                  {isMining ? (
                    <CircularProgress color="primary" size={35} />
                  ) : (
                    "FILE REPORT"
                  )}
                </Button>
              ) : (
                <Alert severity="info">
                  Connect Wallet to Make a Report
                </Alert>
              )}
            </Box>
  
            <Snackbar
              open={addDataSuccess}
              autoHideDuration={5000}
              onClose={handleCloseSnack}
            >
              <Alert onClose={handleCloseSnack} severity="success">
                NFT reported at <a href="https://twitter.com/NFTReporterTool">NFTReporterTool Twitter</a>
              </Alert>
            </Snackbar>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};