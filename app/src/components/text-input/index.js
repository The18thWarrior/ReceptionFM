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
import { DraftailEditor, serialiseEditorStateToRaw, BLOCK_TYPE, INLINE_STYLE } from "draftail";
import { convertToHTML, convertFromHTML } from 'draft-convert';
import { convertToRaw, convertFromRaw } from "draft-js";
import {Parser} from 'html-to-react';
import { exporterConfig } from './components.js';


function TextInput({onTextChange, textType, inputType, inputName, defaultText}) {
  const defaultRTFContent = {"entityMap":{},"blocks":[{"key":"637gr","text":"Example Text","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}]};

  const [textVal, setTextVal] = React.useState(defaultText);
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
    console.log('selectInput');
    setCreateModalOpen(true);
  }

  function onEditorStateChange(editorState) {
    console.log(editorState);
    if (editorState) {
      setRtfValue(editorState);
      const html = toHTML(editorState);
      console.log(html);
      setHtmlVal(html);
    }
  };
  
  const toHTML = (raw) => raw ? convertToHTML(exporterConfig)(convertFromRaw(raw)) : "";

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
      onChange={updateText}
      sx={{display: 'block', mx: "auto", width:500}}/>;
  } else if (inputType === 'rtf') {
    field = <Box sx={{width: "800px"}} ><DraftailEditor
    onSave={onEditorStateChange}
    blockTypes={[
      BLOCK_TYPE.HEADER_TWO,
      BLOCK_TYPE.HEADER_THREE,
      BLOCK_TYPE.HEADER_FOUR,
      BLOCK_TYPE.HEADER_FIVE,
      BLOCK_TYPE.UNORDERED_LIST_ITEM,
      BLOCK_TYPE.ORDERED_LIST_ITEM,
    ]}
    inlineStyles={[{ type: INLINE_STYLE.BOLD }, { type: INLINE_STYLE.ITALIC }]}
  /></Box>;
  }

  let textDisplay;
  if (inputType === 'text') {
    textDisplay = <Typography variant={textType} component="div" gutterBottom onClick={selectInput}>{textVal}</Typography>;
  } else if (inputType === 'rtf') {
    textDisplay = <div onClick={selectInput}>{htmlToReactParser.parse(htmlVal)}</div>;
  }
  

  return (
    <div>
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
    </div>
  )

}
export default TextInput;

