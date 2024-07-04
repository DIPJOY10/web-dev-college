const initialState = {
  commentDictionary: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'AddComment':
      return {
        ...state,
        ...action.payload,
      };

    case 'CommentReset':
      return initialState;

    default:
      return state;
  }
};
