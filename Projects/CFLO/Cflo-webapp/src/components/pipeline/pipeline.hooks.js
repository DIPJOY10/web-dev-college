import {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import Api from '../../helpers/Api';
import {setPipelines} from './pipeline.utils';


export const useGetPipeline = ()=>{
  const dispatch = useDispatch();
  const pipeline = useSelector((state) => state.pipeline);
  const {
    user,
  } = useSelector((state)=>state.auth);

  const {
    teamIds,
  } = useSelector((state) => state.team);

  useEffect(() => {
    Api.post('pipeline/platform', {}).then((pipelines)=>{
      setPipelines(pipelines, pipeline, dispatch);
    });
  }, []);

  useEffect(() => {
    if (user&&user._id) {
      Api.post('pipeline/user', {
        teams: teamIds,
        user: user._id,
      }).then((pipelines)=>{
        setPipelines(pipelines, pipeline, dispatch);
      });
    }
  }, [user, teamIds]);
};

