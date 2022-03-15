import React, { useEffect, useState, useRef, Ref, PropsWithChildren, Component } from 'react';
import ReactDOM from 'react-dom';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {baseImage} from '../../static/constants';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import {Parser} from 'html-to-react';


function TextInput({onTextChange, textType, inputType, inputName, defaultText}) {
  const defaultRTFContent = {"entityMap":{},"blocks":[{"key":"637gr","text":"Example Text","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}]};

  const [textVal, setTextVal] = React.useState();
  const [htmlVal, setHtmlVal] = React.useState("<p>"+defaultText+"</p>");
  const [createModalOpen, setCreateModalOpen] = React.useState(false);
  const [rtfValue, setRtfValue] = useState({});
  const editor = React.useRef(null);
  const htmlToReactParser = new Parser();

  function updateText(event) {
    setTextVal(event.target.value);
  }
  function closeInputModal() {
    setCreateModalOpen(false);
  }
  function selectInput() {
    setCreateModalOpen(true);
  }
  
   useEffect(() => {
    onTextChange({textVal, inputName});
  },[textVal]);

  useEffect(() => {
    onTextChange({htmlVal, inputName});
  },[htmlVal]);

  let field;
  if (inputType === 'text') {
    field = <TextField
      id={inputName}
      label={inputName}
      variant="standard"
      fullWidth
      value={textVal}
      placeholder={defaultText}
      onChange={updateText}
      sx={{display: 'block', mx: "auto", width:500}}/>;
  } else if (inputType === 'rtf') {
    field = <Box sx={{width: "800px"}} ></Box>;
  } else if (inputType === 'textarea') {
    field = <TextField
      id={inputName}
      label={inputName}
      variant="standard"
      fullWidth
      multiline
      rows={4}
      value={textVal}
      placeholder={defaultText}
      onChange={updateText}
      sx={{display: 'block', mx: "auto", width:500, mb:4}}/>;
  }

  let textDisplay;
  if (inputType === 'text') {
    textDisplay = <Typography variant={textType} component="div" gutterBottom onClick={selectInput} sx={{mb:'2rem'}}>{textVal}</Typography>;
  } else if (inputType === 'rtf') {
    textDisplay = <div onClick={selectInput}>{htmlToReactParser.parse(htmlVal)}</div>;
  } else if (inputType === 'textarea') {
    textDisplay = <Typography variant={textType} component="div" gutterBottom onClick={selectInput} sx={{my:'2rem'}}>{textVal}</Typography>;
  }
  

  return (
    <div>
      {field}
    </div>
  )

}
export default TextInput;

/*

<strong>
  {textDisplay}
</strong>
<Dialog open={createModalOpen} onClose={closeInputModal}>
  <DialogContent>
    {field}
  </DialogContent>
  <DialogActions>
    <Button onClick={closeInputModal}>Ok</Button>
  </DialogActions>
</Dialog>
*/
