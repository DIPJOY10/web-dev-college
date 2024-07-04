const initialState = {
  conversationIds: [],
  conversationDictionary: {},
  messageMap: {},
  messageDictionary: {},
  otherUserIds: [],
  userConversation: new Map(),
  selectedPersonId: false,
  selectedConversation: false,
  updatedAt: null,
  isConversationView: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'AddChat':
      return {
        ...state,
        ...action.payload,
      };

    case 'findOrCreateBotConversation':

      return {
        ...state,
        user: action.user,
      };

    case 'ChatReset':
      return initialState;

    case 'SetChat':
      return {
        ...state,
        conversationIds: action.payload.conversationIds,
        conversationDictionary: action.payload.conversationDictionary,
        otherUserIds: action.payload.otherUserIds,
        userConversation: action.payload.userConversation,
      };

    case 'SendMessage':
      return {
        ...state,
        ...action.payload,
      };

    case 'SelectPerson':
      return {
        ...state,
        selectedPersonId: action.payload.selectedPersonId,
      };

    case 'ToggleView':
      return {
        ...state,
        isConversationView: action.payload,
      };

    default:
      return state;
  }
};
