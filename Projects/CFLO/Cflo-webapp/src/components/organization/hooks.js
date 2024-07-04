import {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import Api from '../../helpers/Api';
import {handleTeams} from '../team/team.utils';

export const useUserOrgs = ()=>{
  const dispatch = useDispatch();
  const [teams, setTeams] = useState([]);
  const [adminTeams, setAdminTeams] = useState([]);
  const [fetchingTeams, setFetchingTeams] = useState(true);
  const state = useSelector((state) => state);
  const {
    auth,
  } = state;
  const {
    user,
  } = auth;

  const profileId = user?.profile;

  const getOrgs = async ()=>{
    try {
      const res = await Api.post('team/getOrgTeams', {
        profile: user?.profile,
      });


      const newTeams = res?.data || [];
      const adminTeamsNew = [];
      if (newTeams&&newTeams.length>0) {
        newTeams.map((team)=>{
          const perm = team.permissions[profileId];
          if (perm=='Owner'||perm=='Admin') {
            adminTeamsNew.push(team._id);
          }
        });
        setTeams(newTeams.map((t)=>t._id));
        setAdminTeams(adminTeamsNew);
        handleTeams(newTeams, state, dispatch);
        setFetchingTeams(false);
      }
    }
    catch (error) {

    }
  };

  useEffect(() => {
    if (user&&user._id) {
      getOrgs();
    }
  }, [user]);

  return {
    adminTeams,
    teams,
    fetchingTeams,
  };
};


