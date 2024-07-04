import _ from 'lodash';

export const setPosts = (posts, dashboard, dispatch, front) => {
  const {postIds, postDictionary} = dashboard;
  if (posts && posts.length > 0) {
    const newPostIds = [];
    const newPostDictionary = [];
    posts.forEach((post) => {
      const postId = post._id;
      newPostIds.push(postId);
      newPostDictionary[postId] = post;
    });

    const postIdSet = front ? new Set(_.concat(newPostIds, postIds)) : new Set(_.concat(postIds, newPostIds));

    dispatch({
      type: 'AddDashboard',
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
