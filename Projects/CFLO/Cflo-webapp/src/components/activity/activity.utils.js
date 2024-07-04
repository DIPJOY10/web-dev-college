import Api from "../../helpers/Api";
import _ from "lodash";
import arrayToReducer from "../../helpers/arrayToReducer";

export const topNotification = (activity, activityReducer, dispatch) => {
  const { activityDictionary, topNotificationIds } = activityReducer;
  const activityId = activity?._id;

  const newTopNotificationIds = [
    activityId,
    ...(Array.isArray(topNotificationIds) ? topNotificationIds : []),
  ];

  const newActivityDictionary = { ...activityDictionary };
  newActivityDictionary[activityId] = activity;
  dispatch({
    type: "AddActivity",
    payload: {
      activityDictionary: { ...newActivityDictionary },
      topNotificationIds: [...newTopNotificationIds],
    },
  });
};

export const setActivities = (activites, activityReducer, dispatch) => {
  const { activityDictionary } = activityReducer;
  const newActivityDictionary = {};
  const activityIds = [];
  activites.map((activity) => {
    const activityId = activity._id;
    activityIds.push(activityId);
    newActivityDictionary[activityId] = activity;
  });

  const activityIdSet = new Set(activityIds);

  dispatch({
    type: "AddActivity",
    payload: {
      activityDictionary: {
        ...activityDictionary,
        ...newActivityDictionary,
      },
    },
  });

  return Array.from(activityIdSet);
};

export const getTeamActivities = async () => {};
