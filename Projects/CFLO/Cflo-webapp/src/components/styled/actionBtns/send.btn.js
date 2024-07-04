import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';

import SendIcon from '@material-ui/icons/Send';
import {Typography, Button} from '@material-ui/core';

const useStyles = makeStyles({
  button: {
    height: '2.5rem',
  },

});

export default function SendBtn(props) {
  const classes = useStyles();


  const {
    onClick, text='Send',
  } = props;

  return (
    <Button
      variant="contained"
      color="primary"
      className={classes.button}
      startIcon={<SendIcon />}
    >
      {text}
    </Button>

  );
}
