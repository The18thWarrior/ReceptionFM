
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
import Stack from '@mui/material/Stack';

import { getChannelMetadata} from '../../../../service/worksManager';
import Footer from '../../../../components/footer/footer';
import MembershipList from "./components/membershipList.js";
import PostManager from "./components/postManager.js";
function ChannelDetail() {
  const { channelId } = useParams();

  const [submissionLoading, setSubmissionLoading] = useState(false);
  const [post, setPost] = useState({});
  const [postStatus, setPostStatus] = useState("");
  const [postContract, setPostContract] = useState("");
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

  useEffect(() => {
    if (post.id != null) {
      setPostStatus('selected');
    } else {
      setPostStatus('');
    }
  }, [post]);

  function clearPost() {
    setPostStatus('');
    setPost({});
  }

  function setPostValue(_post, _postContract) {
    if (post.id === _post.id) {
      //setPostStatus('selected');
    } else if (_post.id != null) {
      setPost(_post);
      setPostContract(_postContract);
    }
  }


  const cleanImageUrl = (uri) => {
    return "https://ipfs.io/ipfs/"+uri.replace('ipfs://', '');
  }

  const Item = ({val, title, variant}) => {
    return (
      <Stack spacing={0}  sx={{ display:'inline-block'}}>
        <Typography gutterBottom variant={variant} color="text.primary" component="div">
          {val}
        </Typography>
        <hr />
        <Typography color="text.primary" variant="subtitle2">
          {title}
        </Typography>
      </Stack>
    )
  }

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
      <Box maxWidth="lg" sx={{mx: "auto", bgcolor: '#3C3C3C', mb: 16}}>
        <Box sx={{m:8, display:'inline-block'}}>
          <img src={channelMetadata.parse_image} alt='' style={{ "maxWidth": "100px", width: "-webkit-fill-available"}} />
        </Box>
        <Box sx={{mr:8, display:'inline-block', verticalAlign: 'text-bottom'}}>
          <CustomTitle
            id="outlined-multiline-flexible"
            label="Title"
            fullWidth
            variant="standard"
            value={channelMetadata.name}
            disabled
            sx={{color:"text.primary", fontSize:"2rem"}}
          />
        </Box>
        
        <Box sx={{mr:8, display:'inline-block', minWidth:"30vw", verticalAlign: 'text-bottom'}}>
          <CustomDescription
            id="outlined-multiline-flexible"
            label="Description"
            multiline
            fullWidth
            variant="standard"
            maxRows={4}
            value={channelMetadata.description}
            disabled
            sx={{color:"text.primary", fontSize:"2rem"}}
          />
        </Box>
      </Box>

      <Box maxWidth="lg" sx={{mx: "auto", mb: 32}} className="dark-background">
        <Grid container spacing={2} sx={{mb: 16}}>
          <Grid item xs={5}  sx={{mx: "auto", mb: 16}}>
            <MembershipList></MembershipList>
          </Grid>
          <Grid item xs={7} >
            <PostManager setPost={setPostValue}></PostManager>
          </Grid>
        </Grid>

      </Box>
      
      <Footer status={postStatus} post={post} clearPost={clearPost}  postId={post.id} postContract={postContract} channelId={channelId}></Footer>
    </Box>
  )
}

export default ChannelDetail;

/*


<Item val={channelMetadata.name} title="Title" variant="h4" style={{marginRight:"10px"}}></Item>

*/