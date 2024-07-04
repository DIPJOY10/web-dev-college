import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

import Api from "../../../helpers/Api";
import arrayToReducer from "../../../helpers/arrayToReducer";
import useGetAdminProfiles from "../../profile/useGetAdminProfiles";

import ModerationNav from "./ModerationNav";
import NewJoins from "./NewJoins";

function Moderation({ match }) {
	const dispatch = useDispatch();
	const [navValue, setNavValue] = useState("new");
	const [community, setCommunity] = useState({});
	const [acceptedJoins, setAcceptedJoins] = useState();
	const [progressJoins, setProgressJoins] = useState();
	const [newJoins, setNewJoins] = useState();
	const [loading, setLoading] = useState(true);
	const location = useLocation();
	const { adminProfiles, loading: loadingAdmin } = useGetAdminProfiles();
	const [selectedProfile, setSelectedProfile] = useState(null);

	useEffect(() => {
		setSelectedProfile(adminProfiles[0]);
	}, [adminProfiles]);

	async function getCommunity() {
		try {
			setLoading(true);
			const res = await Api.post("community/get", {
				_id: match.params.communityId,
			});
			console.log("res = ", res);
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

	//add a useeffcet to filter out adminprofiles which are not mods. if length ==0 then redirect to goback()

	useEffect(() => {
		getCommunity();
	}, []);

	useEffect(() => {
		function handleAccptedUsers() {
			//   const acceptedUsersRes = await Api.post();
		}
	}, [navValue]);

	return (
		<div>
			<ModerationNav
				navValue={navValue}
				setNavValue={setNavValue}
				adminProfiles={adminProfiles}
				selectedProfile={selectedProfile}
				setSelectedProfile={setSelectedProfile}
				loading={loadingAdmin}
			/>
			{(() => {
				switch (location.search) {
					case "?members":
						return null;
					case "?requests":
						return <NewJoins />;
					case "?approved":
						return null;
					case "?rejected":
						return null;
					case "?about":
						return null;
					default:
						// redirect to members
						return null;
				}
			})()}
		</div>
	);
}

export default Moderation;
