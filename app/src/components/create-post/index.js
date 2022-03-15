import React, { useEffect, useState, useCallback } from 'react';
import Dropzone, {useDropzone} from 'react-dropzone';
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import { DataGrid } from '@mui/x-data-grid';
import { useContractCall } from "@usedapp/core";
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import AddIcon from '@mui/icons-material/Add';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import AudioFileIcon from '@mui/icons-material/AudioFile';
import VideoFileIcon from '@mui/icons-material/VideoFile';
import Snackbar from '@mui/material/Snackbar';
import CloseIcon from '@mui/icons-material/Close';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
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
import { storeNFTMetadata, storeRawMetadata, fetchMetadata } from '../../service/utility.js';
import LoadingButton from '@mui/lab/LoadingButton';
import {BigNumber} from '@ethersproject/bignumber';
import { NFTStorage, File } from 'nft.storage';

import { 
  getMembershipUri, 
  createPostContract, 
  getChannelPostContract, 
  membershipTokenCreate, 
  getChannelMetadata, 
  getPostIndex,
  getPostUri,
  createPostToken
} from '../../service/worksManager.js';

import UploadImage from '../upload-image';
import TextInput from '../text-input';

const steps = ['Create NFT', 'Add Files', 'Set Access'];

function CreatePost(requestInputs) {
  const [openError, setOpenError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const handleCloseError = (event, reason) => {
    setErrorMessage('');
    setOpenError(false);
  };
  const {acceptedFiles, getRootProps, getInputProps} = useDropzone();
  const [createModalOpen, setCreateModalOpen] = React.useState(false);
  const [activeStep, setActiveStep] = React.useState(0);
  const [submissionLoading, setSubmissionLoading] = React.useState(false);
  const [postName, setPostName] = useState('');
  const handleNameChange = (event) => {
    setPostName(event.target.value);
  };

  const [postBody, setPostBody] = useState('');

  const [postDescription, setPostDescription] = useState('');
  const handleDescriptionChange = (event) => {
    setPostDescription(event.target.value);
  };

  const [postPublic, setPostPublic] = useState(true);
  const handlePublicChange = (event) => {
    setPostPublic(event.target.checked);
    if (postPublic) {
      setPostBuyable(false);
      setPostCost(0);
    }
  };

  const [postBuyable, setPostBuyable] = useState(false);
  const handleBuyableChange = (event) => {
    setPostBuyable(event.target.checked);
    if(!postBuyable) {    
      setPostCost(0);
    }
  };

  const [postMintable, setPostMintable] = useState(false);
  const handleMintableChange = (event) => {
    setPostMintable(event.target.checked);
    if(!postMintable) {    
      setPostBuyable(false);
      setPostCost(0);
    }
  };

  
  const [postCostValidation, setPostCostValidation] = useState(false);
  const [postCost, setPostCost] = useState(0);
  const handleCostChange = (event) => {
    if(isNaN(event.target.value)) {
      setPostCostValidation(true);
    } else {
      setPostCostValidation(false);
      setPostCost(event.target.value);
    }
    
  };

  const [postImage, setPostImage] = useState('');
  const onFileChange = (event) => {
    setPostImage(event.target.files[0]);
  };

  const [postMetadata, setPostMetadata] = useState('');
  const handleMetadataChange = (metadata) => {
    setPostMetadata(metadata);
  };

  function closeNewPostModal() {
    setActiveStep(0);
    setCreateModalOpen(false);
  }

  function newPost() {
    setCreateModalOpen(true);
  }

  function mainImageChanged(event) {
    setPostImage(event.file);
  }

  function textChanged(event) {
    if (event.inputName === 'body') {
      setPostBody(event.htmlVal);
    } else if (event.inputName === 'Title') {
      setPostName(event.textVal)
    } else if (event.inputName === 'Description') {
      setPostDescription(event.textVal)
    }
  }

  function isDataValid() {
    if (!postName || postName.length < 2) {
      setErrorMessage('Missing post name');
      return false;
    }
    if (!postImage || postImage === '') {
      setErrorMessage('Missing post image');
      return false;
    }
    if (!postDescription || postDescription.length < 5) {
      setErrorMessage('Missing post description');
      return false;
    }
    return true;
  }
  
  //Post Creation
  const createPost = async function() {
    if (isDataValid()) {
      setSubmissionLoading(true);
      try {
        const today = new Date();
        const metadata = await storeNFTMetadata(postName, postDescription, postImage, 'post', {properties:{createdDate : today.toUTCString()}});
        let customMapping = {properties: {
          files: []
        }};
        for (let f of acceptedFiles) {
          customMapping.properties.files.push(
            new File(
              [f],
              f.path.split('.').pop(),
              {
                type: f.type,
              }
            )
          )
        }
        customMapping.properties.createdDate =  today.toUTCString();
        const paywall = await storeNFTMetadata(postName, postDescription, postImage, 'post', customMapping);
      
        handleMetadataChange(metadata.ipnft);      
        const postToken = await createPostToken(requestInputs.contractAddress, postCost, postBuyable, postPublic, metadata.ipnft, paywall.ipnft, postMintable, levelSelect);

        setSubmissionLoading(false);
        setCreateModalOpen(false);
      } catch (e) {
        console.log(e);
        setSubmissionLoading(false);
        setErrorMessage(e.data.message);
        setOpenError(true);
      }
    } else {
      setOpenError(true);
      setSubmissionLoading(false);
    }
  }  
  

  // Files Component
  const files = acceptedFiles.map(file => (
    <Paper key={file.path} 
      sx={{
        display: 'block',
        textAlign: 'center',
        fontWeight: 'light',
        p:2,
        backgroundColor: 'transparent'
      }}
      elevation={0}
    >
      {(file.path.endsWith(".png") || file.path.endsWith(".png")) && 
        <ImageIcon sx={{mx:'auto', display:'block', fontSize: "2.5rem"}}></ImageIcon>
      }
      {(file.path.endsWith(".pdf")) && 
        <PictureAsPdfIcon sx={{mx:'auto', display:'block', fontSize: "2.5rem"}}></PictureAsPdfIcon>
      }
      {(file.path.endsWith(".mp3") || file.path.endsWith(".m4a")) && 
        <AudioFileIcon sx={{mx:'auto', display:'block', fontSize: "2.5rem"}}></AudioFileIcon>
      }
      {(file.path.endsWith(".mp4") || file.path.endsWith(".mov")) && 
        <VideoFileIcon sx={{mx:'auto', display:'block', fontSize: "2.5rem"}}></VideoFileIcon>
      }
      <Typography 
        component="span"
        variant="caption"
        color="inherit"
        sx={{
          position: 'relative', 
          textAlign: 'center',
          fontWeight: 'light'
        }}
      >
        {file.type}
      </Typography>
    </Paper>
  ));


  // Stepper Functions
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  //Setting Items
  const levels = [
    'Bronze', 
    'Silver', 
    'Gold', 
    'All'
  ];

  const [levelSelect, setLevelSelect] = React.useState([]);

  const handleLevelChange = (event) => {
    let {
      target: { value },
    } = event;

    if (value.includes('All')) {
      value = 'All';
    }
    setLevelSelect(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  function getStyles(name, requestInputs) {
    return {
      fontWeight:
      requestInputs.indexOf(name) === -1
          ? 'regular'
          : 'bold',
    };
  }

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
    <div>
      <strong style={{ marginLeft: 'auto', float: "right"}}>
        <IconButton aria-label="addRecord" onClick={newPost}>
          <AddIcon />
        </IconButton>
      </strong>

      <Dialog open={createModalOpen} onClose={closeNewPostModal}>
        <DialogTitle>
          New Post 
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={closeNewPostModal}
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
                  <TextInput onTextChange={textChanged} textType="h5" inputName="Title" inputType="text" defaultText="Enter Title"></TextInput>
                  <TextInput onTextChange={textChanged} textType="body2" inputName="Description" inputType="textarea" defaultText="Enter Description" sx={{mb:2}}></TextInput>
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
                  <Card className="dropzone-container transparent-background" sx={{mt:'8rem'}} >
                    <div {...getRootProps({className: 'dropzone'})}>
                      <input {...getInputProps()} />
                      <Typography component="div" variant="body" color="inherit">Drop content here</Typography>
                    </div>
                    <aside className="drop-aside">
                      <Stack direction="row" spacing={2} sx={{m:3}}>
                        {files}
                      </Stack>
                    </aside>
                  </Card>
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
                </Box>
              }

              {activeStep === 2 && 
                <Box sx={{alignItems: 'flex-end', mt:"2rem", mx:6}}>
                  <FormGroup>
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <FormControlLabel control={<Switch checked={postPublic} onChange={handlePublicChange}/>} label="Public" />
                        {!postPublic && 
                          <FormControl sx={{ width: .8, mt:5}}>
                            <InputLabel id="demo-multiple-chip-label">Level Select</InputLabel>
                            <Select
                              labelId="demo-multiple-chip-label"
                              id="demo-multiple-chip"
                              multiple
                              value={levelSelect}
                              onChange={handleLevelChange}
                              input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                              renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                  {selected.map((value) => (
                                    <Chip key={value} label={value} />
                                  ))}
                                </Box>
                              )}
                              MenuProps={MenuProps}
                            >
                              {levels.map((level) => (
                                <MenuItem
                                  key={level}
                                  value={level}
                                  style={getStyles(level, levelSelect)}
                                >
                                  {level}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        }
                      </Grid>
                      <Grid item xs={6}>
                        <Grid container spacing={1} sx={{pr:"2rem"}}>
                          <Grid item xs={6}>
                            {!postPublic && 
                              <FormControlLabel control={<Switch checked={postMintable} onChange={handleMintableChange}/>} label="Mintable" />
                            }
                          </Grid>
                          <Grid item xs={6}>
                            {postMintable && 
                              <FormControlLabel control={<Switch checked={postBuyable} onChange={handleBuyableChange}/>} label="Buyable" sx={{ml:"10px"}}/>
                            } 
                          </Grid>
                        </Grid>
                        {postBuyable && 
                          <TextField sx={{mt:5}} label="Cost" inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} value={postCost} onChange={handleCostChange} error={postCostValidation} helperText="Cost must be a number."/>
                          //<NumericInput value={postCost} onChange={handleCostChange} style={{input: {width: '6vw'}}}/>
                        }
                      </Grid>
                    </Grid>
                  </FormGroup>

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
                      onClick={createPost}
                    >
                      Save
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
    
  )
}

export default CreatePost;


/* Alt DialogContent.innerHTML 

  <Box maxWidth="max" sx={{ flexDirection: 'row', p: 8}}> 
    <Box sx={{ justifyContent: 'center'}}>
      <TextField
        id="name"
        label="Post Name"
        helperText="The name of your post"
        variant="standard"
        fullWidth
        value={postName}
        onChange={handleNameChange}
        sx={{display: 'block', mx: "auto", width:500}}
      />  
      <TextField
        id="author"
        label="Post Author"
        helperText="The author of your post"
        variant="standard"
        fullWidth
        value={postAuthor}
        onChange={handleAuthorChange}
        sx={{display: 'block', mx: "auto", width:500}}
      />  
      <TextField
        id="copyright"
        label="Post Copyright"
        helperText="The copyright of your post"
        variant="standard"
        fullWidth
        value={postCopyright}
        onChange={handleCopyrightChange}
        sx={{display: 'block', mx: "auto", width:500}}
      /> 
      <Select
        id="language"
        fullWidth
        variant="standard"
        value={postLanguage}
        label="Post Language"
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
        label="Post Description"
        helperText="The description of the type of project this is"
        variant="standard"
        fullWidth 
        multiline
        rows={4}
        value={postDescription}
        onChange={handleDescriptionChange}
        sx={{display: 'block', mx: "auto", width:500}}
      />
    </Box>
    <Box maxWidth={1025} sx={{ display: 'block'}}>
      <Box sx={{ml: "auto", width:250, display: 'flex'}}>
        <label htmlFor="post-upload" style={{display: 'inline', ml: "auto", width:100}}>
          <Input accept="image/*" id="post-upload" multiple type="file" onChange={onFileChange} />
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
            console.log('Mint');
          }}
          loading={submissionLoading}
          variant="outlined"
        >
          Mint
        </LoadingButton>
      </Box>
    </Box>
  </Box>

*/