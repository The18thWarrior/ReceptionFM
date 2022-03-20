
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from "react-router-dom";
import { DataGrid } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Footer from '../../../components/footer/footer';

import { getChannelMetadata, getChannelPostContract} from '../../../service/worksManager';
import MembershipDetail from "./components/membershipDetail.js";
import PostList from "../../../components/post-list";

function ChannelDetail() {
  const { channelId } = useParams();

  const [submissionLoading, setSubmissionLoading] = useState(false);
  const [post, setPost] = useState({});
  const [postContract, setPostContract] = useState('');
  const [postStatus, setPostStatus] = useState("");
  const [channelMetadata, setChannelMetadata] = useState({name: '', description: '', image: ''});
  const componentIsMounted = useRef(true)
  useEffect(() => {
    return () => {
      componentIsMounted.current = false
    }
  }, []);

  useEffect(() => {
    //setChannelMetadata([]);
    //setChannelMap({});
    const getCMetadata = async () => {
      const channelUri = await getChannelMetadata(channelId);
      if (channelUri && !channelUri.includes('ipfs')) {
        let metadataRequest = await fetch("https://ipfs.io/ipfs/"+channelUri+'/metadata.json');
        let metadataResponse = await metadataRequest.json();
        metadataResponse["parse_image"] = cleanImageUrl(metadataResponse.image);
        if (componentIsMounted.current) {
          setChannelMetadata(metadataResponse);
        }        
      }
    } 
    getCMetadata();
  },[channelId]);

  const cleanImageUrl = (uri) => {
    return "https://ipfs.io/ipfs/"+uri.replace('ipfs://', '');
  }

  function clearPost() {
    setPostStatus('');
    setPost({});
  }
  
  function setPostValue(_post) {
    if (post.id === _post.id) {
      //setPostStatus('selected');
    } else if (_post.id != null) {
      setPostStatus('selected');
      setPost(_post);
    }
  }


  useEffect(() => {
    //setChannelMetadata([]);
    //setChannelMap({});
    const getChannelPosts = async () => {
      try {
        console.log(channelId);
        const postContractAddress = await getChannelPostContract(channelId);
        if (componentIsMounted.current) {
          setPostContract(postContractAddress);
        }
      } catch (e) {
        console.log(e);
      }
    }; 
    getChannelPosts();
  },[channelId]);

  const CustomTitle = styled(TextField)({
    '& input': {
      fontSize : "2rem",
      color:"white",
      WebkitTextFillColor: "white !important"
    },
  });

  const CustomDescription = styled(TextField)({
    '& textarea': {
      color:"white",
      WebkitTextFillColor: "white !important"
    },
  });

  return (
    <Box maxWidth="max" sx={{pt: 4, my: 8}} className="dark-background">
      <Box maxWidth="lg" sx={{mx: "auto", bgcolor: '#3C3C3C'}}>
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
            <PostList contractAddress={postContract} setPost={setPostValue}></PostList>
          </Grid>
        </Grid>

      </Box>
      
      <Footer status={postStatus} post={post} clearPost={clearPost} postId={post.id} postContract={postContract} channelId={channelId}></Footer>
    </Box>
    
  )
}

export default ChannelDetail;
