const initialState = {
  docDictionary: {},
  docFolderDictionary: {},
  createDoc: {},
  createDocFolder: {},
  tempDoc: null,
  tempFolder: null,
  avialableTemplates: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "CreateDoc":
      return {
        ...state,
        createDoc: action.payload,
      };

    case "CreateDocFolder":
      return {
        ...state,
        createDocFolder: action.payload,
      };

    case "AddDoc":
      // console.log(action.payload,' is docReducer')
      return {
        ...state,
        ...action.payload,
      };

    case "DocReset":
      return initialState;

    case "AddDocFolder":
      // console.log(action.payload,' is docReducer')
      return {
        ...state,
        ...action.payload,
      };

    case "AddAvialableTemplates":
      // console.log(action.payload, "=============== is availalbe");
      return {
        ...state,
        ...action.payload.avialableTemplates,
      };

    case "DocFolderReset":
      return initialState;

    default:
      return state;
  }
};
