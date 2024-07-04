import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles({
  closeButton: {
    height: '2.5rem',
    width: '2.5rem',

  },
});

export default function CloseBtn(props) {
  const classes = useStyles();
  const {closeButton} = classes;

  const {
    onClick,
  } = props;

  return (
    <IconButton

      onClick={()=>{
        if(onClick) onClick();
      }}
      className={closeButton}
    >
      <CloseIcon />
    </IconButton>
  );
}
