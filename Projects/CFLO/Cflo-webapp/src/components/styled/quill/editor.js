import React from 'react';
import {
  makeStyles,
  useTheme,
} from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import { Paper } from '@material-ui/core';
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const useStyles = makeStyles((theme) => ({
    root:{
        margin:'1rem'
    }  
}))

function Editor(props) {
    const classes = useStyles()
    const {text, setText, style, placeholder } = props;

    const setTextData = (editorHtml) => {

        setText(editorHtml)

    }

    return (
        <div className={classes.root}>
            <Paper >
                <ReactQuill 
                    style={style} 
                    value={text} 
                    modules={Editor.modules} 
                    placeholder={placeholder} 
                    onChange={(editorHtml)=>setTextData(editorHtml)} 
                />
            </Paper>
        </div>


    );
}

Editor.modules = {
  toolbar: [
    [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
    [{size: []}],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    ['link'],
    ['clean']
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  }
}


export default Editor;
