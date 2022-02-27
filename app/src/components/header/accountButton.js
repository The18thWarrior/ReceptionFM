import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useEthers, shortenAddress, useLookupAddress } from '@usedapp/core';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import HeaderSwitch from './header-switch.js';

export const AccountButton = (inputs) => {
  const { account, deactivate, activateBrowserWallet } = useEthers();
  const [menuType, setMenuType] = useState('artist');
  const ens = useLookupAddress();
  
  const [activateError, setActivateError] = useState('')
  const { error } = useEthers()
  useEffect(() => {
    if (error) {
      setActivateError(error.message)
    }
  }, [error]);

  useEffect(() => {
    inputs.menuChange(menuType);
  }, [menuType])

  const activate = async () => {
    setActivateError('')
    activateBrowserWallet()
  }

  function menuChange(value) {
    setMenuType(value);
  }

  return (
    <div>
      <div>{activateError}</div>
      {account ? (
        <>
          {
            menuType === 'artist' && 
            <IconButton component={Link} to="/manage/new" variant="contained" color="primary" sx={{}} aria-label="delete" size="large">
              <AddIcon fontSize="inherit" />
            </IconButton>
          }
          
          <HeaderSwitch switchType="artist" sx={{display: "contents"}} valueChange={menuChange}></HeaderSwitch>
          <Button onClick={() => deactivate()} sx={{}} >Disconnect</Button>
        </>
      ) : (
        <Button color="secondary" variant="contained"
          onClick={activate}
        >Connect</Button>
      )}
    </div>
  )
}

