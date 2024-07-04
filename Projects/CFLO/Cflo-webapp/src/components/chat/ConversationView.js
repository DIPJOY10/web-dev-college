import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
  makeStyles,
  useTheme,
} from '@material-ui/core/styles';
import {
  useParams,
  useHistory,
} from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Appbar from './AppBar';
import BottomBar from './BottomBar';
import MessageDrawer from './MessageDrawer';

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
  },
}));

const ConversationView = (props)=>{
  const classes = useStyles();
  const {conversationId} = useParams();

  const {user} = useSelector((state)=>state.auth);

  return (
    <>
      <Appbar conversationId={conversationId}/>
      <MessageDrawer conversationId={conversationId}/>
      <BottomBar conversationId={conversationId} />
    </>
  );
};

export default ConversationView;
