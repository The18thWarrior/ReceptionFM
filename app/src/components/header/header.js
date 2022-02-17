import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
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

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="absolute">
        <Toolbar>
           {account && 
            <MenuLinks />
           }
            
          <Box sx={{ flexGrow: 1, mx: 6 }}>
            <img src={logo2} className="header-image"/>
          </Box>
          
          
          <AccountButton></AccountButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
// 
export default Header;