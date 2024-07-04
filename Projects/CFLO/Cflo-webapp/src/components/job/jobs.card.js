import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import {
  makeStyles,
  useTheme,
} from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import BriefcaseIcon from "@material-ui/icons/BusinessCenter";
import {
  useHistory, useLocation,
} from 'react-router-dom';
import { createSelector } from 'reselect';
import _ from 'lodash';
import AddIcon from '@material-ui/icons/Add';
import ButtonBase from '@material-ui/core/ButtonBase';
import { useJobApi } from './job.hooks';

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
    maxWidth: '18rem',
    minWidth: '18rem',
    margin: '1rem',
    padding: '1rem',
    background: '#1DA1F2',
  },
  titleText: {
    titleTextAlign: 'center',
    fontSize: '1.2rem',
    margin: '0.4rem',
    fontWeight: '700',
    color: 'white',
  },

  text: {

    fontSize: '0.8rem',
    margin: '0.1rem',
    fontWeight: '500',
    color: 'white',
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

  menuIcon: {
    height: "24px",
    width: "24px",
    color: "white",
    "& path": {
      fill: "rgba(255, 255, 255)",
    },
  },

  headerCont: {
    width: "100%",
    display: "flex",
    alignItems: "center",
  }
}));

function JobsCard() {
  const history = useHistory();
  const classes = useStyles();
  const {
    jobCreate, loading
  } = useJobApi()
  const dashboard = useSelector((state) => state.dashboard);
  const publishedIds = useSelector(jobSelector);
  const draftIds = useSelector(draftSelector);
  const appIds = useSelector(jobAppSelector);

  const { jobIds, appDictionary, jobDraftIds, jobPublishedIds } = dashboard;

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

  // var arr = Object.values(draftAppIds)


  const {
    row, col,
  } = classes;
  // console.log(pathname,' is the pathname')

  return (
    <Paper className={classes.root} onClick={() => {
      var path = '/dashboard/jobs'
      history.push(path)
    }}>

      <div className={row}>
        <div className={classes.headerCont}>
          <BriefcaseIcon className={classes.menuIcon} />
          <Typography className={classes.titleText}>
            Jobs
          </Typography>
        </div>
        {/* <Paper className={classes.createBtnPaper}>
          <ButtonBase className={classes.createBtn} disabled={loading} onClick={() => {
            jobCreate()
          }}>
            <Typography>
              Add
            </Typography>

            <AddIcon />

          </ButtonBase>
        </Paper> */}
      </div>



      <Typography className={classes.text}>
        <b>{jobPublishedIds?.length}</b> Published
      </Typography>

      <Typography className={classes.text}>
        <b>{jobDraftIds?.length}</b> In draft
        {/* {
          arr.map(console.log(arr),"These are the drafts")
        } */}
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
