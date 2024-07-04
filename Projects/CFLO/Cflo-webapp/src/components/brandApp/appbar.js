import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {useHistory} from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import HomeIcon from '@material-ui/icons/Home';


const useStyles = makeStyles((theme) => ({

  appBar: {
    backgroundColor: 'white',
    height: '4rem',
    padding: '0.5rem',
  },

  row: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
  },


  center: {
    alignItems: 'center',
    textAlign: 'center',
  },

  homeText: {
    color: 'black',
    marginLeft: '0.5rem',
  },

}));

export default function BrandAppBar(props) {
  const {
    brandApp,
    adminTeams,
  } = props;

  const state = useSelector((state) => state);

  const {
    auth,
    team,
    file,
  } = state;

  const {
    user,
  } = auth;

  const classes = useStyles();

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar variant="dense">

        <ButtonBase className={classes.homeBtn}
          onClick={()=>{

          }}>
          <HomeIcon style={{color: 'black'}} />
          <Typography className={classes.homeText}>
                                Home
          </Typography>

        </ButtonBase>

      </Toolbar>
    </AppBar>
  );
}
