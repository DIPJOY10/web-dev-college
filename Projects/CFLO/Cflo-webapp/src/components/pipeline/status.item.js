import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import {ButtonBase} from '@material-ui/core';
import {ColorBlob} from './color.cards';
import ListItem from '@material-ui/core/ListItem';
import DeleteBtn from '../styled/actionBtns/delete.btn';
import EditBtn from '../styled/actionBtns/edit.btn';

const useStyles = makeStyles({
  root: {

    width: '100%',
    padding: '0.5rem',
    borderRadius: '0.2rem',
    borderColor: '#fafafa',
    borderWidth: '1px',

  },
  row: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
  },
});

export const StatusItem = (props)=>{
  const {color, text, onClick, onDelete, onEdit} = props;
  const classes = useStyles({...props}); ;
  return (
    <ListItem className={classes.root} onClick={()=>{
      if (onClick) {
        onClick();
      }
    }}>
      <div className={classes.row}>
        <ColorBlob backgroundColor={color}/>
        <Typography>{text}</Typography>
      </div>
      {
                onEdit?<EditBtn onClick={onEdit} />:null
      }

      {
                onDelete?<DeleteBtn onClick={onDelete}/>:null
      }

    </ListItem>
  );
};
