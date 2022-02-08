//import env from "react-dotenv";
import './App.css';
import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Home from './pages/home';
import Account from './pages/account';
import Header from './components/header/header';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ChannelCreator from './pages/channelManager/components/channelCreator';
import ChannelList from './pages/channelManager/components/channelList';
import ChannelDetail from './pages/channelManager/components/channelDetail';

function App() {
  console.log('app render');
  //
  return (
    
    <BrowserRouter>
      <Header />
      <Box
        sx={{
          bgcolor: 'text.disabled',
          display: 'block',
          mt: 32
        }}
      >
        <Routes >
          <Route path='/' element={<Home />} />
          <Route exact path='account' element={<Account />} />
          <Route exact path="manage"  element={<ChannelList />}/>
          <Route exact path="new"  element={<ChannelCreator />}/>
          <Route path=':channelId' element={<ChannelDetail />} />
        </Routes>
      </Box>
    </BrowserRouter>
    );
}

export default App;
