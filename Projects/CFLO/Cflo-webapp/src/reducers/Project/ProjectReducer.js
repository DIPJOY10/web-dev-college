const initialState = {
  projectIds: [],
  projectDictionary: {},
  tenantRelationDictionary: {},
  topProjectInfoIds: [],
  topProjectInfoDictionary: {},
  projectOwner: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'AddProject':
      // console.log('payload in add project ',action.payload)
      return {
        ...state,
        ...action.payload,
      };

    case 'ProjectReset':
      return initialState;

    default:
      return state;
  }
};
