import React, { useMemo } from "react";
import LikeNotifications from "./notificationComponents/LikeNotifications";
import IssueNotifications from "./notificationComponents/IssueNotifications";

export default function useSelectNotificationComponent({
  notification,
  isActivity = false,
}) {
  const NotificationComponent = useMemo(() => {
    switch (notification?.dataModel) {
      case "Like":
        return (
          <LikeNotifications
            notification={notification}
            isActivity={isActivity}
          />
        );
        break;
      case "Issue":
        return (
          <IssueNotifications
            notification={notification}
            isActivity={isActivity}
          />
        );
        break;

      default:
        return <></>;
        break;
    }
  }, [notification, isActivity]);

  return NotificationComponent;
}
