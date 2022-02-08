import env from "react-dotenv";
import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useContractCall } from "@usedapp/core";
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import { getOwnerChannelIds, getChannelMetadata } from '../../../../service/worksManager';
import { channelListColumns } from '../../../../static/constants';
import { cleanImageUrl, fetchMetadata } from "../../../../service/utility";

//let worksManagerAddress = env.REACT_APP_WORKSMANAGER_ADDRESS;

const columns = channelListColumns;

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
      const channelVals = await getOwnerChannelIds();
      let channelList = [];
      if (channelVals) {
        for (let channel of channelVals) {
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
    <div className="dark-background" style={{ height: '100%'}}>
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