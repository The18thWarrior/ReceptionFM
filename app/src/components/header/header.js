import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useLocation  } from 'react-router-dom';
import { useEtherBalance, useEthers } from '@usedapp/core';
import { formatEther } from '@ethersproject/units';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuLinks from './menu';
import {AccountButton} from './accountButton';
import ChannelListSidebar from '../channel-list-sidebar';
import logo2 from '../../static/images/logo2.png';

function Header() {
  const {account} = useEthers();
  const [menuType, setMenuType] = useState('');
  let navigate = useNavigate();
  const location = useLocation();

  function menuHasChanged(menu) {
    let menuResponse = menu;
    if (menuResponse === 'artist' && !location.pathname.startsWith('/manage')) {
      navigate("/");
    } else if (menuResponse === 'fan' && !location.pathname.startsWith('/channels')){
      navigate("/channels");
    } else if (menuResponse === '' && location.pathname.startsWith('/manage')) {
      menuResponse = 'artist';
    } else if (menuResponse === '' && location.pathname.startsWith('/channels')) {
      menuResponse = 'fan';
    }

    setMenuType(menuResponse);
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="absolute" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>            
          <Box sx={{ flexGrow: 1, mx: 6 }}>
            <img src={logo2} className="header-image"/>
          </Box>
          {account ? (
            <div>
              <AccountButton sx={{ flexGrow: 1, mx: 6, display:'inline-block' }} menuChange={menuHasChanged} ui={menuType}></AccountButton>
              <MenuLinks sx={{ flexGrow: 1, mx: 6, display:'inline-block' }} ui={menuType} />
            </div>
          ) : (
            <AccountButton sx={{ flexGrow: 1, mx: 6 }} menuChange={menuHasChanged}></AccountButton>
          )}          
        </Toolbar>
      </AppBar>
      
      {account && 
        <ChannelListSidebar></ChannelListSidebar>
      }
    </Box>
  );
}
// 
export default Header;