import React, {useEffect, useState} from 'react';
import UserMessageItem from './UserMessageItem';
import NewUserMessageItem from './NewUserMessageItem';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';

import {useParams, useHistory} from 'react-router-dom';
import Api from '../../helpers/Api';
import {convSort, setConvAndMessages} from './chatUtils';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
  },
}));

const UserMessageList = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const {conversationId} = useParams();
  const {user} = useSelector((state) => state.auth);
  const chat = useSelector((state) => state.chat);
  const state = useSelector((state) => state);
  const {selectedProfileId} = useSelector((state) => state.profile);
  const history = useHistory();
  const {conversationIds, conversationDictionary } = chat;
  const {initConvo} = props;
  const [sortedConvIds, setSortedConvId] = useState(conversationIds);
  const [convId, setConvId] = useState(conversationId);


  useEffect(() => {
    if (conversationIds && conversationIds.length > 1) {
      let newArrIds = convSort(conversationIds, conversationDictionary)
      setSortedConvId(newArrIds);
      dispatch({
        type: 'AddChat',
        payload: {
          conversationIds: newArrIds,
        },
      });
    }
  }, [conversationIds.length]);

  useEffect(() => {
    if (selectedProfileId) {
      Api.post('chat/mutual', {
        userId: user?._id,
        personId: selectedProfileId,
      }).then((res) => {
        const convAndMessages = res.result;

        if (convAndMessages?.length > 0) {
          const convAndMessage = convAndMessages[0];
          const conv = convAndMessage.conversation;
          setConvId(conv?._id);
          const convPath = conv?._id ? '' + conv._id : '';
          const path = '/messages/' + convPath;
          history.push(path);
          setConvAndMessages(convAndMessages, state, dispatch);
          dispatch({
            type: 'AddProfile',
            payload: {
              selectedProfileId: null,
            },
          });
        }
        else {
        }
      });
    }
  }, []);

  return (
    <div className={classes.root}>
      {!convId && selectedProfileId ? <NewUserMessageItem /> : <></>}
      {sortedConvIds.map((conversationId) => {
        return <UserMessageItem key={conversationId} conversationId={conversationId} />;
      })}
    </div>
  );
};

export default UserMessageList;
