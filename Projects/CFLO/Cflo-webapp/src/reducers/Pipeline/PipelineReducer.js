const initialState = {
  pipelineDictionary: {},
  pipelineIds: [],
  jobIds: [],
  defaultJobId: null,
  defaultInvestorId: null,
  defaultTaskId: null,
  defaultIssueId: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'AddPipeline':
      return {
        ...state,
        ...action.payload,
      };

    case 'PipelineReset':
      return initialState;

    default:
      return state;
  }
};
