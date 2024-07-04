const initialState = {
  backdropVisible: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'ShowBackdrop':
      return {
        ...state,
        backdropVisible: true,
      };

    case 'HideBackdrop':
      return {
        ...state,
        backdropVisible: false,
      };

    default:
      return state;
  }
};
