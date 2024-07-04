import React, { useState, useEffect } from "react";
import firebase from "firebase";
import { useDispatch } from "react-redux";
import { firebaseLoginHelper } from "./auth.utils";

const Login = (dispatch) => {
  // console.log('Login Fn called')

  const handleGoogleLogin = () => {
    // console.log('handlegooglelogin called')
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
          .catch((e) => console.log(e, " is the firebase error"));
      });
  };

  handleGoogleLogin();
};

export default Login;
