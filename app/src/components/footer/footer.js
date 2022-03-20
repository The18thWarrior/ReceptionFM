import React, {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Plyr from 'plyr-react';
import ReactPlayer from 'react-player';
import 'plyr-react/dist/plyr.css';

import PostMint from '../post-mint';

function Footer({status, post, clearPost, postId, postContract, channelId}) {
  const [selectedMedia, setSelectedMedia] = React.useState('');
  const [selectedMediaType, setSelectedMediaType] = React.useState('');
  const [selectedMediaMime, setSelectedMediaMime] = React.useState('');
  const [selectedMediaData, setSelectedMediaData] = React.useState({});
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  useEffect(() => {
    if (status === 'selected' && post.parse_properties) {
      let parts = post.parse_properties[0].split("/");
      let mediaResult = parts[parts.length - 1];
      let mediatype = '';
      if (mediaResult === 'm4a') {
        mediatype = 'audio';
      } else {
        mediatype = 'video';
      }

      let media = {
        type: mediatype,
        title: post.name,
        sources: [
          {
            src: post.parse_properties[0],
            type: mediatype+'/'+mediaResult,
          }
        ]
      };
      if (media.sources.src !== '') {
        setSelectedMedia(post.parse_properties[0]);
        setSelectedMediaType(mediatype);
        setSelectedMediaMime(mediatype+'/'+mediaResult);
        setSelectedMediaData(media);
        setDrawerOpen(true);
        console.log(media, post.parse_properties[0])
      }
      
      console.log('footer complete',media, status);
    } else if (status === 'selected') {
      setSelectedMedia('');
      setSelectedMediaType('');
      setSelectedMediaMime('');
      setSelectedMediaData({});
      setDrawerOpen(true);
    } else {
      setSelectedMedia('');
      setSelectedMediaType('');
      setSelectedMediaMime('');
      setSelectedMediaData({});
    }
  }, [status, postContract, postId, post, channelId]);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setDrawerOpen(open);
    if (!open) {
      clearPost();
    }
    
  };

  return (
    <div>
      { status === 'selected' && 
        <Drawer
          anchor={'bottom'}
          open={drawerOpen}
          sx={{height: 5}}
          onClose={toggleDrawer(false)}
          variant="persistent"
        >
          <Grid container spacing={2}>
            {selectedMedia !== '' && 
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <ReactPlayer url={selectedMedia} light="false" controls={true} width="100%"/>
                </Grid>
                <Grid item xs={6} sx={{}}>
                  <IconButton onClick={toggleDrawer(false)} variant="contained" color="primary" sx={{float:"right"}} aria-label="delete">
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
    
                  <Box sx={{ width: '50%', m:10 }}>
                    <TextField
                      helperText="Name"
                      InputProps={{
                        readOnly: true,
                      }}
                      fullWidth 
                      variant="standard"
                      value={post.name}
                    />
                    <TextField
                      helperText="Description"
                      multiline
                      InputProps={{
                        readOnly: true,
                      }}
                      maxRows={10}
                      fullWidth 
                      variant="standard"
                      value={post.description}
                      sx={{my: 3}}
                    />
                    <TextField
                      helperText="Created Date"
                      InputProps={{
                        readOnly: true,
                      }}
                      fullWidth 
                      variant="standard"
                      value={post.properties?.createdDate}
                    />
                  </Box>
                  <PostMint postContract={postContract} postId={postId}></PostMint>
                </Grid>
              </Grid>
            }
            {selectedMedia === '' && 
              
              <Grid item sx={{width:"100vw"}}>
                  <IconButton onClick={toggleDrawer(false)} variant="contained" color="primary" sx={{float:"right"}} aria-label="delete">
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
    
                  <Box sx={{ m:10, width:"50vw" }}>
                    <TextField
                      helperText="Name"
                      InputProps={{
                        readOnly: true,
                      }}
                      variant="standard"
                      value={post.name}
                      sx={{width:"20vw"}}
                    />
                    <TextField
                      helperText="Description"
                      multiline
                      InputProps={{
                        readOnly: true,
                      }}
                      maxRows={10}
                      variant="standard"
                      value={post.description}
                      sx={{width:"30vw"}}
                    />
                  </Box>
                  <PostMint postContract={postContract} postId={postId} channelId={channelId}></PostMint>
               
              </Grid>
              
            }
            
          </Grid>
        </Drawer>
      }
    </div>
    
  );
}

export default Footer;

/*
<Plyr
  source={selectedMediaData}
/>

<ReactPlayer url={selectedMedia} light="false"/>
          

*/