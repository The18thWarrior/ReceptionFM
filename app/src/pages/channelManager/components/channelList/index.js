import env from "react-dotenv";
import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useContractCall } from "@usedapp/core";
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Link } from 'react-router-dom';

import { getOwnerChannelIds, getChannelMetadata } from '../../../../service/worksManager';
import { cleanImageUrl, fetchMetadata } from "../../../../service/utility";

function ChannelList() {

  const columns = [
    {
      field: 'name',
      headerName: 'Channel Name',
      flex:2,
      editable: false,
      sortable: true
    },
    {
      field: 'description',
      headerName: 'Channel Description',
      flex:3,
      editable: false,
      sortable: false
    },
    {
      field: 'parse_image',
      headerName: 'Channel Image',
      flex:2,
      editable: false,
      sortable: false,
      renderCell: (params)=>{
        return (
            <img src={params.row.parse_image} alt='' style={{width: "-webkit-fill-available"}} />
        )
      }
    },
    {
      field: 'manageButton',
      renderHeader: () => (
        <IconButton color="primary" aria-label="refresh list" onClick={refreshList} sx={{mx:"auto", color: "text.primary"}}>
          <RefreshIcon />
        </IconButton>
      ),
      flex:1,
      editable: false,
      sortable: false,
      renderCell: (params) => {
        let channelLink = '/manage/'+params.row.id;
        return <Button component={Link} to={channelLink} variant="outlined" color="primary" sx={{mx:"auto"}}>Manage</Button>
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
      const channelVals = await getOwnerChannelIds();
      let channelList = [];
      if (channelVals) {
        for (let channel of channelVals) {
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
    const channelVals = await getOwnerChannelIds();
    let channelList = [];
    if (channelVals) {
      for (let channel of channelVals) {
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
      <div style={{ height: 400, width: '100%', paddingTop: '5vh'}}>
        <DataGrid
          rows={channelMetadata}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          disableColumnMenu
          sx={{mx:'auto', width: '80vw'}}
        />
      </div>
    </div>
  );
}

export default ChannelList;