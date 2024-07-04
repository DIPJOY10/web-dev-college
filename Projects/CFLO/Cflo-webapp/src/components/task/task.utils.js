import _ from 'lodash';
import {handleComments} from '../comment/comment.utils';
import Api from '../../helpers/Api';

export const setTaskMap = (taskMaps, taskReducer, dispatch)=>{
  const {taskMapIds, taskMapDictionary} = taskReducer;
  const newTaskMapDictionary = {};
  const newTaskMapIds = [];
  const oldIds = taskMapIds?taskMapIds:[];

  taskMaps.map((taskMap)=>{
    const taskMapId = taskMap._id;
    newTaskMapIds.push(taskMapId);
    newTaskMapDictionary[taskMapId] = taskMap;
  });

  const totalIds = [...oldIds, ...newTaskMapIds];
  const taskMapIdSet = new Set(totalIds);

  dispatch({
    type: 'AddTask',
    payload: {
      taskMapIds: Array.from(taskMapIdSet),
      taskMapDictionary: {
        ...taskMapDictionary,
        ...newTaskMapDictionary,
      },
    },
  });
};

export const createTaskMap = (state, dispatch)=>{
  const {
    task,
  } = state;

  Api.post('task/map/create', {})
      .then((taskMap)=>{
        setTaskMap([taskMap], task, dispatch);
      });
};

export const updateTaskMap = (taskMap, state, dispatch)=>{
  const {
    task,
  } = state;

  Api.post('task/map/update', taskMap)
      .then((taskMapResponse)=>{
        if (taskMapResponse) {
          setTaskMap([taskMapResponse], task, dispatch);
        }
      });
};


export const setTasks = (tasks, taskReducer, dispatch)=>{
  const {taskDictionary} = taskReducer;
  const newTaskDictionary = {};
  const taskIds = [];
  tasks.map((task)=>{
    const taskId = task._id;
    taskIds.push(taskId);
    newTaskDictionary[taskId] = task;
  });


  const taskIdSet = new Set(taskIds);
  // console.log(taskIds,taskIdSet,Array.from(taskIdSet))
  dispatch({
    type: 'AddTask',
    payload: {
      taskDictionary: {
        ...taskDictionary,
        ...newTaskDictionary,
      },
    },
  });

  return {
    taskIds: Array.from(taskIdSet),
  };
};

export const addInTeam = async ( tasks, team, state, dispatch, addInFront)=>{
  const {team: teamReducer, task: taskReducer} = state;
  const {
    teamDictionary,
  } = teamReducer;

  const teamId = team?._id;

  let teamArray = [];
  const newTeamObject = {};
  let taskIds = [];

  if (teamId && tasks && tasks.length>0) {
    const teamArrayOld = team?.tasks ? team.tasks :[];


    taskIds = await setTasks(tasks, taskReducer, dispatch).taskIds;


    if (addInFront) {
      teamArray = teamArrayOld.length>0?
                [...taskIds, ...teamArrayOld]:taskIds;
    }
    else {
      teamArray = teamArrayOld.length>0?
                [...teamArrayOld, ...taskIds]:taskIds;
    }

    const newSet = new Set(teamArray);

    newTeamObject[teamId] = {
      ...team,
      tasks: Array.from(newSet),
    };

    const newTeamDictionary = {
      ...teamDictionary,
      ...newTeamObject,
    };

    // console.log(newTeamDictionary,' is the newTeamDictionary')


    dispatch({
      type: 'AddTeam',
      payload: {
        teamDictionary: {
          ...teamDictionary,
          ...newTeamDictionary,
        },
      },
    });
  }
};

export const handleTaskTeam = (task, team, teamReducer, dispatch)=>{
  const {teamDictionary} = teamReducer;
  const teamId = task.team;
  const oldTeam = teamDictionary[teamId];
  const oldTaskIds = oldTeam.tasks;

  const taskId = task._id;
  const taskIdSet = new Set([taskId, ...oldTaskIds]);


  const newTeam = {
    ...oldTeam,
    tasks: Array.from(taskIdSet),
    numTasks: team.numTasks,
  };

  const newTeamObject = {};
  newTeamObject[teamId] = newTeam;
  const newTeamDictionary = {
    ...teamDictionary,
    ...newTeamObject,
  };

  dispatch({
    type: 'AddTeam',
    payload: {
      teamDictionary: newTeamDictionary,
    },
  });
};

export const handleTasks = (tasks, taskReducer, dispatch)=>{
  const {taskDictionary} = taskReducer;

  const newTaskDictionary = {};

  if (tasks&&tasks.length>0) {
    tasks.map((task)=>{
      if (task&&task._id) {
        const taskId = task._id;

        newTaskDictionary[taskId] = task;
      }
    });

    dispatch({
      type: 'AddTask',
      payload: {
        taskDictionary: {...taskDictionary, ...newTaskDictionary},
      },
    });
  }
};

export const deleteTask = (taskId, teamId, teamDictionary, taskDictionary, dispatch)=>{
  const oldTeam = teamDictionary[teamId];

  const newTeamObject = {};
  newTeamObject[teamId] = {
    ...oldTeam,
    numTasks: oldTeam.numTasks-1,
    tasks: oldTeam.tasks.filter((task)=>task!==taskId),
  };

  delete taskDictionary[taskId];

  dispatch({
    type: 'AddTeam',
    payload: {
      teamDictionary: {
        ...teamDictionary,
        ...newTeamObject,
      },
    },
  });

  dispatch({
    type: 'AddTask',
    payload: {
      taskDictionary,
    },
  });
};


export default {
  setTaskMap,
  createTaskMap,
  updateTaskMap,
  handleTasks,
  handleTaskTeam,
  setTasks,
  deleteTask,
};
