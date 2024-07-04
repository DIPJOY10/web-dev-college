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
import { CircularProgress, LinearProgress } from "@material-ui/core";
import IssueTemplateEdit from "./issue.template.edit";
import IssueTemplateView from "./issue.template.view";
import ProfileAppbar from "../profile/profile.appbar";

const useStyles = makeStyles((theme) => ({
	root: {
		display: "flex",
		flex: 1,
		flexDirection: "column",
	},
	center: {
		display: "flex",
		justifyContent: "center",
		minHeight: "80vh",
		alignItems: "center",
	},
}));

function IssueTemplateViewManager(props) {
	const history = useHistory();
	const classes = useStyles();
	const { templateId } = useParams();
	const { handleClose } = props;
	const {} = classes;
	const [template, setTemplate] = useState(null);
	const [loading, setLoading] = useState(true);
	const [editMode, setEditMode] = useState(false);

	// const createDefaultForm = async () => {
	// 	try {
	// 		const res = await Api.post("issue/template/create/form", {
	// 			templateId,
	// 		});

	// 		if(res?.data){
	// 			setTemplate(res?.data)
	// 		}
	// 	} catch (error) {
			
	// 	}
	// }

	const getData = async () => {
		try {
			const res = await Api.post("issue/template/getTemplateDetail", {
				template: templateId,
			});

			const data = res?.data;
			if (data) {
				const { template } = data;
				setTemplate(template);

				// if(template.form){

				// }else{
				// 	createDefaultForm()
				// }
			}

			setLoading(false);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		if (templateId) {
			getData();
		}
	}, [templateId]);


	return (
		<div className={classes.root}>
			{loading ? (
				<div className={classes.center}>
					<CircularProgress />
				</div>
			) : (
				<>
					{template?._id ? (
						<IssueTemplateEdit
							template={template}
							setTemplate={setTemplate}
							setLoading={setLoading}
							handleClose={handleClose}
						/>
					) : null}
				</>
			)}
		</div>
	);
}

export default IssueTemplateViewManager;
