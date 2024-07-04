import React, { useMemo } from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { Link, useHistory } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import MuiAlert from "@material-ui/lab/Alert";

import MentionOutput from "../../styled/mention.output";
import NotificationBody from "./NotificationBody";
import ActivityCard from "../activity.card";

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

function IssueNotifications({ notification, isActivity }) {
  const classes = useStyles();
  const history = useHistory();
  const NotificationComponent = useMemo(() => {
    const Component = isActivity ? ActivityCard : NotificationBody;
    // const Component = isActivity ? NotificationBody : NotificationBody;
    //`/explore/forum/post/${notification?.parent?._id}`
    console.log("issueNotification", isActivity);

    switch (notification?.type) {
      case "IssueCreated":
        return (
          <Component
            link={`/issue/view/${notification?.parent?._id}`}
            notification={{ ...notification }}
            activity={{ ...notification }}
            actId={notification?._id}
          />
        );
        break;
      default:
        return <></>;
    }
  }, [notification, isActivity]);
  return <div>{NotificationComponent}</div>;
}

export default IssueNotifications;
