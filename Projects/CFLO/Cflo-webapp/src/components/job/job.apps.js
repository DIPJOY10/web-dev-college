import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useJob } from './job.hook';
import JobViewBasic from './job.view.basic';
import PipelineBar from '../pipeline/pipeline.bar';
import Kanban from '../pipeline/kanban';
import JobApp from './job.app.card';
import Api from '../../helpers/Api';

import {
  useParams,
  useHistory,
} from 'react-router-dom';
import { testFields } from '../pipeline/pipeline.utils';
import { setJobs } from './job.utils';
import PipelineList from '../pipeline/pipeline.list';

const useStyles = makeStyles((theme) => ({

  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
    marginTop: '6rem',
  },

}));

export default function JobApps(props) {
  const classes = useStyles();
  const history = useHistory();
  const [listView, setListView] = useState(false);
  const [selectPipeline, setSelectPipeline] = useState(false);
  const dashboard = useSelector((state) => state.dashboard);
  const dispatch = useDispatch();
  const {
    jobDictionary,
    appDictionary,
  } = dashboard;

  const { jobId } = props;
  const job = jobDictionary[jobId];
  const { appIds } = job;
  const [appJobIds, setJobAppIds] = useState(appIds);

  /**
     *  getCard,
        getCardStatus,
        setCardStatus
     */


  const search = (text) => {
    const searchAppIds = [];
    if (appIds && appIds.length > 0) {
      appIds.map((appId) => {
        const app = appDictionary[appId];
        const { topComment, profile } = app;
        const displayName = profile?.parent?.displayName;
        const commentText = topComment?.text;

        const fieldArray = [displayName, commentText];
        const containText = testFields(fieldArray, text);
        if (containText) {
          searchAppIds.push(appId);
        }
      });
      setJobAppIds(searchAppIds);
    }
  };

  const onSelectPipeline = (pipelineId) => {
    if (pipelineId) {
      Api.post('job/update', {
        _id: jobId,
        pipeline: pipelineId,
      }).then((res) => {
        const newJob = {
          ...job,
          pipeline: pipelineId,
        };
        setJobs([newJob], dashboard, dispatch);
      });
    }
  };


  const getCard = (appId) => {
    return <JobApp appId={appId} onSelect={() => {
      history.push('/dashboard/job/app/' + appId);
    }} />;
  };

  const getStatus = (appId) => {
    const app = appDictionary[appId];
    return app.status;
  };

  const setStatus = (appId, state) => {
    const app = appDictionary[appId];
    const newAppObject = {};
    newAppObject[appId] = {
      ...app,
      status: state,
    };
    dispatch({
      type: 'AddDashboard',
      payload: {
        appDictionary: {
          ...appDictionary,
          ...newAppObject,
        },
      },
    });

    Api.post('apply/update', {
      _id: appId,
      status: state,
    }).then((app) => {
      // no need to update, already updated above
    });
  };

  return <div className={classes.root}>
    {selectPipeline ? <PipelineList type={'Job'} onClose={() => setSelectPipeline(false)} onSelect={(pipelineId) => {
      onSelectPipeline(pipelineId);
      setSelectPipeline(false);
    }} /> : <>
      {job.pipeline ? <PipelineBar
        type="Job"
        listView={selectPipeline}
        setListView={setSelectPipeline}
        search={search}
      /> : null}
      {job.pipeline ? <Kanban
        pipelineId={job.pipeline}
        cardIds={appJobIds}
        getCard={getCard}
        getStatus={getStatus}
        setStatus={setStatus}
      /> : null}
    </>}


  </div>;
}
