import React, {useState, useEffect} from 'react';
import {
  makeStyles,
  useTheme,
} from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import {withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';


const styles = {
  root: {
    maxWidth: '20rem',
    height: '2.5rem',
    paddingLeft: '1rem',
    paddingRight: '1rem',
    fontSize: '1rem',
    backgroundColor: '#eeeeee',
    color: '#424242',
    margin: '0.6rem 0',

  },

  input: {
    WebkitBoxShadow: '0 0 0 1000px #eeeeee inset',

  },

};

export const TextInputBase = withStyles(styles)(InputBase);

const zipStyles = {
  root: {
    maxWidth: '8rem',
    height: '2.5rem',
    paddingLeft: '1rem',
    paddingRight: '1rem',
    color: '#424242',
    fontSize: '1rem',
    backgroundColor: '#eeeeee',
  },

  input: {
    WebkitBoxShadow: '0 0 0 1000px #eeeeee inset',
  },
};

export const ZipInput = withStyles(zipStyles)(InputBase);


const useStyles = makeStyles((theme) => ({
  redText: {
    fontSize: '0.9rem',
    color: 'orange',
    margin: '0.5rem 0.5rem',
  },


}));

export const ErrorText = (props)=>{
  const classes = useStyles();
  const {show, msg} = props;

  const MsgView = (
    <Typography className={classes.redText}>
      {msg}
    </Typography>
  );

  return show?MsgView:null;
};

export const DescriptionInput = (props)=>{
  const classes = useStyles();
  const {text, setText, placeholder} = props;

  return (
    <InputBase
      multiline
      rowsMax={2}
      value={text}
      placeholder={placeholder}
      onChange={(event)=>setText(event.target.value)}
      className={classes.descInput}
      autoFocus
    />
  );
};
