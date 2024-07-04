const initialState = {
  jobDictionary: {},
  jobIds: [],
  postDictionary: {},
  postIds: [],
  investmentIds: [],
  investmentDictionary: {},
  people: false,
  personIds: [],
  personDictionary: {},
  peopleCalled: false,
  peopleCalledAt: null,
  falseValue: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'AddFeed':
      return {
        ...state,
        ...action.payload,
      };

    case 'FeedReset':
      return initialState;

    default:
      return state;
  }
};
