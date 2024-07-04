const initialState = {
  applicationIds: [],
  appDictionary: {},
  jobDictionary: {},
  jobIds: [],
  jobDraftIds: [],
  jobPublishedIds: [],
  postDictionary: {},
  postIds: [],
  postDraftIds: [],
  postPublishedIds: [],
  selectedPost: {},
  userJobIds: [],
  selectedJobCats: [],
  selectedPropCats: [],
  jobCats: [],
  jobCatDictionary: {},
  investmentIds: [],
  investmentDraftIds: [],
  investmentPublishedIds: [],
  investmentDictionary: {},
  propCats: [],
  propCatDictionary: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "AddDashboard":
      return {
        ...state,
        ...action.payload,
      };

    case "DashboardReset":
      return initialState;

    default:
      return state;
  }
};
