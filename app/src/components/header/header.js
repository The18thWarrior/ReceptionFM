import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate  } from 'react-router-dom';
import { useEtherBalance, useEthers } from '@usedapp/core';
import { formatEther } from '@ethersproject/units';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuLinks from './menu';
import {AccountButton} from './accountButton';
import logo2 from '../../static/images/logo2.png';

function Header() {
  const {account} = useEthers();
  const [menuType, setMenuType] = useState('artist');
  let navigate = useNavigate();

  function menuHasChanged(menu) {
    setMenuType(menu);
    console.log(menu);
    if (menu === 'artist') {
      navigate("/");
    } else if (menu === 'fan'){
      navigate("/channels");
    }
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="absolute">
        <Toolbar>
           {account && 
            <MenuLinks ui={menuType} />
           }
            
          <Box sx={{ flexGrow: 1, mx: 6 }}>
            <img src={logo2} className="header-image"/>
          </Box>
          
          
          <AccountButton sx={{ flexGrow: 1, mx: 6 }} menuChange={menuHasChanged}></AccountButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
// 
export default Header;