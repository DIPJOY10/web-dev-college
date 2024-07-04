import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ButtonBase } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import JobCard from './job.card';
import Divider from '@material-ui/core/Divider';
import ProfileAppbar from "../profile/profile.appbar";
import _ from 'lodash';
import Menubar from "../styled/menubar";
import JobList from './job.list';
import JobAppbar from './job.appbar';
import ApplicationsApplied from './applications.applied';
import SavedJobs from './jobs.saved';
const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    marginTop: '6rem',
  },

  topBarDivider: {
    width: '60%',
    marginTop: '0.5rem',
  },

  createDivStyle: {
    marginLeft: '2rem',
    marginTop: '0.2rem',
  },

  createButtonText: {
    marginLeft: '0.5rem',
    color: theme.palette.primary.main,
  },
}));

export default function Jobs(props) {
  const classes = useStyles();
  const dashboard = useSelector((state) => state.dashboard);

  const {
    jobDraftIds, jobPublishedIds, jobIds, jobDictionary
  } = dashboard;
  const [nav, setNav] = useState('Jobs');
  const [draftJobs, setDraftJobs] = useState(false)
  var View = null

  // switch (nav) {
  //   case 'Published':

  //     break;

  //   case 'Draft':

  //     break;

  //   default:
  //     break;
  // }


  // const JobCards = (jobIds) => {
  //   return jobIds.map((jobId) => {
  //     return (
  //       <JobCard jobId={jobId} />
  //     );
  //   });
  // };

  switch (nav) {
    case 'Jobs':
      View = <JobList />
      break;

    case 'Applications':
      View = <ApplicationsApplied />
      break;
    case 'Saved':
      View = <SavedJobs />
      break;
    default:
      break;
  }

  return (
    <div className={classes.root}>
      <JobAppbar
        // name={"Jobs"}
        nav={nav}
        setNav={setNav}
        jobDictionary={jobDictionary}
        jobPublishedIds={jobPublishedIds}
        jobDraftIds={jobDraftIds}
        btns={
          <>
            { }
          </>
        }
      />





      {View}
      {/* <Menubar /> */}
    </div>
  );
}

