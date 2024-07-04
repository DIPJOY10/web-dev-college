import React, {useState, useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import firebase from 'firebase';
import Api from '../../../helpers/Api';
import {useHistory} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import {firebaseLoginHelper} from '../../auth/auth.utils';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import ButtonBase from '@material-ui/core/ButtonBase';
import Snackbar from '@material-ui/core/Snackbar';
// const { setAuthUser } = AuthActions;

const useStyles = makeStyles((theme) => ({

  paper: {
    marginTop: '2rem',
    width: '12rem',
  },

  btnStart: {
    backgroundColor: 'white',
    borderRadius: '0.2rem',
    height: '3rem',
    fontSize: '1.5rem',
    fontWeight: '800',
    color: theme.palette.primary.main,
    width: '12rem',


  },

}));

const GetStartedBtn = (props) =>{
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const handleGoogleLogin = () => {
    // console.log('handleGoogleLogin called')
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
              .catch((e) => {
                console.log(e, ' is the firebase error');
                setOpen(true);
              });
        });
  };

  const handleClose = (event, reason) => {
    setOpen(false);
  };


  return (
    <Paper className={classes.paper}>
      <ButtonBase onClick={()=>handleGoogleLogin()} className={classes.btnStart}>
                Get Started
      </ButtonBase>
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message="Login Failed"
        action={
          <React.Fragment>
            <Button color="secondary" size="small" onClick={handleClose}>
                        Try Again
            </Button>

          </React.Fragment>
        }
      />
    </Paper>

  );
};


export default GetStartedBtn;
