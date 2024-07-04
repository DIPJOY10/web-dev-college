import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles({
  editButton: {
    height: '2.5rem',
    width: '2.5rem',
  },
});

export default function DeleteBtn(props) {
  const classes = useStyles();
  const {editButton} = classes;

  const {
    onClick,
  } = props;

  return (
    <IconButton

      onClick={()=>{
        onClick();
      }}
      className={editButton}
    >
      <DeleteIcon />
    </IconButton>
  );
}
