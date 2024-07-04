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

  const {conversationId, conversationDictionary, profile} = props;

  return (
    <>
      <Appbar 
          conversationId={conversationId}
          conversationDictionary={conversationDictionary}
          profile={profile}
          />
      <MessageDrawer 
          conversationId={conversationId}
          conversationDictionary={conversationDictionary}
          profile={profile}
      />
      <BottomBar 
         conversationId={conversationId}
         profile={profile}
      />
    </>
  );
};

export default ConversationView;
