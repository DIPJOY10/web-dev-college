import React, {useEffect, useRef, useState} from 'react';
import moment from 'moment';
import {useSelector, useDispatch} from 'react-redux';
import {
  makeStyles,
  useTheme,
} from '@material-ui/core/styles';
import {
  useMediaQuery,
} from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Link from '@material-ui/core/Link';
import ListItem from '@material-ui/core/ListItem';
import {
  Typography,
} from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import ChatMsg from './ChatMsg';
import ChatMsgSlack from './ChatMsgSlack';
import TimeBar from './TimeBar';
import ChatUtils from './chatUtils';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

const {prepareMessages, prepareMessagesSlack, conversationSeen, conversationDetail} = ChatUtils;

const useStyles = makeStyles((theme) => ({
  root: {
    boxShadow: '0 1px 1px 1px #eeeeee',
    paddingTop: '2rem',
    paddingBottom: '5rem',
    overflow: 'auto',
    height: `calc(90vh)`,
    width: '80%',
    [theme.breakpoints.only('sm')]: {
      width: '85%',
    },
    [theme.breakpoints.down('xs')]: {
      width: `100%`,
    },
  },
  paper: {
    padding: '1rem',
  },
}));

const MessageDrawer = (props)=>{
  const classes = useStyles();
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);
  const messageListRef = useRef(null);
  const [dates, setDates] = useState([]);
  const [dateMessages, setDateMessages] = useState({});


  const {conversationId, initConvo} = props;
  const {user} = useSelector((state)=>state.auth);
  const state = useSelector((state)=>state);
  const chat = useSelector((state)=>state.chat);
  const profile = useSelector((state)=>state.profile);
  const {conversationDictionary, messageMap} = chat;
  const conversation = conversationDictionary[conversationId];
  const topMessage = conversation?.topMessage;

  const userId = user._id;

  const scrollToBottom = () => {
    if (messagesEndRef&&messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({behavior: 'smooth', block: 'end'});
    }
  };

  const handleScroll = () =>{
    const scrollTop = messageListRef.current.scrollTop;
    // console.log('scrolling ',scrollTop)
  };

  useEffect(() => {
    conversationDetail(conversationId, chat, dispatch);
  }, []);

  useEffect(() => {
    // setTimeout(() => {
    //     scrollToBottom()
    // }, 1000);
    // conversationSeen(userId,conversationId,chat,dispatch)
    scrollToBottom();
  }, [topMessage]);


  useEffect(() => {
    if (userId&&conversationId) {
      const {dates, dateMessages} = prepareMessagesSlack(conversationId, state);

      setDates(dates);
      setDateMessages(dateMessages);
    }
  }, [userId, chat, conversationId]);

  let primaryUser;
  let displayPicture;
  let displayName;

  if (conversationId) {
    const {conversationDictionary} = chat;

    const conversation = conversationDictionary[conversationId];

    if (conversation&&conversation.participants) {
      const participants = conversation.participants;

      const otherUsers = participants.filter((participant)=>(participant._id!==user._id));

      primaryUser = otherUsers[0];
      if (primaryUser) {
        displayName = primaryUser.displayName;
        displayPicture = primaryUser.displayPicture;
      }
    }
  }

  return (
    <div className={classes.root} ref={messageListRef} onScroll={handleScroll}>
      <Grid>
        {
          dates.map((date, index)=>{
            const dayMessages = dateMessages.get(date);

            if (dayMessages&&dayMessages.length>0) {
              return (
                <Paper key={index} variant={'outlined'} square className={classes.paper}>

                  <TimeBar date={date} />

                  {
                    dayMessages.map((messageBlock, index)=>{
                      const {user, messages} = messageBlock;

                      return (
                        <ChatMsgSlack
                          user={user}
                          messages={messages}
                          fullTime={true}
                        />
                      );
                    })
                  }
                </Paper>
              );
            }
            else {
              return null;
            }
          })
        }
      </Grid>


      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageDrawer;
