import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import {
  makeStyles,
  useTheme,
} from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import CreateBtn from '../../styled/actionBtns/create.btn';
import {
  useHistory, useLocation,
} from 'react-router-dom';
import { createSelector } from 'reselect';
import _ from 'lodash';
import AddIcon from '@material-ui/icons/Add';
import ButtonBase from '@material-ui/core/ButtonBase';

const appIdsSelector = (state) => state.dashboard.applicationIds;
const appDictionarySelector = (state) => state.dashboard.appDictionary;

const jobAppSelector = createSelector(
  appIdsSelector,
  appDictionarySelector,
  (appIds, appDictionary) => appIds.filter((appId) => appDictionary[appId]?.parentModelName == 'Job'),
);

const jobIdsSelector = (state) => state.dashboard.jobIds;
const jobDictionarySelector = (state) => state.dashboard.jobDictionary;

const jobSelector = createSelector(
  jobIdsSelector,
  jobDictionarySelector,
  (jobIds, jobDictionary) => jobIds.filter((jobId) => jobDictionary[jobId]?.published),
);

const draftSelector = createSelector(
  jobIdsSelector,
  jobSelector,
  (jobIds, acceptedIds) => _.difference(jobIds, acceptedIds),
);

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    maxWidth: '20rem',
    minWidth: '18rem',
    margin: '1rem',
    padding: '1rem',
  },
  titleText: {
    titleTextAlign: 'center',
    fontSize: '1.2rem',
    margin: '0.4rem',
    fontWeight: '700',
  },

  text: {

    fontSize: '0.8rem',
    margin: '0.1rem',
    fontWeight: '500',
  },

  row: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  col: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
  },

  createBtn: {
    paddingLeft: '1rem',
    padding: '0.5rem',
    paddingTop: '0.25rem',
    paddingBottom: '0.25rem',

  },

  createBtnPaper: {
    alignSelf: 'flex-end',
    marginRight: '1rem',
  },

  divider: {
    height: '0.1px',
    width: '100%',
    margin: '0.5rem',
    marginTop: '1rem',
    backgroundColor: '#bdbdbd',
  },

}));

function JobsCard() {
  const history = useHistory();
  const classes = useStyles();

  const dashboard = useSelector((state) => state.dashboard);
  const publishedIds = useSelector(jobSelector);
  const draftIds = useSelector(draftSelector);
  const appIds = useSelector(jobAppSelector);

  const { jobIds, appDictionary } = dashboard;

  const pubAppIds = [];
  const draftAppIds = [];
  appIds.map((appId) => {
    const isPub = appDictionary[appId].published;
    if (isPub) {
      pubAppIds.push(appId);
    }
    else {
      draftAppIds.push(appId);
    }
  });

  const location = useLocation();
  const pathname = location['pathname'];

  const {
    row, col,
  } = classes;
  // console.log(pathname,' is the pathname')

  return (
    <Paper className={classes.root} onClick={() => {
      const path = '/dashboard/jobs';
      history.push(path);
    }}>

      <div className={row}>
        <div className={row}>
          <Typography className={classes.titleText}>
            Jobs
          </Typography>
        </div>
        <Paper className={classes.createBtnPaper}>
          <ButtonBase className={classes.createBtn} onClick={() => {
            const path = '/dashboard/create/job/';
            history.push(path);
          }}>
            <Typography>
              Add
            </Typography>

            <AddIcon />

          </ButtonBase>
        </Paper>
      </div>

      <span className={classes.divider}></span>

      <Typography className={classes.text}>
        You have published <b>{publishedIds?.length} </b> jobs. {publishedIds?.length > 0 ? 'Manage applications' : ''}
      </Typography>

      <Typography className={classes.text}>
        You have <b>{publishedIds?.length}</b> jobs in draft. {draftAppIds?.length > 0 ? 'Complete and publish jobs to hire candidates' : ''}
      </Typography>

      <span className={classes.divider}></span>

      <Typography className={classes.text}>
        You have applied for <b>{pubAppIds?.length} </b> jobs.
      </Typography>

      <Typography className={classes.text}>
        You are <b>{draftAppIds?.length}</b> job applications in draft. {draftAppIds?.length > 0 ? 'Complete the draft to apply' : ''}
      </Typography>


      {/* {jobIds.length>0?<>
                {jobIds.slice(0,2).map(jobId=><JobCard jobId={jobId} min={true}/>)}
            </>:<>
                <Typography className={classes.titleText}>
                    You haven't posted a job on Marketplace
                </Typography>
                <CreateBtn  color="primary" onClick={()=>{
                            var path = '/dashboard/create/job/';
                            history.push(path);
                }}>
                    Post a Job
                </CreateBtn>
            </>
            } */}
    </Paper>
  );
}

export default JobsCard;
