import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ButtonBase } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import JobCard from '../job/job.card';
import _ from 'lodash';
import Api from '../../helpers/Api';
const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

export default function JobFeed() {
  const classes = useStyles();
  const explore = useSelector((state) => state.explore);
  const { jobIds } = explore;
  // const { auth } = useSelector((state) => state);
  // const { user } = auth;
  // const [savedIds, setSavedIds] = useState(null);
  // const profile = user?.profile;

  // // useEffect(() => {
  // Api.post('job/getSavedJobs', {
  //   profile, user
  // }).then((res) => {
  //   // for (const values of Object.values(res)) {
  //   setSavedIds(res);
  //   console.log(savedIds, 'savedJobs');
  //   // }
  // })
  // }, [profile, user])
  const JobCards = (jobIds) => {
    if (jobIds && jobIds.length > 0) {
      return jobIds.map((jobId) => {
        if (jobId) {
          return (
            <JobCard jobId={jobId} />
          );
        }
        else {
          return null;

        }
      });
    }
    else {
      return null;
    }
  };

  return (
    <div className={classes.root}>
      {JobCards(jobIds)}
    </div>
  );
}

