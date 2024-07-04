import _ from 'lodash';
import {handleComments} from '../comment/comment.utils';

export const setUserApps = (applications, dashboard, dispatch) => {
  const {applicationIds, appDictionary} = dashboard;
  if (applications && applications.length > 0) {
    const newApplicationIds = [];
    const newApplicationDictionary = {};
    applications.forEach((application) => {
      const applicationId = application._id;
      newApplicationIds.push(applicationId);
      newApplicationDictionary[applicationId] = application;
    });

    const applicationIdSet = new Set(_.concat(applicationIds, newApplicationIds));

    dispatch({
      type: 'AddDashboard',
      payload: {
        appDictionary: {
          ...appDictionary,
          ...newApplicationDictionary,
        },
        applicationIds: Array.from(applicationIdSet),
      },
    });

    return newApplicationIds;
  }
};

export const setApps = (applications, dashboard, dispatch) => {
  const {appDictionary} = dashboard;
  if (applications && applications.length > 0) {
    const newApplicationDictionary = {};
    applications.map((application) => {
      const applicationId = application._id;
      newApplicationDictionary[applicationId] = application;
    });

    dispatch({
      type: 'AddDashboard',
      payload: {
        appDictionary: {
          ...appDictionary,
          ...newApplicationDictionary,
        },
      },
    });
  }
};

export const HandleAppComments = (appId, addInFront, comments, state, dispatch) => {
  if (comments && comments.length > 0) {
    const {dashboard, comment: commentReducer} = state;
    const {appDictionary} = dashboard;
    const app = appDictionary[appId];

    const newAppObject = {};
    const oldCommentIds = app?.commentIds ? app.commentIds : [];
    const newCommentIds = comments.map((comment) => {
      const commentId = comment._id;
      return commentId;
    });

    let totalCommentIds = [];

    if (addInFront) {
      totalCommentIds = [...newCommentIds, ...oldCommentIds];
    }
    else {
      totalCommentIds = [...oldCommentIds, ...newCommentIds];
    }

    // remove null values
    totalCommentIds = totalCommentIds.filter((commId) => commId);

    // remove duplicates
    const totalSet = new Set(totalCommentIds);
    // console.log(comments,newCommentIds,oldCommentIds,totalCommentIds,' is the totalCommentIds')

    newAppObject[appId] = {
      ...app,
      commentIds: Array.from(totalSet),
    };
    handleComments(comments, commentReducer, dispatch);
    dispatch({
      type: 'AddDashboard',
      payload: {
        appDictionary: {
          ...appDictionary,
          ...newAppObject,
        },
      },
    });
  }
};
