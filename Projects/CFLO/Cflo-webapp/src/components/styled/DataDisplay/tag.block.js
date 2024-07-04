import React, {useState, useEffect} from 'react';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import {useSelector, useDispatch} from 'react-redux';
import Tags from './tags.view';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
  root: {
    flex: 1,
    marginTop: '1rem',
  },

  textStyle: {
    wordWrap: 'break-word',
  },


  row: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
  },

  col: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '17rem',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '0.5rem',
    textAlign: 'center',
    margin: '1rem',
  },

  paper: {
    margin: '1rem',
  },

});

export default function Data(props) {
  const classes = useStyles();
  const {name, tagIds, type} = props;


  return (

    <div className={classes.col}>
      <Typography variant="button"><b>{name}</b></Typography>
      <Tags
        tagIds={tagIds}
        type={type}
      />
    </div>


  );
}
