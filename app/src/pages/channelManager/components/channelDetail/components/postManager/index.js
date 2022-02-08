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
import { storeMetadata, fetchMetadata } from '../../../../../../service/utility';
import LoadingButton from '@mui/lab/LoadingButton';

import { getMembershipList, getMembershipUri, membershipTokenCreate } from '../../../../../../service/worksManager';
import { membershipListColumns, levels } from '../../../../../../static/constants';

function PostManager() {
  const { channelId } = useParams();
  const [submissionLoading, setSubmissionLoading] = useState(false);
  const [createModalOpen, setCreateModalOpen] = React.useState(false);
  const [channelPosts, setChannelPosts] = useState([]);
  const [channelPostMetadata, setChannelPostMetadata] = useState([]);
 
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

  const getChannelPosts = async () => {
    //const memberships = await getMembershipList(channelId);
    //setChannelPosts(memberships);
    //setSubmissionLoading(false);
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
    const metadata = await storeMetadata(row.name, row.description, null, 'membership', mapping);
    const membership = await membershipTokenCreate(channelId, row.cost, row.level, metadata.ipnft);
    getChannelPosts();
  };

  useEffect(() => {
    getChannelPosts();
  },[channelId]);

  function newPost() {
    console.log('newPost');
    let data2 = JSON.parse(JSON.stringify(channelPostMetadata));
    let newPost = {
      id: uuidv4(),
      name : 'Name',
      isNew : true
    };
    data2.push(newPost);
    setChannelPostMetadata(data2);
    setCreateModalOpen(true);
  }

  function closeNewPostModal() {
    setCreateModalOpen(false);
  }

  return (
    <Box sx={{m:8}} >
      
      <Typography variant="h5" component="div" gutterBottom sx={{color: 'text.primary'}}>
        Posts
        <strong style={{ marginLeft: 'auto', float: "right"}}>
          <IconButton aria-label="addRecord" onClick={newPost}>
            <AddIcon />
          </IconButton>
        </strong>
      </Typography>
      <div style={{ display: 'flex', height: '20rem', width: '100%'}}>
        <Typography variant="p" component="p" gutterBottom sx={{color: 'text.primary'}}>
          Post List
        </Typography>
      </div>

      <Dialog open={createModalOpen} onClose={closeNewPostModal}>
        <DialogTitle>New Post</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To subscribe to this website, please enter your email address here. We
            will send updates occasionally.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeNewPostModal}>Cancel</Button>
          <Button onClick={closeNewPostModal}>Subscribe</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default PostManager;