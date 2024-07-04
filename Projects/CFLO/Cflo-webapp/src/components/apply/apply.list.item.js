import React, {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
  makeStyles,
  useTheme,
} from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Link from '@material-ui/core/Link';
import ListItem from '@material-ui/core/ListItem';
import {
  Typography,
} from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import {
  useParams,
  useHistory,
} from 'react-router-dom';
import moment from 'moment';
import Paper from '@material-ui/core/Paper';


const useStyles = makeStyles((theme) => ({
  root: {
    boxShadow: '0 1px 1px 1px #eeeeee',
    flex: 1,
  },
  selectedRoot: {
    boxShadow: '0 1px 1px 1px #eeeeee',
    flex: 1,

    backgroundColor: '#eceff1',
  },
  divRoot: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
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
  nameTimeBox: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',

    [theme.breakpoints.only('sm')]: {

    },
    [theme.breakpoints.only('xs')]: {

    },

  },
  nameBox: {
    height: '2.5rem',
    fontWeight: '500',
    color: '#212121',
    textAlign: 'left',
    [theme.breakpoints.down('sm')]: {
    },
  },
  rightTimeText: {
    textAlign: 'right',
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

const ApplyListItem = (props)=>{
  const classes = useStyles();
  const dispatch = useDispatch();
  const {appId, setAppId} = props;
  const dashboard = useSelector((state)=>state.dashboard);
  const {appDictionary} = dashboard;

  const selectedConversation = false;
  const seen = true;


  const app = appDictionary[appId];
  const profile = app?.profile?.parent;
  const displayName = profile?.displayName;
  const displayPicture = profile?.displayPicture;
  // console.log(app,' is the app in list')

  let text = app?.topComment?.text?.slice(0, 80);
  if (text?.length==80) {
    text = text + '...';
  }

  return (
    <ListItem onClick={()=>{
      setAppId(appId);
    }} className={selectedConversation?classes.selectedRoot:classes.root}>
      <div className={classes.divRoot}>

        <ButtonBase>
          <div className={classes.avatarBox}>
            <Avatar alt={displayName} src={displayPicture?.thumbUrl} />
          </div>
        </ButtonBase>

        <div className={classes.textBox}>
          <Typography variant="button" className={classes.nameBox}>
            <b>{displayName}</b>
          </Typography>
          <Typography className={classes.rightTimeText}>
            {moment(app?.topComment?.createdAt).format('DD MMM YYYY')}
          </Typography>
          <Typography className={seen?classes.messageBoxSeen:classes.messageBoxNotSeen}>
            {text}
          </Typography>
        </div>

      </div>

    </ListItem>

  );
};

export default ApplyListItem;
