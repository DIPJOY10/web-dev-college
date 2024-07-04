import {useState, useEffect} from 'react';
import socket from '../../helpers/socket/socketio';
import {useSelector, useDispatch} from 'react-redux';
import Api from '../../helpers/Api';
import {setJobs, setInvestments} from './feed.utils';

export const useFeedData = function() {
  const dispatch = useDispatch();
  const explore = useSelector((state)=>state.explore);


  useEffect(() => {
    Api.post('feed/get', {})
        .then((data)=>{
          const {
            jobs,
            investments,
          } = data;

          setJobs(jobs, explore, dispatch);
          setInvestments( investments, explore, dispatch);
        });
  }, []);
};
