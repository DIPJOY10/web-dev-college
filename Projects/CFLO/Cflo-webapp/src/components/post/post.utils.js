import React from "react";
import NotificationAlert from "../activity/NotificationAlert";
import { useSelector, useDispatch } from "react-redux";

{
  /* <Link
        to={`/explore/forum/post/${notification?._id}`}
        className={classes.link}
      >
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
      </Link> */
}
const handlePostNotification = (activity, state, dispatch) => {
  switch (activity.type) {
    case "PostLiked":
      break;
    default:
      break;
  }
};

export default {
  handlePostNotification,
};
