import env from "react-dotenv";
import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useContractCall } from "@usedapp/core";
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import RefreshIcon from '@mui/icons-material/Refresh';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import {BigNumber} from '@ethersproject/bignumber';
import { Link } from 'react-router-dom';

import { getPostIndex, getPostUri } from '../../service/worksManager';
import { postListColumns } from '../../static/constants';
import { cleanImageUrl, fetchMetadata } from "../../service/utility";

//let worksManagerAddress = env.REACT_APP_WORKSMANAGER_ADDRESS;



function PostList({contractAddress, setPost}) {
  const columns = [
    {
      field: 'parse_image',
      headerName: 'Post Image',
      flex:2,
      editable: false,
      sortable: false,
      renderCell: (params)=>{
        if (!params.row) {
          return (
            <div></div>
          )
        }
        return (
          <img src={params.row.parse_image} alt='' style={{width: "-webkit-fill-available"}} />
        )
      }
    },
    {
      field: 'name',
      headerName: 'Post Title',
      flex:3,
      editable: false,
      sortable: true,
      renderCell: (params) => {
        if (!params.row) {
          return (<CircularProgress />);
        }

        return (
          <span>{params.row.name}</span>
        )
      }
    },
    {
      field: 'accessPost',
      renderHeader: () => (
        <IconButton color="primary" aria-label="refresh list" onClick={refreshList} sx={{mx:"auto", color: "text.primary"}}>
          <RefreshIcon />
        </IconButton>
      ),
      flex:1,
      editable: false,
      sortable: false,
      renderCell: (params) => {
        if (!params.row) {
          return (
            <div></div>
          )
        }

        const onClickEdit = async () => {
          setPost(params.row);
        };
        //return <div>1</div>
        return <Button onClick={onClickEdit} variant="outlined" color="primary" sx={{mx:"auto"}}>View</Button>
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
  },[]);

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
          console.log(postMetadataResponse);
          postList.push(postMetadataResponse);
        }
      }
      setPostMetadata(postList);
    } 
    getPostList();
  },[postIndex]);

  function selectPost(post) {
    setPost(post);
  }

  const refreshList = async () => {
    setPostIndex(BigNumber.from(0));
    const pI = await getPostIndex(contractAddress);
    setPostIndex(pI);
  }

  return (
    <div className="dark-background" style={{ }}>
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