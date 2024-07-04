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
import taskUtils from './task.utils';
import teamUtils from '../team/team.utils';
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
import CreateBtn from '../styled/actionBtns/create.btn';
import DoneIcon from '@material-ui/icons/Done';
import Checkbox from '@material-ui/core/Checkbox';
import TitleInput from '../styled/title.input';
import DescriptionInput from '../styled/description.input';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useHistory,
} from 'react-router-dom';
import Api from '../../helpers/Api';

const {
  handleTasks,
} = taskUtils;

const {
  handleTeams,
} = teamUtils;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    height: '100vh',
    overflow: 'auto',
    marginTop: '6rem',
    marginLeft: '19rem',
    [theme.breakpoints.down('sm')]: {
      marginLeft: 0,
    },
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
    display: 'flex',
    flexDirection: 'row-reverse',
    paddingRight: '3rem',
    height: '4.5rem',
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
}));

function EditTask(props) {
  const history = useHistory();
  const classes = useStyles();
  const {taskId} = useParams();
  const {
    durationInput, durationText,
  } = classes;

  const dispatch = useDispatch();


  const {user, userProfile} = useSelector((state)=>state.auth);
  const teamReducer = useSelector((state)=>state.team);
  const taskReducer = useSelector((state)=>state.task);
  const {
    taskDictionary,
  } = taskReducer;
  const taskOld = taskDictionary[taskId];
  const [task, setTask] = useState(taskOld);
  const teamId = taskOld.team;
  const {sortedProjectTeamIds, taskLabels, teamDictionary} = useSelector((state)=>state.team);

  const [description, setDescription] = useState(task.description);
  const [title, setTitle] = useState(task.title);
  const [startDate, setStartDate] = useState(''+task?.dates?.pS);
  const [endDate, setEndDate] = useState(''+ task?.dates?.pF);
  const [duration, setDuration] = useState(task.duration);
  const [tags, setTags] = useState([taskLabels[1], taskLabels[4]]);
  const [assignedMemberIds, setAssignedMemberIds] = useState([]);
  const [assignedMembers, setAssignedMembers] = useState([]);

  const [notifyMemberIds, setNotifyMemberIds] = useState([]);
  const [notifyMembers, setNotifyMembers] = useState([]);

  const [taskCreated, setTaskCreated] = useState(false);
  const [publish, setPublish] = useState(false);
  // console.log(startDate,endDate, task.dates,' tasks');
  const tagSelected = tags.map((tag)=>tag.name);
  const assigned = assignedMembers.map((member)=>{
    return {
      modelId: member._id,
      modelName: member.model,
    };
  });

  const taskObject = {
    _id: taskId,
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

  const updateTaskApi = ()=>{
    Api.post('task/update', taskObject).then((res)=>{
      if (res) {
        setTask(res);

        handleTasks([res], taskReducer, dispatch);
        history.goBack();
      }
    })
        .catch((err)=>{

        });
  };

  return (
    <div className={classes.root}>

      <AppBar position="fixed" className={classes.appbar}>
        <div className={classes.toolbar}>
          {title==0?null:<CreateBtn endIcon={<DoneIcon />} onClick={()=>{
            updateTaskApi();
          }} >
                        Save Task
          </CreateBtn>}
        </div>

      </AppBar>

      <TitleInput
        title={title}
        placeholder={'Task Title'}
        setTitle={setTitle}
      />

      <DescriptionInput
        description={description}
        placeholder={'Task Description(Optional)'}
        setDescription={setDescription}
      />


      <div className={classes.rowDiv}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            value={startDate}
            className={classes.datePicker}
            margin="normal"
            id="date-picker-dialog"
            label="Start Date"
            format="MM/dd/yyyy"
            onChange={(date)=>{setStartDate(date);}}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />

          {/* <KeyboardTimePicker
                        value={startDate}
                        className={classes.timePicker}
                        margin="normal"
                        id="time-picker"
                        label="Start Time"
                        onChange={(date)=>{
                            setStartDate(date);
                        }}
                        KeyboardButtonProps={{
                            'aria-label': 'change time',
                        }}
                        /> */}


          <KeyboardDatePicker
            value={endDate}
            className={classes.datePicker}
            margin="normal"
            id="due-date-picker"
            label="Due Date"
            format="MM/dd/yyyy"
            onChange={(date)=>{setEndDate(date);}}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />

        </MuiPickersUtilsProvider>


      </div>
      <div className={classes.rowDiv}>

        {/* <KeyboardTimePicker
                        value={endDate}
                        className={classes.timePicker}
                        margin="normal"
                        id="due-time-picker"
                        label="Due Time"
                        onChange={(date)=>{
                            setEndDate(date);
                        }}
                        KeyboardButtonProps={{
                            'aria-label': 'change time',
                        }}
                        /> */}
        <Typography variant="body2" component="p" className={durationText}>
                    Weeks
        </Typography>
        <InputBase
          value={duration.weeks}
          min="0" max="100"
          onChange={(event)=>{
            const target = Number(event.target.value);
            if (Number.isInteger(target)&&target>=0&&target<=60) {
              setDuration({
                ...duration,
                weeks: target,
              });
            }
          }}
          className={durationInput}
        />
        <Typography variant="body2" component="p" className={durationText}>
                    Days
        </Typography>
        <InputBase
          value={duration.days}
          min="0" max="100"
          onChange={(event)=>{
            const target = Number(event.target.value);
            if (Number.isInteger(target)&&target>=0&&target<=60) {
              setDuration({
                ...duration,
                days: target,
              });
            }
          }}
          className={durationInput}
        />
        <Typography variant="body2" component="p" className={durationText}>
                    Hours
        </Typography>
        <InputBase
          value={duration.hours}
          min="0" max="100"
          onChange={(event)=>{
            const target = Number(event.target.value);
            if (Number.isInteger(target)&&target>=0&&target<=60) {
              setDuration({
                ...duration,
                hours: target,
              });
            }
          }}
          className={durationInput}
        />

      </div>


      <div className={classes.selectDivStyle}>
        <div className={classes.leftLineRoot}>
          <Button className={classes.tag}>Assign People</Button>
        </div>
      </div>


      <AssignMember teamId={teamId}
        memberIds={assignedMemberIds}
        members={assignedMembers}
        setMemberIds={setAssignedMemberIds}
        setMembers={setAssignedMembers}
      />


      <div className={classes.selectDivStyle}>
        <div className={classes.leftLineRoot}>
          <Button className={classes.tag}>Predecessors</Button>
        </div>
      </div>

      {/* <AddTeams teamId={teamId}/> */}


    </div>
  );
}

export default EditTask;
