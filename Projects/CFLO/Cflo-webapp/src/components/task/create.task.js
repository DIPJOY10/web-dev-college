import React, {useEffect, useRef, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
  makeStyles,
  useTheme,
} from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Fab from '@material-ui/core/Fab';
import CloseIcon from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';
import AssignMember from '../AssignMember.js';
import NotifyMember from '../NotifyMember.js';
import AddTeams from '../AddTeams';
import AddTags from '../AddTags';
import {addInTeam} from './task.utils';

import TextField from '@material-ui/core/TextField';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import MomentUtils from '@date-io/moment';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import {nanoid} from 'nanoid';
import {
  AppBar,
  Toolbar,
} from '@material-ui/core';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import TopBar from '../styled/create.topbar';
import CreateBtn from '../styled/actionBtns/create.btn';
import DoneIcon from '@material-ui/icons/Done';
import TitleInput from '../styled/title.input';
import DescriptionInput from '../styled/description.input';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import HomeIcon from '@material-ui/icons/Home';
import TaskSvg from '../../Assets/tasks.svg';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams,
  useHistory,
} from 'react-router-dom';
import Api from '../../helpers/Api';


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    height: '100vh',
    overflow: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '3rem',
  },

  appbar: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignSelf: 'flex-start',
    top: 0,
    position: 'fixed',
    borderColor: 'grey',
    backgroundColor: 'white',
    height: '4.5rem',
    width: '100%',
    marginLeft: '19rem',
    [theme.breakpoints.down('sm')]: {
      marginLeft: 0,
    },
  },

  durationText: {
    marginLeft: '1rem',
  },

  durationInput: {
    width: '3rem',
    height: '3rem',
    justifyContent: 'center',
    paddingLeft: '0.9rem',
    textAlign: 'center',
    fontSize: '1.3rem',
    borderTopWidth: '1px',
    color: theme.palette.primary.main,
    borderColor: theme.palette.primary.main,
    backgroundColor: '#eceff1',
    marginLeft: '1rem',
  },

  toolbar: {
    flex: 1,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    paddingRight: '3rem',
    height: '5.5rem',
    position: 'fixed',
    top: 0,
    right: 0,
    left: '17rem',
    [theme.breakpoints.down('sm')]: {
      left: '5rem',
    },
    [theme.breakpoints.down('xs')]: {
      left: '1rem',
    },
  },

  rowDiv: {
    flex: 1,
    flexDirection: 'row',
    display: 'flex',
    marginLeft: '2rem',
    alignItems: 'center',

  },


  leftLineRoot: {
    minWidth: 200,
    padding: 0,
  },

  tag: {
    borderRadius: '0 3px 3px 0',
    background: '#FFFFFF',
    borderLeft: `3px solid ${theme.palette.primary.main}`,
    fontWeight: 'bold',
    padding: '8px 16px',
    margin: theme.spacing(1),
  },

  createDivStyle: {
    marginRight: '-2rem',
  },

  createButtonText: {
    marginLeft: '0.5rem',
    color: theme.palette.primary.main,
  },

  selectBranchText: {
    marginLeft: '0.5rem',
    color: theme.palette.primary.main,
  },

  selectDivStyle: {
    width: '40%',
    display: 'flex',
    flex: 1,
  },

  fabStyle: {
    backgroundColor: theme.palette.primary.light,
    marginLeft: '3rem',
    marginTop: '0.5rem',
  },

  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 240,
    margin: 10,
  },

  datePicker: {
    width: 150,
  },
  timePicker: {
    width: 100,
  },
  link: {
    display: 'flex',
  },
}));

function CreateTask(props) {
  const history = useHistory();
  const classes = useStyles();
  const {
    durationInput, durationText,
  } = classes;
  const [duration, setDuration] = useState({
    weeks: 0,
    days: 1,
    hours: 0,
  });
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const [exit, setExit] = React.useState(false);

  const [title, setTitle] = useState('');
  const DateNow = new Date();
  const [lastUpdated, setLastUpdated] = useState(DateNow);
  const [startDate, setStartDate] = useState(''+DateNow);
  const [endDate, setEndDate] = useState(''+DateNow);

  const [description, setDescription] = useState('');
  const {teamId} = useParams();
  const {user, userProfile} = useSelector((state)=>state.auth);
  const teamReducer = useSelector((state)=>state.team);


  const taskReducer = useSelector((state)=>state.task);
  const {sortedProjectTeamIds, taskLabels, teamDictionary} = useSelector((state)=>state.team);
  const team = teamDictionary[teamId];
  const userId = user._id;
  const {close, showTeamPanel, ultimateParentId, ultimateParentModel} = props;
  const [tags, setTags] = useState([taskLabels[1], taskLabels[4]]);
  const [assignedMemberIds, setAssignedMemberIds] = useState([]);
  const [assignedMembers, setAssignedMembers] = useState([]);

  const [notifyMemberIds, setNotifyMemberIds] = useState([]);
  const [notifyMembers, setNotifyMembers] = useState([]);
  const [task, setTask] = useState(null);
  const [taskCreated, setTaskCreated] = useState(false);
  const [publish, setPublish] = useState(false);
  const oldTeam = teamDictionary[teamId];

  const tagSelected = tags.map((tag)=>tag.name);
  const assigned = assignedMembers.map((member)=>{
    return {
      modelId: member._id,
      modelName: member.model,
    };
  });

  const getProjectTasks = ()=>{
    const taskMap = oldTeam.taskMap;
    const projectIds = sortedProjectTeamIds.filter((teamId)=>{
      const team = teamDictionary[teamId];
      return team.taskMap == taskMap;
    });
    Api.post('task/getSortedTasks', {
      teamIds: projectIds,
    }).then((tasks)=>{
      // console.log(tasks,' are the tasks')
    });
    // console.log(projectIds,' is the project ids')
  };

  getProjectTasks();

  const teamAncestors = oldTeam.ancestors? oldTeam.ancestors:[];
  const projectTeams = [...teamAncestors, teamId];

  const taskObject = {
    taskMap: oldTeam.taskMap,
    tId: nanoid(8),
    projectTeams,
    team: teamId,
    user: user.model==='User'?user._id:userProfile._id,
    profile: user.profile,
    title,
    description,
    dates: {
      pS: startDate,
      pF: endDate,
      aS: startDate,
      aF: endDate,
    },
    duration,
    assigned,
    tags: tagSelected,
  };

  const createTaskApi = ()=>{
    Api.post('task/create', taskObject).then((res)=>{
      // console.log(res,' is the createTask response')
      if (res&&res.result) {
        const {task, team} = res.result;

        addInTeam([task], {
          ...oldTeam,
          numTasks: team.numTasks,
        }, state, dispatch, true);
        history.goBack();
      }
    })
        .catch((err)=>{

        });
  };


  return (
    <div className={classes.root}>



    </div>
  );
}

export default CreateTask;
