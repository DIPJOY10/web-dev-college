export const activityHandler = (activity, state, dispatch) => {
  console.log(activity, " is activity handler");
  dispatch({
    type: "AddActivity",
    payload: {
      showNotification: true,
      newNotification: activity,
    },
  });
  // switch (activity.parentModelName) {
  //   case "Team":
  //     teamHandler(activity, state, dispatch);
  //     break;
  //   case "Post":
  //     postHandler(activity, state, dispatch);
  //     break;

  //   default:
  //     break;
  // }
};
