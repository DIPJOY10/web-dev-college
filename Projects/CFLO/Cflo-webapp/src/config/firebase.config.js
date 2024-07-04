let firebaseConfig = null;

// eslint-disable-next-line eqeqeq
if ("prod" == process.env.mode) {
  firebaseConfig = {
    apiKey: "AIzaSyALkEAm5pa0OszGULo9dcjHYKOlJLlcrg8",
    authDomain: "contractflo.firebaseapp.com",
    databaseURL: "https://contractflo.firebaseio.com",
    projectId: "contractflo",
    storageBucket: "contractflo.appspot.com",
    messagingSenderId: "481726993184",
  };
} else {
  firebaseConfig = {
    apiKey: "AIzaSyDrLKkpH8Hie1IooAbKo5n2v6Kz2V7xz-g",
    authDomain: "dev-contractflo.firebaseapp.com",
    databaseURL: "https://dev-contractflo.firebaseio.com",
    projectId: "dev-contractflo",
    storageBucket: "dev-contractflo.appspot.com",
    messagingSenderId: "671558970982",
    appId: "1:671558970982:web:b6c60a6268862feefa47a7",
  };
}

export default firebaseConfig;
