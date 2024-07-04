import {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import Api from '../../helpers/Api';
import {handleTeams} from '../team/team.utils';
import _ from 'lodash';

export const useGetTopProjects = (profileIds=[])=>{
  const dispatch = useDispatch();
  const [teams, setTeams] = useState([]);
  const [ids, setIds] = useState(profileIds);

  const [called, setCalled] = useState(false);
  const [fetchingTeams, setFetchingTeams] = useState(true);

  const state = useSelector((state) => state);
  const {
    auth, team,
  } = state;
  const {
    user,
  } = auth;

  const isEqual = _.isEqual(profileIds, ids);

  const getProjects = async ()=>{
    try {
      if (user&&user?._id&&profileIds.length>0) {
        const res = await Api.post('team/getTopProjects', {
          adminProfiles: profileIds,
        });

        const data = res?.data;

        if (data?.length>0) {
          setTeams(data);
          handleTeams(data, state, dispatch);
        }


        setFetchingTeams(false);
      }
    }
    catch (error) {

    }
  };

  useEffect(() => {
    getProjects();
  }, []);

  useEffect(() => {
    if (!isEqual) {
      setIds(profileIds);
      getProjects();
    }
  }, [isEqual]);

  return {
    teams,
    fetchingTeams,
  };
};


