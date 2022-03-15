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
import Card from '@mui/material/Card';
import SendIcon from '@mui/icons-material/Send';
import Dropzone, {useDropzone} from 'react-dropzone';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Snackbar from '@mui/material/Snackbar';
import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Chip from '@mui/material/Chip';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import NumericInput from 'react-numeric-input';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import DialogTitle from '@mui/material/DialogTitle';

//import { basicSvg } from '../../../../static/constants';
import { NFTStorage, File } from 'nft.storage';
import LoadingButton from '@mui/lab/LoadingButton';
import {mintChannel} from '../../service/worksManager';
import {storeNFTMetadata} from '../../service/utility';


// Custom Components
import UploadImage from '../upload-image';
import TextInput from '../text-input';


//Static References
const nftStorageAddress = process.env.REACT_APP_NFT_STORAGE_API_KEY;

//const contract = new Contract(wethContractAddress, wethInterface);
const storageClient = new NFTStorage({ token: nftStorageAddress });

//mintChannel
//const svgString = basicSvg.svgPartOne + basicSvg.svgPartTwo + basicSvg.svgPartThree
const steps = ['Create NFT', 'Set Rights'];

function CreateChannel() {
  let navigate = useNavigate();
  
  const [submissionLoading, setSubmissionLoading] = useState(false);
  const [openError, setOpenError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const handleCloseError = (event, reason) => {
    setErrorMessage('');
    setOpenError(false);
  };
  const {acceptedFiles, getRootProps, getInputProps} = useDropzone();
  const [createModalOpen, setCreateModalOpen] = React.useState(false);
  const [activeStep, setActiveStep] = React.useState(0);

  const [channelName, setChannelName] = useState('');
  const handleNameChange = (event) => {
    setChannelName(event.textVal);
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
    setChannelDescription(event.textVal);
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
        const metadata = await storeNFTMetadata(channelName, channelDescription, channelImage, 'channel');

        handleMetadataChange(metadata.ipnft);      
        const channelChange = await mintChannel(channelName, metadata.ipnft, channelAuthor, channelCopyright, channelLanguage);

        setSubmissionLoading(false);
        setCreateModalOpen(false);
        navigate("/manage", { replace: true });
      } else {
        setSubmissionLoading(false);
      }
    } catch (err) {
      console.log(err);
      setSubmissionLoading(false);
    }
    
    
  }

  function mainImageChanged(event) {
    setChannelImage(event.file);
  }

  function newChannel() {
    setCreateModalOpen(true);
  }

  function closeNewChannelModal() {
    setActiveStep(0);
    setCreateModalOpen(false);
  }
  

  const Input = styled('input')({
    display: 'none',
  });

  // Stepper Functions
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const errorAction = (
    <React.Fragment>
      <Button color="secondary" size="small" onClick={handleCloseError}>
        
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleCloseError}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );
  
  

  return (
    <div style={{display: "inline-block", "marginRight":"1rem"}}>
      <IconButton aria-label="addRecord" onClick={newChannel}>
        <AddIcon />
      </IconButton>
      <Dialog open={createModalOpen} onClose={closeNewChannelModal}>
        <DialogTitle>
          New Channel 
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={closeNewChannelModal}
            sx={{float:'right'}}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Stepper activeStep={activeStep}>
            {steps.map((label, index) => {
              const stepProps = {};
              const labelProps = {};
              return (
                <Step key={label} {...stepProps}>
                  <StepLabel {...labelProps}>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
          <Card sx={{ maxWidth: 1200 , minWidth: "25rem"}} className="transparent-background">
            
              {activeStep === 0 && 
                <div>
                  <UploadImage onImageChange={mainImageChanged}></UploadImage>
                  <TextInput onTextChange={handleNameChange} textType="h5" inputName="ChannelName" inputType="text" defaultText="Enter Channel Name"></TextInput>
                  <TextInput onTextChange={handleDescriptionChange} textType="body2" inputName="Description" inputType="textarea" defaultText="Enter Description" sx={{mb:2}}></TextInput>
                  <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                    <Button
                      color="inherit"
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      sx={{ mr: 1 }}
                    >
                      Back
                    </Button>
                    <Box sx={{ flex: '1 1 auto' }} />

                    <Button onClick={handleNext}>
                      Next
                    </Button>
                  </Box>
                </div>
              }

              {activeStep === 1 && 
                <Box sx={{alignItems: 'flex-end'}}>
                  <Box maxWidth="max" sx={{ flexDirection: 'row', p: 8}}> 
                    <Box sx={{ justifyContent: 'center'}}>
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
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                    <Button
                      color="inherit"
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      sx={{ mr: 1 }}
                    >
                      Back
                    </Button>
                    <Box sx={{ flex: '1 1 auto' }} />

                    <LoadingButton
                      component="span"
                      loading={submissionLoading}
                      variant="contained"
                      onClick={mintCreatorChannel}
                    >
                      Create
                    </LoadingButton>
                  </Box>
                </Box>
              }
          </Card>
        </DialogContent>
      </Dialog>
      
      <Snackbar
        open={openError}
        autoHideDuration={6000}
        onClose={handleCloseError}
        message={errorMessage}
        action={errorAction}
      />
    </div>

    /*
    <Box maxWidth="max" sx={{pt: 4, height: ' 100vh'}} className="dark-background">
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
    */
  );
}

export default CreateChannel;


