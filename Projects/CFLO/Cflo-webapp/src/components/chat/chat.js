import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {BrowserRouter as Router, Switch, Route, Link, useParams, useHistory} from 'react-router-dom';

import Api from '../../helpers/Api';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import {useMediaQuery} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import ConversationView from './ConversationView';
import SearchBar from '../SearchBar';
import UserMessageList from './UserMessageList';
import {AppBar, Box, Toolbar} from '@material-ui/core';

const drawerWidth = '17rem';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flex: 1,
    height: '100vh',
    position: 'fixed',
    top: 0,
    left:theme.drawer.width,
    [theme.breakpoints.only('sm')]: {
      left:theme.drawer.smWidth,
    },
    [theme.breakpoints.only('sm')]: {
      left:0,
    },
    width: `100%`,
  },
  gridView: {
    flex: 1,
    height: '100%',

    backgroundColor: 'orange',
  },
  MessageListDiv: {
    width: '30%',
    [theme.breakpoints.only('md')]: {
      width: '31%',
    },
    [theme.breakpoints.only('sm')]: {
      width: '40%',
    },
    [theme.breakpoints.only('xs')]: {
      width: '100%',
    },
  },
  MessageList: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
  searchBarDiv: {
    paddingTop: '2rem',
    paddingLeft: '2.5rem',
    justifyContent: 'center',
    marginBottom: '2rem',
  },
  ConversationViewDiv: {
    flex: 1,
    backgroundColor: 'white',
  },
  ConversationView: {
    backgroundColor: '#eeeeee',
  },
}));

const Chat = (props) => {
  const [initConvo, setInitConvo] = useState(false);
  const classes = useStyles();
  const {conversationId} = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const theme = useTheme();
  const {user} = useSelector((state) => state.auth);
  const userId = user._id;
  const chat = useSelector((state) => state.chat);
  const profile = useSelector((state) => state.profile);
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const [searchTerm, setSearchTerm] = useState('');

  const {selectedProfileId} = profile;
  const {conversationIds, userConversation} = chat;

  const isConversationDefined = conversationId ? true : false;
  
  
  useEffect(() => {
    if (isConversationDefined) {
      // if conversation is defined it's ok, do nothing
      setInitConvo(false);
    }
    else {
      if (selectedProfileId) {
        // console.log(selectedProfileId,conversationId,userId,' is selected person and conv id')
        // if conversation not defined, but person is selected
        // if conversation with person exists, select conversation

        if (selectedProfileId === userId) {
          const path = '/messages/' + conversationIds[0];
          history.push(path);
          dispatch({
            type: 'AddProfile',
            payload: {
              selectedProfileId: null,
            },
          });
        }
        else if (userConversation[selectedProfileId]) {
          const conversations = userConversation[selectedProfileId];
          // console.log(userConversation,conversations)
          const convoId = conversations[0];
          const newUrl = '/messages/' + convoId;
          history.push(newUrl);
        }
        else {
          // We have to create Conversation
          setInitConvo(true);
        }
      }
      else {
        setInitConvo(false);
        // console.log(conversationIds,' is the conversaiontIds')
        const firstConvo = conversationIds[0];
        if (firstConvo) {
          const newUrl = '/messages/' + conversationIds[0];
          history.push(newUrl);
        }
      }
    }
  }, [chat, conversationId, userId]);

  return (
    <div className={classes.root}>
      {isMobile ? (
        <Grid container className={classes.gridView}>
          {chat?.isConversationView ? (
            <div className={classes.ConversationViewDiv}>
              <ConversationView initConvo={initConvo} />
            </div>
          ) : (
            <div className={classes.MessageListDiv}>
              <Paper square className={classes.MessageList}>
                <div className={classes.searchBarDiv}>
                  <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} searchPlaceholder={' Search conversation'} />
                </div>
                <UserMessageList initConvo={initConvo} />
              </Paper>
            </div>
          )}
        </Grid>
      ) : (
        <Box flexDirection="row" flexGrow={1} display="flex" overflow="hidden" height="100%" width={`100%`}>
          <Box flexDirection="column" overflow="auto" height="100%" width="30%">
            <Paper square className={classes.MessageList}>
              <div className={classes.searchBarDiv}>
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} searchPlaceholder={' Search conversation'} />
              </div>
              <UserMessageList initConvo={initConvo} />
            </Paper>
          </Box>

          <Box flexDirection="column" overflow="auto" height="100%" width="70%">
            <ConversationView initConvo={initConvo} />
          </Box>
        </Box>
      )}
    </div>
  );
};

export default Chat;
