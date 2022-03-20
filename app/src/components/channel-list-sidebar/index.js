import env from "react-dotenv";
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Toolbar from '@mui/material/Toolbar';
import Drawer from '@mui/material/Drawer';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';


import { 
  getCurrentChannelIndex, 
  getChannelMetadata,
  getMembership 
} from '../../service/worksManager.js';
import { cleanImageUrl, fetchMetadata } from "../../service/utility";

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
    let asynFunction = async () => {
      await refreshList();
    }
    
    asynFunction();
  },[]);

  useEffect(() => {
    
  },[channelMetadata]);
  
  const refreshList = async () => {
    let currentIndex = await getCurrentChannelIndex();
    let channelList = [];
    if (currentIndex) {
      for (let i = 0;i <= currentIndex.toNumber();i++) {
        const channel = currentIndex.add(i);
        let channelMember = await getMembership(channel);
        if (channelMember.eq(1)) {
          let metadataUri = await getChannelMetadata(channel);
          if (metadataUri) {
            let metadataResponse = await fetchMetadata(channel, metadataUri);
            //updateChannelMap(channel, channelMedataResponse);
            channelList.push(metadataResponse);
          }
        }
        
      }
      setChannelMetadata(channelList);
    }
  };

  const cleanImageUrl = (uri) => {
    return "https://ipfs.io/ipfs/"+uri.replace('ipfs://', '');
  }

  const listOfChannels = (anchor) => (
    <div>
      { 
        channelMetadata.map((channel) => {
          let channelLink = '/channels/'+channel.id;
          return (
            <div key={channel.key}>
              <Tooltip title={channel.name}>
                <Link to={channelLink} >
                  <Avatar alt={channel.name} src={channel.parse_image} sx={{p:5, borderRadius:500}} />
                </Link>           
              </Tooltip>   
            </div>
          );
        })        
      }
    </div>
  );
  return (
    <div>
      {channelMetadata.length > 0 && 
        <Drawer
          anchor='left'
          variant="persistent"
          open={true}
        >
          <Toolbar />
          {listOfChannels('let')}
        </Drawer>
      }
    </div>
    
  );
}

export default ChannelList;