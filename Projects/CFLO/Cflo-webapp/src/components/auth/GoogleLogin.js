import React, {useState, useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {Button} from '@material-ui/core';
import PropTypes from 'prop-types';
import firebase from 'firebase';
import Api from '../../helpers/Api';
import {useHistory} from 'react-router-dom';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import AuthButtons from './AuthButtons';
import {useDispatch} from 'react-redux';
import {firebaseLoginHelper} from './auth.utils';
import Paper from '@material-ui/core/Paper';
import ButtonBase from '@material-ui/core/ButtonBase';

// const { setAuthUser } = AuthActions;

const useStyles = makeStyles((theme) => ({

  createBtn: {
    paddingLeft: '0.5rem',
    padding: '0.5rem',
    paddingTop: '0.25rem',
    paddingBottom: '0.25rem',
    paddingRight: '1rem',
  },
  createBtnPaperFixed: {
    alignSelf: 'flex-end',
    maxWidth: '10.5rem',
  },
  createBtnPaperFixed: {
    alignSelf: 'flex-end',
    maxWidth: '10.5rem',
    position: 'fixed',
    top: '2rem',
    right: '2rem',
  },
  imgStyle: {
    margin: '0.5rem',
  },

  textStyle: {
    fontSize: '0.9rem',
  },

}));

const SocialAuth = (props) =>{
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();
  const absolute = props.absolute;

  const {
    createBtnPaperFixed,
    createBtnPaper,
  } = classes;
  const matchLarge = useMediaQuery('(min-width:400px)');

  const handleGoogleLogin = () => {
    const provider = new firebase.auth.GoogleAuthProvider();

    firebase
        .auth()
        .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(() => {
          firebase
              .auth()
              .signInWithPopup(provider)
              .then((result) => {
                console.log('google signin result ',result);
                firebaseLoginHelper(result.user, dispatch);
              })
              .catch((e) => console.log(e, ' is the firebase error'));
        });
  };


  return (


    <Paper className={absolute?createBtnPaperFixed:createBtnPaper}>
      <ButtonBase className={classes.createBtn}
        onClick={() => handleGoogleLogin()}>

        <img
          src={'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg'}
          alt="logo"
          height="18px"
          className={classes.imgStyle}
        />

        <Typography
          className={classes.textStyle} >
          <b>Get Started</b>
        </Typography>
      </ButtonBase>
    </Paper>

  );
};


export default SocialAuth;
