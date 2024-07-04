import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import Typography from "@material-ui/core/Typography";

import MentionOutput from "../styled/mention.output";
import LikeNotifications from "./notificationComponents/LikeNotifications";
import IssueNotifications from "./notificationComponents/IssueNotifications";
import useSelectNotificationComponent from "./useSelectNotificationComponent";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  link: {
    textDecoration: "none",
  },
  flex: {
    display: "flex",
    alignItems: "center",
  },
}));

function NotificationAlert() {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const { activity } = state;
  const { showNotification, newNotification } = activity;

  const [notification, setNotification] = useState(() => newNotification);
  const [open, setOpen] = useState(false);
  const [display, setDisplay] = useState(false);

  // const NotificationComponent = useMemo(() => {
  //   switch (newNotification?.dataModel) {
  //     case "Like":
  //       return <LikeNotifications notification={notification} />;
  //       break;
  //     case "Issue":
  //       return <IssueNotifications notification={notification} />;
  //       break;

  //     default:
  //       return <></>;
  //       break;
  //   }
  // }, [newNotification]);
  const NotificationComponent = useSelectNotificationComponent({
    notification,
  });

  const classes = useStyles();
  useEffect(() => {
    setNotification(newNotification);
    setDisplay(true);
  }, [newNotification]);

  useEffect(() => {
    // console.log("hello in alert");
    if (display) setOpen(true);
  }, [notification]);
  //   console.log({ activity });

  function handleClose() {
    setOpen(false);
  }
  return (
    <Snackbar
      // className={classes.snackBar}
      open={open}
      autoHideDuration={4000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      {NotificationComponent}
    </Snackbar>
  );
}

export default NotificationAlert;
