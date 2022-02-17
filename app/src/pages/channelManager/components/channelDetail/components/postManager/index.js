import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import { DataGrid } from '@mui/x-data-grid';
import { useContractCall } from "@usedapp/core";
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { storeNFTMetadata, fetchMetadata } from '../../../../../../service/utility.js';
import LoadingButton from '@mui/lab/LoadingButton';
import {BigNumber} from '@ethersproject/bignumber';
import CreatePost from './components/createPost';

import { 
  getMembershipUri, 
  createPostContract, 
  getChannelPostContract, 
  membershipTokenCreate, 
  getChannelMetadata, 
  getPostIndex,
  getPostUri 
} from '../../../../../../service/worksManager';
import { membershipListColumns, levels } from '../../../../../../static/constants.js';

function PostManager() {
  const { channelId } = useParams();
  const [submissionLoading, setSubmissionLoading] = useState(false);
  const [createModalOpen, setCreateModalOpen] = React.useState(false);
  const [postContract, setPostContract] = useState('');
  const [postIndex, setPostIndex] = useState(null);
  const [channelPosts, setChannelPosts] = useState([]);
  const [channelPostMetadata, setChannelPostMetadata] = useState([]);
  const [channelMetadata, setChannelMetadata] = useState([]);
 
  useEffect(() => {
    const _getChannelMetadata = async () => {
      let channelUri = await getChannelMetadata(channelId);
      if (channelUri) {
        let metadataResponse = await fetchMetadata(BigNumber.from(channelId), channelUri);
        (metadataResponse) ? setChannelMetadata(metadataResponse) : console.log('error channel fetchMetadata');
      }
    } 
    _getChannelMetadata();
  }, [channelId])
  
  useEffect(() => {
    const getChannelPostMetadata = async () => {
      let metadataList = [];
      if (channelPosts.length > 0) {
        for (let membership of channelPosts) {
          let membershipMetadataUri = await getMembershipUri(membership);
          if (membershipMetadataUri) {
            let metadataResponse = await fetchMetadata(membership, membershipMetadataUri);
            (metadataResponse) ? metadataList.push(metadataResponse) : console.log('error fetchMetadata');
          }
        }
        setChannelPostMetadata(metadataList);
      }
    } 
    getChannelPostMetadata();
  },[channelPosts]);

  useEffect(() => {
    const _getPostIndex = async () => {
      const pIndex = await getPostIndex(postContract);  
      console.log(pIndex);
      setPostIndex(pIndex);
    } 
    _getPostIndex();
  },[postContract]);

  useEffect(() => {
    const _getPosts = async () => {
      let metadataList = [];
      if (postIndex != null) {
        for (let i = 0; i <= postIndex; i++) {
          let metadataUri = await getPostUri(postContract, i);
          console.log(metadataUri);
          if (metadataUri) {
            let metadataResponse = await fetchMetadata(BigNumber.from(i), metadataUri);
            (metadataResponse) ? metadataList.push(metadataResponse) : console.log('error fetchMetadata');
          }
        }
        setChannelPosts(metadataList);
      }
    } 
    _getPosts();
  },[postIndex]);

  const getChannelPosts = async () => {
    try {
      const postContractAddress = await getChannelPostContract(channelId);
      console.log(postContractAddress);
      setPostContract(postContractAddress);
    } catch (e) {
      console.log(e);
    }
  }; 

  const mintPostContract = async () => {
    try {
      const postContractAddress = await createPostContract(channelMetadata.name, channelId);
      getChannelPosts();
    } catch (e) {
      console.log(e);
    }
  }; 

  const createChannelMembership = async (rawRow) => {
    let row = JSON.parse(JSON.stringify(rawRow));
    delete row.isNew;
    delete row.id;
    row.description = row.name + ' ' + row.level;
    const mapping = {
      level : row.level,
      cost : row.cost
    };
    const metadata = await storeNFTMetadata(row.name, row.description, null, 'membership', mapping);
    const membership = await membershipTokenCreate(channelId, row.cost, row.level, metadata.ipnft);
    getChannelPosts();
  };

  useEffect(() => {
    getChannelPosts();
  },[channelId]);

  useEffect(() => {
    console.log('channelMetadata updated');
    console.log(channelMetadata);
  },[channelMetadata]);

  
  function closeNewPostModal() {
    setCreateModalOpen(false);
  }

  return (
    <Box sx={{m:8}} >
      { 
        postContract !== '' && 
        (
          <div>
            <Typography variant="h5" component="div" gutterBottom sx={{color: 'text.primary'}}>
              Posts
              <CreatePost contractAddress={postContract}></CreatePost>
            </Typography>
            <div style={{ display: 'flex', height: '20rem', width: '100%'}}>
              <Typography variant="p" component="p" gutterBottom sx={{color: 'text.primary'}}>
                Post List
              </Typography>
            </div>

            
          </div>
        )
      }

      {
        !postContract && 
        (
          
          <Box sx={{ display: 'flex'}}>
            <LoadingButton
              sx={{display: 'block', mx: "auto", width:150}}
              onClick={() => {
                mintPostContract();
              }}
              loading={submissionLoading}
              variant="outlined"
            >
              Mint Post Collection
            </LoadingButton>
          </Box>
        )
      }
    </Box>
  );
}

export default PostManager;