const initialState = {
  selectedFilePaths: [],
  selectedFileDictionary: {},
  createdFileIds: [],
  fileDictionary: {},
  allFileIds: [],
  newFileIds: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "AddFile":
      // console.log(' in File reducer ',action.payload)
      return {
        ...state,
        ...action.payload,
      };

    case "SetFiles":
      // console.log(' in File reducer ',action.payload)
      return {
        ...state,
        fileDictionary: {
          ...state.fileDictionary,
          ...action.payload,
        },
      };

    case "FileReset":
      return initialState;

    case "FileUploadReset":
      return {
        fileDictionary: state.fileDictionary,
        selectedFilePaths: [],
        selectedFileDictionary: {},
        createdFileIds: [],
      };

    default:
      return state;
  }
};
