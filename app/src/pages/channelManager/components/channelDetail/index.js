
import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { DataGrid } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import { getChannelMetadata} from '../../../../service/worksManager';
import { channelListColumns } from '../../../../static/constants';
import MembershipList from "./components/membershipList.js";
import PostManager from "./components/postManager";
function ChannelDetail() {
  const { channelId } = useParams();

  const [submissionLoading, setSubmissionLoading] = useState(false);
  const [channelMetadata, setChannelMetadata] = useState({name: '', description: '', image: ''});

  useEffect(() => {
    //setChannelMetadata([]);
    //setChannelMap({});
    const getCMetadata = async () => {
      const channelUri = await getChannelMetadata(channelId);
      if (channelUri && !channelUri.includes('ipfs')) {
        let metadataRequest = await fetch("https://ipfs.io/ipfs/"+channelUri+'/metadata.json');
        let metadataResponse = await metadataRequest.json();
        metadataResponse["parse_image"] = cleanImageUrl(metadataResponse.image);
        setChannelMetadata(metadataResponse);
      }
    } 
    getCMetadata();
  },[channelId]);

  const cleanImageUrl = (uri) => {
    return "https://ipfs.io/ipfs/"+uri.replace('ipfs://', '');
  }

  return (
    <Box maxWidth="max" sx={{pt: 4, my: 8}} className="dark-background">
      <Box maxWidth="lg" sx={{mx: "auto", bgcolor: 'info.main'}}>
        <Grid container spacing={2} sx={{mb: 16}}>
          <Grid item xs={4} >
            <TextField
              id="name"
              label="Channel Name"
              variant="filled"
              fullWidth
              disabled 
              value={channelMetadata.name}
              sx={{m: 8, color: 'text.primary'}}
              className='overwrite-disabled'
            />
            <TextField
              id="description"
              label="Description"
              variant="filled"
              fullWidth
              disabled 
              multiline
              rows={4}
              value={channelMetadata.description}
              sx={{m: 8, color: "white"}}
              className='overwrite-disabled'
            />
          </Grid>
          <Grid item xs={3}></Grid>
          <Grid item xs={4} sx={{m: 8}}>
            <img src={channelMetadata.parse_image} alt='' style={{ "maxWidth": "250px", width: "-webkit-fill-available"}} />
          </Grid>
        </Grid>
      </Box>

      <Box maxWidth="lg" sx={{mx: "auto", mb: 32}} className="dark-background">
        <Grid container spacing={2} sx={{mb: 16}}>
          <Grid item xs={5}  sx={{mx: "auto", mb: 16}}>
            <MembershipList></MembershipList>
          </Grid>
          <Grid item xs={7} >
            <PostManager></PostManager>
          </Grid>
        </Grid>

      </Box>
        
    </Box>
  )
}

export default ChannelDetail;
