import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import SendIcon from '@material-ui/icons/Send';
import { Typography, useMediaQuery } from '@material-ui/core';
import ButtonBase from '@material-ui/core/ButtonBase';
import InputBase from '@material-ui/core/InputBase';
import Api from '../../helpers/Api';
import TextField from '@material-ui/core/TextField';
import FileUploadButton from '../file/Uploader/FileUploadButton';
import { useHistory } from 'react-router-dom';
import Picker from 'emoji-picker-react';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';

const useStyles = makeStyles((theme) => ({
  bottomBar: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F4F5F6',
    padding: "5px 20px",
    paddingRight: "30px",
    position: "relative",
    [theme.breakpoints.down('sm')]: {
      padding: "5px 10px",
    },
    [theme.breakpoints.down('xs')]: {
      position: "absolute",
      bottom: "60px",
      zIndex: "999999999999999",
      width: "100vw"
    },
  },
  textBar: {
    width: '82%'
  },
  textAreaBar: {
    width: '100%',
    // height: "60px",
    // padding: '10px 20px',
    fontSize: "16px",
    backgroundColor: '#ffffff',
    borderRadius: "15px",
    [theme.breakpoints.down('sm')]: {
      width: '96%',
    },
  },
  sendBar: {
    alignSelf: 'center',
    display: 'flex',
  },
  sendIcon: {
    fontSize: 34
  },
}));

const BottomBar = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const theme = useTheme();
  const [text, setText] = useState('');
  const [emojiPickerToggal, setEmojiPickerToggal] = useState(false);
  const { conversationId, profile, addMsgHelper, removeImgFromReducer } = props;
  const chat = useSelector((state) => state.chat);
  const { createdFileIds } = useSelector((state) => state.file);
  const profileId = profile?._id;

  const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  const isXs = useMediaQuery(theme.breakpoints.down('xs'));

  const onEmojiClick = (event, emojiObject) => {
    setText(text + emojiObject.emoji);
  };

  const sendMessage = async () => {
    setEmojiPickerToggal(false);
    const res = await Api.post('chat/message', {
      conversation: conversationId,
      user: profileId,
      text,
      files: createdFileIds,
    })

    setText('');
    const data = res?.data
    const msgs = data?.messages
    if (msgs?.length > 0) {
      var conv = data?.conversation
      addMsgHelper(msgs, conv, true);
    }

  };

  return (
    <div className={classes.bottomBar}>
      <FileUploadButton
        parentType='Message'
        used={false}
        parentId={null}
      />
      {emojiPickerToggal &&
        <Picker
          pickerStyle={
            isXs ? { position: "absolute", bottom: "70px", width: "100%", left: "0px", right: "0px" } :
              isSm ? { position: "absolute", bottom: "-4px", width: "100%", left: "0px", right: "0px" } :
                { position: "absolute", bottom: "63px", width: "100%", left: "0px", right: "0px" }
          }
          onEmojiClick={onEmojiClick}
        />}
      <InsertEmoticonIcon style={{ color: "#2296F3" }} onClick={() => setEmojiPickerToggal(!emojiPickerToggal)} />
      <div className={classes.textBar}>
        {/* <InputBase
          multiline
          rowsMax={5}
          value={text}
          placeholder={'Start your message here'}
          onChange={(event) => setText(event.target.value)}
          className={classes.textAreaBar}
        /> */}
        <TextField
          id="outlined-multiline-static"
          size="small"
          multiline
          rows={1}
          value={text}
          placeholder={'Start your message here'}
          onChange={(event) => setText(event.target.value)}
          className={classes.textAreaBar}
          variant="outlined"
        />
      </div>
      <ButtonBase className={classes.sendBar} onClick={() => {
        if (conversationId) {
          if (text?.length > 0 || createdFileIds?.length > 0) {
            sendMessage();
          }
        }
        removeImgFromReducer()
      }}>
        <div>
          <SendIcon color="primary" className={classes.sendIcon} />
        </div>
      </ButtonBase>
    </div>
  );
};

export default BottomBar;
