import React, { useMemo } from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { Link, useHistory } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import MuiAlert from "@material-ui/lab/Alert";

import MentionOutput from "../../styled/mention.output";

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

function NotificationBody({ link, notification }) {
  const classes = useStyles();
  const history = useHistory();

  return (
    <Link to={link} className={classes.link} onClick={history.push(link)}>
      <Alert icon={false} severity="info">
        <div className={classes.flex}>
          <Avatar
            alt={notification?.user?.displayName}
            src={notification?.user?.displayPicture?.thumbUrl}
          />
          <div style={{ marginLeft: "20px" }}>
            <div>{notification?.title}</div>
            <Typography variant="caption" display="block">
              <MentionOutput text={notification?.body} />
            </Typography>
          </div>
        </div>
      </Alert>
    </Link>
  );
}

export default NotificationBody;
