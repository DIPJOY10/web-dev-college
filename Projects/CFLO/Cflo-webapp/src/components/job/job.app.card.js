import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {useHistory, useLocation} from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import moment from 'moment';
import {
  Typography,
} from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem';

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    width: '16rem',
    display: 'flex',
    flexDirection: 'row',
    marginTop: '1rem',
    padding: '0.5rem',
  },
  avatarBox: {
    width: '5rem',
    padding: '0.7rem',
    [theme.breakpoints.down('sm')]: {
      width: '3rem',
      padding: '0.3rem',
      marginRight: '0.4rem',
    },
  },
  textBox: {
    flex: 1,
    flexDirection: 'column',

  },
  rightTimeText: {
    color: '#9e9e9e',
    fontSize: '11px',
    marginTop: '-0.5rem',
  },
  messageBoxSeen: {
    flex: 1,
    fontSize: '0.9rem',
    color: '#424242',

  },
  messageBoxNotSeen: {
    flex: 1,
    fontSize: '0.9rem',
    color: 'black',
    fontWeight: '600',
  },
}));

export default function JobCard(props) {
  const classes = useStyles();
  const dashboard = useSelector((state)=>state.dashboard);
  const {appDictionary} = dashboard;
  const {appId, onSelect} = props;
  const app = appDictionary[appId];
  const history = useHistory();
  const profile = app?.profile?.parent;
  const displayName = profile?.displayName;
  const displayPicture = profile?.displayPicture;
  let text = app?.topComment?.text?.slice(0, 80);
  if (text?.length==80) {
    text = text + '...';
  }
  const seen = true;

  return (
    <Paper onClick={()=>{
      if (onSelect) {
        onSelect();
      }
    }} className={classes.root} variant="outlined" square >
      <ButtonBase>
        <div className={classes.avatarBox}>
          <Avatar alt={displayName} src={displayPicture?.thumbUrl} />
        </div>
      </ButtonBase>
      <div className={classes.textBox}>
        <Typography variant="button" className={classes.nameBox}>
          <b>{displayName}</b>
        </Typography>
        {/* <Typography className={classes.rightTimeText}>
                        created At {moment(app?.topComment?.createdAt).format('DD MMM YYYY')}
                    </Typography>  */}
        <Typography className={seen?classes.messageBoxSeen:classes.messageBoxNotSeen}>
          {text}
        </Typography>
      </div>
    </Paper>
  );
}
