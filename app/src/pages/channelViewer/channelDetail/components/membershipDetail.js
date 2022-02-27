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
import { getMembership, getMembershipList, getMembershipUri, mintChannelMembership} from '../../../../service/worksManager';
import { fetchMetadata } from '../../../../service/utility';
import { levels } from '../../../../static/constants';
import LoadingButton from '@mui/lab/LoadingButton';
import { utils, ethers, BigNumber } from 'ethers';



function MembershipDetail(data) {
  console.log('membershipDetail');
  
  const [submissionLoading, setSubmissionLoading] = useState(false);
  const [channelId, setChannelId] = useState(data.channelId);
  const [userMembershipId, setUserMembershipId] = useState('');
  const [userMembership, setUserMembership] = useState({});
  const [membershipList, setMembershipList] = useState([]);
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
      renderHeader: (params) => (
        <p></p>
      ),
      renderCell: (params) => {
        return (
          <LoadingButton
            sx={{display: 'flex', width:100}}
            onClick={() => {
              mintMembership(params.row);
            }}
            loading={submissionLoading}
            variant="outlined"
            color="primary"
          >
            Mint
          </LoadingButton>
        );
      }
    } 
  ];

  useEffect(() => {
    const getCMetadata = async () => {
      const membershipLists = await getMembershipList(channelId);
      console.log(membershipLists);
      let finalMembershipList = [];
      for (let membership of membershipLists) {
        let membershipResult = await getMembership(membership);
        if(membershipResult.eq(1)) {
          console.log('membership found');
          setUserMembershipId(membership);
          break;
        } else {
          console.log('membershipNotFound');
          let membershipMetadataUri = await getMembershipUri(membership);
          if (membershipMetadataUri) {
            let metadataResponse = await fetchMetadata(membership, membershipMetadataUri);
            (metadataResponse) ? finalMembershipList.push(metadataResponse) : console.log('error fetchMetadata');
          }
        }
      }

      console.log(userMembershipId);
      if (userMembershipId === '') {
        setMembershipList(finalMembershipList);
      }
    } 
    getCMetadata();
  },[channelId]);

  useEffect(() => {
    const getCMetadata = async () => {
      if (userMembershipId !== '') {
        let membershipMetadataUri = await getMembershipUri(userMembershipId);
        if (membershipMetadataUri) {
          let metadataResponse = await fetchMetadata(userMembershipId, membershipMetadataUri);
          console.log(metadataResponse);
          (metadataResponse) ? setUserMembership(metadataResponse) : console.log('error fetchMetadata');
        }
      }
      
    } 
    getCMetadata();
  },[userMembershipId]);

  const mintMembership = async(row) => {
    console.log(row);
    const membershipId = BigNumber.from(row.id);
    const membershipResponse = await mintChannelMembership(channelId, row.level, row.cost);
    if (membershipResponse === 'success') {
      setUserMembershipId(membershipId);
    }
  }
  return (
    <div >
      
      {userMembershipId === '' && 
        <Box sx={{m:8, p:8}} >
          <Typography variant="h5" component="div" gutterBottom sx={{color: 'text.primary'}}>
            Memberships
          </Typography>
          
          <div style={{ display: 'flex', height: '23.25rem', width: '100%'}}>
            <DataGrid
              rows={membershipList}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              disableSelectionOnClick
              disableColumnMenu
              isCellEditable={(params) => false}
              sx={{}}
              className="dark-background"
            />
          </div>
        </Box>
      }

      {userMembershipId !== '' && 
        <Box sx={{m:8}} >
          <Typography variant="h5" component="div" gutterBottom sx={{color: 'text.primary'}}>
            My Membership
          </Typography>
          <Box sx={{display:"table"}}>
            <img src={userMembership.parse_image} alt='' style={{ "display" : "table-cell", "maxWidth": "100px", width: "-webkit-fill-available", backgroundPosition: "center center"}} />
            <Typography variant="h6" component="div" gutterBottom sx={{color: 'text.primary', "display" : "table-cell", verticalAlign: "middle", px:"2rem"}}>
              {userMembership.name}
            </Typography>
          </Box>
        </Box>
      }
      
    </div>
  );
}

export default MembershipDetail;
