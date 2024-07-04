import {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import ChatUtils from './chatUtils';
import Api from '../../helpers/Api';

const { setConvAndMessages } = ChatUtils;

function useChatSocket(profileId, convId, selectedProfileId ) {
    const dispatch = useDispatch();
    const chat = useSelector((state)=>state.chat);
    const { conversationDictionary } = chat;

    useEffect(() => {

    }, []);

    const sendMessage = async ()=>{
        await Api.post('chat/message',{
            conversation:'622b50a46aaad0229c7a3eab',
            user:user?.profile,
            text
       })
    }
}

export default useChatSocket;

