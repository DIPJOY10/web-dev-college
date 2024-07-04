const initialState = {
  selectedCommunity: {},
  acceptedJoins: [],
  acceptedJoinIds: [],
  acceptedJoinDict: {},
  progressJoins: [],
  progressJoinIds: [],
  progressJoinDict: {},
  newJoins: [],
  newJoinIds: [],
  newJoinDict: {},
};

export default (state = initialState, action) => {
  //   console.log("moderationReducer In", action);
  switch (action.type) {
    case "AddModeration":
      return {
        ...state,
        ...action.payload,
      };

    case "resetModeration":
      return {
        ...initialState,
      };

    default:
      return state;
  }
};
