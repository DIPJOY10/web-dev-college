import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import JoinCard from "./JoinCard";

import Api from "../../../helpers/Api";
import arrayToReducer from "../../../helpers/arrayToReducer";

function NewJoin() {
	const dispatch = useDispatch();
	const params = useParams();
	const { moderation, auth } = useSelector((state) => state);
	const moderationCommunity = moderation?.selectedCommunity;
	const { newJoinIds, newJoinDict, progressJoinIds, progressJoinDict } =
		moderation;
	const [community, setCommunity] = useState(undefined);
	const [loading, setLoading] = useState(true);

	// console.log("moderationReducer", moderation);

	async function getCommunity() {
		try {
			console.log("moderationGetCommunity");
			setLoading(true);
			console.log("matchParams", params);
			const res = await Api.post("community/get", {
				_id: params.communityId,
			});
			console.log("moderationSelectedCommunity", res);
			setCommunity(res.data);
			dispatch({
				type: "AddModeration",
				payload: {
					selectedCommunity: res?.data || {},
				},
			});
			setLoading(false);
		} catch (error) {
			if (error.response) {
				console.log(error);
			} else if (error.request) {
				console.log(error);
			} else {
				console.log(error);
			}
		}
	}

	async function getJoins() {
		if (!community?.profile?._id) return;
		let joins = await Api.post("join/communityJoins", {
			communityProfile: community?.profile?._id,
			status: "new",
		});
		const newJoins = joins?.joins;
		if (newJoins) {
			const { idArr: newJoinIdsTemp, newDict: newJoinDictTemp } =
				arrayToReducer(newJoins);
			dispatch({
				type: "AddModeration",
				payload: {
					newJoins,
					newJoinIds: newJoinIdsTemp,
					newJoinDict: newJoinDictTemp,
				},
			});
		}

		joins = await Api.post("join/communityJoins", {
			communityProfile: community?.profile?._id,
			status: "progress",
		});
		const progressJoins = joins?.joins;
		if (progressJoins) {
			const {
				idArr: progressJoinIdsTemp,
				newDict: progressJoinDictTemp,
			} = arrayToReducer(progressJoins);
			dispatch({
				type: "AddModeration",
				payload: {
					progressJoins,
					progressJoinIds: progressJoinIdsTemp,
					progressJoinDict: progressJoinDictTemp,
				},
			});
		}

		console.log("moderationJoins", joins);
	}

	async function updateProgress(id) {
		const joins = await Api.post("join/updateProgress", {
			joinIds: [id] || [],
		});
	}

	useEffect(() => {
		if (moderationCommunity?._id) setCommunity(moderationCommunity);
		else getCommunity();
	}, [moderationCommunity?._id]);

	useEffect(() => {
		getJoins();
	}, [community?._id]);

	return (
		<div>
			<div
				style={{
					backgroundColor: "white",
					margin: "1rem 0",
					border: "1px solid lightgray",
					borderRadius: "13px",
					overflow: "hidden",
				}}
			>
				{newJoinIds.map((id) => {
					return newJoinDict[id] ? (
						<JoinCard
							key={id}
							join={newJoinDict[id]}
							updateProgress={updateProgress}
						/>
					) : (
						<></>
					);
				})}

				{progressJoinIds.map((id) => {
					return progressJoinDict[id] ? (
						<JoinCard key={id} join={progressJoinDict[id]} />
					) : (
						<></>
					);
				})}
			</div>
		</div>
	);
}

export default NewJoin;
