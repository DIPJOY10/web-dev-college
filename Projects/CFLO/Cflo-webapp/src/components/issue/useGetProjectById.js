import React, { useEffect, useRef, useState } from "react";
import Api from "../../helpers/Api";

function useGetProjectById(projectId) {
	const [project, setProject] = React.useState([]);
	const [Loading, setLoading] = React.useState(false);
	const getApi = async () => {
		setLoading(true);
		const res = await Api.post("issue/project/getProject", {
			projectId: projectId,
		});
		if (res?.data) {
			const data = res?.data;
			setProject(data[0]);
		}
		setLoading(false);
	};

	useEffect(() => {
		getApi();
	}, [projectId]);

	return { Loading, project };
}

export default useGetProjectById;
