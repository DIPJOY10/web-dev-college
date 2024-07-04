const initialState = {
  discussionDictionary: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'AddDiscussion':

      return {
        ...state,
        ...action.payload,
      };

    case 'DiscussionReset':
      return initialState;

    default:
      return state;
  }
};
