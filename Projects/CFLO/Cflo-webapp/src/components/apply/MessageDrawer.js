import React, {useEffect, useRef, useState} from 'react';
import moment from 'moment';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import {useMediaQuery} from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Link from '@material-ui/core/Link';
import ListItem from '@material-ui/core/ListItem';
import {Typography} from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import Api from '../../helpers/Api';
import ChatMsgSlack from '../chat/ChatMsgSlack';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import {HandleAppComments} from './apply.utils';

const useStyles = makeStyles((theme) => ({
  root: {
    boxShadow: '0 1px 1px 1px #eeeeee',
    paddingTop: '2rem',
    paddingBottom: '5rem',
    overflow: 'auto',
    height: `calc(90vh)`,
    width: '100%',
    [theme.breakpoints.only('sm')]: {
      width: '100%',
    },
    [theme.breakpoints.down('xs')]: {
      width: `100%`,
    },
  },
}));

const MessageDrawer = (props) => {
  const classes = useStyles();
  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);
  const messageListRef = useRef(null);
  const commentReducer = useSelector((state) => state.comment);
  const {commentDictionary} = commentReducer;
  const dashboard = useSelector((state) => state.dashboard);
  const {appDictionary} = dashboard;
  const {appId} = props;
  const app = appDictionary[appId];
  const commentIds = app?.commentIds || [];

  const scrollToBottom = () => {
    if (messagesEndRef && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({behavior: 'smooth'});
    }
  };

  const handleScroll = () => {
    const scrollTop = messageListRef.current.scrollTop;
    // console.log('scrolling ',scrollTop)
  };

  useEffect(() => {
    Api.post('comment/getComments', {
      parent: appId,
      model: 'Application',
    }).then((comments) => {
      HandleAppComments(appId, true, comments, state, dispatch);
    });
  }, [appId]);

  return (
    <div className={classes.root} ref={messageListRef} onScroll={handleScroll}>
      <Grid>
        {commentIds.map((commentId, index) => {
          const comment = commentDictionary[commentId];
          const user = comment?.profile?.parent;

          return <ChatMsgSlack user={user} messages={[comment]} fullTime={true} />;
        })}
      </Grid>

      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageDrawer;
