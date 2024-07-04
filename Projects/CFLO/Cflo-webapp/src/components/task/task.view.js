import React, {useEffect, useRef, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
  makeStyles,
  useTheme,
} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import InputBase from '@material-ui/core/InputBase';
import {useMediaQuery, ButtonBase} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Fab from '@material-ui/core/Fab';
import CloseIcon from '@material-ui/icons/Close';
import taskUtils from './task.utils';
import teamUtils from '../team/team.utils';
import TextField from '@material-ui/core/TextField';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import MomentUtils from '@date-io/moment';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import Api from '../../helpers/Api';
import CommentList from '../comment/comment.list';
import CommentCard from '../comment/comment.card';
import CommentCreate from '../comment/comment.create';
import Chip from '@material-ui/core/Chip';
import {getCommentByIds} from '../comment/comment.utils';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useHistory,
} from 'react-router-dom';

const {
  deleteTask,
  handleTasks,
  HandleTaskComments,
} = taskUtils;

const {
  handleTeams,
} = teamUtils;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    marginTop: '6rem',
  },

  rowDiv: {
    flex: 1,
    flexDirection: 'row',
    display: 'flex',
  },

  rowDivBetween: {
    flex: 1,
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'space-between',
    marginLeft: '1rem',
  },

  colDiv: {
    flex: 1,
    flexDirection: 'column',
    display: 'flex',
  },

  avatarStyle: {
    height: 25,
    width: 25,
  },
  nameStyle: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 10,
    color: '#424242',
    flex: 1,
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


  selectDivStyle: {

    display: 'flex',
    flexDirection: 'row',
  },

  fabStyle: {
    backgroundColor: theme.palette.primary.light,
    marginLeft: '3rem',
    marginTop: '0.5rem',
  },

}));

function TaskView(props) {
  const classes = useStyles();
  const history = useHistory();
  const {taskId} = useParams();
  const {rowDiv, avatarStyle, nameStyle, cardStyle, cardContentStyle} = classes;
  const dispatch = useDispatch();
  const [text, setText] = useState('');
  const {user, userProfile} = useSelector((state)=>state.auth);
  const state = useSelector((state) => state);
  const teamReducer = useSelector((state)=>state.team);
  const taskReducer = useSelector((state)=>state.task);
  const commentReducer = useSelector((state)=>state.comment);
  const {commentDictionary} = commentReducer;
  const {taskLabels, teamDictionary} = useSelector((state)=>state.team);
  const {taskDictionary} = taskReducer;

  const userId = user._id;
  const task = taskDictionary[taskId];
  const comments = task.comments?task.comments:[];
  const oldTeam = teamDictionary[task.team];


  const expectedStart = task?.dates?.ps;
  const expectedDueDate = task?.dates?.pf;

  // console.log(task.expectedStart,expectedStart);


  const [title, setTitle] = useState(task.title||'');
  const [description, setDescription] = useState(task?.description);
  const [startDate, setStartDate] = useState(expectedStart);
  const [endDate, setEndDate] = useState(expectedDueDate);


  // var assignedIds = []
  // var assignedMemberArray = [];
  // task.assigned.map(member=>{
  //     var model = member.modelId;
  //     var modelId = model._id;
  //     assignedIds.push(modelId);
  //     assignedMemberArray.push(model)
  // })

  // const [assignedMemberIds, setAssignedMemberIds] = useState(assignedIds)
  // const [assignedMembers, setAssignedMembers] = useState(assignedMemberArray);

  const _deleteTaskApi = ()=>{
    Api.post('task/delete', {
      taskId,
    }).then((team)=>{
      deleteTask(taskId, task.team, teamDictionary, taskDictionary, dispatch);
    });
  };

  const _createComment = ()=>{
    const commentObject = {
      text,
      user: userId,
      userModelName: user.model,
      creator: user.model==='User'?userId:userProfile._id,
      parent: taskId,
      parentModelName: 'Task',
    };

    // addCommentInParent(commentObject, state, dispatch);
  };

  useEffect(() => {
    if (taskId) {
      Api.post('task/getTasksByIds', {
        tasks: [taskId],
      }).then((res)=>{
        const tasks = res.result;

        handleTasks(tasks, taskReducer, dispatch);
      });
    }
  }, [taskId]);

  return (
    <div className={classes.root}>


      <div className={classes.rowDiv}>
        <Avatar alt={task?.user?.displayName} src={task?.user?.displayPicture?.thumbUrl} />
        <div className={classes.colDiv}>
          <div className={classes.rowDivBetween}>
            <Typography variant="overline" display="block">
              {task?.user?.displayName}
            </Typography>
            <div className={classes.selectDivStyle}>

              <IconButton onClick={()=>{
                _deleteTaskApi();
              }}><DeleteOutlineIcon />
              </IconButton>
              <IconButton onClick={()=>{
                history.push('/task/edit/'+taskId);
              }}><EditIcon />
              </IconButton>

            </div>
          </div>
          <div className={classes.colDiv}>
            <Typography>{title}</Typography>
            <Typography>{description}</Typography>
          </div>
        </div>

      </div>
      {/* <div className={rowDiv}>
                        {assignedMemberArray.map(member=>{
                            return (

                                        <Chip
                                        avatar={<Avatar alt={member.displayName} src={member.displayPicture.thumbUrl} />}
                                        label={member.displayName}
                                    />


                            );
                        })}
                    </div> */}

      <CommentList
        commentIds={task.comments}
        parent={taskId}
        parentModelName={'Task'}
      />

    </div>
  );
}

export default TaskView;
