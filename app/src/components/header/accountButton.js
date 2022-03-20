import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useEthers, shortenAddress, useLookupAddress } from '@usedapp/core';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import HeaderSwitch from './header-switch.js';
import CreateChannel from '../create-channel';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';

export const AccountButton = (inputs) => {
  const { account, deactivate, activateBrowserWallet } = useEthers();
  const [menuType, setMenuType] = useState('');
  const [errorModalOpen, setErrorModalOpen] = React.useState(false);
  const ens = useLookupAddress();
  let initialRenderComplete = React.useRef(false);
  
  const [activateError, setActivateError] = useState('')
  const { error } = useEthers()
  useEffect(() => {
    console.log(JSON.stringify(error));
    if (error) {
      setActivateError(error.message);
      if(error.name === 'UnsupportedChainIdError') {
        setErrorModalOpen(true);
      }
    } else {
      setErrorModalOpen(false);
      setActivateError('')
    }
  }, [error]);

  useEffect(() => {
    inputs.menuChange(menuType);
  }, [menuType]);

  useEffect(() => {
    setMenuType(inputs.ui);
  }, [inputs.ui]);

  const activate = async () => {
    setActivateError('')
    activateBrowserWallet()
    setErrorModalOpen(false);
  }

  function menuChange(value) {
    setMenuType(value);
  }

  function closeErrorModal() {
    setActivateError('')
    setErrorModalOpen(false);
  }

  function doNotClose() {
    console.log('sorry you can\'t close this');
  }

  return (
    <div style={{display:'inline-block'}}>
      {/*<div>{activateError}</div>*/}
      {account ? (
        <>
          {
            menuType === 'artist' && 
            /*<IconButton component={Link} to="/manage/new" variant="contained" color="primary" sx={{}} aria-label="delete" size="large">
              <AddIcon fontSize="inherit" />
            </IconButton>*/
            <CreateChannel></CreateChannel>
          }
          
          <HeaderSwitch switchType="artist" sx={{display: "contents"}} valueChange={menuChange} value={menuType}></HeaderSwitch>
          {/*<Button onClick={() => deactivate()} sx={{}} >Disconnect</Button>*/}
        </>
      ) : (
        <Button color="secondary" variant="contained"
          onClick={activate}
        >Connect</Button>
      )}

      <Dialog 
        open={errorModalOpen} 
        onClose={doNotClose}
        disableEscapeKeyDown={true}
        onBackdropClick={doNotClose}
      >
        <DialogTitle>
          Error 
        </DialogTitle>
        <DialogContent>
          <Box sx={{ }} className="transparent-background">
            Connected to wrong network, please switch to Polygon Testnet.             
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  )
}

