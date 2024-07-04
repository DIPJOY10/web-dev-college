import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Api from "../../helpers/Api";

import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link,
	useParams,
	useHistory,
} from "react-router-dom";
import TaskList from "../task/smart.task.list";
import { LinearProgress } from "@material-ui/core";
import ProfileIssueEdit from "./profile.issue.edit";
import ProfileIssueView from "./profile.issue.view";
import { Loadinglogo } from "../../helpers/loadinglogo";

const useStyles = makeStyles((theme) => ({
	root: {
		display: "flex",
		flex: 1,
		flexDirection: "column",
	},
}));

function ProfileIssueViewManager(props) {
	const history = useHistory();
	const classes = useStyles();
	const { editModeValue = false } = props;
	const { issueId } = useParams();
	const {} = classes;

	const [issue, setIssue] = useState(null);
	const [loading, setLoading] = useState(true);
	const [editMode, setEditMode] = useState(editModeValue);
	useEffect(() => {
		setEditMode(editModeValue);
	}, [editModeValue]);

	const getData = async () => {
		try {
			const res = await Api.post("issue/getIssueDetail", {
				issue: issueId,
			});

			const data = res?.data;

			if (data?._id) {
				setIssue(data);
			}

			setLoading(false);
		} catch (error) {
			console.log("error in profile.issue.view.manager : ", error);
		}
	};

	useEffect(() => {
		getData();
	}, []);

	return (
		<div className={classes.root}>
			{loading ? (
				<Loadinglogo />
			) : (
				<>
					{editMode ? (
						<ProfileIssueEdit issue={issue} setIssue={setIssue} />
					) : (
						<ProfileIssueView issue={issue} setIssue={setIssue} />
					)}
				</>
			)}
		</div>
	);
}

export default ProfileIssueViewManager;
