import S from "../../components/appbar/notification";

const initialState = {
  activityDictionary: {},
  topNotificationIds: [],
  showNotification: false,
  newNotification: null,
  apiAlert: null,
};

export default (state = initialState, action) => {
  //   console.log("activityReducer", { state, payload: action.payload });
  // topNotificationIds
  //topNotificationIds
  //   console.log(action, "B0efore Setting =====================");
  switch (action.type) {
    case "AddApiAlert":
      return {
        ...state,
        apiAlert: {
          ...action?.payload,
          createdAt: new Date(),
        },
      };
      break;

    case "AddActivity":
      return {
        ...state,
        ...action.payload,
      };
      break;

    case "ActivityReset":
      return initialState;
      break;

    default:
      return state;
  }
};
