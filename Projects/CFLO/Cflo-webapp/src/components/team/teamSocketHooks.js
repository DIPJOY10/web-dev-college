import {useState, useEffect} from 'react';
import socket from '../../helpers/socket/socketio';
import {useSelector, useDispatch} from 'react-redux';
import TeamUtils from './team.utils';
import TaskUtils from '../task/task.utils';
import Api from '../../helpers/Api';

const {handleTasks} = TaskUtils;
const {handleTeams} = TeamUtils;

const processTeamData = (data, state, dispatch)=>{
  const {team, task} = state;
  switch (data.eventName) {
    case 'TaskCreated':
      handleTasks([data.task], task, dispatch);
      break;

    default:
      break;
  }
};

function useTeamSocket(userId) {
  const dispatch = useDispatch();
  const state = useSelector((state)=>state);

  useEffect(() => {
    const onTeamEvent = 'team/'+userId;
    socket.on(onTeamEvent, (data)=>{
      // console.log(' before process team data ');
      processTeamData(data, state, dispatch);
    });
  }, [userId]);
}


export default useTeamSocket;
