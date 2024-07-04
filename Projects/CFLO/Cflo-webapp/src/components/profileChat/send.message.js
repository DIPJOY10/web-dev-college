import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import ActionBtnCircle from "../action.btn.circle";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import ButtonBase from "@material-ui/core/ButtonBase";
import Typography from "@material-ui/core/Typography";
import cx from "clsx";
import Button from "@material-ui/core/Button";

import {
  Dialog,
  DialogTitle,
  IconButton,
  InputBase,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import AvatarLocal from "../profile/avatar";
import { MailOutline } from "@material-ui/icons";
import ProfileSelect from "../styled/profile.select";
import SendIcon from "@material-ui/icons/Send";
import Api from "../../helpers/Api";

const useStyles = makeStyles((theme) => ({
  textAreaBar: {
    maxWidth: "30rem",
    width: "90vw",
    paddingLeft: "1rem",
    margin: "0.5rem 1rem",
    paddingTop: "0.8rem",
    fontSize: 16,
    height: "6rem",
    color: "#424242",
    backgroundColor: "#ebf9fa",
  },

  avatar: {
    height: "1.9rem",
    width: "1.9rem",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
  },
  sendIcon: {
    fontSize: 28,
  },
}));

export default function SendMessage(props) {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");

  const { adminProfiles, senderProfile, setSenderProfile, receiverProfile } =
    props;

  const { row } = classes;

  const initConv = async () => {
    const recProfileId = receiverProfile.profile;
    const senderProfileId = senderProfile.profile;
    const participantIds = [senderProfileId, recProfileId];

    const participantsRole = [
      {
        user: { _id : recProfileId },
        role: "Admin"
      },
      {
        user: { _id : senderProfileId },
        role: "Admin"
      }
    ]

    const convObj = {
      participants: participantIds,
      participantsRole,
      user: senderProfileId,
      type: "Private",
      text,
    };

    const res = await Api.post("chat/initConv", convObj);
    if (res?.data) {
      const data = res?.data;
      const conversation = data?.conversation;
      var path = `/profile/chat/${senderProfileId}/${conversation?._id}`;
      history.push(path);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button
        style={{ textTransform: "none" }}
        variant="contained"
        color="primary"
        startIcon={<MailOutline />}
        onClick={() => {
          setOpen(true);
        }}
      >
        Message
      </Button>
      {/* <ActionBtnCircle
        actionFn={() => {
          setOpen(true);
        }}
      >
        <MailOutline color="primary" />
      </ActionBtnCircle> */}
      <Dialog open={open} onClose={() => handleClose()}>
        <List dense={true}>
          <ListItem>
            <ListItemIcon>
              <AvatarLocal src={receiverProfile} className={classes.avatar} />
            </ListItemIcon>
            <ListItemText>
              <b> Message {receiverProfile?.displayName}</b>
            </ListItemText>
          </ListItem>
        </List>

        <InputBase
          multiline
          rowsMax={5}
          value={text}
          placeholder={"Start your message here"}
          onChange={(event) => setText(event.target.value)}
          className={classes.textAreaBar}
        />

        <div className={classes.row}>
          <div className={classes.row}></div>
          <ProfileSelect
            owner={senderProfile}
            adminProfiles={adminProfiles}
            displayOwner={true}
            hideTitle={true}
            title={"Message As"}
            onChange={(value) => {
              setSenderProfile(value);
            }}
          />
          <div>
            <IconButton
              variant="outlined"
              onClick={() => {
                initConv();
              }}
            >
              <SendIcon color="primary" className={classes.sendIcon} />
            </IconButton>
          </div>
        </div>
      </Dialog>
    </>
  );
}
