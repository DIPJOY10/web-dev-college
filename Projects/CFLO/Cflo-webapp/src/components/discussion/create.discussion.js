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
import {
  handleDiscussions,
  handleDiscussionTeam,
} from './discussion.utils';
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
import TitleInput from '../styled/title.input';
import DescriptionInput from '../styled/description.input';
import DoneIcon from '@material-ui/icons/Done';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useHistory,
} from 'react-router-dom';
import Api from '../../helpers/Api';
import TopBar from '../styled/create.topbar';

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

function CreateDiscussion(props) {
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
  const discussionReducer = useSelector((state)=>state.discussion);
  const {teamDictionary} = useSelector((state)=>state.team);

  const userId = user._id;


  const [assignedMemberIds, setAssignedMemberIds] = useState([]);
  const [assignedMembers, setAssignedMembers] = useState([]);

  const [notifyMemberIds, setNotifyMemberIds] = useState([]);
  const [notifyMembers, setNotifyMembers] = useState([]);

  const [discussionCreated, setDiscussionCreated] = useState(false);
  const [publish, setPublish] = useState(false);
  const oldTeam = teamDictionary[teamId];


  const createDiscussionApi = ()=>{
    const discussionObject = {
      team: teamId,
      user: userId,
      title,
      description,
    };

    Api.post('discussion/create', discussionObject).then((res)=>{
      if (res&&res.result) {
        const {discussion, team} = res.result;
        // console.log('discussion created ',discussion)
        handleDiscussionTeam(discussion, team, teamReducer, dispatch);
        // console.log('discussion team created ',discussion)
        handleDiscussions([discussion], discussionReducer, dispatch);
        // console.log(discussion,' is the discussion')
        history.goBack();
      }
    })
        .catch((err)=>{

        });
  };

  return (
    <div className={classes.root}>

      <TopBar
        teamId={teamId}
        typeName={'Discussions'}
        typeHomePath={'/discussions/'+ teamId}
        showCreate={title.length>0}
        createApi={createDiscussionApi}
        saveText={'Save Post'}
      />

      <TitleInput
        title={title}
        placeholder={'Post Title'}
        setTitle={setTitle}

      />

      <DescriptionInput
        description={description}
        placeholder={'Post Text (Optional)'}
        setDescription={setDescription}

      />

    </div>
  );
}

export default CreateDiscussion;
