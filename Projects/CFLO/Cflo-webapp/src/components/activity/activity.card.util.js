import React from "react";
import { useSelector, useDispatch } from "react-redux";
import useSelectNotificationComponent from "./useSelectNotificationComponent";

function ActivityCardUtil({ activity: activityProp, actId }) {
  const activityReducer = useSelector((state) => state.activity);
  const { activityDictionary } = activityReducer;
  const activity = activityDictionary[actId] || activityProp;

  const ActivityCard = useSelectNotificationComponent({
    notification: { ...activity },
    isActivity: true,
  });
  return <>{ActivityCard}</>;
}

export default ActivityCardUtil;
