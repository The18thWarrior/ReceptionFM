import React, { useEffect, useState, useRef } from 'react';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {baseImage} from '../../static/constants';

function UploadImage({onImageChange}) {
  
  const hiddenFileInput = useRef(null);
  const [uploadedImage, setUploadedImage] = React.useState({
    "image": {
      "url" : baseImage,
      "title" : "Upload Image"
    }
  });
  function uploadImage(event) {
    getBase64(event.target.files[0]).then((uri) => {
      let newImageFile = {
        "url" : uri,
        "title" : event.target.files[0].name
      };
      setUploadedImage({image: newImageFile, file:event.target.files[0]});
    });
  }

  useEffect(() => {
    onImageChange(uploadedImage);
  },[uploadedImage]);


  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  function openImageUpload() {
    hiddenFileInput.current.click();
  }

  const ImageButton = styled(ButtonBase)(({ theme }) => ({
    position: 'relative',
    height: 200,
    [theme.breakpoints.down('sm')]: {
      width: '100% !important', // Overrides inline-style
      height: 100,
    },
    '&:hover, &.Mui-focusVisible': {
      zIndex: 1,
      '& .MuiImageBackdrop-root': {
        opacity: 0.15,
      },
      '& .MuiImageMarked-root': {
        opacity: 0,
      },
      '& .MuiTypography-root': {
        border: '4px solid currentColor',
      },
    },
  }));

  const ImageSrc = styled('span')({
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center 40%',
  });

  const Image = styled('span')(({ theme }) => ({
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.common.white,
  }));

  const ImageBackdrop = styled('span')(({ theme }) => ({
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: theme.palette.common.black,
    opacity: 0.4,
    transition: theme.transitions.create('opacity'),
  }));

  const ImageMarked = styled('span')(({ theme }) => ({
    height: 3,
    width: 18,
    backgroundColor: theme.palette.common.white,
    position: 'absolute',
    bottom: -2,
    left: 'calc(50% - 9px)',
    transition: theme.transitions.create('opacity'),
  }));

  const Input = styled('input')({
    display: 'none',
  });

  return(
    <Box sx={{ display: 'flex', flexWrap: 'wrap', minWidth: 500, width: '100%', my:4 }}>
      <Input accept="image/*" id="channel-upload" multiple type="file" onChange={uploadImage} ref={hiddenFileInput} />
      <ImageButton
        focusRipple
        style={{
          width: "800px",
        }}
        onClick={openImageUpload}
      >
        
        <ImageSrc style={{ backgroundImage: `url(${uploadedImage.image.url})` }} />
        <ImageBackdrop className="MuiImageBackdrop-root" />
        <Image>
          <Typography
            component="span"
            variant="subtitle1"
            color="inherit"
            sx={{
              position: 'relative',
              p: 4,
              pt: 2,
              pb: (theme) => `calc(${theme.spacing(1)} + 6px)`,
            }}
          >
            {uploadedImage.image.title}
            <ImageMarked className="MuiImageMarked-root" />
          </Typography>
        </Image>
      </ImageButton>
    </Box>
  )

} 

export default UploadImage;