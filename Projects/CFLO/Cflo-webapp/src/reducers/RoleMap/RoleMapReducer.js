const initialState = {
  roleMapDictionary: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'AddRoleMap':

      return {
        ...state,
        ...action.payload,
      };

    case 'RoleMapReset':
      return initialState;

    default:
      return state;
  }
};
