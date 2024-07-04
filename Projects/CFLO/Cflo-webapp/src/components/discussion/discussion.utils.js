import _ from 'lodash';
import {handleComments} from '../comment/comment.utils';


export const setDiscussions = (discussions, discussionReducer, dispatch)=>{
  const {discussionDictionary} = discussionReducer;
  const newDiscussionDictionary = {};
  const discussionIds = [];
  discussions.map((discussion)=>{
    const discussionId = discussion._id;
    discussionIds.push(discussionId);
    newDiscussionDictionary[discussionId] = discussion;
  });


  const discussionIdSet = new Set(discussionIds);
  // console.log(discussionIds,discussionIdSet,Array.from(discussionIdSet))
  dispatch({
    type: 'AddDiscussion',
    payload: {
      discussionDictionary: {
        ...discussionDictionary,
        ...newDiscussionDictionary,
      },
    },
  });

  return {
    discussionIds: Array.from(discussionIdSet),
  };
};

export const addInTeam = ( discussions, team, state, dispatch, addInFront)=>{
  const {team: teamReducer, discussion: discussionReducer} = state;
  const {
    teamDictionary,
  } = teamReducer;

  const {
    discussionDictionary,
  } = discussionReducer;

  const teamId = team?._id;

  const discussionIds = [];
  const discussionObject = {};
  let teamArray = [];
  const newTeamObject = {};

  if (teamId && team && discussions && discussions.length>0) {
    const teamArrayOld = team?.discussions ? team.discussions :[];


    discussions.map((discussion)=>{
      const discussionId = discussion._id;
      discussionObject[discussionId] = discussion;
      discussionIds.push(discussionId);
    });

    if (addInFront) {
      teamArray = teamArrayOld.length>0?
                [...discussionIds, ...teamArrayOld]:discussionIds;
    }
    else {
      teamArray = teamArrayOld.length>0?
                [...teamArrayOld, ...discussionIds]:discussionIds;
    }

    newTeamObject[teamId] = {
      ...team,
      discussions: teamArray,
    };

    // console.log(newTeamObject,discussionObject)

    // dispatch({
    //     type:'AddTeam',
    //     payload:{
    //         teamDictionary:{
    //             ...teamDictionary,
    //             ...newTeamObject
    //         }
    //     }
    // })

    // dispatch({
    //     type:'AddDiscussion',
    //     payload:{
    //         discussionDictionary:{
    //             ...discussionDictionary,
    //             ...discussionObject
    //         }
    //     }
    // })
  }
};

export const handleDiscussionTeam = (discussion, team, teamReducer, dispatch)=>{
  const {teamDictionary} = teamReducer;
  const teamId = discussion.team;
  const oldTeam = teamDictionary[teamId];
  const oldDiscussionIds = oldTeam.discussions;
  const discussionIdSet = new Set(oldDiscussionIds);
  discussionIdSet.add(discussion._id);

  const newTeam = {
    ...oldTeam,
    discussions: Array.from(discussionIdSet),
    numDiscussions: team.numDiscussions,
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

export const deleteDiscussion = (discussionId, teamId, teamDictionary, discussionDictionary, dispatch)=>{
  const oldTeam = teamDictionary[teamId];

  const newTeamObject = {};
  newTeamObject[teamId] = {
    ...oldTeam,
    numDiscussions: oldTeam.numDiscussions-1,
    discussions: oldTeam.discussions.filter((discussion)=>discussion!==discussionId),
  };

  delete discussionDictionary[discussionId];

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
    type: 'AddDiscussion',
    payload: {
      discussionDictionary,
    },
  });
};

export const HandleDiscussionComments = (discussionId, comments, discussionReducer, commentReducer, dispatch)=>{
  const {discussionDictionary} = discussionReducer;
  const discussion = discussionDictionary[discussionId];

  const newDiscussionObject = {};
  const oldCommentIds = discussion.comments?discussion.comments:[];
  const commentIdSet = new Set(oldCommentIds);
  comments.map((comment)=>{
    const commentId = comment._id;
    commentIdSet.add(commentId);
  });

  newDiscussionObject[discussionId] = {
    ...discussion,
    numComments: discussion.numComments+1,
    comments: Array.from(commentIdSet),
  };
  handleComments(comments, commentReducer, dispatch);
  dispatch({
    type: 'AddDiscussion',
    payload: {
      discussionDictionary: {
        ...discussionDictionary,
        ...newDiscussionObject,
      },
    },
  });
};


export const deleteComment = (commentId, discussionId, discussionDictionary, commentDictionary, dispatch)=>{
  const olddiscussion = discussionDictionary[discussionId];

  const newdiscussionObject = {};
  newdiscussionObject[discussionId] = {
    ...olddiscussion,
    numcomments: olddiscussion.numcomments-1,
    comments: olddiscussion.comments.filter((comment)=>comment!==commentId),
  };

  delete commentDictionary[commentId];

  dispatch({
    type: 'AddDiscussion',
    payload: {
      discussionDictionary: {
        ...discussionDictionary,
        ...newdiscussionObject,
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


export const handleDiscussions = (discussions, discussionReducer, dispatch)=>{
  const {discussionDictionary} = discussionReducer;

  const newDiscussionDictionary = {};

  if (discussions&&discussions.length>0) {
    discussions.map((discussion)=>{
      if (discussion&&discussion._id) {
        const discussionId = discussion._id;

        newDiscussionDictionary[discussionId] = discussion;
      }
    });

    dispatch({
      type: 'AddDiscussion',
      payload: {
        discussionDictionary: {...discussionDictionary, ...newDiscussionDictionary},
      },
    });
  }
};

