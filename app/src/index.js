import {env} from './static/constants';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { DAppProvider, Mainnet, ChainId,  } from '@usedapp/core';
import { Helmet } from "react-helmet";
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';

console.log('test');
const config_local = {
  multicallAddresses: {
    //31337 : '0xa40b14bd26aa8b469182ecff4f02781a08946d83'
    [env.REACT_APP_CHAIN_ID] : env.REACT_APP_MULTICALL_ADDRESS,
    [ChainId.Mumbai]: env.REACT_APP_MULTICALL_MUMBAI,
  }
};
const config = {
  networks: [
    {
      chainId: env.REACT_APP_CHAIN_ID,
      multicallAddresses : env.REACT_APP_MULTICALL_ADDRESS
    },
    {
      chainId: 31337,
      multicallAddresses : '0x76ee9222c8c377c5e365df1c4bd2e4495022528d'
    },
    {
      chainId: ChainId.Mumbai,
      multicallAddresses : env.REACT_APP_MULTICALL_MUMBAI
    }
  ]
};

const finalConfig = config_local;
const mdTheme = createTheme({
  spacing: 2,
  palette: {
    mode: 'dark',
  },
});
/*
<Helmet>
  <title>Reception.fm</title>
  <meta name="keywords" content="HTML,CSS,JavaScript" />
  <meta name="viewport" content="initial-scale=1, width=device-width" />
  <meta
    name="description"
    content="web3 Patreon"
  />
</Helmet>
*/
ReactDOM.render(
  <React.StrictMode>
    
    <DAppProvider config={finalConfig}>
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
