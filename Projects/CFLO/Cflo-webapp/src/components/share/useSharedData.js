import React, { useState, useEffect } from "react";
import arrayToReducer from "../../helpers/arrayToReducer";
import Api from "../../helpers/Api";

export default function useSharedData(props) {
	const { shared } = props;

	const [loadingShared, setLoading] = useState(false);
	const [oldShared, setOldShared] = useState([]);
	const [sharedDict, setSharedDict] = useState({});
	const [assignableIds, setAssignableIds] = useState([]);

	const processProfiles = (profiles) => {
		var profileArr = [];

		profiles.map((profile) => {
			if (profile?.parentModelName == "User") {
				profileArr.push(profile);
			} else {
				const team = profile?.parent?.team;

				var newProfile = {
					...profile,
					team: team?._id,
				};

				const participants = team?.participants;
				if (participants) {
					profileArr = [...profileArr, newProfile, ...participants];
				}
			}
		});

		const { newDict, idArr } = arrayToReducer(profileArr);

		setOldShared(shared);
		setSharedDict(newDict);
		setAssignableIds(idArr);
	};

	const getProfiles = async () => {
		if (shared?.length > 0) {
			setLoading(true);
			const res = await Api.post("shared/assignable", {
				shared,
			});
			setLoading(false);
			// console.log(res, " is the profilegetres");

			if (res?.data) {
				const profiles = res?.data;
				processProfiles(profiles);
			}
		} else {
			setOldShared([]);
		}
	};

	useEffect(() => {
		if (oldShared?.length <= shared?.length) {
			getProfiles();
		} else {
			setOldShared(shared);
		}
	}, [shared?.length]);

	return {
		sharedDict,
		assignableIds,
		loadingShared,
	};
}
