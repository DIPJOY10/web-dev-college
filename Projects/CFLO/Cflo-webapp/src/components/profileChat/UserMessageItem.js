import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AvatarLocal from '../profile/avatar';
import { Typography } from '@material-ui/core';
import { useParams, useHistory } from 'react-router-dom';
import moment from 'moment';
import Avatar from "@material-ui/core/Avatar";


const useStyles = makeStyles((theme) => ({
  msgSingleContact: {
    width: "100%",
    borderBottom: "1px solid #E1E2E5",
    display: "flex",
    padding: "10px",
    position: "relative",
    cursor: "pointer",
  },
  selectedMsgSingleContact: {
    width: "100%",
    borderBottom: "1px solid #E1E2E5",
    display: "flex",
    padding: "10px",
    position: "relative",
    backgroundColor: "#62B9ED",
    color: "#F7F7F6",
    cursor: "pointer",
  },
  msgNameAndTimeCont: {
    marginLeft: "15px"
  },
  msgNameAndTime: {
    display: "flex",
    justifyContent: "space-between",
  },
  timeStamp: {
    position: "absolute",
    top: "10px",
    right: "10px",
    fontSize: "13px"
  },
  contactName: {
    fontSize: "15px",
    fontWeight: "520"
  },
  lastMsg: {
    fontSize: "13px",
  },
  avatarSty: {
    height: "35px",
    width: "35px"
  }
}));

const UserMessageListItem = (props) => {
  const {
    conversationId, conversationDictionary, profile,
    selectedConversation, setSelectedConversation,
    handleDrawerToggle, setSelectedUsers
  } = props;
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const profileId = profile?._id;

  const [currentConv, setCurrentConv] = useState()

  useEffect(() => {
    setCurrentConv(conversationDictionary[conversationId])
  }, [conversationDictionary[conversationId]])

  const conversation = conversationDictionary[conversationId];

  let displayName;
  let primaryUser;
  let otherUsers;

  if (conversation && conversation.participants) {
    const participants = conversation.participants;
    otherUsers = participants.filter((participant) => (participant._id !== profileId));

    if (otherUsers.length > 0) {
      primaryUser = otherUsers[0];
      displayName = primaryUser?.parent?.displayName;
    }
  }

  let text = conversation?.topMessage?.text.slice(0, 40);
  if (text?.length == 40) {
    text = text + '...';
  }

  return (
    <>
      <div
        className={selectedConversation === conversationId ? classes.selectedMsgSingleContact : classes.msgSingleContact}
        onClick={() => {
          setSelectedConversation(conversationId);
          setSelectedUsers(null)
          if (handleDrawerToggle) {
            handleDrawerToggle(conversationId)
          }
        }}
      >
        {conversation?.type === "Group" ? (<>
          <Avatar
            alt="userPic"
            size={"large"}
            className={classes.avatarSty}
            src={currentConv?.groupDP?.url}
          />
        </>) : (<>
          <AvatarLocal
            alt="userPic"
            size={"large"}
            className={classes.avatarSty}
            src={primaryUser?.parent?._id && primaryUser?.parent}
          />
        </>)}
        <div className={classes.msgNameAndTimeCont} >
          <div className={classes.msgNameAndTime} >
            {conversation?.type === "Group" ? (<>
              <Typography className={classes.contactName} >
                {conversation?.groupName}
              </Typography>
            </>) : (<>
              <Typography className={classes.contactName} >
                {displayName}
              </Typography>
            </>)}
            <Typography className={classes.timeStamp} >{moment(conversation?.topMessage?.createdAt).format('DD MMM YYYY')}</Typography>
          </div>
          <Typography className={classes.lastMsg} >{text}</Typography>
        </div>
      </div>
    </>
  );
};

export default UserMessageListItem;
