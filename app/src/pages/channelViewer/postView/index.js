import React, {useEffect, useState, useRef} from 'react';
import { useParams } from "react-router-dom";
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import {BigNumber} from '@ethersproject/bignumber';
import Plyr from 'plyr-react';
import ReactPlayer from 'react-player';
import 'plyr-react/dist/plyr.css';

import PostMint from '../../../components/post-mint';
import { getCurrentChannelIndex, getChannelMetadata, getChannelPostContract, getPostUri } from '../../../service/worksManager.js';
import { cleanImageUrl, fetchMetadata } from "../../../service/utility";

function PostView() {
  const { channelId, postId } = useParams();
  const [selectedMedia, setSelectedMedia] = React.useState('');
  const [selectedMediaType, setSelectedMediaType] = React.useState('');
  const [selectedMediaMime, setSelectedMediaMime] = React.useState('');
  const [selectedMediaData, setSelectedMediaData] = React.useState({});
  const [post, setPost] = React.useState({});
  const [postContract, setPostContract] = React.useState('');
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const componentIsMounted = useRef(true)
  useEffect(() => {
    return () => {
      componentIsMounted.current = false
    }
  }, []);

  useEffect(() => {
    console.log(channelId, postId, postContract);
    if (post?.parse_properties) {
      let parts = post.parse_properties[0].split("/");
      let mediaResult = parts[parts.length - 1];
      let mediatype = '';
      if (mediaResult === 'm4a') {
        mediatype = 'audio';
      } else {
        mediatype = 'video';
      }

      let media = {
        type: mediatype,
        title: post.name,
        sources: [
          {
            src: post.parse_properties[0],
            type: mediatype+'/'+mediaResult,
          }
        ]
      };
      if (media.sources.src !== '') {
        setSelectedMedia(post.parse_properties[0]);
        setSelectedMediaType(mediatype);
        setSelectedMediaMime(mediatype+'/'+mediaResult);
        setSelectedMediaData(media);
        setDrawerOpen(true);
        console.log(media, post.parse_properties[0])
      }
      
      console.log('footer complete',media);
    } 
  }, [post]);

  useEffect(() => {
    const getChannelPosts = async () => {
      try {
        const postContractAddress = await getChannelPostContract(channelId);
        setPostContract(postContractAddress);
      } catch (e) {
        console.log(e);
      }
    }; 
    getChannelPosts();
  }, [channelId]);

  useEffect(() => {
    const getChannelPosts = async () => {
      if (postId !== '' && postContract !== '') {
        let indexNum = BigNumber.from(postId);
        let postMetadataUri = await getPostUri(postContract, indexNum);
        if (postMetadataUri && postMetadataUri.length > 0) {
          let postMetadataResponse = await fetchMetadata(indexNum, postMetadataUri);
          console.log(postMetadataResponse);
          setPost(postMetadataResponse);
        }
      }
    }; 
    getChannelPosts();
  }, [postContract, postId]);
  

  return (
    <Grid container spacing={2} sx={{ minHeight: '80vh', paddingTop: '5vh'}} className="dark-background">
      {selectedMedia !== '' && 
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <ReactPlayer url={selectedMedia} light="false" controls={true} width="100%"/>
          </Grid>
          <Grid item xs={6} sx={{}}>
            <Box sx={{ width: '50%', m:10 }}>
              <TextField
                helperText="Name"
                InputProps={{
                  readOnly: true,
                }}
                fullWidth 
                variant="standard"
                value={post.name}
              />
              <TextField
                helperText="Description"
                multiline
                InputProps={{
                  readOnly: true,
                }}
                maxRows={10}
                fullWidth 
                variant="standard"
                value={post.description}
                sx={{my: 3}}
              />
              <TextField
                helperText="Created Date"
                InputProps={{
                  readOnly: true,
                }}
                fullWidth 
                variant="standard"
                value={post.properties?.createdDate}
              />
            </Box>
            <PostMint postContract={postContract} postId={postId}></PostMint>
          </Grid>
        </Grid>
      }
      {selectedMedia === '' && 
        <Grid item sx={{width:"100vw"}}>
            <Box sx={{ m:10, width:"50vw" }}>
              <TextField
                helperText="Name"
                InputProps={{
                  readOnly: true,
                }}
                variant="standard"
                value={post.name}
                sx={{width:"20vw"}}
              />
              <TextField
                helperText="Description"
                multiline
                InputProps={{
                  readOnly: true,
                }}
                maxRows={10}
                variant="standard"
                value={post.description}
                sx={{width:"30vw"}}
              />
            </Box>
            <PostMint postContract={postContract} postId={postId} channelId={channelId}></PostMint>
          
        </Grid>
      }
    </Grid>
  );
}

export default PostView;

/*
<Plyr
  source={selectedMediaData}
/>

<ReactPlayer url={selectedMedia} light="false"/>
          

*/