import { useState, useEffect } from "react";
import Api from "../../helpers/Api";
import arrayToReducer from "../../helpers/arrayToReducer";

export default function useProfileMoreIssueData(profileId, page) {
	const [moreIssueIds, setMoreIssueIds] = useState([]);
	const skip = page + 2;
	// (page - 1) * 25;
	const [moreIssueDictionary, setMoreIssueDictionary] = useState({});
	const [loading, setLoading] = useState(false);
	try {
		const getData = async () => {
			setLoading(true);

			const res = await Api.post("issue/getMoreIssues", {
				profile: profileId,
				skip: skip,
			});

			const data = res.data;
			// console.log("data from backend new ", data);

			setLoading(false);

			if (data) {
				const issues = data.issues;

				const { newDict, idArr } = arrayToReducer(issues);

				setMoreIssueIds(idArr);
				setMoreIssueDictionary(newDict);
			}
		};

		useEffect(() => {
			getData();
		}, []);
	} catch (error) {
		console.log("more issues error", error);
	}

	return {
		moreIssueIds,
		setMoreIssueIds,
		moreIssueDictionary,
		setMoreIssueDictionary,
		loading,
	};
}
