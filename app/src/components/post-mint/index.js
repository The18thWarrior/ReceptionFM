import env from "react-dotenv";
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { useContractCall } from "@usedapp/core";
import Container from '@mui/material/Container';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
//import { basicSvg } from '../../../../static/constants';
import { NFTStorage, File } from 'nft.storage';
import LoadingButton from '@mui/lab/LoadingButton';
import {BigNumber} from '@ethersproject/bignumber';
import {
  getMembershipList, 
  getMembership,
  getPostUri, 
  getPostTokenBalance, 
  postIsBuyable, 
  postIsMintable, 
  postGetCost,
  postMint,
  postMintPayable
} from '../../service/worksManager';
import {storeNFTMetadata, fetchMetadata} from '../../service/utility';
import logo from '../../static/images/logo.png';


//Static References
const nftStorageAddress = process.env.REACT_APP_NFT_STORAGE_API_KEY;

//const contract = new Contract(wethContractAddress, wethInterface);
const storageClient = new NFTStorage({ token: nftStorageAddress });

function PostMint({postContract, postId, channelId}) {
  let navigate = useNavigate();
  
  const [submissionLoading, setSubmissionLoading] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [isAccessible, setIsAccessible] = useState(false);
  const [isMintable, setIsMintable] = useState(false);
  const [isBuyable, setIsBuyable] = useState(false);
  const [membershipId, setMembershipId] = React.useState('');
  const [cost, setCost] = useState(0);


  const [channelMetadata, setChannelMetadata] = useState('');
  const handleMetadataChange = (metadata) => {
    setChannelMetadata(metadata);
  };
  

  //Effect for querying main data
  useEffect(() => {
    //setChannelMetadata([]);
    //setChannelMap({});
    const runAsyncFunction = async () => {
      try {
        const postUri = await getPostUri(postContract, postId);
        let postMetadataResponse = await fetchMetadata(BigNumber.from(postId), postUri);
        console.log(postMetadataResponse);
        handleMetadataChange(postMetadataResponse);

        const postOwned = await getPostTokenBalance(postContract, postId);
        if (postOwned.eq(1)) {
          setIsOwner(true);
        }

        const _isMintable = await postIsMintable(postContract, postId);
        setIsMintable(_isMintable);
        const _isBuyable = await postIsBuyable(postContract, postId);
        setIsBuyable(_isBuyable);
        const _cost = await postGetCost(postContract, postId);
        setCost(_cost);
        console.log(isMintable, isBuyable, cost);
      } catch (e) {
        console.log(e);
      }
    }; 
    runAsyncFunction();
  }, [postContract, postId]);

  //Effect for membership info
  useEffect(() => {
    const runAsyncFunction = async () => {
      try {
        const membershipLists = await getMembershipList(channelId);
        for (let membership of membershipLists) {
          let membershipResult = await getMembership(membership);
          if(membershipResult.eq(1)) {
            setMembershipId(membership);
            break;
          }
        }
      } catch (e) {
        console.log(e);
      }
    }; 

    if (channelMetadata.parse_properties) {
      setIsAccessible(true);
    }
    runAsyncFunction();
    
  }, [channelMetadata]);

  /**/
  const mintPost = async function() {
    try {
      setSubmissionLoading(true);

      if (isAccessible) {
        //handleMetadataChange(metadata.ipnft);      
        const mintNFT = await postMint(postContract, membershipId, BigNumber.from(postId));
        //postMint
        setSubmissionLoading(false);

      } else {
        const mintNFT = await postMintPayable(postContract, BigNumber.from(0), BigNumber.from(postId), cost);
        //postMint
        setSubmissionLoading(false);
      }
    } catch (err) {
      console.log(err);
      setSubmissionLoading(false);
    }
    
    
  }

  const Input = styled('input')({
    display: 'none',
  });

  return (
    <Box sx={{ml: "auto", width:250, display: 'flex'}}>
      {!isOwner && isMintable && 
        <LoadingButton
          sx={{display: 'flex', width:100}}
          onClick={() => {
            mintPost();
          }}
          loading={submissionLoading}
          variant="outlined"
        >
          Mint
        </LoadingButton>
      }
      {isOwner && 
        <img src={logo} style={{"maxWidth" : "2rem"}} alt="OwnedNFT"/>
      }
    </Box>
  );
}

export default PostMint;


