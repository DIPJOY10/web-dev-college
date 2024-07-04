import _ from 'lodash';
import arrayToReducer from '../../helpers/arrayToReducer';

export const setJobCats = (jobCats, dashboard, dispatch) => {
  const catDictionary = {};
  if (jobCats && jobCats.length > 0) {
    jobCats.map((jobCat) => {
      const cats = _.concat([jobCat.main], jobCat.subs);
      cats.forEach((cat) => {
        const catId = cat._id;
        catDictionary[catId] = cat;
      });
    });

    dispatch({
      type: 'AddDashboard',
      payload: {
        jobCats,
        jobCatDictionary: catDictionary,
      },
    });
  }
};

export const setJobApps = (jobId, applications, dashboard, dispatch) => {
  const { jobDictionary, appDictionary } = dashboard;
  const job = jobDictionary[jobId];

  if (applications && applications.length > 0) {
    const newApplicationIds = [];
    const newApplicationDictionary = {};
    applications.map((application) => {
      const applicationId = application._id;
      newApplicationIds.push(applicationId);
      newApplicationDictionary[applicationId] = application;
    });
    const newAppDictionary = {
      ...appDictionary,
      ...newApplicationDictionary,
    };

    const newJobObject = {};

    if (job?.appIds && job.appIds.length > 0) {
      const newAppIdSet = new Set([...newApplicationIds, ...job.appIds]);
      let newAppIds = Array.from(newAppIdSet);
      newAppIds = newAppIds.sort((aId, bId) => {
        const a = newAppDictionary[aId].createdAt;
        const b = newAppDictionary[bId].createdAt;
        return new Date(a) - new Date(b);
      });
      newJobObject[jobId] = {
        ...job,
        appIds: newAppIds,
      };
    }
    else {
      let newAppIds = newApplicationIds;
      newAppIds = newAppIds.sort((aId, bId) => {
        const a = newAppDictionary[aId].createdAt;
        const b = newAppDictionary[bId].createdAt;
        return new Date(a) - new Date(b);
      });
      newJobObject[jobId] = {
        ...job,
        appIds: newAppIds,
      };
    }

    dispatch({
      type: 'AddDashboard',
      payload: {
        appDictionary: newAppDictionary,
        jobDictionary: {
          ...jobDictionary,
          ...newJobObject,
        },
      },
    });
  }
};

export const setJobs = (jobs, dashboard, dispatch) => {
  const { jobIds = [], jobDictionary } = dashboard;
  if (jobs && jobs.length > 0) {
    const {
      idArr, newDict
    } = arrayToReducer(jobs)


    const jobIdSet = new Set(_.concat(jobIds, idArr));

    dispatch({
      type: 'AddDashboard',
      payload: {
        jobDictionary: {
          ...jobDictionary,
          ...newDict,
        },
        jobIds: Array.from(jobIdSet),
      },
    });

    return idArr;
  }
};

export const evaluateProjectStep = (job) => {
  if (job?.title?.length > 2 && job?.description?.length > 2 && job?.startDate && job.location) {
    if (job?.categories?.length > 0) {
      return 2;
    }
    else {
      return 1;
    }
  }
  else {
    return 0;
  }
};
