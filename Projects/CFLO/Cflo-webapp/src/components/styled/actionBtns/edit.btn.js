import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';

const useStyles = makeStyles({
  editButton: {
    height: '2.5rem',
    width: '2.5rem',
  },
});

export default function EditBtn(props) {
  const classes = useStyles();
  const {editButton} = classes;

  const {
    onClick,
  } = props;

  return (
    <IconButton

      onClick={(ev)=>{
        if (onClick) {
          onClick(ev);
        }
      }}
      className={editButton}
    >
      <EditIcon reverse />
    </IconButton>
  );
}
