import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link,
	useParams,
	useHistory,
} from "react-router-dom";
import Api from "../../helpers/Api";

function useDocDetail() {
	const { docId } = useParams();

	const docReducer = useSelector((state) => state.doc);
	const reducerDoc = docReducer?.tempDoc;
	const oldDoc = reducerDoc?._id == docId ? reducerDoc : null;
	const oldTitle = oldDoc?.title || "";
	const oldDescription = oldDoc?.description || "";
	const oldFiles = oldDoc?.files || [];
	const oldShared = oldDoc?.shared || [];
	const oldVersions = oldDoc?.versions || [];

	const [doc, setDoc] = useState(oldDoc);
	const [title, setTitle] = useState(oldTitle);
	const [description, setDescription] = useState(oldDescription);
	const [files, setFiles] = useState(oldFiles);
	const [shared, setShared] = useState(oldShared);
	const [versions, setVersions] = useState(oldVersions);
	const [loading, setLoading] = useState(false);
	const [isPrivate, setPrivate] = useState(false);

	const getDocDetail = async () => {
		setLoading(true);
		// console.log("sending id to backend: ", docId);
		const res = await Api.post("/doc/getDocDetail/withfile", {
			docId,
		});
		// console.log(res, " is the doc");
		if (res?.data) {
			const data = res.data[0];
			setDoc(data);
			setTitle(data.title);
			setDescription(data.description);
			setFiles(data.files);
			setShared(data.shared);
			setVersions(data.versions);
		}
		// console.log("res.data in doc = ", res?.data);
		setLoading(false);
	};

	useEffect(() => {
		getDocDetail();
	}, []);

	return {
		doc,
		setDoc,
		title,
		setTitle,
		description,
		setDescription,
		files,
		setFiles,
		versions,
		setVersions,
		isPrivate,
		setPrivate,
	};
}

export default useDocDetail;
