import { useState, useEffect } from "react";
import Api from "../../helpers/Api";
import arrayToReducer from "../../helpers/arrayToReducer";

function useProfileIssueData(profileId) {
	const [issueIds, setIssueIds] = useState([]);

	const [issueDictionary, setIssueDictionary] = useState({});
	const [totalIssues, setTotalIssues] = useState(0);

	const [loading, setLoading] = useState(false);

	const getData = async () => {
		setLoading(true);

		const res = await Api.post("issue/getProfileIssues", {
			profile: profileId,
		});

		const data = res.data;
		// console.log("data from backend new ", data);

		setLoading(false);

		if (data) {
			const issues = data.issues;
			const length = data.issueLength;

			const { newDict, idArr } = arrayToReducer(issues);

			setIssueIds(idArr);
			setIssueDictionary(newDict);
			setTotalIssues(length);
		}
	};

	useEffect(() => {
		if (profileId) {
			getData();
		}
	}, [profileId]);

	return {
		issueIds,
		setIssueIds,
		issueDictionary,
		setIssueDictionary,
		totalIssues,
		loading,
	};
}

export default useProfileIssueData;
