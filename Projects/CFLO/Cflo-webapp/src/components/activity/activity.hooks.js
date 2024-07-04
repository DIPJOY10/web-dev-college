import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Api from "../../helpers/Api";
import { setActivities } from "./activity.utils";

export const useGetUserNotification = () => {
	const dispatch = useDispatch();
	const activity = useSelector((state) => state.activity);
	const { user } = useSelector((state) => state.auth);
	const { teamIds } = useSelector((state) => state.team);
	const [actIds, setActIds] = useState([]);

	useEffect(() => {
		if (teamIds && teamIds.length > 0 && user && user._id) {
			Api.post("notification/get", {
				profile: user?.profile,
			}).then((notificationsResponse) => {
				const notifications = notificationsResponse.notifications;
				if (notifications && notifications.length > 0) {
					const activities = notifications.map((el) => el.activity);
					//   console.log("activities in hook", activities);

					const activityIds = setActivities(
						activities,
						activity,
						dispatch
					);
					dispatch({
						type: "AddActivity",
						payload: {
							topNotificationIds: activityIds,
						},
					});
				}
			});
		}
	}, [teamIds, user]);

	return actIds;
};

export const useGetTeamActivities = (teamIds, limit, skip) => {
	const dispatch = useDispatch();
	const activity = useSelector((state) => state.activity);
	const [actIds, setActIds] = useState([]);

	useEffect(() => {
		if (teamIds && teamIds.length > 0) {
			Api.post("activity/team", {
				teamIds,
				limit,
				skip,
			}).then((activities) => {
				if (activities && activities.length > 0) {
					//   console.log({ activities });
					const activityIds = setActivities(
						activities,
						activity,
						dispatch
					);
					setActIds(activityIds);
				}
			});
		}
	}, [teamIds, limit, skip]);

	return actIds;
};

export const useGetMyActivities = (limit, skip) => {
	const dispatch = useDispatch();
	const [actIds, setActIds] = useState([]);
	const activity = useSelector((state) => state.activity);
	const { user } = useSelector((state) => state.auth);
	const userId = user._id;

	useEffect(() => {
		if (userId) {
			Api.post("activity/my", {
				user: userId,
				limit,
				skip,
			}).then((activities) => {
				if (activities && activities.length > 0) {
					const activityIds = setActivities(
						activities,
						activity,
						dispatch
					);
					setActIds(activityIds);
				}
			});
		}
	}, [userId, limit, skip]);

	return actIds;
};
