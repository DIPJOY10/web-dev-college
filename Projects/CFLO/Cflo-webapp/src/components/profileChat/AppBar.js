import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useMediaQuery } from '@material-ui/core';
import { useParams, useHistory } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import { Typography } from '@material-ui/core';
import ButtonBase from '@material-ui/core/ButtonBase';
import EditIcon from '@material-ui/icons/Edit';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CameraAltIcon from '@material-ui/icons/CameraAlt';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import GroupInfoDrawer from "./GroupInfoDrawer";
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles((theme) => ({
  avatarStyle: {
    height: "35px",
    width: "35px"
  },
  nameBox: {
    fontSize: "16px",
    fontWeight: "520",
    marginLeft: "15px",
    display: "flex",
    alignItems: "center",
  },
  nameChainingStyle: {
    width: "100%",
    fontSize: "12px",
    marginLeft: "15px",
    whiteSpace: "nowrap",
    overflow: "hidden",
  },
  moreOptions: {
    position: "absolute",
    right: "10px",
    top : "-1px",
    color: "white",
  },
  infoDataStyle: {
    maxWidth: "100%"
  }
}));

const Appbar = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const history = useHistory();
  const {
    conversationId, conversationDictionary,
    setConversationDictionary, profile,
    getProfileChat, loadingBool, setLoadingBool
  } = props;

  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const isOnlyMd = useMediaQuery(theme.breakpoints.only('md'));
  const [groupInfoOpen, setGroupInfoOpen] = useState(false)
  let currentConversation = conversationDictionary[conversationId]

  let primaryUser;
  let displayPicture;
  let displayName;

  if (conversationId) {
    const conversation = conversationDictionary[conversationId];

    if (conversation && conversation.participants) {
      const participants = conversation.participants;

      const otherUsers = participants.filter((participant) => (participant._id !== profile?._id));

      primaryUser = otherUsers[0];
      if (primaryUser) {
        displayName = primaryUser?.parent?.displayName;
        displayPicture = primaryUser?.parent?.displayPicture;
      }
    }
  }
  else {
    if (primaryUser) {
      displayName = primaryUser?.parent?.displayName;
      displayPicture = primaryUser?.parent?.displayPicture;
    }
  }

  let nameChaining = ""
  let allParticipants = currentConversation?.participants

  allParticipants?.length > 0 && allParticipants.map((participant, i) => {

    if (i === allParticipants?.length - 1) {
      nameChaining = nameChaining + participant?.parent?.displayName
    } else {
      nameChaining = nameChaining + participant?.parent?.displayName + ","
    }

  })



  return (
    <>
      {conversationId || primaryUser ? (
        <>
          {currentConversation?.type === "Group" ? (<>
            <Avatar
              alt={displayName}
              src={conversationDictionary[conversationId]?.groupDP?.url}
              className={classes.avatarStyle}
              onClick={() => {
                if (primaryUser?._id) {
                  const path = '/profile/' + primaryUser?._id;
                  history.push(path);
                }
              }}
            />
          </>) : (<>
            <Avatar
              alt={displayName}
              src={displayPicture?.thumbUrl}
              className={classes.avatarStyle}
              onClick={() => {
                if (primaryUser?._id) {
                  const path = '/profile/' + primaryUser?._id;
                  history.push(path);
                }
              }}
            />
          </>)}

          {currentConversation?.type === "Group" ? (<>
            <div className={classes.infoDataStyle} >
              <div className={classes.nameBox}>
                {currentConversation?.groupName}
              </div>
              <Typography className={classes.nameChainingStyle}>
                {nameChaining}
              </Typography>
            </div>
          </>) : (<>
            <Typography className={classes.nameBox}>
              {displayName}
            </Typography>
          </>)}

          {currentConversation?.type === "Group" &&
            <>
              <IconButton
                className={classes.moreOptions}
                onClick={() => { setGroupInfoOpen(true) }}
              >
                <MoreVertIcon />
              </IconButton>
              <GroupInfoDrawer
                setGroupInfoOpen={setGroupInfoOpen}
                groupInfoOpen={groupInfoOpen}
                conversationDictionary={conversationDictionary}
                conversationId={conversationId}
                setConversationDictionary={setConversationDictionary}
                getProfileChat={getProfileChat}
                setLoadingBool={setLoadingBool}
              />
            </>
          }

        </>) : (<>
          <ButtonBase >
            <Avatar
              alt={"displayName"}
              className={classes.avatarStyle}
            />
          </ButtonBase>
          <Typography className={classes.nameBox}>
          </Typography>
        </>)}
    </>
  );
};

export default Appbar;
