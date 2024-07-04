import moment from 'moment';
import Api from '../../helpers/Api';
import _ from 'lodash';
import { setProfiles } from '../profile/profile.utils';
import arrayToReducer from '../../helpers/arrayToReducer';

export const convSort = (convIds, convDict) => {
  const filteredArr = convIds.filter(convId => {
    return convDict[convId]?.topMessage?.createdAt
  })

  const newArrIds = filteredArr.sort((aId, bId) => {
    const a = new Date(convDict[aId].topMessage.createdAt);
    const b = new Date(convDict[bId].topMessage.createdAt);
    return b - a;
  });

  return newArrIds
}


export const setConvAndMessages = (convs, state, dispatch, front, reset) => {
  const {
    chat,
  } = state;

  const {
    conversationIds: oldConversationIds,
    conversationDictionary: oldConversationDictionary,
  } = chat;



  if (convs.length > 0) {

    let {
      newDict, idArr
    } = arrayToReducer(convs)

    console.log(newDict, ' is the newDict, idArr is ', idArr, oldConversationDictionary, ' is the conversationDictionary');

    dispatch({
      type: 'AddChat',
      payload: {
        conversationIds: reset ? idArr : (
          front ? _.uniq([...idArr, ...oldConversationIds])
            : _.uniq([...oldConversationIds, ...idArr])),
        conversationDictionary: {
          ...oldConversationDictionary,
          ...newDict,
        },
      },
    });
  }
};

export const conversationToTop = (conversationId, state, dispatch) => {
  console.log('conToTOp before api call');

  Api.post('chat/conversationDetail', {
    conversationId: conversationId,
  }).then((res) => {
    const convMessage = res.result;
    console.log(convMessage, ' is convMessage in convToTop');
    setConvAndMessages([convMessage], state, dispatch, true);
  });
};

const conversationDetail = (conversationId, chat, dispatch) => {
  Api.post('chat/conversationDetail', {
    conversationId: conversationId,
  }).then((res) => {
    const {
      conversationDictionary: oldConversationDictionary,
      messageMap: oldMessageMap,
      messageDictionary: oldMessageDictionary,
    } = chat;

    const conversationDictionary = {};
    const messageMap = {};
    const messageDictionary = {};

    if (res?.result?.conversation && res.result.messages.length > 0) {
      const {
        conversation, messages,
      } = res?.result;

      if (conversation?.topMessage?._id && messages?.length > 0) {
        const conversationId = conversation?._id;
        conversationDictionary[conversationId] = conversation;

        const messageIds = messages.map((message) => {
          const messageId = message?._id;
          messageDictionary[messageId] = message;
          return messageId;
        });

        messageMap[conversationId] = messageIds;


        dispatch({
          type: 'AddChat',
          payload: {
            conversationDictionary: {
              ...oldConversationDictionary,
              ...conversationDictionary,
            },
            messageMap: {
              ...oldMessageMap,
              ...messageMap,
            },
            messageDictionary: {
              ...oldMessageDictionary,
              ...messageDictionary,

            },
          },
        });
      }
    }
  });
};

const conversationSeen = (userId, conversationId, chat, dispatch) => {
  Api.post('chat/lastSeen', {
    conversationId: conversationId,
    userId: userId,
  }).then((res) => {
    // console.log(res,' is the res')
    const { conversationDictionary } = chat;
    const oldConversation = conversationDictionary[conversationId];
    const newConversationObject = {};
    newConversationObject[conversationId] = {
      ...oldConversation,
      lastSeen: res.lastSeen,
    };
    const newConversationDictionary = {
      ...conversationDictionary,
      ...newConversationObject,
    };

    dispatch({
      type: 'SendMessage',
      payload: {
        conversationDictionary: newConversationDictionary,
      },
    });
  });
};

const addMessage = (message, chat, dispatch) => {
  const { conversationDictionary, conversationIds } = chat;
  const conversationId = message.conversation;
  const conversation = conversationDictionary[conversationId];
  const messages = conversation?.messages ? conversation.messages : [];


  // put messages in set, add message
  const newMessages = new Set(messages);
  newMessages.add(message);
  const array = Array.from(newMessages);
  const newConversation = {
    ...conversation,
    topMessage: message,
    messages: array,
  };
  const newConversationObject = {};
  newConversationObject[conversationId] = newConversation;
  const newConversationDictionary = {
    ...conversationDictionary,
    ...newConversationObject,
  };

  conversationToTop(conversation, chat, dispatch);

  dispatch({
    type: 'SendMessage',
    payload: {
      conversationDictionary: newConversationDictionary,
    },
  });
};


const prepareMessagesSlack = (conversationId, state) => {
  const dates = new Set([]);
  const dateMessages = new Map();
  const {
    chat, profile,
  } = state;
  const { conversationDictionary, messageMap, messageDictionary } = chat;
  const { profileDictionary } = profile;
  const conversation = conversationDictionary[conversationId];


  if (conversation && conversation.participants) {
    const messageIds = messageMap[conversationId] || [];
    let messages = messageIds.map((messageId) => {
      return messageDictionary[messageId];
    });


    if (messages?.length > 0) {
      const length = messages.length;
      // if array is already reversed don't reverse again
      if (length > 1) {
        const firstMessageCreatedAt = new Date(messages[0].createdAt);
        const secondMessageCreatedAt = new Date(messages[1].createdAt);
        if (secondMessageCreatedAt - firstMessageCreatedAt < 0) {
          messages = messages.reverse();
        }
      }

      messages.map((message, index) => {
        const date = message.createdAt;
        const dateFormat = moment(date).format('DD MMM YYYY');
        dates.add(dateFormat);
        const user = message.user;
        if (dateMessages.has(dateFormat)) {
          const dayMessages = dateMessages.get(dateFormat);
          const arrayLength = dayMessages.length;
          const lastBlock = dayMessages[arrayLength - 1];

          if (lastBlock?.user?._id === user) {
            // if last block is of same type just add in array

            lastBlock.messages.push(message);
            dateMessages.set(dateFormat, dayMessages);
          }
          else {
            // create new block if type is different and push in parent array


            if (profileDictionary[user] && profileDictionary[user].parent) {
              const newBlock = {
                user: profileDictionary[user].parent,
                messages: [message],
              };
              dayMessages.push(newBlock);
            }
          }
        }
        else {
          if (profileDictionary[user] && profileDictionary[user].parent) {
            const newDayMessageObject = {
              user: profileDictionary[user].parent,
              messages: [message],
            };

            dateMessages.set(dateFormat, [newDayMessageObject]);
          }
        }
      });
    }
  }

  return {
    dates: Array.from(dates),
    dateMessages,
  };
};

const prepareMessages = (userId, conversationId, chat) => {
  const dates = new Set([]);
  const dateMessages = new Map();
  const { conversationDictionary } = chat;
  const conversation = conversationDictionary[conversationId];

  if (conversation) {
    let messages = conversation.messages;


    if (messages?.length > 0) {
      const length = messages.length;
      // if array is already reversed don't reverse again
      if (length > 1) {
        const firstMessageCreatedAt = new Date(messages[0].createdAt);
        const secondMessageCreatedAt = new Date(messages[1].createdAt);
        if (secondMessageCreatedAt - firstMessageCreatedAt < 0) {
          messages = messages.reverse();
        }
      }

      messages.map((message, index) => {
        const date = message.createdAt;
        const dateFormat = moment(date).format('DD MMM YYYY');
        dates.add(dateFormat);
        const type = (userId === message.user) ? 'right' : 'left';

        if (dateMessages.has(dateFormat)) {
          const dayMessages = dateMessages.get(dateFormat);
          const arrayLength = dayMessages.length;
          const lastBlock = dayMessages[arrayLength - 1];

          if (lastBlock.type === type) {
            // if last block is of same type just add in array

            lastBlock.messages.push(message);
            dateMessages.set(dateFormat, dayMessages);
          }
          else {
            // create new block if type is different and push in parent array
            const newBlock = {
              type,
              messages: [message],
            };
            dayMessages.push(newBlock);
          }
        }
        else {
          const newDayMessageObject = {
            type,
            messages: [message],
          };

          dateMessages.set(dateFormat, [newDayMessageObject]);
        }
      });
    }
  }

  return {
    dates: Array.from(dates),
    dateMessages,
  };
};

const initiateChat = (userId, chat, conversations, dispatch) => {
  // getting data from Chat, initializing local variables in map and set
  if (userId && conversations) {
    let conversationIds = new Set([]);
    let userConversation = new Map();
    let conversationDictionary = new Map();
    let otherUserIds = new Set([]);

    // getting data from new conversation and use in above maps & sets

    conversations.map((conversation) => {
      const conversationId = conversation._id;
      if (conversation?.participants) {
        const participantIds = conversation.participants.map((participant) => {
          return participant._id;
        });

        const otherParticipantUserIds = participantIds.filter((participantId) => (participantId !== userId));

        otherParticipantUserIds.map((otherUserId) => {
          if (userConversation.has(otherUserId)) {
            const conversationSet = new Set(userConversation.get(otherUserId));
            conversationSet.add(conversationId);
            userConversation.set(otherUserId, conversationSet);
          }
          else {
            const conversationSet = new Set([conversationId]);
            userConversation.set(otherUserId, conversationSet);
            otherUserIds.add(otherUserId);
          };
        });

        conversationDictionary.set(conversationId, conversation);
        conversationIds.add(conversationId);
      }
    });

    // putting values back from (Set & Maps) to Array and objects

    conversationIds = Array.from(conversationIds);
    conversationDictionary = Object.fromEntries(conversationDictionary.entries());
    userConversation = Object.fromEntries(userConversation.entries());

    otherUserIds = Array.from(otherUserIds);
    otherUserIds.map((otherUserId) => {
      const conversationSet = userConversation[otherUserId];
      userConversation[otherUserId] = Array.from(conversationSet);
    });

    const chatObject = {
      conversationIds,
      conversationDictionary,
      userConversation,
      otherUserIds,
    };

    dispatch({
      type: 'SetChat',
      payload: chatObject,
    });

    return chatObject;
  }
};

const handleChatData = (userId, chat, conversations, dispatch) => {
  // getting data from Chat, initializing local variables in map and set
  if (userId && conversations) {
    const oldConversationDictionary = chat.conversationDictionary;
    const oldConversationIds = chat.conversationIds;
    const oldUserConversation = chat.userConversation;
    let conversationIds = new Set(oldConversationIds);
    let userConversation = new Map(Object.entries(oldUserConversation));
    let conversationDictionary = new Map(Object.entries(oldConversationDictionary));
    let otherUserIds = new Set(chat.otherUserIds);

    // getting data from new conversation and use in above maps & sets

    conversations.map((conversation) => {
      const conversationId = conversation._id;
      const participantIds = conversation.participants.map((participant) => {
        return participant._id;
      });

      const otherParticipantUserIds = participantIds.filter((participantId) => (participantId !== userId));

      otherParticipantUserIds.map((otherUserId) => {
        if (userConversation.has(otherUserId)) {
          const conversationSet = new Set(userConversation.get(otherUserId));
          conversationSet.add(conversationId);
          userConversation.set(otherUserId, conversationSet);
        }
        else {
          const conversationSet = new Set([conversationId]);
          userConversation.set(otherUserId, conversationSet);
          otherUserIds.add(otherUserId);
        };
      });

      conversationDictionary.set(conversationId, conversation);
      conversationIds.add(conversationId);
    });

    // putting values back from (Set & Maps) to Array and objects

    conversationIds = Array.from(conversationIds);
    conversationDictionary = Object.fromEntries(conversationDictionary.entries());
    userConversation = Object.fromEntries(userConversation.entries());

    otherUserIds = Array.from(otherUserIds);
    otherUserIds.map((otherUserId) => {
      const conversationSet = userConversation[otherUserId];
      userConversation[otherUserId] = Array.from(conversationSet);
    });

    const chatObject = {
      conversationIds,
      conversationDictionary,
      userConversation,
      otherUserIds,
    };

    dispatch({
      type: 'SetChat',
      payload: chatObject,
    });

    return chatObject;
  }
};

export default {
  conversationDetail,
  conversationSeen,
  addMessage,
  prepareMessagesSlack,
  prepareMessages,
  initiateChat,
  handleChatData,
};
