import Api from '../../helpers/Api';
import {setIssues} from '../issue/issue.utils';


export const addComment = (comment, parentOld, state, parentDictionary, dispatch, dispatchType) => {
  Api.post('comment/create', comment).then((res) => {
    const {comment, parent} = res.result;
    const numComments = parent.numComments ? parent.numComments : 1;
    const newParent = {
      ...parentOld,
      numComments,
    };
    HandleParentComments([comment], newParent, true, parentDictionary, state, dispatch, dispatchType);
  });
};

export const parentUpdate = (comment, newParent, state, dispatch) => {
  const {task: taskReducer, issue: issueReducer, discussion: discussionReducer, dashboard} = state;

  const parentId = comment.parent;
  const model = comment.parentModelName;
  let callback = null;
  let reducer = null;
  let oldParent = null;

  switch (model) {



    case 'Issue': {
      callback = setIssues;
      reducer = issueReducer;
      const {issueDictionary} = reducer;
      oldParent = issueDictionary[parentId];
      const newParentObject = {
        ...oldParent,
        comments: newParent.comments,
      };

      callback([newParentObject], reducer, dispatch);
      break;
    }

    default:
      break;
  }
};

export const addCommentInParent = (commentObject, state, dispatch) => {
  const {comment: commentReducer} = state;
  return new Promise(function(resolve, reject) {
    Api.post('comment/createInParent', commentObject)
        .then((res) => {
          const {comment, parent} = res.result;
          parentUpdate(comment, parent, state, dispatch);
          handleComments([comment], commentReducer, dispatch);
          resolve({
            comment,
            parent,
          });
        })
        .catch((err) => {
          reject(err);
        });
  });
};

export const update = (commentObject, state, dispatch) => {
  const {comment: commentReducer} = state;
  return new Promise(function(resolve, reject) {
    Api.post('comment/update', commentObject)
        .then((comment) => {
          handleComments([comment], commentReducer, dispatch);
          resolve({
            comment,
          });
        })
        .catch((err) => {
          reject(err);
        });
  });
};

export const getCommentByIds = (commentIds, commentReducer, dispatch) => {
  return new Promise(function(resolve, reject) {
    Api.post('comment/getByIds', {
      comments: commentIds,
    })
        .then((res) => {
          const comments = res.result;
          // console.log(comments,' is the comments')
          handleComments(comments, commentReducer, dispatch);
          resolve(comments);
        })
        .catch((err) => {
          reject(err);
        });
  });
};

export const getComments = (parentType, parentOld, state, parentDictionary, dispatch, dispatchType) => {
  Api.post('comment/getComments', {
    parent: parentOld._id,
    model: parentType,
  }).then((comments) => {
    HandleParentComments(comments, parentOld, false, parentDictionary, state, dispatch, dispatchType);
  });
};

export const handleComments = (comments, commentReducer, dispatch) => {
  const {commentDictionary} = commentReducer;

  const newCommentDictionary = {};

  if (comments && comments.length > 0) {
    comments.map((comment) => {
      const commentId = comment._id;

      newCommentDictionary[commentId] = comment;
    });

    dispatch({
      type: 'AddComment',
      payload: {
        commentDictionary: {...commentDictionary, ...newCommentDictionary},
      },
    });
  }
};

export const HandleParentComments = (comments, parent, addInFront, parentDictionary, state, dispatch, dispatchType) => {
  if (comments && comments.length > 0) {
    const comment = comments[0];

    const {comment: commentReducer} = state;

    const parentId = parent._id;

    const newParentObject = {};
    const oldcommentIds = parent?.commentIds ? parent.commentIds : [];
    const newcommentIds = comments.map((comment) => {
      const commentId = comment._id;
      return commentId;
    });

    let totalcommentIds = [];

    if (addInFront) {
      totalcommentIds = [...newcommentIds, ...oldcommentIds];
    }
    else {
      totalcommentIds = [...oldcommentIds, ...newcommentIds];
    }

    // remove null values
    totalcommentIds = totalcommentIds.filter((commId) => commId);

    // remove duplicates
    const totalSet = new Set(totalcommentIds);
    // console.log(comments,newcommentIds,oldcommentIds,totalcommentIds,' is the totalcommentIds')

    newParentObject[parentId] = {
      ...parent,
      commentIds: Array.from(totalSet),
    };

    handleComments(comments, commentReducer, dispatch);
    dispatch({
      type: dispatchType,
      payload: {
        parentDictionary: {
          ...parentDictionary,
          ...newParentObject,
        },
      },
    });
  }
};
