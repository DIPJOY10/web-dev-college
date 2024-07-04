import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import InputBase from "@material-ui/core/InputBase";
import Typography from "@material-ui/core/Typography";
import { useParams, useHistory } from "react-router-dom";
import Button from "@material-ui/core/Button";
import _ from "lodash";
import DraggableStatusList from "../pipeline/DraggableStatusList";
import Api from "../../helpers/Api";
import ColorSelect from "../styled/color/color.select";
import Paper from "@material-ui/core/Paper";
import { StatusItem } from "../pipeline/status.item";
import TocIcon from "@material-ui/icons/Toc";
import StatusList from "./status.list";
import TitleInput from "../styled/title.input";
import { useDebounce } from "react-use";
import ProfileAppbar from "../profile/profile.appbar";
import { Chip, Grid, TextField } from "@material-ui/core";
import { Title } from "@material-ui/icons";
import Question from "../form/question";
import Form from "../form/form";
import Kanban from "../styled/Kanban/Kanban";
import useShared from "../share/useShared";
import SharedList from "../share/sharedList";
import ShareIconBtn from "../share/share.icon.btn";
import EditIcon from "@material-ui/icons/Edit";

const useStyles = makeStyles({
	listStyle: {
		padding: "1rem",
		paddingBottom: "2rem",
		paddingTop: 0,
		minWidth: "17rem",
		width: "90vw",
		maxWidth: "32rem",
	},
	centerDiv: {
		flex: 1,
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "white",
		padding: "2rem 0",
		paddingTop: "3.5rem",
		// width: '50vw'
	},

	row: {
		flex: 1,
		display: "flex",
		flexDirection: "row",
	},

	center: {
		justifyContent: "center",
		alignItems: "center",
	},

	margin: {
		margin: "1rem",
	},

	col: {
		flex: 1,
		display: "flex",
		flexDirection: "column",
	},
	input: {
		margin: "1rem",
		textAlign: "center",
		fontSize: "1.2rem",
		minWidth: "17rem",
	},
	createBtn: {
		paddingLeft: "1rem",
		padding: "0.5rem",
		paddingTop: "0.25rem",
		paddingBottom: "0.25rem",
		maxWidth: "6rem",
	},
	createBtnPaper: {
		maxWidth: "6rem",
		margin: "1rem",
	},
	bgColor: {
		backgroundColor: "#64b5f6",
		color: "white",
	},
	text: {
		fontSize: 20,
		fontWeight: "bold",
		margin: "1rem 1rem 1rem 0",
	},
});

export default function IssueTemplateEdit(props) {
	const classes = useStyles();
	const { template, setTemplate, setLoading, handleClose } = props;
	const DateNow = new Date();
	const [lastUpdated, setLastUpdated] = useState(DateNow);

	const history = useHistory();

	const oldtitle = template?.title ? template.title : "";
	const oldFinalStates = template.finalStates || []
	const oldStartState = template.startState ? template.startState : null
	const [title, setTitle] = useState(oldtitle);
	const [open, setOpen] = useState(false);
	const [statusIds, setStatusIds] = useState([]);
	const [statusDict, setStatusDict] = useState({});
	const [startState, setStartState] = useState(oldStartState);
	const [finalStates, setFinalStates] = useState(oldFinalStates);

	const oldForm = template?.form;
	const [form, setForm] = useState(oldForm);

	const [isPrivate, setPrivate] = useState(false);
	const { user, userProfile } = useSelector((state) => state.auth);
	const userProfileId = user?.profile;

	const sharedProps = useShared({
		initShared: [...(template?.shared || [])],
		initAssigned: [],
	});


	var { assignButton, assigness, sharedPeoples } = SharedList(
		sharedProps,
		isPrivate,
		setPrivate
	);

	const dispatch = useDispatch();
	const updateApi = async () => {
		if (finalStates.length > 0 && startState) {
			await Api.post("issue/template/update", {
				_id: template?._id,
				title,
				finalStates: finalStates,
				startState: startState,
				pipeline: statusIds
			})
				.then((res) => {
					if (res?.data) {
						const t = res?.data;

						setTemplate(res?.data);
					}
				})
				.catch((err) => {
					console.log("error in issue.template.edit.js as :", err);
				});
		}

	};
	// const getForm = () => {
	// 	Api.post("form/getFormHelper", { parent: template?._id, parentModelName: 'IssueTemplate' })
	// 		.then((res) => {
	// 			if (res) {
	// 				setForm(res?.data)
	// 				console.log(form)
	// 			}
	// 		})
	// }
	// useEffect(() => {
	// 	getForm();
	// }, [template])

	useEffect(() => {
		if (finalStates.length == template.finalStates.length && startState == template.startState) {

		} else {
			console.log(startState, ' is the startState yahan se')
			updateApi()
		}

	}, [finalStates.length, startState])


	return (
		<div className={classes.centerDiv}>
			<ProfileAppbar
				name={template?.title || "Edit Template"}
				btns={
					<>
						<Button
							variant="contained"
							color="primary"
							disabled={title.length < 3}
							onClick={() => {
								setLoading(true);
								updateApi('called from button');
								history.goBack();
								// handleClose();
								// window.close();
							}}
						>
							Save
						</Button>
					</>
				}
			/>
			<Paper style={{ width: "90%" }} elevation={0}>
				<div style={{ padding: "1rem 0" }}>
					<div
						style={{
							display: "flex",
							gap: "7px",
							alignItems: "center",
							marginBottom: "16px",
						}}
					>
						<EditIcon
							style={{ width: "2.5rem", height: "2.5rem" }}
						/>
						<Typography variant="h3" style={{ fontWeight: "600" }}>
							Edit Template
						</Typography>
					</div>
					<Typography
						style={{
							fontSize: "1.06rem",
							fontFamily: "Inter",
							fontWeight: "500",
							lineHeight: "1.5",
						}}
					>
						Some info ........................
					</Typography>
					<Typography
						style={{
							fontSize: "1.06rem",
							fontFamily: "Inter",
							fontWeight: "500",
							lineHeight: "1.5",
						}}
					>
						Add states and form questions for your issues.
					</Typography>
					<Typography
						style={{
							fontSize: "1.06rem",
							fontFamily: "Inter",
							fontWeight: "500",
							lineHeight: "1.5",
						}}
					>
						Some info ...svsv
					</Typography>
					<div
						style={{
							fontSize: "1.06rem",
							fontFamily: "Inter",
							fontWeight: "500",
							lineHeight: "1.5",
						}}
					>
						Click{" "}
						<span
							style={{
								backgroundColor: "rgba(135,131,120,0.15)",
								color: "#EB5757",
								fontSize: "1.06rem",
								fontFamily: "Inter",
								fontWeight: "500",
								lineHeight: "1.5",
							}}
						>
							Save
						</span>{" "}
						to save your changes.
					</div>
				</div>
				{sharedProps?.shareDrawer}
				{sharedProps?.assignedDialog}
				{/* <TitleInput
					title={title}
					setTitle={setTitle}
					placeholder={"Template Title"}
					type={"Template"}
				/> */}
				<TextField
					label="Title"
					placeholder="List Title"
					type="text"
					variant="outlined"
					margin="normal"
					fullWidth
					// error={handleClickCheck}
					// style={{ flexBasis: "80%" }}
					onChange={(e) => setTitle(e.target.value)}
					value={title}
				/>

				<StatusList
					template={template}
					setTemplate={setTemplate}
					statusIds={statusIds}
					setStatusIds={setStatusIds}
					statusDict={statusDict}
					setStatusDict={setStatusDict}
					startState={startState}
					setStartState={setStartState}
					finalStates={finalStates}
					setFinalStates={setFinalStates}
				/>
				<div>
					<div
						style={{
							width: "100%",
							display: "flex",
							justifyContent: "center",
							flexDirection: "column",
							alignItems: "center",
						}}
					>
						{/* <Question /> */}
						<Form form={template?.form} />
					</div>
					<Grid container spacing={2}>

						<Grid
							item
							sm={12}
							md={3}
							xs={12}
							style={{
								display: "flex",
								alignItems: "center",
								marginTop: "1rem",
							}}
						>
							<Typography variant="h4" className={classes.text}>
								Shared
							</Typography>
						</Grid>
						<Grid
							item
							xs={12}
							md={9}
							style={{ alignSelf: "center" }}
						>
							<div
								style={{
									display: "flex",
									justifyContent: "space-around",
								}}
							>
								{sharedPeoples}
								<ShareIconBtn
									open={sharedProps?.open}
									setOpen={sharedProps?.setOpen}
								/>
							</div>
						</Grid>
						<Grid
							item
							sm={12}
							md={3}
							xs={12}
							style={{ display: "flex", alignItems: "center" }}
						>
							<Typography variant="h4" className={classes.text}>
								Assigned
							</Typography>
						</Grid>
						<Grid
							item
							xs={12}
							md={9}
							style={{ alignSelf: "center" }}
						>
							<div
								style={{
									display: "flex",
									justifyContent: "space-around",
								}}
							>
								<>{assigness}</>
								<>{assignButton}</>
							</div>
						</Grid>
					</Grid>
				</div>
			</Paper>
		</div>
	);
}
