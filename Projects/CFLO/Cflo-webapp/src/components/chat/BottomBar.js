import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
  makeStyles,
  useTheme,
} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import SendIcon from '@material-ui/icons/Send';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import ButtonBase from '@material-ui/core/ButtonBase';
import InputBase from '@material-ui/core/InputBase';
import Api from '../../helpers/Api';
import FileUploadButton from '../file/Uploader/FileUploadButton';
import ChatUtils, {conversationToTop} from './chatUtils';
import {
  useHistory,
} from 'react-router-dom';
import FilesViewer from '../file/Viewer/FilesViewer';

const attachBarWidthRem = 2;
const sendBarWidthRem = 3;
const minusTotalWidth = attachBarWidthRem + sendBarWidthRem;

const {handleChatData, addMessage, conversationDetail} = ChatUtils;

const useStyles = makeStyles((theme) => ({
  bottomBar: {
    flex: 1,
    width: '100%',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'row',
    minHeight: '4rem',
    maxHeight: '7rem',
    backgroundColor: 'white',
    position: 'fixed',
    zIndex: theme.zIndex.appBar,
    bottom: 0,
    boxShadow: '0 2px 3px 3px #eeeeee',

  },
  attachBar: {
    width: '4rem',
    display: 'flex',
    height: '100%',
    padding: '1rem',
    justifyContent: 'center',
    alignItems: 'center',
  },
  attachIcon: {
    fontSize: 26,
  },
  textAreaBar: {
    width: '35rem',
    paddingLeft: '1rem',
    paddingTop: '0.8rem',
    fontSize: 16,
    color: '#424242',
  },
  sendBar: {
    width: '4rem',
    height: '4rem',
    alignSelf: 'center',
    display: 'flex',

  },
  sendIcon: {
    fontSize: 34,
  },
}));

const BottomBar = (props)=>{
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const [text, setText] = useState('');
  const {conversationId} = props;
  const state = useSelector((state)=>state);
  const {user} = useSelector((state)=>state.auth);
  const chat = useSelector((state)=>state.chat);
  const {createdFileIds} = useSelector((state)=>state.file);
  const {profileDictionary, selectedProfileId} = useSelector((state)=>state.profile);
  const {conversationDictionary} = chat;
  const profileId = user.profile;
  let conversation;
  let messages;

  if (conversationId) {
    conversation = conversationDictionary[conversationId];
    if (conversation) {
      messages = conversation.messages;
    }
  }


  const sendMessage = ()=>{
    console.log('before sendMessageCalled');
    Api.post('chat/message', {
      conversation: conversationId,
      user: profileId,
      text,
      files: createdFileIds,
    }).then((message)=>{
      setText('');
      dispatch({type: 'FileUploadReset'});
      console.log('conToTOp before fn call');
      conversationToTop(conversationId, state, dispatch);
    })
        .catch((err)=>{
          // console.log(' send message failed with error ',err)
        });
  };

  const initiateConversation = ()=>{
    console.log('initiate conv getting called');


    Api.post('chat/initiateConversation', {
      participants: [profileId, selectedProfileId],
      user: profileId,
      text,
      files: createdFileIds,
    }).then((res)=>{
      const conversation = res.result;
      setText('');
      dispatch({type: 'FileUploadReset'});
      conversationToTop(conversation._id, state, dispatch);
      const path = '/messages/'+conversation._id;
      history.push(path);
    });
  };

  return (
    <div className={classes.bottomBar}>

      <div className={classes.attachBar}>
        <FileUploadButton
          parentType='Message'
          used={false}
          parentId={null}
        />
        {/* <AttachFileIcon color="primary" className={classes.attachIcon} />                                */}
      </div>


      <div
        className={classes.textBar}>

        <InputBase
          multiline
          rowsMax={5}
          value={text}
          placeholder={'Start your message here'}
          onChange={(event)=>setText(event.target.value)}
          className={classes.textAreaBar}
        />
        <FilesViewer fileIds={createdFileIds} />
      </div>


      <ButtonBase className={classes.sendBar} onClick={()=>{
        console.log('called send ', conversationId, selectedProfileId);
        if (conversationId) {
          sendMessage();
        }
        else if (selectedProfileId) {
          initiateConversation();
        }
      }}>
        <div>
          <SendIcon color="primary" className={classes.sendIcon} />
        </div>
      </ButtonBase>


    </div>

  );
};

export default BottomBar;
