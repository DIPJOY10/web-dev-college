import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import firebase from 'firebase';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { firebaseLoginHelper } from '../../auth/auth.utils';
import ButtonBase from '@material-ui/core/ButtonBase';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';

const useStyles = makeStyles((theme) => ({
  navJoinBtn: {
    padding: "5px",
    borderRadius: "5px",
    minWidth: "100px",
    fontSize: "17px",
    border: "1px solid white",
    [theme.breakpoints.down("sm")]: {
      border: "1px solid #2E73F8",
    },
  },
  navJoinBtnAsNav: {
    padding: "5px",
    borderRadius: "5px",
    minWidth: "100px",
    fontSize: "17px",
    border: "1px solid #2E73F8",
    [theme.breakpoints.down("sm")]: {
      border: "1px solid #2E73F8",
    },
  }
}));

const JoinNow = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const { isCrossHomePage } = props;

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
    <ButtonBase onClick={() => handleGoogleLogin()} className={isCrossHomePage ? classes.navJoinBtnAsNav : classes.navJoinBtn}>
      Join Now
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
    </ButtonBase>
  );
};


export default JoinNow;
