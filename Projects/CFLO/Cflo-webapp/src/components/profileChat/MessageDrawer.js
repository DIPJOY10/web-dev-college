import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';
import TimeBar from './TimeBar';
import _ from 'lodash';
import Api from "../../helpers/Api";
import ChatMsgSlack from './ChatMsgSlack';
import arrayToReducer from '../../helpers/arrayToReducer';
import FilesViewer from '../file/Viewer/FilesViewer';
import CloseIcon from '@material-ui/icons/Close';
import { updateDeleteFlagForSingleFiles } from './apiCall';


const useStyles = makeStyles((theme) => ({
  root: {
    boxShadow: '0 1px 1px 1px #eeeeee',
    paddingTop: '2rem',
    paddingBottom: '5rem',
    overflow: 'auto',
    width: '100%',
    height: `calc(100vh - 118px)`,
    overflowX: 'hidden',
    backgroundColor: 'white',
    [theme.breakpoints.down('sm')]: {
      height: `calc(100vh - 120px)`,
    }
  },
  paper: {
    padding: '1rem',
  },
  chatImgViewCont: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatImgViewContWithShadow: {
    width: '95%',
    height: '100%',
    display: 'flex',
    boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
    justifyContent: 'center',
    alignItems: 'center',
    position: "relative",
    paddingTop: "22px",
    overflowY: "auto",
  },
  imgCancleBtn: {
    position: "absolute",
    top: "20px",
    right: "25px",
  },
  sendImgCont: {
    maxWidth: '100%',
    maxHeight: '84%',
  }
}));

const MessageDrawer = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);
  const messageListRef = useRef(null);
  const [dates, setDates] = useState([]);
  const [dateMessages, setDateMessages] = useState({});
  var dateNow = new Date();
  const [timeOldest, setTimeOldest] = useState(dateNow)
  const [allLoaded, setAllLoaded] = useState(false)

  const {
    conversation, messageMap, messageDictionary,
    addMsgHelper, removeImgFromReducerAndDelete
  } = props;

  const { createdFileIds } = useSelector((state) => state.file);

  const conversationId = conversation?._id
  const participants = conversation?.participants || [];
  const { newDict: profileDict } = arrayToReducer(participants)
  const messageIds = messageMap[conversationId];

  const processMsgs = () => {
    if (messageIds?.length > 0) {
      const sortMsgIds = messageIds?.sort((a, b) => {
        var aMsg = messageDictionary[a]
        var bMsg = messageDictionary[b]
        return new Date(aMsg?.createdAt) - new Date(bMsg?.createdAt)
      })

      const len = sortMsgIds?.length
      const a = sortMsgIds[0]
      const oldestMsg = messageDictionary[a]
      setTimeOldest(oldestMsg?.createdAt || dateNow)

      const groupMsgs = _.groupBy(sortMsgIds, (msgId) => {
        const item = messageDictionary[msgId]
        const date = item?.createdAt;
        return moment(date).format('DD MMM YYYY')
      })
      const newDates = Object.keys(groupMsgs)

      setDates(newDates)
      setDateMessages(groupMsgs)
    }
  }

  useEffect(() => {
    processMsgs()
  }, [messageIds?.length, conversation?._id])

  const getMoreMsgs = async () => {
    const res = await Api.post('chat/getMoreMessages', {
      conversationId, timeOldest
    })
    var data = res?.data

    if (data?.messages.length > 0) {
      var messages = data?.messages;
      console.log("all messages", messages)
      addMsgHelper(messages, conversationId, false)
      if (messages.length < 30) {
        setAllLoaded(true)
      }
    } else {

    }
  }

  useEffect(() => {
    getMoreMsgs()
  }, [conversation?._id])

  useEffect(() => {
    if (messageListRef) {
      messageListRef.current.addEventListener('DOMNodeInserted', event => {
        const { currentTarget: target } = event;
        target.scroll({ top: target.scrollHeight, behavior: 'smooth' });
      });
    }
  }, [])


  const handleScroll = () => {
    const scrollTop = messageListRef.current.scrollTop;
    console.log('scrolling ', scrollTop)
    if (!allLoaded && scrollTop == 0) {
      getMoreMsgs()
    }
  };

  const removeSingleImgFromReducerAndDelete = async (selectedId) => {
    const filteredFileIds = createdFileIds.filter(id => id != selectedId);

    dispatch({
      type: "AddFile",
      payload: {
        createdFileIds: [...filteredFileIds],
      },
    });

    await updateDeleteFlagForSingleFiles({ fileId: selectedId })
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      })
  }


  return (
    <div className={classes.root} ref={messageListRef} onScroll={handleScroll}>
      {createdFileIds.length > 0 ? (
        <div className={classes.chatImgViewCont} >
          <div className={classes.chatImgViewContWithShadow} >
            <ButtonBase
              className={classes.imgCancleBtn}
              onClick={() => { removeImgFromReducerAndDelete() }} >
              <CloseIcon />
            </ButtonBase>
            <div className={classes.sendImgCont} >
              <FilesViewer
                fileIds={createdFileIds}
                deletable={true}
                styleBody={{
                  width: '65%',
                  height: 'auto',
                }}
                handler={removeSingleImgFromReducerAndDelete}
              />
            </div>
          </div>
        </div>
      ) : (<>
        {dates.map((date, index) => {
          const dayMessageIds = dateMessages[date];
          const dayMessages = dayMessageIds.map(msgId => messageDictionary[msgId]) || []
          if (dayMessages && dayMessages.length > 0) {
            return (
              <div key={index} square className={classes.paper}>
                <TimeBar date={date} />
                {dayMessages.map((message) => {
                  const profileId = message?.user;
                  const profile = profileDict[profileId];
                  return (
                    <ChatMsgSlack
                      profile={profile}
                      message={message}
                    />
                  );
                })
                }
              </div>
            );
          }
          else {
            return null;
          }
        })
        }
      </>)}
    </div>
  );
};

export default MessageDrawer;
