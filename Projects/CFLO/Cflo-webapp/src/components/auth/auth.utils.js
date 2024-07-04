import firebase from "firebase";
import Api from "../../helpers/Api";

export const handleGoogleLogin = (dispatch) => {
  const provider = new firebase.auth.GoogleAuthProvider();

  firebase
    .auth()
    .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(() => {
      firebase
        .auth()
        .signInWithPopup(provider)
        .then((result) => {
          console.log(result, " is the authenticated user ", result.user);
          firebaseLoginHelper(result.user, dispatch);
        })
        .catch((e) => {
          console.log(e, " is the firebase error");
        });
    });
};

export const handleEmailPasswordLogin = (dispatch, email, password) => {
  const auth = firebase.auth();
  auth
    .signInWithEmailAndPassword(email, password)
    .then((result) => {
      console.log(result);
      firebaseLoginHelper(result.user, dispatch);
    })
    .catch((e) => {
      console.log(e, " is the firebase error");
    });
};

export const handleEmailPasswordSignup = (
  dispatch,
  email,
  password,
  displayNameParam = null
) => {
  const auth = firebase.auth();
  auth
    .createUserWithEmailAndPassword(email, password)
    .then((result) => {
      console.log(result);
      firebaseLoginHelper(result.user, dispatch, displayNameParam);
    })
    .catch((e) => {
      console.log(e, " is the firebase error");
    });
};

export const handleForgotPassword = (email) => {
  const auth = firebase.auth();
  auth
    .sendPasswordResetEmail(email)
    .then(() => {
      console.log("email Sent Successfully");
    })
    .catch((e) => {
      console.log(e, " is the firebase error");
    });
};

export const handleResetPassword = (oobCode, password) => {
  const auth = firebase.auth();
  auth
    .confirmPasswordReset(oobCode, password)
    .then(() => {
      console.log("Password Reset Successfully");
    })
    .catch((e) => {
      console.log(e, " is the firebase error");
    });
};

export const firebaseLoginHelper = async (
  firebaseUser,
  dispatch,
  displayNameParam = null
) => {
  console.log("firebase user");
  let { uid, email, displayName, photoURL } = firebaseUser;
  displayName = displayName || displayNameParam;
  const token = await firebase.auth().currentUser.getIdToken(true);
  localStorage.setItem("token", token);
  localStorage.setItem("loggedInFirebaseUId", uid);

  Api.post("signIn/", {
    firebaseUid: uid,
    email,
    displayName,
    imagePath: photoURL,
    emailVerified: true,
  }).then((user) => {
    console.log("Returned user from backend: ", user);
    const userId = user._id;
    const personDictionary = {};
    personDictionary[userId] = user;
    dispatch({
      type: "SET_AUTH_USER",
      user,
    });
  });
};

export const updateUser = (userObject, state, dispatch) => {
  const { auth } = state;
  const { user } = auth;
  Api.post("user/update", userObject).then((user) => {});
  dispatch({
    type: "AddAuth",
    payload: {
      user: {
        ...user,
        ...userObject,
      },
    },
  });
};
