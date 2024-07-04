import React, {useState, useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import {AppBar, Box, Toolbar} from '@material-ui/core';
import {ColorBlob} from './color.cards';


const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
  },
  paper: {
    padding: '1rem',
    width: '18rem',
    minHeight: '32rem',
    margin: '0.5rem',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    display: 'flex',
  },
  statusTop: {
    flex: 1,
    height: '4rem',
  },
}));

export default function Column(props) {
  const classes = useStyles();
  const {state, color} = props;
  return (
    <Box flexDirection="column" flexGrow={1} display="flex" >

      <Paper className={classes.paper}>
        <div className={classes.row}>
          <ColorBlob backgroundColor={color}/>
          <Typography variant="body2" color="textSecondary">
            {state}
          </Typography>
        </div>
        {props.children}
      </Paper>
    </Box>
  );
}
