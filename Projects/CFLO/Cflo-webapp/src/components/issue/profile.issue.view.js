import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Api from "../../helpers/Api";
import DoneIcon from "@material-ui/icons/Done";
import EditIcon from "@material-ui/icons/Edit";
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link,
	useParams,
	useHistory,
} from "react-router-dom";
import TaskList from "../task/smart.task.list";
import {
	Button,
	CircularProgress,
	Divider,
	Grid,
	LinearProgress,
	Paper,
	TextField,
	Typography,
	useMediaQuery,
	ListItem,
	ListItemAvatar,
	ListItemText,
	Avatar,
} from "@material-ui/core";
import IssueSvg from "../../Assets/issue.svg";
import SmartCommentList from "../comment/smart.comment.list";
import Menubar from "../styled/menubar";
import ThumbDP from "../file/Viewer/ThumbDP";
import moment from "moment";
import clsx from "clsx";
import ProfileAppbar from "../profile/profile.appbar";
import DescriptionInput from "../styled/description.input";
import * as h2p from "html2plaintext";
import FilesViewer from "../file/Viewer/FilesViewer";
import { Alert } from "@material-ui/lab";
import TemplateAttach from "./template.attach";
import useGetTemplates from "./useGetTemplates";
import StatusPicker from "./status.picker";
import { useDebounce } from "react-use";
import IssueDialog from "./issue.table.dialog";
import SubjectIssue from "./subject.issue";
import docImage from "../../Assets/FileIcon/docs.png";

const useStyles = makeStyles((theme) => ({
	root: {
		display: "flex",
		flex: 1,
		flexDirection: "column",
		marginTop: "8vh",
	},

	paper: {
		margin: "1rem 0 1rem 0",
		padding: "0.5rem 0.5rem",
	},

	titleText: {
		fontSize: "1.7rem",
		fontWeight: "bold",
		margin: "1rem",
	},

	postedText: {
		fontSize: "0.9rem",
		fontWeight: "500",
		paddingRight: "0.9rem",
		// color: "#424242",
	},

	descText: {
		fontSize: "1.0rem",
		fontWeight: "400",
		marginTop: "0.5rem",
	},

	row: {
		display: "flex",
		flex: 1,
		flexDirection: "row",
	},

	col: {
		display: "flex",
		flex: 1,
		flexDirection: "column",
	},
	text: {
		fontSize: "1.1rem",
		fontWeight: "600",
		margin: "0rem 1rem",
	},
	Temprow: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},

	Tempcol: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
	},
}));
const ListDict = {
	// parentModel name to display Name
	Organization: "Organization",
	Project: "Project",
	Doc: "Documents",
	Issue: "Issues",
	RentalUnit: "Rental Units",
	FinanceRelation: "Contacts",
	Transaction: "Transactions",
};

const getSubjectText = (parentModel, parentObject) => {
	const sendText = () => {
		switch (parentModel) {
			case "Issue":
				return (
					<ListItemText
						primary={parentObject?.title || " "}
						secondary={
							<>
								{`${
									parentObject?.template?.title ||
									"No Template"
								} `}
								<br />
								Issue
							</>
						}
					/>
				);
			case "Doc":
				return (
					<ListItemText
						primary={parentObject?.title || " "}
						secondary={ListDict[parentModel]}
					/>
				);
			case "RentalUnit":
				return (
					<ListItemText
						primary={parentObject?.name || " "}
						secondary={ListDict[parentModel]}
					/>
				);
			default:
				return (
					<ListItemText
						primary={parentObject?.displayName || " "}
						secondary={ListDict[parentModel]}
					/>
				);
		}
	};
	let html = (
		<ListItem
			style={{
				width: "19rem",
				alignItems: "center",
				border: "1px solid #c7c7c7",
				borderRadius: "12px",
			}}
		>
			<ListItemAvatar>
				<Avatar
					src={
						parentModel == "Issue"
							? IssueSvg
							: parentModel == "Doc"
							? docImage
							: parentObject?.displayPicture?.thumbUrl
					}
					style={{
						height: "1.6rem",
						width: "1.6rem",
						borderRadius: "0.8rem",
					}}
				/>
			</ListItemAvatar>
			{sendText()}
		</ListItem>
	);
	return html;
};
function ProfileIssueView(props) {
	const history = useHistory();
	const classes = useStyles();
	const { issue, setIssue } = props;
	const profileId = issue?.profile?._id;
	const { paper, row, titleText, descText, postedText } = classes;
	const [taskIds, setTaskIds] = useState([]);
	const [docIds, setDocIds] = useState([]);
	const [template, setTemplate] = useState("");
	const [status, setStatus] = useState("");
	let currentStatus = {};
	const matches = useMediaQuery("(max-width:700px)");
	const priorityDict = {
		1: "Very Low",
		2: "Low",
		3: "Medium",
		4: "High",
		5: "Urgent",
	};
	console.log("issues ", issue);
	const [updateTemplateStatusLoading, setUpdateTemplateStatusLoading] =
		useState(false);
	const startDateTime = new Date(issue?.actualStart);
	const EndDateTime = new Date(issue?.actualFinish);
	const [open, setOpen] = useState(false);
	const [updated, setUpdated] = useState(false);
	const [parent, setParent] = useState(null);
	const [parentModel, setParentModel] = useState("Organization");
	const [parentObject, setParentObject] = useState({});
	const {
		templateIds,
		setTemplateIds,
		templateDictionary,
		setTemplateDictionary,
	} = useGetTemplates(issue?.profile?._id);

	const templates = [];
	templateIds.map((tempId) => {
		var temp = templateDictionary[tempId];
		if (temp?._id) {
			templates.push(temp);
		} else {
		}
	});

	useEffect(() => {
		let statusObj = issue?.template?.pipeline.filter(
			(obj) => obj?._id == issue?.status
		)[0];
		setTemplate(issue?.template);
		if (issue?.parent) {
			if (["Organization", "Project"].includes(issue?.parentModelName)) {
				setParent([issue?.parent?.profile]);
			} else {
				setParent([issue?.parent?._id]);
			}
			setParentObject(issue?.parent);
			setParentModel(issue?.parentModelName);
		}
		setStatus(statusObj);
		let imgs = issue?.files;
		let imgIds = [];
		imgs?.length > 0 &&
			imgs.map((img) => {
				imgIds.push(img?._id);
			});
		setDocIds(imgIds);
	}, [issue]);

	if (issue !== undefined) {
		currentStatus = (issue?.template?.pipeline || []).filter(
			(obj) => obj?._id == issue?.status
		)[0];
	}
	const updateTemplateStatus = async () => {
		setUpdateTemplateStatusLoading(true);
		const issueObject = {
			_id: issue?._id,
			template: template?._id,
			status: status?._id,
			closed: template?.finalStates.includes(status?._id),
		};
		const res = await Api.post("issue/updateTemplateStatus", issueObject);
		// console.log("res = ", res);
		if (res?.issue) {
			setIssue(res?.issue);
			setUpdated(true);
		} else {
			console.error(res?.error);
		}
		setUpdateTemplateStatusLoading(false);
	};

	useDebounce(
		() => {
			if (issue && template && status && status?._id != issue?.status) {
				updateTemplateStatus();
			}
		},
		1700,
		[template, status]
	);

	return (
		<div className={classes.root}>
			<ProfileAppbar
				name={issue?.title}
				btns={
					<>
						<Button
							color={issue?.closed ? "primary" : "secondary"}
							onClick={() => {
								setOpen(true);
							}}
						>
							{issue?.closed ? " Mark as Open" : "Mark as Closed"}
						</Button>
						<Button
							startIcon={<EditIcon />}
							onClick={() => {
								var path = "/issue/edit/" + issue?._id;
								history.push(path);
							}}
						>
							Edit Issue
						</Button>
					</>
				}
			/>

			<div
				style={{
					flexGrow: "1",
					backgroundColor: "white",
				}}
			>
				<div className={classes.row}>
					<IssueDialog
						open={open}
						IdArr={[issue?._id]}
						issueDictionary={{ [issue?._id]: issue }}
						setOpen={setOpen}
						status={Boolean(issue?.closed)}
					/>
					<div className={classes.col}>
						<Typography
							align="center"
							variant="h4"
							className={classes.titleText}
						>
							{issue?.title}
						</Typography>

						<Typography className={postedText} align="right">
							{"created At "}
							{moment(issue?.createdAt).format("Do MMM YYYY")}
						</Typography>
					</div>
				</div>
				<Grid
					container
					spacing={2}
					style={{
						// display: "grid",
						// gridTemplateColumns: "20% auto",
						// gridGap: "10px",
						// backgroundColor: "white",
						padding: "10px",
						width: "100%",
					}}
				>
					{issue?.description != "" ? (
						<>
							<Grid
								item
								sm={12}
								md={3}
								xs={12}
								style={{
									display: "flex",
									alignItems: "center",
								}}
							>
								<Typography
									variant="h4"
									className={classes.text}
								>
									Description
								</Typography>
							</Grid>
							<Grid item sm={12} md={9} xs={12}>
								<TextField
									multiline
									maxRows={5}
									value={h2p(issue?.description)}
									variant="outlined"
									style={{ width: "100%", padding: "1rem 0" }}
								/>
							</Grid>
						</>
					) : null}
					<Grid item xs={12}>
						{updateTemplateStatusLoading ? (
							<div
								style={{
									display: "flex",
									justifyContent: "flex-end",
									alignItems: "center",
									gap: "2px",
								}}
							>
								<CircularProgress
									style={{ width: "14px", height: "14px" }}
								/>
								Updating...
							</div>
						) : updated ? (
							<div
								style={{
									display: "flex",
									justifyContent: "flex-end",
									alignItems: "center",
									gap: "2px",
								}}
							>
								<DoneIcon
									style={{
										color: "green",
										width: "14px",
										height: "14px",
										gap: "2px",
									}}
								/>
								Updated
							</div>
						) : null}
					</Grid>
					<Grid
						item
						sm={12}
						md={3}
						xs={12}
						style={{
							display: "flex",
							alignItems: "center",
						}}
					>
						<Typography variant="h4" className={classes.text}>
							Template
						</Typography>
					</Grid>
					<Grid
						item
						sm={12}
						md={9}
						xs={12}
						className={matches ? classes.Tempcol : classes.Temprow}
						style={{ justifyContent: "space-around" }}
					>
						<div>
							<TemplateAttach
								profileId={profileId}
								template={template}
								templates={templates}
								onSelect={(template) => {
									setTemplate(template);
									const pipeline = template?.pipeline || [];
									if (pipeline.length > 0) {
										let currentstatus = pipeline.filter(
											(obj) => obj?._id == status?._id
										);
										if (currentstatus.length == 0) {
											let startState = pipeline.filter(
												(obj) =>
													obj?._id ==
													template?.startState
											)[0];
											if (
												(startState || []).length == 0
											) {
												startState = pipeline[0];
											}
											setStatus(startState);
										}
									}
								}}
							/>
						</div>

						{template?.pipeline?.length > 0 ? (
							<StatusPicker
								viewMode
								pipeline={template?.pipeline}
								startState={template?.startState}
								status={status}
								setStatus={setStatus}
							/>
						) : null}
					</Grid>
					<Grid item xs={12}>
						<div>
							<Alert
								severity={
									template?.finalStates
										? template?.finalStates.includes(
												status?._id
										  )
											? "warning"
											: "info"
										: issue?.closed
										? "warning"
										: "info"
								}
							>
								{template?.finalStates
									? template?.finalStates.includes(
											status?._id
									  )
										? "Selected status is final state so issue will be marked as closed"
										: "Selected status is not a final state so issue will be marked as Open"
									: issue?.closed
									? "Issue is currently marked as closed"
									: "Issue is currently marked as open."}
							</Alert>
						</div>
					</Grid>
					{parent ? (
						<>
							<Grid
								item
								sm={12}
								md={3}
								xs={12}
								style={{
									display: "flex",
									alignItems: "center",
								}}
							>
								<Typography
									variant="h4"
									className={classes.text}
								>
									Subject
								</Typography>
							</Grid>
							<Grid
								item
								sm={12}
								md={9}
								xs={12}
								style={{
									display: "flex",
									justifyContent: "center",
								}}
							>
								{getSubjectText(parentModel, parentObject)}
							</Grid>
						</>
					) : null}
					<Grid
						item
						sm={12}
						md={3}
						xs={12}
						style={{
							display: "flex",
							alignItems: "center",
						}}
					>
						<Typography variant="h4" className={classes.text}>
							Priority
						</Typography>
					</Grid>
					<Grid item sm={12} md={9} xs={12}>
						<Typography>{priorityDict[issue?.priority]}</Typography>
					</Grid>
					<Grid
						item
						sm={12}
						md={3}
						xs={12}
						style={{
							display: "flex",
							alignItems: "center",
						}}
					>
						<Typography variant="h4" className={classes.text}>
							Files
						</Typography>
					</Grid>
					<Grid
						item
						sm={12}
						md={9}
						xs={12}
						style={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							flexDirection: "column",
						}}
					>
						<div style={{ marginTop: "20px" }}>
							<FilesViewer fileIds={docIds} />
						</div>
					</Grid>
					<Grid
						item
						sm={12}
						md={3}
						xs={12}
						style={{
							display: "flex",
							alignItems: "center",
						}}
					>
						<Typography variant="h4" className={classes.text}>
							Start and End Dates
						</Typography>
					</Grid>
					<Grid
						item
						sm={12}
						md={9}
						xs={12}
						style={{
							display: "flex",
							justifyContent: "space-around",
						}}
					>
						<TextField
							value={startDateTime.toLocaleString("en-IN", {
								dateStyle: "medium",
								timeStyle: "medium",
							})}
							label="Start Time"
						/>
						<TextField
							value={EndDateTime.toLocaleString("en-IN", {
								dateStyle: "medium",
								timeStyle: "medium",
							})}
							label="End Time"
						/>
					</Grid>
					<Grid
						item
						sm={12}
						xs={12}
						style={{
							display: "flex",
							alignItems: "center",
						}}
					>
						<Typography variant="h4" className={classes.text}>
							Checklist
						</Typography>
					</Grid>
					<Grid item xs={12}>
						<TaskList
							issue={issue}
							taskIds={taskIds}
							setTaskIds={setTaskIds}
						/>
					</Grid>
				</Grid>
				<Divider />
				<Typography
					variant="h4"
					className={classes.text}
					style={{ marginTop: "1rem" }}
				>
					Comments
				</Typography>
				<SmartCommentList parent={issue?._id} parentModelName="Issue" />
			</div>
		</div>
	);
}

export default ProfileIssueView;
