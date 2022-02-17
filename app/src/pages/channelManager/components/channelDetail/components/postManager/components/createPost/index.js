import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import { DataGrid } from '@mui/x-data-grid';
import { useContractCall } from "@usedapp/core";
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { storeNFTMetadata, storeRawMetadata, fetchMetadata } from '../../../../../../../../service/utility.js';
import LoadingButton from '@mui/lab/LoadingButton';
import {BigNumber} from '@ethersproject/bignumber';
import { NFTStorage, File } from 'nft.storage';

import { 
  getMembershipUri, 
  createPostContract, 
  getChannelPostContract, 
  membershipTokenCreate, 
  getChannelMetadata, 
  getPostIndex,
  getPostUri,
  createPostToken
} from '../../../../../../../../service/worksManager.js';

import UploadImage from '../../../../../../../../components/upload-image';
import TextInput from '../../../../../../../../components/text-input';


function CreatePost(contractAddress) {
  
  const [createModalOpen, setCreateModalOpen] = React.useState(false);
  const [submissionLoading, setSubmissionLoading] = React.useState(false);
  const [postName, setPostName] = useState('');
  const handleNameChange = (event) => {
    setPostName(event.target.value);
  };

  const [postBody, setPostBody] = useState('');

  const [postAuthor, setPostAuthor] = useState('');
  const handleAuthorChange = (event) => {
    setPostAuthor(event.target.value);
  };
  
  const [postCopyright, setPostCopyright] = useState('');
  const handleCopyrightChange = (event) => {
    setPostCopyright(event.target.value);
  };
  
  const [postLanguage, setPostLanguage] = useState('');
  const handleLanguageChange = (event) => {
    setPostLanguage(event.target.value);
  };

  const [postDescription, setPostDescription] = useState('');
  const handleDescriptionChange = (event) => {
    setPostDescription(event.target.value);
  };

  const [postImage, setPostImage] = useState('');
  const onFileChange = (event) => {
    setPostImage(event.target.files[0]);
  };

  const [postMetadata, setPostMetadata] = useState('');
  const handleMetadataChange = (metadata) => {
    setPostMetadata(metadata);
  };

  function closeNewPostModal() {
    setCreateModalOpen(false);
  }

  function newPost() {
    console.log('newPost');
    setCreateModalOpen(true);
  }

  function mainImageChanged(event) {
    console.log('image changed');
    console.log(event);
    setPostImage(event.file);
  }

  const Input = styled('input')({
    display: 'none',
  });

  function textChanged(event) {
    console.log(event);
    if (event.inputName === 'body') {
      setPostBody(event.htmlVal);
    } else if (event.inputName === 'header') {
      setPostName(event.textVal)
    } else if (event.inputName === 'description') {
      setPostDescription(event.textVal)
    }
  }

  function isDataValid() {
    if (postName.length < 2) {
      return false;
    }
    if (postBody.length < 10) {
      return false;
    }
    if (postImage === '') {
      return false;
    }
    if (postDescription.length < 5) {
      return false;
    }
    return true;
  }

  
  const createPost = async function() {
    if (isDataValid()) {
      setSubmissionLoading(true);
      const metadata = await storeNFTMetadata(postName, postDescription, postImage, 'post');
      const paywall = await storeRawMetadata([postBody]);
      try {
        console.log(metadata.ipnft, paywall, contractAddress.contractAddress);
        handleMetadataChange(metadata.ipnft);      
        const postToken = await createPostToken(contractAddress.contractAddress, 10, false, true, metadata.ipnft, paywall, true, ["ALL"]);
        console.log(postToken);

        setSubmissionLoading(false);
      } catch (e) {
        console.log(e);
        setSubmissionLoading(false);
      }
    }
  }

  
  return (
    <div>
      <strong style={{ marginLeft: 'auto', float: "right"}}>
        <IconButton aria-label="addRecord" onClick={newPost}>
          <AddIcon />
        </IconButton>
      </strong>

      <Dialog open={createModalOpen} onClose={closeNewPostModal}>
        <DialogTitle>New Post</DialogTitle>
        <DialogContent>
          <Card sx={{ maxWidth: 1200 }}>
            <CardContent>
              <UploadImage onImageChange={mainImageChanged}></UploadImage>
              <TextInput  onTextChange={textChanged} textType="h5" inputName="header" inputType="text" defaultText="Enter Title"></TextInput>
              <TextInput  onTextChange={textChanged} textType="body2" inputName="description" inputType="text" defaultText="Enter Description"></TextInput>
              <TextInput  onTextChange={textChanged} textType="body2" inputName="body" inputType="rtf" defaultText="Enter Body"></TextInput>
            </CardContent>
          </Card>
          
        </DialogContent>
        <DialogActions>
          <Button onClick={closeNewPostModal}>Cancel</Button>
          <LoadingButton
            component="span"
            loading={submissionLoading}
            variant="contained"
            onClick={createPost}
          >
            Save
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </div>
    
  )
}

export default CreatePost;


/* Alt DialogContent.innerHTML 

  <Box maxWidth="max" sx={{ flexDirection: 'row', p: 8}}> 
    <Box sx={{ justifyContent: 'center'}}>
      <TextField
        id="name"
        label="Post Name"
        helperText="The name of your post"
        variant="standard"
        fullWidth
        value={postName}
        onChange={handleNameChange}
        sx={{display: 'block', mx: "auto", width:500}}
      />  
      <TextField
        id="author"
        label="Post Author"
        helperText="The author of your post"
        variant="standard"
        fullWidth
        value={postAuthor}
        onChange={handleAuthorChange}
        sx={{display: 'block', mx: "auto", width:500}}
      />  
      <TextField
        id="copyright"
        label="Post Copyright"
        helperText="The copyright of your post"
        variant="standard"
        fullWidth
        value={postCopyright}
        onChange={handleCopyrightChange}
        sx={{display: 'block', mx: "auto", width:500}}
      /> 
      <Select
        id="language"
        fullWidth
        variant="standard"
        value={postLanguage}
        label="Post Language"
        onChange={handleLanguageChange}
        sx={{display: 'block', mx: "auto", width:500}}
      >
        <MenuItem value={'zh-cn'}>Mandarin</MenuItem>
        <MenuItem value={'zh-hk'}>Cantonese</MenuItem>
        <MenuItem value={'en-us'}>English - US</MenuItem>
        <MenuItem value={'en-gb'}>English - UK</MenuItem>
        <MenuItem value={'es'}>Spanish</MenuItem>
        <MenuItem value={'fr'}>French</MenuItem>
        <MenuItem value={'pt-br'}>Portuguese</MenuItem>
        <MenuItem value={'ja'}>Japanese</MenuItem>
        <MenuItem value={'ar'}>Arabic</MenuItem>
        <MenuItem value={'de'}>German</MenuItem>
        <MenuItem value={'sw'}>Swahili</MenuItem>
      </Select>

    </Box>
    <Box component="span" sx={{ display: 'block', justifyContent: 'center'}}>
      <TextField
        id="description"
        label="Post Description"
        helperText="The description of the type of project this is"
        variant="standard"
        fullWidth 
        multiline
        rows={4}
        value={postDescription}
        onChange={handleDescriptionChange}
        sx={{display: 'block', mx: "auto", width:500}}
      />
    </Box>
    <Box maxWidth={1025} sx={{ display: 'block'}}>
      <Box sx={{ml: "auto", width:250, display: 'flex'}}>
        <label htmlFor="post-upload" style={{display: 'inline', ml: "auto", width:100}}>
          <Input accept="image/*" id="post-upload" multiple type="file" onChange={onFileChange} />
          <LoadingButton
            component="span"
            sx={{display: 'flex', ml: "auto", width:100}}
            loading={submissionLoading}
            variant="contained"
          >
            Upload
          </LoadingButton>
        </label>
        <LoadingButton
          sx={{display: 'flex', width:100}}
          onClick={() => {
            console.log('Mint');
          }}
          loading={submissionLoading}
          variant="outlined"
        >
          Mint
        </LoadingButton>
      </Box>
    </Box>
  </Box>

*/