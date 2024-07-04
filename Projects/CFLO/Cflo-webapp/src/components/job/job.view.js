import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {useJob} from './job.hook';
import JobViewBasic from './job.view.basic';

import {
  useParams,
  useHistory,
} from 'react-router-dom';

const useStyles = makeStyles((theme) => ({

  root: {
    flex: 1,
    marginTop: '6rem',
  },

}));

export default function JobCard(props) {
  const classes = useStyles();
  const {jobId} = useParams();
  const {job, isFeed} = useJob(jobId);
  // console.log(job,' is the job',jobId)
  const history = useHistory();

  return <div className={classes.root}>
    <JobViewBasic
      job={job}
      isFeed={isFeed}
    />
  </div>;
}

