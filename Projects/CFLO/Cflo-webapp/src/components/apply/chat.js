import React, {useState, useEffect} from 'react';
import AppItem from './apply.list.item';
import {useSelector} from 'react-redux';
import {BrowserRouter as Router, Switch, Route, Link, useParams, useHistory} from 'react-router-dom';

import Api from '../../helpers/Api';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import {useMediaQuery} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Appbar from './AppBar';
// import BottomBar from './BottomBar';
import MessageDrawer from './MessageDrawer';
import BottomBar from './BottomBar';
import {AppBar, Box, Toolbar} from '@material-ui/core';
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flex: 1,
    marginTop: '5rem',
    flexDirection: 'row',
  },

  avoid: {
    flex: 1,
    marginBottom: '5rem',
    paddingBottom: '5rem',
  },

  left: {
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    overflow: 'auto',
    position: 'fixed',
    bottom: 0,
  },

  right: {
    flex: 2,
    flexDirection: 'column',
    display: 'flex',
    height: '100%',
    overflow: 'auto',
    position: 'fixed',
    bottom: 0,
    right: 0,
    backgroundColor: 'yellow',
  },
}));

const Chat = (props) => {
  const classes = useStyles();
  const dashboard = useSelector((state) => state.dashboard);
  const [appId, setAppId] = useState(null);
  const {parentId, parentModelName} = props;
  const {investmentDictionary, jobDictionary, appDictionary} = dashboard;
  let appIds = [];
  switch (parentModelName) {
    case 'Investment':
      const investment = investmentDictionary[parentId];
      appIds = investment?.appIds || [];
      break;

    case 'Job':
      const job = jobDictionary[parentId];
      appIds = job?.appIds || [];
      break;

    default:
      break;
  }

  useEffect(() => {
    setAppId(appIds[0]);
  }, []);

  return (
    <div className={classes.root}>
      {/* <div className={classes.left}>
                        lol
                        {appIds.map(appId=>{
                    return <AppItem key={appId} appId={appId} />
                })}

                {appIds.map(appId=>{
                    return <AppItem key={appId} appId={appId} />
                })}

{appIds.map(appId=>{
                    return <AppItem key={appId} appId={appId} />
                })}


{appIds.map(appId=>{
                    return <AppItem key={appId} appId={appId} />
                })}


                </div>
                <Paper className={classes.right}>
                {appIds.map(appId=>{
                    return <AppItem key={appId} appId={appId} />
                })}

                </Paper> */}
      <Box flexDirection="row" flexGrow={1} display="flex" overflow="hidden" height="100%" width="100%" position="fixed">
        <Box flexDirection="column" overflow="auto" height="100%" width="30%">
          {appIds.map((appId) => {
            return <AppItem key={appId} appId={appId} setAppId={setAppId} />;
          })}
        </Box>
        <Divider orientation="vertical" flexItem />
        <Box flexDirection="column" overflow="auto" height="100%" width="60%">
          <Appbar appId={appId} />
          <MessageDrawer appId={appId} />
          <BottomBar appId={appId} />
        </Box>
      </Box>
    </div>
  );
};

export default Chat;
