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


// const { setAuthUser } = AuthActions;

const useStyles = makeStyles((theme) => ({
  root: {
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center',
    textWrap: 'wrap',
    overflow: 'hidden',
    width: '100%',
    marginTop: '20px',
  },


}));

const SocialAuth = (props) =>{
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();
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
                firebaseLoginHelper(result.user, dispatch);
              })
              .catch((e) => console.log(e, ' is the firebase error'));
        });
  };

  const handleFacebookLogin = () => {
    const provider = new firebase.auth.FacebookAuthProvider();

    firebase
        .auth()
        .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(() => {
          firebase
              .auth()
              .signInWithPopup(provider)
              .then((result) => {
                const {uid, email, displayName, photoURL} = result.user;
                Api.post('signIn/', {
                  firebaseUid: uid,
                  email,
                  displayName,
                  imagePath: photoURL,
                  emailVerified: true
                }).then((user)=>{

                });
              })
              .catch((e) => console.log(e.message));
        });
  };


  return (
    <div className={classes.root}>

      <AuthButtons
        imagePath={'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg'}
        text={'Signin with Google'}
        onClick={() => handleGoogleLogin()}
      />
      {/*
                      <AuthButtons
                        imagePath={"https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg"}
                        text={"Signin with Facebook"}
                        onClick={() => handleFacebookLogin()}
                      />
                */}
      {/* <Grid container>
                        <Grid xs={false} sm={2}>

                        </Grid>
                        <Grid xs={12} sm={8}>
                                <Button className={matchLarge?classes.googleBtn:classes.googleBtnSm} variant="contained" onClick={() => handleGoogleLogin()} >
                                    <Grid container direction="row">
                                            <Grid item xs={2} justify={"flex-end"} >
                                                    <img
                                                        src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                                                        alt="logo"
                                                        height="20px"
                                                        style={{
                                                            marginTop:5
                                                        }}
                                                    />
                                            </Grid>
                                            <Grid item xs={10} justify="center" className={classes.textButtonGrid}>
                                                Continue with Google
                                            </Grid>
                                    </Grid>
                            </Button>
                        </Grid>
                        <Grid xs={false} sm={2}>

                        </Grid>
                    </Grid> */}

    </div>

  );
};


export default SocialAuth;
