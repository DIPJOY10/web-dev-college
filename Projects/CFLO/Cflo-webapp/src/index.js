import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import firebase from 'firebase';
import configureStore, { history } from './store/configureStore';
import { PersistGate } from 'redux-persist/integration/react';
import './index.css';
import App from './App';
import firebaseConfig from './config/firebase.config';
import config from './config/index';
import "firebase/database";
import { Elements } from '@stripe/react-stripe-js';
import * as serviceWorker from './serviceWorker';
const { store, persistor } = configureStore();


firebase.initializeApp(config.firebaseConfig);
export const db = firebase.database();
// const { store, persistor } = configureStore;


ReactDOM.render(
  <Provider store={store}>
    <Router>
      <PersistGate loading={<div>loading</div>} persistor={persistor}>
        <App history={history} />
      </PersistGate>
    </Router>
  </Provider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
