import React, { useState, useEffect } from "react";
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
import { SendClaimRemoval } from "../hooks/removeClaim";

export const Removeclaim = () => {
  const { notifications } = useNotifications();
  const [contractAddress, setContractAddress] = useState<string>("0x");
  const [tokenID, setTokenID] = useState<number>(0);


  const { account } = useEthers();
  const {removeReported, removalState} = SendClaimRemoval()
  const isConnected = account !== undefined;


  const handleContractChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newAddress = event.target.value === "" ? "" : String(event.target.value);
    setContractAddress(newAddress);
  };

  const handleTokenChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTokenID = Number(event.target.value);
    setTokenID(newTokenID);
  };


  const sendRemovalRequest = () => {
    removeReported(contractAddress, tokenID);
  };
  
  const isMining = removalState.status === "Mining";

  const [addDataSuccess, setAddDataSuccess] = useState(false);

  useEffect(() => {
    if (
      notifications.filter(
        (notification) =>
          notification.type === "transactionSucceed" &&
          notification.transactionName === "removeReport"
      ).length > 0
    ) {
      setAddDataSuccess(true);
    }
  }, [notifications, addDataSuccess]);

  const handleCloseSnack = () => {
    setAddDataSuccess(false);
  };

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
          REMOVE NFT REPORT
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
              } }}
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
                  onClick={sendRemovalRequest}
                  disabled={isMining}
                >
                  {isMining ? (
                    <CircularProgress color="primary" size={35} />
                  ) : (
                    "REMOVE REPORT"
                  )}
                </Button>
              ) : (
                <Alert severity="info">
                  Connect Wallet to Remove Report
                </Alert>
              )}
            </Box>
  
            <Snackbar
              open={addDataSuccess}
              autoHideDuration={5000}
              onClose={handleCloseSnack}
            >
              <Alert onClose={handleCloseSnack} severity="success">
                NFT theft claim of {contractAddress} Token ID:{tokenID} has been removed
              </Alert>
            </Snackbar>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};