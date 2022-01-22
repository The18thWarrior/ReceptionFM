import React from 'react';
import { Link } from 'react-router-dom';
import { useEtherBalance, useEthers } from '@usedapp/core';
import { formatEther } from '@ethersproject/units';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuLinks from './menu';

function Header() {
  const { activateBrowserWallet, account, deactivate } = useEthers()
  const etherBalance = useEtherBalance(account);
  
  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="absolute">
        <Toolbar>
          {account &&
            <MenuLinks />
          }
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1, mx: 6 }}
          >
            Reception.fm
          </Typography>
          
          {account === undefined && 
            <Button color="secondary" variant="contained"
              onClick={() => activateBrowserWallet()}
            >Connect</Button>
          }

          {account && 
            <Button component={Link} to="/account" variant="contained" color="primary" sx={{mx:2}}>
              Account
            </Button>
          }


          {account && 
            <Button color="secondary" variant="contained" sx={{mx:2}}
              onClick={() => deactivate()}
            >Disconnect</Button>
          }
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Header;