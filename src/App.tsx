import React from 'react'
import {Config, DAppProvider, FantomTestnet} from "@usedapp/core"
import {MuiNavBar} from "./components/NavBar"
import { ReportNFT } from './components/reportNft'
import {Removeclaim} from './components/deleteClaim'
import {Container} from "@mui/material"
import { Routes, Route } from "react-router-dom";


const config: Config = {
  readOnlyChainId: FantomTestnet.chainId,
  readOnlyUrls: {
    [FantomTestnet.chainId]: 'https://rpc.ankr.com/fantom_testnet/',
  },
  networks: [FantomTestnet],
  notifications: {
    expirationPeriod: 1000,
    checkInterval: 1000
  }
}


function App() {
  return (
    <DAppProvider config={config}>
       <MuiNavBar />
      <Container maxWidth="md">
      <Routes>
      <Route path="/" element={<ReportNFT />}/>
        <Route path="/Add" element={<ReportNFT />}/>
        <Route path="/Remove" element={<Removeclaim />}/>
      </Routes>
      </Container>
    </DAppProvider>
  );
}

export default App;
