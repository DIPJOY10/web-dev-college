const initialState = {
  joinedCommunities: [],
  joinedCommunitiesIds: [],
  joinedCommunitiesDict: {},
  joinedCommunitiesPosts: [],
  joinedCommunitiesPostsIds: [],
  joinedCommunitiesPostsDict: {},
  suggestedCommunities: [],
  suggestedCommunitiesIds: [],
  suggestedCommunitiesDict: {},
  moderationCommunities: [],
  moderationCommunitiesIds: [],
  moderationCommunitiesDict: {},
  selectedCommunity: {},
  popularPosts: [],
  popularPostsIds: [],
  popularPostsDict: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "AddForum":
      return {
        ...state,
        ...action.payload,
      };
    case "ResetForum":
      return initialState;

    default:
      return state;
  }
};
