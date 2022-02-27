//import env from "react-dotenv";
import './App.css';
import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Home from './pages/home';
import Account from './pages/account';
import Header from './components/header/header';
import { styled } from '@mui/material/styles';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// Management View
import ChannelCreator from './pages/channelManager/components/channelCreator';
import ChannelList from './pages/channelManager/components/channelList';
import ChannelDetail from './pages/channelManager/components/channelDetail';

// Fan View
import Subscription from './pages/channelViewer/subcription';
import Timeline from './pages/channelViewer/timeline';
import FanChannelDetail from './pages/channelViewer/channelDetail';


const MainBox = styled(Box)(({ theme }) => ({
  bgcolor: 'text.disabled',
  display: 'block',
  height: ' 100vh',
  backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
  marginTop: '4rem'
}));

function App() {
  console.log('app render');
  //
  return (
    
    <BrowserRouter>
      <Header />
      <MainBox>
        <Routes >
          <Route path='/' element={<Home />} />
          <Route exact path='account' element={<Account />} />
          <Route exact path="manage" >
            <Route index  element={<ChannelList />} />
            <Route exact path="new"  element={<ChannelCreator />}/>
            <Route path=':channelId' element={<ChannelDetail />} />
          </Route>
          <Route exact path="channels" >
            <Route index element={<Timeline />} />
            <Route exact path="subscription"  element={<Subscription />}/>
            <Route path=':channelId' element={<FanChannelDetail />} />
          </Route>
        </Routes>
      </MainBox>
    </BrowserRouter>
  );
}

export default App;
