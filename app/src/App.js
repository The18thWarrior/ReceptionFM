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
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/account' element={<Account />} />
          <Route exact path="/manage"  element={<ChannelList />}/>
          <Route exact path="/newChannel"  element={<ChannelCreator />}/>
          <Route exact path="/channel/:id"  element={<ChannelDetail />}/>
        </Routes>
      </Box>
    </BrowserRouter>
    );
}

export default App;
