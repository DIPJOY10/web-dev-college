const initialState = {
  codeFromUrl: "",
  accessToken: "",
  refreshToken: "",
  isSignedIn: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "DocSignAuth":
      return {
        ...state,
        codeFromUrl: action.payload,
      };

    case "SignToken":
      return {
        ...state,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
      };
    // TODO : Delete
    case "ToggleSignIn":
      return {
        ...state,
        isSignedIn: action.payload.isSignedIn,
      };

    case "DocFolderReset":
      return initialState;

    default:
      return state;
  }
};
