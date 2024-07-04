import {useState, useEffect} from 'react';
import socket from '../../helpers/socket/socketio';
import {useSelector, useDispatch} from 'react-redux';
import ChatUtils from './chatUtils';
import Api from '../../helpers/Api';

const {addMessage, handleChatData, conversationToTop} = ChatUtils;

function useChatSocket(userId) {
  const dispatch = useDispatch();
  const chat = useSelector((state)=>state.chat);


  useEffect(() => {
    const onMessage = 'onMessage/'+userId;
    const onNewConversation = 'onNewConversation/'+userId;


    socket.on(onMessage, (data) => {
      const message = data.message;
      addMessage(message, chat, dispatch);
    });

    socket.on(onNewConversation, (data) => {
      const conversation = data.conversation;
      const participants = conversation.participants;

      Api.post('profile/userProfileDetail', {
        userIds: participants,
      }).then((res)=>{
        const participants = res.result;
        conversation.participants = participants;
        // handleChatData(userId,chat,[conversation],dispatch);
        // conversationToTop(conversation,chat,dispatch);
      });
    });
  }, [userId, dispatch, chat]);
}

export default useChatSocket;
