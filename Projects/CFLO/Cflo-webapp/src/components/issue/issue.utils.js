import _ from 'lodash';
import {handleComments} from '../comment/comment.utils';


export const setIssues = (issues, issueReducer, dispatch)=>{
  const {issueDictionary} = issueReducer;
  const newIssueDictionary = {};
  const issueIds = [];
  issues.map((issue)=>{
    const issueId = issue._id;
    issueIds.push(issueId);
    newIssueDictionary[issueId] = issue;
  });


  const issueIdSet = new Set(issueIds);

  dispatch({
    type: 'AddIssue',
    payload: {
      issueDictionary: {
        ...issueDictionary,
        ...newIssueDictionary,
      },
    },
  });

  return {
    issueIds: Array.from(issueIdSet),
  };
};


export const addInTeam = async ( issues, team, state, dispatch, addInFront)=>{
  const {team: teamReducer, issue: issueReducer} = state;
  const {
    teamDictionary,
  } = teamReducer;

  const teamId = team?._id;

  let teamArray = [];
  const newTeamObject = {};
  let issueIds = [];

  if (teamId && issues && issues.length>0) {
    const teamArrayOld = team?.issues ? team.issues :[];

    // console.log(' before setIssues ')

    issueIds = await setIssues(issues, issueReducer, dispatch).issueIds;

    // console.log('after setIssues',issueIds)

    if (addInFront) {
      teamArray = teamArrayOld.length>0?
                [...issueIds, ...teamArrayOld]:issueIds;
    }
    else {
      teamArray = teamArrayOld.length>0?
                [...teamArrayOld, ...issueIds]:issueIds;
    }

    const newSet = new Set(teamArray);

    newTeamObject[teamId] = {
      ...team,
      issues: Array.from(newSet),
    };

    // console.log(newTeamObject,' is the newTeamObject')

    const newTeamDictionary = {
      ...teamDictionary,
      ...newTeamObject,
    };

    // console.log(newTeamDictionary,' is the newTeamDictionary')

    dispatch({
      type: 'AddTeam',
      payload: {
        teamDictionary: {
          ...teamDictionary,
          ...newTeamDictionary,
        },
      },
    });
  }
};

export const handleIssueTeam = (issue, team, teamReducer, dispatch)=>{
  const {teamDictionary} = teamReducer;
  const teamId = issue.team;
  const oldTeam = teamDictionary[teamId];
  const oldIssueIds = oldTeam.issues;
  const issueIdSet = new Set(oldIssueIds);
  issueIdSet.add(issue._id);

  const newTeam = {
    ...oldTeam,
    issues: Array.from(issueIdSet),
    numIssues: team.numIssues,
  };

  const newTeamObject = {};
  newTeamObject[teamId] = newTeam;
  const newTeamDictionary = {
    ...teamDictionary,
    ...newTeamObject,
  };

  dispatch({
    type: 'AddTeam',
    payload: {
      teamDictionary: newTeamDictionary,
    },
  });
};

export const deleteIssue = (issueId, teamId, teamDictionary, issueDictionary, dispatch)=>{
  const oldTeam = teamDictionary[teamId];

  const newTeamObject = {};
  newTeamObject[teamId] = {
    ...oldTeam,
    numIssues: oldTeam.numIssues-1,
    issues: oldTeam.issues.filter((issue)=>issue!==issueId),
  };

  delete issueDictionary[issueId];

  dispatch({
    type: 'AddTeam',
    payload: {
      teamDictionary: {
        ...teamDictionary,
        ...newTeamObject,
      },
    },
  });

  dispatch({
    type: 'AddIssue',
    payload: {
      issueDictionary,
    },
  });
};

export const HandleIssueComments = (issueId, comments, issueReducer, commentReducer, dispatch)=>{
  const {issueDictionary} = issueReducer;
  const issue = issueDictionary[issueId];

  const newIssueObject = {};
  const oldCommentIds = issue.comments?issue.comments:[];
  const commentIdSet = new Set(oldCommentIds);
  comments.map((comment)=>{
    const commentId = comment._id;
    commentIdSet.add(commentId);
  });

  newIssueObject[issueId] = {
    ...issue,
    numComments: issue.numComments+1,
    comments: Array.from(commentIdSet),
  };
  handleComments(comments, commentReducer, dispatch);
  dispatch({
    type: 'AddIssue',
    payload: {
      issueDictionary: {
        ...issueDictionary,
        ...newIssueObject,
      },
    },
  });
};


export const deleteComment = (commentId, issueId, issueDictionary, commentDictionary, dispatch)=>{
  const oldissue = issueDictionary[issueId];

  const newissueObject = {};
  newissueObject[issueId] = {
    ...oldissue,
    numcomments: oldissue.numcomments-1,
    comments: oldissue.comments.filter((comment)=>comment!==commentId),
  };

  delete commentDictionary[commentId];

  dispatch({
    type: 'AddIssue',
    payload: {
      issueDictionary: {
        ...issueDictionary,
        ...newissueObject,
      },
    },
  });

  dispatch({
    type: 'AddComment',
    payload: {
      commentDictionary,
    },
  });
};


export const handleIssues = (issues, issueReducer, dispatch)=>{
  const {issueDictionary} = issueReducer;

  const newIssueDictionary = {};

  if (issues&&issues.length>0) {
    issues.map((issue)=>{
      if (issue&&issue._id) {
        const issueId = issue._id;

        newIssueDictionary[issueId] = issue;
      }
    });

    dispatch({
      type: 'AddIssue',
      payload: {
        issueDictionary: {...issueDictionary, ...newIssueDictionary},
      },
    });
  }
};

