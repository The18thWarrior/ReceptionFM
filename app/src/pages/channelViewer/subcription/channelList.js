import env from "react-dotenv";
import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useContractCall } from "@usedapp/core";
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import { getCurrentChannelIndex, getChannelMetadata } from '../../../service/worksManager.js';
import { channelListColumnsFan } from '../../../static/constants';
import { cleanImageUrl, fetchMetadata } from "../../../service/utility";

//let worksManagerAddress = env.REACT_APP_WORKSMANAGER_ADDRESS;

const columns = channelListColumnsFan;

function ChannelList() {
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
      console.log(currentIndex.add(500));
      console.log('currentIndex');
      let channelList = [];
      if (currentIndex) {
        for (let i = 0;i <= currentIndex.toNumber();i++) {
          const channel = currentIndex.add(i);
          let channelMetadataUri = await getChannelMetadata(channel);
          if (channelMetadataUri) {
            let channelMetadataResponse = await fetchMetadata(channel, channelMetadataUri);
            console.log(channelMetadataResponse);
            //updateChannelMap(channel, channelMedataResponse);
            channelList.push(channelMetadataResponse);
          }
        }
        setChannelMetadata(channelList);
      }
    } 
    getChannelList();
  },[]);
  

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