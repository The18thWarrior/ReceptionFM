import {env} from './static/constants';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { DAppProvider, Mainnet } from '@usedapp/core';
import { Helmet } from "react-helmet";
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';

console.log('test');
const config = {
  multicallAddresses: {
    //31337 : '0xa40b14bd26aa8b469182ecff4f02781a08946d83'
    [env.REACT_APP_CHAIN_ID] : env.REACT_APP_MULTICALL_ADDRESS
  }
};
const config2 = {
  readOnlyChainId: Mainnet.chainId,
  readOnlyUrls: {
    [Mainnet.chainId]: 'https://mainnet.infura.io/v3/3165a249c65f4198bf57200109b8fadf',
  },
};

console.log(config);
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
