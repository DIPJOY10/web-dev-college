import React, { useEffect, useRef, useState } from "react";
import Api from "../../helpers/Api";
import arrayToReducer from "../../helpers/arrayToReducer";

function useGetDocs(profileId) {
	const [docIds, setDocIds] = useState([]);
	const [loadingDocs, setLoading] = useState(false);
	const [docDictionary, setDocDictionary] = useState({});

	const getApi = async () => {
		setLoading(true);
		const a = new Date();
		const res = await Api.post("doc/get", {
			profileId: profileId,
		});
		const b = new Date();

		if (res?.data) {
			const docs = res?.data;
			const { newDict: newTempDict, idArr: idTempArr } =
				arrayToReducer(docs);
			setDocIds(idTempArr);
			setDocDictionary(newTempDict);
		}
		setLoading(false);
	};

	useEffect(() => {
		if (profileId) {
			getApi();
		}
	}, [profileId]);

	return {
		docIds,
		setDocIds,
		docDictionary,
		setDocDictionary,
		loadingDocs,
	};
}

export default useGetDocs;
