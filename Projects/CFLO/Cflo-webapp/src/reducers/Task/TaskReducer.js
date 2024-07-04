const initialState = {
  taskDictionary: {},
  taskMapIds: [],
  taskMapDictionary: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'AddTask':
      return {
        ...state,
        ...action.payload,
      };

    case 'TaskReset':
      return initialState;

    default:
      return state;
  }
};
