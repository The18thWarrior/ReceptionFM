import env from "react-dotenv";
import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useContractCall } from "@usedapp/core";
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import {BigNumber} from '@ethersproject/bignumber';

import { getPostIndex, getPostUri } from '../../../../../../../../service/worksManager';
import { postListColumns } from '../../../../../../../../static/constants';
import { cleanImageUrl, fetchMetadata } from "../../../../../../../../service/utility";

//let worksManagerAddress = env.REACT_APP_WORKSMANAGER_ADDRESS;

const columns = postListColumns;

function PostList({contractAddress}) {
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
          //console.log(postMetadataResponse);
          postList.push(postMetadataResponse);
        }
      }
      console.log(postList);
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