import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useJob, useGetJob } from './job.hook';
import { useGetApps } from '../apply/apply.hooks';
import JobViewBasic from './job.view.basic';
import AppChat from '../apply/chat';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import ChatIcon from '@material-ui/icons/Chat';
import SubjectIcon from '@material-ui/icons/Subject';
import Grid from '@material-ui/core/Grid';
import { useJobDefaultPipeline } from './job.hook';
import JobApps from './job.apps';
import HomeIcon from '@material-ui/icons/Home';
import {
  AppBar,
  Toolbar,
  IconButton,
  useScrollTrigger,
  useMediaQuery,
} from '@material-ui/core';
import {
  useParams,
  useHistory,
} from 'react-router-dom';

import Appbar from '../appbar/menu.appbar';

const useStyles = makeStyles((theme) => ({

  root: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    height: '100vh',
    overflow: 'auto',

  },

  infoRoot: {
    display: 'flex',
    flex: 1,
    marginTop: '5rem',
  },

  appbar: {
    display: 'flex',
    flexDirection: 'row',
    alignSelf: 'flex-start',
    top: 0,
    left: '17rem',
    position: 'fixed',
    borderColor: 'grey',
    backgroundColor: 'white',
    height: '5rem',
  },


}));

export default function JobManageView(props) {
  const classes = useStyles();
  const [edit, setEdit] = useState(false);
  const [view, setView] = useState('Applications');

  const dashboard = useSelector((state) => state.dashboard);
  const { jobCatDictionary } = dashboard;
  const { jobId } = useParams();
  const { job, isFeed } = useJob(jobId);
  const appIds = job?.appIds;
  useGetApps(jobId, 'Job');
  useGetJob(jobId);
  useJobDefaultPipeline(jobId);
  // console.log(job,' is the job',jobId)
  const history = useHistory();

  useEffect(() => {
    // console.log(job,' in jobManageview',job.appIds)
    if (job?.appIds && job?.appIds.length > 0) {
      setView('Applications');
      // console.log('setView called')
    }
  }, [job]);

  const JobAndEditView = <div className={classes.infoRoot}>
    <JobViewBasic
      job={job}
      isFeed={isFeed}
      setEdit={() => setEdit(true)}
    />
  </div>;

  let JobManageView = JobAndEditView;

  switch (view) {
    case 'Job Info':
      JobManageView = JobAndEditView;
      break;

    case 'Messages':
      JobManageView = <AppChat
        parentId={jobId}
        parentModelName={'Job'}
      />;
      break;

    case 'Applications':
      JobManageView = <JobApps jobId={jobId} />;
      break;
    default:
      break;
  }


  return <div className={classes.root}>

    <Appbar
      navState={view}
      items={[
        {
          Icon: <HomeIcon />,
          text: 'Job Info',
          onClick: () => {
            setView('Job Info');
          },
        },
        {
          Icon: <SubjectIcon />,
          text: 'Applications',
          onClick: () => {
            setView('Applications');
          },
        },
        {
          Icon: <ChatIcon />,
          text: 'Messages',
          onClick: () => {
            setView('Messages');
          },
        },
      ]}
    />

    {JobManageView}


  </div>;
}

