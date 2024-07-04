const initialState = {
  paymentScheduleDictionary: {},
  paymentMilestoneDictionary: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'AddSchedule':

      return {
        ...state,
        ...action.payload,
      };


    case 'ScheduleReset':
      return initialState;

    default:
      return state;
  }
};
