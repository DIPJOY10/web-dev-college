import React, {useState, useEffect} from 'react';
import firebase from 'firebase';
import {useSelector, useDispatch} from 'react-redux';
import ExploreActions from '../reducers/Explore/ExploreActions';
import ChatActions from '../reducers/Chat/ChatActions';
import Api from './Api';
const lastCalledReload = 300;

/**
 *
 * @param { String } path
 * @param { Object} body
 */

function useApiHook(path, body, callbackFn) {
  const [data, setData] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const state = useSelector((state)=>state);
  const Auth = firebase.auth();
  const user = Auth.currentUser;

  useEffect(() => {
    async function callApi() {
      try {
        setLoading(true);

        const res = await Api.post(path, body);
        const {status, result} = res;

        callbackFn(dispatch, state, result);
        setLoading(false);
        setData(true);
      }
      catch (error) {
        setError(error);
      }

      callApi();
    }
  }, []);

  return [loading, error, data];
}

export default useApiHook;
