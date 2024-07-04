import React, {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
  makeStyles,
  useTheme,
} from '@material-ui/core/styles';
import Avatar from '../profile/avatar';
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
import ChatUtils from './chatUtils';

const {conversationSeen} = ChatUtils;


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
    display: 'flex',
    // flex:1,
    flexDirection: 'row',
    // minHeight:'4rem',
    // width:'100%'
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
    flexDirection: 'column',
  },
  nameTimeBox: {
    width: `calc(23vw)`,
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    [theme.breakpoints.only('sm')]: {
      width: `calc(30vw)`,
    },
    [theme.breakpoints.only('xs')]: {
      width: `82vw`,
    },

  },
  nameBox: {
    width: '65%',
    height: '1.5rem',
    marginTop: '0.4rem',
    fontSize: '0.90rem',
    color: '#212121',
    textAlign: 'left',
    [theme.breakpoints.down('sm')]: {
      width: '65%',
    },
  },
  rightTimeText: {
    textAlign: 'right',
    color: '#9e9e9e',
    fontSize: '11px',
    marginTop: '0.5rem',
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

const UserMessageListItem = (props)=>{
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const {user} = useSelector((state)=>state.auth);
  const {conversationId: paramConvId} = useParams();
  const {conversationId} = props;
  const chat = useSelector((state)=>state.chat);
  const userId = user._id;
  const {conversationDictionary, selectedPersonId} = chat;
  let selectedConversation = false;
  let seen = true;

  if (conversationId===paramConvId) {
    selectedConversation = true;
  }

  const conversation = conversationDictionary[conversationId];

  let displayName;
  let displayPicture;
  let primaryUser;
  let otherUsers;


  if (conversation&&conversation.participants) {
    const participants = conversation.participants;
    const lastSeen = conversation.lastSeen;

    const createdAt = conversation?.topMessage?.createdAt;
    const messageCreator = conversation?.topMessage?.user;

    if (lastSeen) {
      const lastSeenTime = lastSeen[userId];
      if (lastSeenTime) {
        seen = (new Date(lastSeenTime) - new Date(createdAt))>0||(messageCreator===userId)?true:false;
      }
    }


    otherUsers = participants.filter((participant)=>(participant._id!==user.profile));


    if (otherUsers.length>0) {
      primaryUser = otherUsers[0];
      displayName = primaryUser?.parent?.displayName;
    }
  }

  let text = conversation?.topMessage?.text.slice(0, 40);
  if (text?.length==40) {
    text = text + '...';
  }

  return (
    <ListItem button onClick={()=>{
      const path = '/messages/'+conversationId;
      dispatch({type: 'ToggleView', payload: true});
      history.push(path);
    }} className={selectedConversation?classes.selectedRoot:classes.root}>
      <div className={classes.divRoot}>

        <ButtonBase>
          <div className={classes.avatarBox}>
            {primaryUser?.parent?._id&&<Avatar alt={displayName} src={primaryUser?.parent} />}
          </div>
        </ButtonBase>

        <div className={classes.textBox}>
          <div className={classes.nameTimeBox}>
            <Typography className={classes.nameBox}>
              {displayName}
            </Typography>
            <Typography className={classes.rightTimeText}>
              {moment(conversation?.topMessage?.createdAt).format('DD MMM YYYY')}
            </Typography>
          </div>


          <Typography className={seen?classes.messageBoxSeen:classes.messageBoxNotSeen}>
            {text}
          </Typography>
        </div>

      </div>

    </ListItem>

  );
};

export default UserMessageListItem;
