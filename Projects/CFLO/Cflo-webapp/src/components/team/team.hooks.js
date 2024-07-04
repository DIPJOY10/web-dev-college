import {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import Api from '../../helpers/Api';
import teamUtils from './team.utils';
const {handleTeams} = teamUtils;

export const useGetTeams = ()=>{
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const {
    auth,
  } = state;
  const {
    user,
  } = auth;

  useEffect(() => {
    if (user&&user._id) {
      Api.post('team/getTeams', {
        profile: user.profile,
      }).then((res)=>{

        handleTeams(res?.teams, state, dispatch);
      });
    }
  }, [user?._id]);
};

