import React, { useEffect, useRef, useState } from "react";
import Api from "../../helpers/Api";

function useGetProject(profileId) {
	const [projectArray, setProjectArray] = React.useState([]);
	const [loading, setLoading] = React.useState(false);
	const getApi = async () => {
		setLoading(true);
		const res = await Api.post("issue/project/getAll", {
			profileId: profileId,
		});
		if (res?.data) {
			const data = res?.data;
			setProjectArray(data);
		}
		setLoading(false);
	};

	useEffect(() => {
		getApi();
	}, [profileId]);

	return { loading, projectArray };
}

export default useGetProject;
