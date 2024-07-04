import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {useHistory} from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import cx from 'clsx';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    maxHeight: '4rem',
    width: '100%',
    minWidth: '18rem',
    backgroundColor: 'white',
  },

  title: {
    color: '#616161',
    marginTop: '0.5rem',
    marginLeft: '0.8rem',
  },

  row: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
  },

  paper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',

  },

  col: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },

  margin: {
    margin: '1rem',
  },
}));

export default function LeftTopBar(props) {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const {

  } = useSelector((state) => state);

  const {
    root, row, paper,
  } = classes;

  return (
    <AppBar position="static" className={root} elevation={1}>
      <Toolbar>

        <Typography variant="h6" className={classes.title}>
                Banking Setup
        </Typography>

      </Toolbar>
    </AppBar>


  );
}
