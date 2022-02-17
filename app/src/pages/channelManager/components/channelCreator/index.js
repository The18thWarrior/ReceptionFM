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
import {mintChannel} from '../../../../service/worksManager';
import {storeNFTMetadata} from '../../../../service/utility';


//Static References
const nftStorageAddress = env.REACT_APP_NFT_STORAGE_API_KEY;

//const contract = new Contract(wethContractAddress, wethInterface);
const storageClient = new NFTStorage({ token: nftStorageAddress });

//mintChannel
//const svgString = basicSvg.svgPartOne + basicSvg.svgPartTwo + basicSvg.svgPartThree;

function ChannelCreator() {
  let navigate = useNavigate();
  
  const [submissionLoading, setSubmissionLoading] = useState(false);

  const [channelName, setChannelName] = useState('');
  const handleNameChange = (event) => {
    setChannelName(event.target.value);
  };

  const [channelAuthor, setChannelAuthor] = useState('');
  const handleAuthorChange = (event) => {
    setChannelAuthor(event.target.value);
  };
  
  const [channelCopyright, setChannelCopyright] = useState('');
  const handleCopyrightChange = (event) => {
    setChannelCopyright(event.target.value);
  };
  
  const [channelLanguage, setChannelLanguage] = useState('');
  const handleLanguageChange = (event) => {
    setChannelLanguage(event.target.value);
  };

  const [channelDescription, setChannelDescription] = useState('');
  const handleDescriptionChange = (event) => {
    setChannelDescription(event.target.value);
  };

  const [channelImage, setChannelImage] = useState('');
  const onFileChange = (event) => {
    setChannelImage(event.target.files[0]);
  };

  const [channelMetadata, setChannelMetadata] = useState('');
  const handleMetadataChange = (metadata) => {
    setChannelMetadata(metadata);
  };

  /**/
  const mintCreatorChannel = async function() {
    try {
      setSubmissionLoading(true);

      if (channelName.length > 0) {
        console.log('running storage');
        const metadata = await storeNFTMetadata(channelName, channelDescription, channelImage, 'channel');

        console.log(metadata);
        handleMetadataChange(metadata.ipnft);      
        const channelChange = await mintChannel(channelName, metadata.ipnft, channelAuthor, channelCopyright, channelLanguage);
        console.log(channelChange);

        setSubmissionLoading(false);
        navigate("/manage", { replace: true });
      } else {
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
    <Box maxWidth="max" sx={{pt: 4}} className="dark-background">
      <Box sx={{ p: 8, color: 'text.primary', fontSize: 'h6.fontSize', display: 'flex', justifyContent: 'center'}}>Mint New Channel</Box>
      <Box maxWidth="max" sx={{ flexDirection: 'row', p: 8}}> 
        <Box sx={{ justifyContent: 'center'}}>
          <TextField
            id="name"
            label="Channel Name"
            helperText="The name of your channel"
            variant="standard"
            fullWidth
            value={channelName}
            onChange={handleNameChange}
            sx={{display: 'block', mx: "auto", width:500}}
          />  
          <TextField
            id="author"
            label="Channel Author"
            helperText="The author of your channel"
            variant="standard"
            fullWidth
            value={channelAuthor}
            onChange={handleAuthorChange}
            sx={{display: 'block', mx: "auto", width:500}}
          />  
          <TextField
            id="copyright"
            label="Channel Copyright"
            helperText="The copyright of your channel"
            variant="standard"
            fullWidth
            value={channelCopyright}
            onChange={handleCopyrightChange}
            sx={{display: 'block', mx: "auto", width:500}}
          /> 
          <Select
            id="language"
            fullWidth
            variant="standard"
            value={channelLanguage}
            label="Channel Language"
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
            label="Channel Description"
            helperText="The description of the type of project this is"
            variant="standard"
            fullWidth 
            multiline
            rows={4}
            value={channelDescription}
            onChange={handleDescriptionChange}
            sx={{display: 'block', mx: "auto", width:500}}
          />
        </Box>
        <Box maxWidth={1025} sx={{ display: 'block'}}>
          <Box sx={{ml: "auto", width:250, display: 'flex'}}>
            <label htmlFor="channel-upload" style={{display: 'inline', ml: "auto", width:100}}>
              <Input accept="image/*" id="channel-upload" multiple type="file" onChange={onFileChange} />
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
                mintCreatorChannel();
              }}
              loading={submissionLoading}
              variant="outlined"
            >
              Mint
            </LoadingButton>
          </Box>
        </Box>
      </Box>
    </Box>

  );
}

export default ChannelCreator;


