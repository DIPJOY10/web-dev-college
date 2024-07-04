import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {useHistory} from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    width: (props)=>{
      if (props.size=='xs') {
        return '14rem';
      }
      else if (props.size=='sm') {
        return '15.5rem';
      }
      else {
        return '30rem';
      }
    },
    display: 'flex',
    flexDirection: 'row',
    marginTop: '0.5rem',

  },
  row: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titleText: {
    fontSize: (props)=>{
      if (props.size=='xs') {
        return '0.9rem';
      }
      else {
        return '1.2rem';
      }
    },
    fontWeight: '600',
  },
  nameText: {
    fontSize: (props)=>{
      if (props.size=='xs') {
        return '0.8rem';
      }
      else {
        return '1.0rem';
      }
    },
    fontWeight: '500',
  },

  avatarBox: {
    width: '2rem',
    padding: '0.7rem',
    [theme.breakpoints.down('sm')]: {
      padding: '0.3rem',
      marginRight: '0.4rem',
    },
  },
  dP: (props)=>{
    if (props.size=='xs') {
      return {
        height: '1.1rem',
        width: '1.1rem',
      };
    }
    else {
      return {
        height: '1.2rem',
        width: '1.2rem',
      };
    }
  },
  textBox: {
    flex: 1,
    flexDirection: 'column',
  },
}));

export default function TaskCard(props) {
  const {taskId, onSelect, size} = props;

  const taskReducer = useSelector((state)=>state.task);
  const {taskDictionary} = taskReducer;

  const task = taskDictionary[taskId];

  const history = useHistory();
  const classes = useStyles({size});
  const user = task?.user;

  const {displayName, displayPicture} = user;

  return (
    <Paper className={classes.root} variant="outlined" square >
      <ButtonBase>
        <div className={classes.avatarBox}>
          <Avatar alt={displayName}
            src={displayPicture?.thumbUrl}
            className={classes.dP}
          />
        </div>
      </ButtonBase>
      <div className={classes.textBox}>
        <div className={classes.row}>
          <Typography className={classes.nameText}>
            {displayName}
          </Typography>
          {props.size=='xs'?null:<IconButton onClick={()=>{
            history.push('/task/edit/'+taskId);
          }}><EditIcon />
          </IconButton>}

        </div>
        <ButtonBase className={classes.row} onClick={()=>{
          if (onSelect) {
            onSelect();
          }
        }}>
          <Typography className={classes.titleText}>
            <b>{(task.title).slice(0, 40)}</b>
          </Typography>
        </ButtonBase>


      </div>
    </Paper>
  );
}

