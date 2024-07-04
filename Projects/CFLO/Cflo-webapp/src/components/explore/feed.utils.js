import _ from 'lodash';

export const setInvestments = (investments, explore, dispatch) => {
  const {investmentIds, investmentDictionary} = explore;
  if (investments && investments.length > 0) {
    const newInvestmentIds = [];
    const newInvestmentDictionary = {};
    investments.forEach((investment) => {
      const investmentId = investment._id;
      newInvestmentIds.push(investmentId);
      newInvestmentDictionary[investmentId] = investment;
    });

    const investmentIdSet = new Set(_.concat(investmentIds, newInvestmentIds));

    dispatch({
      type: 'AddFeed',
      payload: {
        investmentDictionary: {
          ...investmentDictionary,
          ...newInvestmentDictionary,
        },
        investmentIds: Array.from(investmentIdSet),
      },
    });

    return newInvestmentIds;
  }
};

export const setJobs = (jobs, explore, dispatch) => {
  const {jobIds, jobDictionary} = explore;
  if (jobs && jobs.length > 0) {
    const newJobIds = [];
    const newJobDictionary = [];
    jobs.map((job) => {
      const jobId = job._id;
      newJobIds.push(jobId);
      newJobDictionary[jobId] = job;
    });

    const jobIdSet = new Set(_.concat(jobIds, newJobIds));

    dispatch({
      type: 'AddFeed',
      payload: {
        jobDictionary: {
          ...jobDictionary,
          ...newJobDictionary,
        },
        jobIds: Array.from(jobIdSet),
      },
    });

    return newJobIds;
  }
};

export const setPosts = (posts, explore, dispatch, front) => {
  const {postIds, postDictionary} = explore;
  if (posts && posts.length > 0) {
    const newPostIds = [];
    const newPostDictionary = [];
    posts.map((post) => {
      const postId = post._id;
      newPostIds.push(postId);
      newPostDictionary[postId] = post;
    });

    const postIdSet = front ? new Set(_.concat(newPostIds, postIds)) : new Set(_.concat(postIds, newPostIds));

    dispatch({
      type: 'AddFeed',
      payload: {
        postDictionary: {
          ...postDictionary,
          ...newPostDictionary,
        },
        postIds: Array.from(postIdSet),
      },
    });

    return newPostIds;
  }
};
