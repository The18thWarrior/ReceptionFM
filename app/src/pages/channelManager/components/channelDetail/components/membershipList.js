import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useParams } from "react-router-dom";
import { DataGrid } from '@mui/x-data-grid';
import { useContractCall } from "@usedapp/core";
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import RefreshIcon from '@mui/icons-material/Refresh';
import CircularProgress from '@mui/material/CircularProgress';
import AddIcon from '@mui/icons-material/Add';
import { storeNFTMetadata, fetchMetadata } from '../../../../../service/utility';
import LoadingButton from '@mui/lab/LoadingButton';

import { getMembershipList, getMembershipUri, membershipTokenCreate } from '../../../../../service/worksManager';
import { membershipListColumns, levels } from '../../../../../static/constants';

function MembershipList() {
  const { channelId } = useParams();
  const [submissionLoading, setSubmissionLoading] = useState(false);
  const [channelMemberships, setChannelMemberships] = useState([]);
  const [channelMembershipMetadata, setChannelMembershipMetadata] = useState([]);
  const columns = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 3,
      editable: true,
      sortable: true
    },
    {
      field: 'level',
      headerName: 'Level',
      flex: 3,
      editable: true,
      sortable: false,
      type: 'singleSelect',
      valueOptions: levels
    },
    {
      field: 'cost',
      headerName: 'Cost',
      flex: 3,
      type: 'number',
      editable: true,
      sortable: false
    },
    {
      field: 'isNew',
      flex: 2,
      editable: false,
      sortable: false,
      renderHeader: () => (
        <IconButton color="primary" aria-label="refresh list" onClick={refreshList} sx={{mx:"auto", color: "text.primary"}}>
          <RefreshIcon />
        </IconButton>
      ),
      renderCell: (params) => {
        if (params.row.isNew) { 
          return (
            <LoadingButton
              sx={{display: 'flex', width:100}}
              onClick={() => {
                createMembership(params.row);
              }}
              loading={submissionLoading}
              variant="outlined"
              color="primary"
            >
              Save
            </LoadingButton>
          );
        }
      }
    } 
  ];
 
  useEffect(() => {
    const getChannelMembershipMetadata = async () => {
      let membershipList = [];
      
      if (channelMemberships.length > 0) {
        let index = 0;
        for (let membership of channelMemberships) {
          let membershipMetadataUri = await getMembershipUri(membership);
          if (membershipMetadataUri) {
            let metadataResponse = await fetchMetadata(membership, membershipMetadataUri);
            (metadataResponse) ? membershipList[index] = metadataResponse : console.log('error fetchMetadata');
          }
          index++;
        }
        setChannelMembershipMetadata(membershipList);
      }
    } 
    getChannelMembershipMetadata();
  },[channelMemberships]);

  const getChannelMemberships = async () => {
    const memberships = await getMembershipList(channelId);
    console.log(memberships);
    setChannelMemberships(memberships);
    setSubmissionLoading(false);
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
    getChannelMemberships();
  };

  useEffect(() => {
    getChannelMemberships();
  },[channelId]);

  const refreshList = async () => {
    setSubmissionLoading(true);
    setChannelMemberships([]);
    setChannelMembershipMetadata([]);
    getChannelMemberships();
  };

  function newMembership() {
    let data2 = JSON.parse(JSON.stringify(channelMembershipMetadata));
    let newMembership = {
      id: uuidv4(),
      name : 'Name',
      description : 'Description',
      level : 'bronze',
      cost : 0,
      isNew : true
    };
    data2.push(newMembership);
    setChannelMembershipMetadata(data2);
  }

  function createMembership(row) {
    setSubmissionLoading(true);
    createChannelMembership(row);
  }

  return (
    <Box sx={{m:8}} >
      
      <Typography variant="h5" component="div" gutterBottom sx={{color: 'text.primary'}}>
        Memberships
        <strong style={{ marginLeft: 'auto', float: "right"}}>
          <IconButton aria-label="addRecord" onClick={newMembership}>
            <AddIcon />
          </IconButton>
        </strong>
      </Typography>
      <div style={{ display: 'flex', height: '23.25rem', width: '100%'}}>
        <DataGrid
          rows={channelMembershipMetadata}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          disableColumnMenu
          isCellEditable={(params) => params.row.isNew === true}
          sx={{}}
        />
      </div>
    </Box>
  );
}

export default MembershipList;