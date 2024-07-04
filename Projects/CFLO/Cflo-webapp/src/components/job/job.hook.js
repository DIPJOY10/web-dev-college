import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import Api from '../../helpers/Api';
import { setJobs } from './job.utils';

export const useJob = function (jobId) {
  const location = useLocation();
  const pathname = location['pathname'];
  // console.log(pathname,' is the pathname')

  const isFeed = pathname.slice(1, 5) == 'feed' || pathname == '/';
  const dispatch = useDispatch();
  const explore = useSelector((state) => state.explore);
  const dashboard = useSelector((state) => state.dashboard);
  const { jobDictionary: exploreMap } = explore;
  const { jobDictionary: dashboardMap, jobCatDictionary } = dashboard;
  const jobDictionary = isFeed ? exploreMap : dashboardMap;
  const job = jobDictionary[jobId];
  return { job, isFeed };
};

export const useGetJob = function (jobId) {
  const dispatch = useDispatch();
  const dashboard = useSelector((state) => state.dashboard);

  useEffect(() => {
    Api.post('job/getDetail', { jobId })
      .then((job) => {
        // console.log(job,' is the job hook')
        setJobs([job], dashboard, dispatch);
      });
  }, []);
};

export const useJobDefaultPipeline = function (jobId) {
  const pipelineReducer = useSelector((state) => state.pipeline);
  const dispatch = useDispatch();
  const dashboard = useSelector((state) => state.dashboard);
  const { jobDictionary } = dashboard;
  const job = jobDictionary[jobId];
  const {
    pipelineDictionary,
    pipelineIds,
  } = pipelineReducer;

  const typePipelineIds = pipelineIds.filter((pipelineId) => {
    const pipeline = pipelineDictionary[pipelineId];
    return pipeline.type === 'Job' && pipeline.platform;
  });
  let pipelineId = null;
  if (typePipelineIds && typePipelineIds.length > 0) {
    pipelineId = typePipelineIds[0];
  }

  useEffect(() => {
    if (job.pipeline) {
      // do nothing if pipeline is already present
    }
    else {
      if (pipelineId) {
        Api.post('job/update', {
          ...job,
          pipeline: pipelineId,
        }).then((job) => {
          setJobs([job], dashboard, dispatch);
        });
      }
    }
  }, [pipelineId]);
};
