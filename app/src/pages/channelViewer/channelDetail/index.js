
import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { DataGrid } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { getChannelMetadata, getChannelPostContract} from '../../../service/worksManager';
import { channelListColumns } from '../../../static/constants';
import MembershipDetail from "./components/membershipDetail.js";
import PostList from "./components/postList.js";

function ChannelDetail() {
  const { channelId } = useParams();

  const [submissionLoading, setSubmissionLoading] = useState(false);
  const [postContract, setPostContract] = useState('');
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
        console.log(metadataResponse);
        setChannelMetadata(metadataResponse);
      }
    } 
    getCMetadata();
  },[channelId]);

  const cleanImageUrl = (uri) => {
    return "https://ipfs.io/ipfs/"+uri.replace('ipfs://', '');
  }
  

  useEffect(() => {
    //setChannelMetadata([]);
    //setChannelMap({});
    const getChannelPosts = async () => {
      try {
        const postContractAddress = await getChannelPostContract(channelId);
        console.log(postContractAddress);
        setPostContract(postContractAddress);
      } catch (e) {
        console.log(e);
      }
    }; 
    getChannelPosts();
  },[channelId]);


  return (
    <Box maxWidth="max" sx={{pt: 4, my: 8}} className="dark-background">
      <Box maxWidth="lg" sx={{mx: "auto", bgcolor: 'info.main'}}>
        <Grid container spacing={2} sx={{mb: 16}}>
          <Grid item xs={5} >
            <img src={channelMetadata.parse_image} alt='' style={{ "maxWidth": "100px", width: "-webkit-fill-available", margin:"1rem"}} />
            <Typography variant="h5" component="div" gutterBottom sx={{color: 'text.primary', display: 'inline-block', verticalAlign: 'bottom', mb:6}}>
              {channelMetadata.name}
            </Typography>
            
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
          <Grid item xs={1}></Grid>
          <Grid item xs={5} sx={{m: 8}}>
            <MembershipDetail channelId={channelId}></MembershipDetail>
          </Grid>
        </Grid>
      </Box>

      <Box maxWidth="lg" sx={{mx: "auto", mb: 32}} className="dark-background">
        <Grid container spacing={2} sx={{mb: 16}}>
          <Grid item xs={12} >
            <PostList contractAddress={postContract}></PostList>
          </Grid>
        </Grid>

      </Box>
        
    </Box>
  )
}

export default ChannelDetail;
