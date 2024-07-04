import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import CloseIcon from '@material-ui/icons/Close';
import {Button} from '@material-ui/core';

const useStyles = makeStyles({
  button: {
    height: '2.5rem',
  },
});

export default function DisabledBtn(props) {
  const classes = useStyles();

  const {
    text,
  } = props;

  return (
    <Button
      disabled={true}
      className={classes.button}
    >
      {text}
    </Button>
  );
}
