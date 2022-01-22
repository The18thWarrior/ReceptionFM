import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { DAppProvider } from '@usedapp/core';
import { Helmet } from "react-helmet";
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';

const config = {
  readOnlyChainId: process.env.CHAIN_ID,
  readOnlyUrls: {
    [process.env.CHAIN_ID]: process.env.CHAIN_RPC_URL,
  },
  multicallAddresses: {
    31337 : '0xa40b14bd26aa8b469182ecff4f02781a08946d83'
  }
};
const mdTheme = createTheme({
  spacing: 2,
  palette: {
    mode: 'dark',
  },
});

console.log(config);
/*
,
  multicallAddresses: {
    [process.env.CHAIN_ID] : 
  }
  */

ReactDOM.render(
  <React.StrictMode>
    <Helmet>
      <title>Reception.fm</title>
      <meta name="keywords" content="HTML,CSS,JavaScript" />
      <meta name="viewport" content="initial-scale=1, width=device-width" />
      <meta
        name="description"
        content="web3 Patreon"
      />
    </Helmet>
    <DAppProvider config={config}>
      <ThemeProvider theme={mdTheme}>
        <App />
      </ThemeProvider>
    </DAppProvider>    
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
