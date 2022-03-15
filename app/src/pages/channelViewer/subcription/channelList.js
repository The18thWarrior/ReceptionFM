import env from "react-dotenv";
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { useContractCall } from "@usedapp/core";
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import RefreshIcon from '@mui/icons-material/Refresh';

import { getCurrentChannelIndex, getChannelMetadata } from '../../../service/worksManager.js';
import { channelListColumnsFan } from '../../../static/constants';
import { cleanImageUrl, fetchMetadata } from "../../../service/utility";

//let worksManagerAddress = env.REACT_APP_WORKSMANAGER_ADDRESS;

function ChannelList() {
  const columns = [
    {
      field: 'name',
      headerName: 'Channel Name',
      width: 150,
      editable: false,
      sortable: true
    },
    {
      field: 'description',
      headerName: 'Channel Description',
      width: 250,
      editable: false,
      sortable: false
    },
    {
      field: 'parse_image',
      headerName: 'Channel Image',
      width: 250,
      editable: false,
      sortable: false,
      renderCell: (params)=>{
        return (
            <img src={params.row.parse_image} alt='' style={{width: "-webkit-fill-available"}} />
        )
      }
    },
    {
      field: 'accessButton',
      renderHeader: () => (
        <IconButton color="primary" aria-label="refresh list" onClick={refreshList} sx={{mx:"auto", color: "text.primary"}}>
          <RefreshIcon />
        </IconButton>
      ),
      width: 250,
      editable: false,
      sortable: false,
      renderCell: (params) => {
        let channelLink = '/channels/'+params.row.id;
        return <Button component={Link} to={channelLink} variant="outlined" color="primary" sx={{mx:"auto"}}>Access</Button>
      }
    }
  ];

  const [channelMetadata, setChannelMetadata] = useState([]);
  const updateChannelMetadata = (metadata) => {
    setChannelMetadata([...channelMetadata, metadata]);
  }
  const [channelMap, setChannelMap] = useState({});
  const updateChannelMap = (channel, metadata) => {
    let cm = [...channelMap];
    cm[channel] = metadata;
    setChannelMap(cm);
  }

  useEffect(() => {
    //setChannelMetadata([]);
    //setChannelMap({});
    const getChannelList = async () => {
      let currentIndex = await getCurrentChannelIndex();
      let channelList = [];
      if (currentIndex) {
        for (let i = 0;i <= currentIndex.toNumber();i++) {
          const channel = currentIndex.add(i);
          let channelMetadataUri = await getChannelMetadata(channel);
          if (channelMetadataUri) {
            let channelMetadataResponse = await fetchMetadata(channel, channelMetadataUri);
            //updateChannelMap(channel, channelMedataResponse);
            channelList.push(channelMetadataResponse);
          }
        }
        setChannelMetadata(channelList);
      }
    } 
    getChannelList();
  },[]);
  
  const refreshList = async () => {
    let currentIndex = await getCurrentChannelIndex();
    let channelList = [];
    if (currentIndex) {
      for (let i = 0;i <= currentIndex.toNumber();i++) {
        const channel = currentIndex.add(i);
        let channelMetadataUri = await getChannelMetadata(channel);
        if (channelMetadataUri) {
          let channelMetadataResponse = await fetchMetadata(channel, channelMetadataUri);
          //updateChannelMap(channel, channelMedataResponse);
          channelList.push(channelMetadataResponse);
        }
      }
      setChannelMetadata(channelList);
    }
  };

  return (
    <div className="dark-background" style={{ height: ' 100vh'}}>
      <div style={{ height: 400, width: '100%'}}>
        <DataGrid
          rows={channelMetadata}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          disableColumnMenu
        />
      </div>
    </div>
  );
}

export default ChannelList;