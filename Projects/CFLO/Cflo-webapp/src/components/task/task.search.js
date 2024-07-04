import React, {useEffect, useRef, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
  makeStyles,
  useTheme,
} from '@material-ui/core/styles';


import Api from '../../helpers/Api';


const useStyles = makeStyles((theme) => ({

}));

function TaskSearch(props) {
  const classes = useStyles();

  const {teamId, type} = props;
  const teamReducer = useSelector((state)=>state.team);
  const taskReducer = useSelector((state)=>state.task);
  const {sortedProjectTeamIds, orgTeamIds, taskLabels, teamDictionary} = useSelector((state)=>state.team);
  const team = teamDictionary[teamId];


  const getProjectTasks = ()=>{
    const taskMap = team.taskMap;
    const typeIds = type=='Project'?sortedProjectTeamIds:orgTeamIds;
    const parentIds = typeIds.filter((teamId)=>{
      const team = teamDictionary[teamId];
      return team.taskMap == taskMap;
    });
    Api.post('task/getSortedTasks', {
      teamIds: parentIds,
    }).then((tasks)=>{
      // console.log(tasks,' are the tasks')
    });
    // console.log(parentIds,' is the project ids')
  };

  getProjectTasks();


  return (
    <div className={classes.root}>


      {/* <AddTeams teamId={teamId}/> */}


    </div>
  );
}

export default TaskSearch;
