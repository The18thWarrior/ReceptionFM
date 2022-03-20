import React from 'react';
import { Link } from 'react-router-dom';
//import { useEtherBalance, useEthers } from '@usedapp/core';
import { formatEther } from '@ethersproject/units';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import logo2 from '../../static/images/logo2.png';
import { useEthers } from '@usedapp/core';

function MenuLinks (data) {
  const { account, deactivate, activateBrowserWallet } = useEthers();
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleMenu = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  let artistLinkList = [
    {
      name: 'Dashboard',
      link: '/'
    },
    {
      name: 'My Account',
      link: '/account'
    },
    {
      name: 'Channel Manager',
      link: '/manage/'
    }
  ];
  let fanLinkList = [
    {
      name: 'My Account',
      link: '/account'
    },
    {
      name: 'Timeline',
      link: '/channels/'
    },
    {
      name: 'Subscriptions',
      link: '/channels/subscription'
    }
  ];

  const list = (anchor) => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleMenu(anchor, false)}
      onKeyDown={toggleMenu(anchor, false)}
    >
      <Box sx={{ mx: 'auto' }}>
        <img src={logo2} className="side-image"/>
      </Box>
      <List>
        {data.ui === 'artist' && 
          (artistLinkList.map((linkVal) => (
            <ListItem button component={Link} to={linkVal.link} key={linkVal.name}>   
              <ListItemText primary={linkVal.name}/>
            </ListItem>
          )))
        }

        {data.ui === 'fan' && 
          (fanLinkList.map((linkVal) => (
            <ListItem button component={Link} to={linkVal.link} key={linkVal.name}>   
              <ListItemText primary={linkVal.name}/>
            </ListItem>
          )))
        }
      </List>
      <Box sx={{position: 'absolute', bottom:"1vh", width:"100%"}}>
        <Button onClick={() => deactivate()} style={{marginLeft:'auto', marginRight:'auto', display:'block'}} >Disconnect</Button>
      </Box>
    </Box>
  );

  return (
    <div style={{display:'inline-block'}}>
      <MenuIcon onClick={toggleMenu('right', true)} sx={{verticalAlign: 'middle'}}></MenuIcon>
      <Drawer
        anchor={'right'}
        open={state['right']}
        onClose={toggleMenu('right', false)}
      >
        {list('right')}
      </Drawer>
    </div>
  )
}
export default MenuLinks;