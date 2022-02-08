import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useEthers, shortenAddress, useLookupAddress } from '@usedapp/core';
import Button from '@mui/material/Button';

export const AccountButton = () => {
  const { account, deactivate, activateBrowserWallet } = useEthers();
  const ens = useLookupAddress();
  
  const [activateError, setActivateError] = useState('')
  const { error } = useEthers()
  useEffect(() => {
    if (error) {
      setActivateError(error.message)
    }
  }, [error])

  const activate = async () => {
    setActivateError('')
    activateBrowserWallet()
  }

  return (
    <div>
      <div>{activateError}</div>
      {account ? (
        <>
          <Button component={Link} to="/new" variant="contained" color="primary" sx={{mx:2}}>
            Create Channel
          </Button>
          <Button onClick={() => deactivate()}>Disconnect</Button>
        </>
      ) : (
        <Button color="secondary" variant="contained"
          onClick={activate}
        >Connect</Button>
      )}
    </div>
  )
}

