import { useState, useEffect } from "react";
import socket from "./socketio";
import { useSelector, useDispatch } from "react-redux";
import { topNotification } from "../../components/activity/activity.utils";
import { activityHandler } from "./activityHandler";

function useSocketHook(profileId) {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const activity = useSelector((state) => state.activity);
  const { user } = state?.auth;
  useEffect(() => {
    const path = "profile/" + profileId;
    socket.removeListener(path);
    socket.on(path, (data) => {
      console.log("Socket here: ", { data, activity });
      switch (data.type) {
        case "Activity":
          if (profileId == user?.profile) {
            topNotification(data.payload, activity, dispatch);
            activityHandler(data.payload, state, dispatch);
          }
          break;

        default:
          break;
      }
    });
  }, [
    profileId,
    activity?.topNotificationIds?.length,
    activity?.activityDictionary,
  ]);
}

export default useSocketHook;
