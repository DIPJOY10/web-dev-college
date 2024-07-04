import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
  makeStyles,
  useTheme,
} from '@material-ui/core/styles';
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
  const {appId} = props;

  const {user} = useSelector((state)=>state.auth);

  return (
    <Grid container item className={classes.root}>
      <Appbar appId={appId}/>
      <MessageDrawer appId={appId}/>
      <BottomBar appId={appId} />
    </Grid>
  );
};

export default ConversationView;
