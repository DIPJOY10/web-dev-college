import React, { useEffect, useRef, useState } from "react";
import Api from "../../helpers/Api";
import arrayToReducer from "../../helpers/arrayToReducer";

function useGetFolders(profileId) {
	const [folderIds, setFolderIds] = useState([]);
	const [folderDictionary, setFolderDictionary] = useState({});

	const [loadingFolder, setLoading] = useState(false);
	const getApi = async () => {
		setLoading(true);

		const res = await Api.post("doc/folder/get", {
			profileId: profileId,
		});

		if (res?.data) {
			const folders = res?.data;
			const { newDict: newTempDict, idArr: idTempArr } =
				arrayToReducer(folders);
			setFolderIds(idTempArr);
			setFolderDictionary(newTempDict);
		}
		setLoading(false);
	};

	useEffect(() => {
		if (profileId) {
			getApi();
		}
	}, [profileId]);

	return {
		folderIds,
		setFolderIds,
		folderDictionary,
		setFolderDictionary,
		loadingFolder,
	};
}

export default useGetFolders;
