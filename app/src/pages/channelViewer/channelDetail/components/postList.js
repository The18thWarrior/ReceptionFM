import env from "react-dotenv";
import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useContractCall } from "@usedapp/core";
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import {BigNumber} from '@ethersproject/bignumber';

import { getPostIndex, getPostUri } from '../../../../service/worksManager';
import { cleanImageUrl, fetchMetadata } from "../../../../service/utility";

function PostList({contractAddress, selectPost}) {
  const columns = [
    {
      field: 'parse_image',
      headerName: 'Post Image',
      width: 150,
      editable: false,
      sortable: true,
      renderCell: (params)=>{
        return (
            <img src={params.row.parse_image} alt='' style={{width: "-webkit-fill-available"}} />
        )
      }
    },
    {
      field: 'name',
      headerName: 'Post Title',
      width: 250,
      editable: false,
      sortable: false
    },
    {
      field: 'selectPost',
      headerName: '',
      width: 250,
      editable: false,
      sortable: false,
      renderCell: (params) => {
        return <Button onClick={selectPost(params.row)} variant="outlined" color="primary" sx={{mx:"auto"}}>View</Button>
      }
    }
  ];

  const [postMetadata, setPostMetadata] = useState([]);
  const updatePostMetadata = (metadata) => {
    setPostMetadata([...postMetadata, metadata]);
  }

  const [postIndex, setPostIndex] = useState(BigNumber.from(0));

  useEffect(() => {
    //setPostMetadata([]);
    //setPostMap({});
    const getPostList = async () => {
      const pI = await getPostIndex(contractAddress);
      setPostIndex(pI);
    } 
    getPostList();
  },[contractAddress]);

  useEffect(() => {
    //setPostMetadata([]);
    //setPostMap({});
    const getPostList = async () => {
      let pIndex = postIndex.toNumber();
      let postList = [];
      for (let i = 0; i < pIndex; i++) {
        let indexNum = BigNumber.from(i);
        let postMetadataUri = await getPostUri(contractAddress, indexNum);
        if (postMetadataUri && postMetadataUri.length > 0) {
          let postMetadataResponse = await fetchMetadata(indexNum, postMetadataUri);
          //console.log(postMetadataResponse);
          postList.push(postMetadataResponse);
        }
      }
      setPostMetadata(postList);
    } 
    getPostList();
  },[postIndex]);

  return (
    <div className="dark-background" style={{ height: ' 100vh'}}>
      <div style={{ height: 400, width: '100%'}}>
        <DataGrid
          rows={postMetadata}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          disableColumnMenu
        />
      </div>
    </div>
  );
}

export default PostList;