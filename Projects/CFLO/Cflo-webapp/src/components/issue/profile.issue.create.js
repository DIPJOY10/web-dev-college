import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import SubjectIssue from "./subject.issue.js";
import IssueSvg from "../../Assets/issue.svg";
import CreateBtn from "../styled/actionBtns/create.btn";
import EditIcon from "@material-ui/icons/Edit";
import docImage from "../../Assets/FileIcon/docs.png";

import {
	Avatar,
	Button,
	FormControl,
	FormControlLabel,
	Grid,
	IconButton,
	ListItem,
	ListItemAvatar,
	ListItemText,
	Radio,
	RadioGroup,
	Slide,
	TextField,
	Typography,
	useMediaQuery,
} from "@material-ui/core";

import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link,
	useParams,
	useHistory,
} from "react-router-dom";
import Api from "../../helpers/Api";
import TitleInput from "../styled/title.input";
import DescriptionInput from "../styled/description.input";
import CloseIcon from "@material-ui/icons/Close";
import TaskList from "../task/smart.task.list.js";
import ProfileAppbar from "../profile/profile.appbar.js";
import TemplateAttach from "./template.attach.js";
import StatusPicker from "./status.picker.js";
import useProfileIssueData from "./useProfileIssueData.js";
import useShared from "../share/useShared.js";
import ShareIconBtn from "../share/share.icon.btn.js";
import SharedList from "../share/sharedList.js";
import moment from "moment";
import useDatePickerMap from "../styled/datepicker/index.js";
import useGetTemplates from "./useGetTemplates";
import useGetProfile from "../profile/useGetProfile";
import FileUploadButton from "../file/Uploader/FileUploadButton";
import FilesViewer from "../file/Viewer/FilesViewer";

import { Alert } from "@material-ui/lab";
import { updateDeleteFlagForSingleFiles } from "../propertyManagement/apiCall";

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

const getSubjectText = (
	setParent,
	parentModel,
	parentObject,
	handleClickOpen
) => {
	const sendText = () => {
		switch (parentModel) {
			case "Issue":
				return (
					<ListItemText
						primary={parentObject?.title || " "}
						secondary={
							<>
								{`${parentObject?.template?.title ||
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
				width: "max-content",
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
			<IconButton onClick={handleClickOpen}>
				<EditIcon />
			</IconButton>
			<IconButton
				onClick={() => {
					setParent(null);
				}}
			>
				<CloseIcon />
			</IconButton>
		</ListItem>
	);
	return html;
};

const useStyles = makeStyles((theme) => ({
	root: {
		display: "flex",
		flex: 1,
		flexDirection: "column",
		height: "100vh",

		marginTop: "8vh",
		// justifyContent: "center",
		alignItems: "center",
	},

	row: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},

	col: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
	},

	appbar: {
		flex: 1,
		display: "flex",
		flexDirection: "row",
		alignSelf: "flex-start",
		top: 0,
		position: "fixed",
		borderColor: "grey",
		backgroundColor: "white",
		height: "4.5rem",
		width: "100%",
	},

	rowDiv: {
		flexDirection: "row",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		margin: "1rem 0",
	},

	text: {
		fontSize: "1.1rem",
		fontWeight: "600",
		margin: "0rem 1rem",
	},
	attachIconFont: {
		fontSize: "25px",
		transform: "rotate(-20deg)",
		marginRight: "5px",
	},
	iconWithTextStyle: {
		border: `2px solid ${theme.palette.primary.main}`,
		width: "150px",
	},
}));

function CreateProfileIssue(props) {
	const history = useHistory();
	const classes = useStyles();
	const { row, col } = classes;
	const dispatch = useDispatch();
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const { profileId } = useParams();
	const { user, userProfile } = useSelector((state) => state.auth);
	const matches = useMediaQuery("(max-width:700px)");
	const userId = user._id;
	const userProfileId = user?.profile;
	const [tags, setTags] = useState([]);
	const [isPrivate, setPrivate] = useState(false);
	const sharedProps = useShared({
		initShared: [profileId, userProfileId],
		initAssigned: [],
	});
	const [openDialog, setOpenDialog] = useState(false);
	const handleClickOpen = () => {
		setOpenDialog(true);
	};

	const [issue, setIssue] = useState(null);
	const [parent, setParent] = useState(null);
	const [parentModel, setParentModel] = useState("Organization");
	const [parentObject, setParentObject] = useState({});
	const [template, setTemplate] = useState(null);
	const [status, setStatus] = useState(null);
	const [issueCreated, setIssueCreated] = useState(false);
	const [publish, setPublish] = useState(false);
	const [taskIds, setTaskIds] = useState([]);
	const [priority, setPriortiy] = useState("3");
	const file = useSelector((state) => state.file);
	const { createdFileIds } = file;
	var dateNow = new Date();
	var { privateButton, assignButton, assigness, sharedPeoples } = SharedList(
		sharedProps,
		isPrivate,
		setPrivate
	);
	const { dateTimePickView, dateArr } = useDatePickerMap({
		isOrder: true,
		dateArr: [
			{
				label: "Start Time",
				value: dateNow,
			},
			{
				label: "End Time",
				value: dateNow,
			},
		],
	});
	const profile = useGetProfile(profileId);

	const {
		issueIds,
		setIssueIds,
		issueDictionary,
		setIssueDictionary,
		loading,
	} = useProfileIssueData(profileId);

	const {
		templateIds,
		setTemplateIds,
		templateDictionary,
		setTemplateDictionary,
	} = useGetTemplates(profileId);

	var templates = [];
	templateIds.map((tempId) => {
		var temp = templateDictionary[tempId];
		// var temp=temp.filter(templateDictionary[tempId]?.type!=='Issue');
		// console.log(temp);
		if (temp?._id) {
			templates.push(temp);
			templates = templates.filter((templates) => (templates?.type === 'Issue' && templates?.title.length > 0));
		} else {
		}
	});
	console.log(templates, "temp");

	const removeSingleImgFromReducerAndDelete = async (selectedId) => {
		const filteredFileIds = createdFileIds.filter((id) => id != selectedId);
		dispatch({
			type: "AddFile",
			payload: {
				createdFileIds: [...filteredFileIds],
			},
		});

		await updateDeleteFlagForSingleFiles({ fileId: selectedId })
			.then((data) => {
				console.log(data);
			})
			.catch((err) => {
				console.log(err);
			});
	};
	const getParentId = () => {
		if (parent) {
			if (["Organization", "Project"].includes(parentModel)) {
				return parentObject?._id;
			} else {
				return parent[0] || null;
			}
		} else {
			return null;
		}
	};
	const createIssueApi = async () => {
		let parentId = getParentId();
		let issueObject = {
			user: user._id,
			profile: profileId,
			title,
			description,
			closed: template?.finalStates.includes(status?._id),
			checklist: taskIds,
			template: template?._id,
			status: status?._id,
			parentModelName: parent ? parentModel : "",
			parent: parentId,
			shared: sharedProps?.shared,
			assigned: sharedProps?.assigned,
			startDate: dateArr[0],
			finishDate: dateArr[1],
			files: createdFileIds,
			priority: parseInt(priority),
			isPrivate,
			activeUserId: user,
			activeUserProfile: user.profile,
		};
		const res = await Api.post("issue/create", issueObject);

		console.log(res);

		dispatch({
			type: "AddApiAlert",
			payload: {
				success: true,
				message: "Issue created successfully",
			},
		});

		dispatch({ type: "FileUploadReset" });

		var path = "/issues/profile/" + profileId;
		history.push(path);
	};

	return (
		<div className={classes.root}>
			<ProfileAppbar
				name={"Add Issue"}
				btns={
					<>
						{privateButton}
						<ShareIconBtn
							open={sharedProps?.open}
							setOpen={sharedProps?.setOpen}
						/>

						<CreateBtn
							onClick={() => {
								createIssueApi();
							}}
						>
							Save
						</CreateBtn>
					</>
				}
			/>

			{sharedProps?.shareDrawer}
			{sharedProps?.assignedDialog}
			<div
				style={{
					flexGrow: "1",
				}}
			>
				<Grid
					container
					style={{
						// display: "grid",
						// gridTemplateColumns: "20% auto",
						// gridGap: "10px",
						backgroundColor: "white",
						padding: "10px",
						width: "100%",
					}}
				>
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
							Title
						</Typography>
					</Grid>
					<Grid item sm={12} md={9} xs={12}>
						<TextField
							value={title}
							placeholder={"Issue Title"}
							onChange={(event) => setTitle(event.target.value)}
							variant="outlined"
							style={{ padding: "1rem" }}
							fullWidth
						/>
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
							Description
						</Typography>
					</Grid>
					<Grid item sm={12} md={9} xs={12}>
						<DescriptionInput
							NoTitle
							description={description}
							placeholder={"Issue Description"}
							setDescription={setDescription}
						/>
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
						{parent ? (
							getSubjectText(
								setParent,
								parentModel,
								parentObject,
								handleClickOpen
							)
						) : (
							<Button
								style={{ margin: "1rem" }}
								onClick={handleClickOpen}
								variant="contained"
								color="primary"
							>
								Choose Subject
							</Button>
						)}

						<SubjectIssue
							openDialog={openDialog}
							setOpenDialog={setOpenDialog}
							parent={parent}
							setParent={setParent}
							parentModel={parentModel}
							parentObject={parentObject}
							setParentObject={setParentObject}
							setParentModel={setParentModel}
						/>
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
						className={matches ? col : row}
						style={{ justifyContent: "space-around" }}
					>
						<div>
							<TemplateAttach
								profileId={profileId}
								template={template}
								templates={templates}
								type={"Issue"}
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
											if (startState?.length == 0) {
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
								pipeline={template?.pipeline}
								status={status}
								setStatus={setStatus}
							/>
						) : null}
					</Grid>
					<Grid item xs={12}>
						<div>
							{template != null ? (
								<Alert
									severity={
										template?.finalStates
											? template?.finalStates.includes(
												status?._id
											)
												? "warning"
												: "info"
											: "info"
									}
								>
									{template?.finalStates
										? template?.finalStates.includes(
											status?._id
										)
											? "Selected status is final state so issue will be marked as closed"
											: "Selected status is not a final state so issue will be marked as Open"
										: null}
								</Alert>
							) : null}
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
						className={matches ? col : row}
						style={{ justifyContent: "space-around" }}
					>
						{dateTimePickView}
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
							Priority
						</Typography>
					</Grid>
					<Grid
						item
						sm={12}
						md={9}
						xs={12}
						className={matches ? col : row}
						style={{ justifyContent: "space-around" }}
					>
						<FormControl
							component="fieldset"
							style={{ paddingBottom: "1.2rem" }}
						>
							<RadioGroup
								row
								aria-label="position"
								name="position"
								value={priority}
								onChange={(e) => {
									setPriortiy(e.target.value);
								}}
							>
								<FormControlLabel
									value={"1"}
									control={<Radio color="primary" />}
									label="Very Low"
									labelPlacement="bottom"
								/>
								<FormControlLabel
									value={"2"}
									control={<Radio color="primary" />}
									label="Low"
									labelPlacement="bottom"
								/>
								<FormControlLabel
									value={"3"}
									control={<Radio color="primary" />}
									label="Medium"
									labelPlacement="bottom"
								/>
								<FormControlLabel
									value={"4"}
									control={<Radio color="primary" />}
									label="High"
									labelPlacement="bottom"
								/>
								<FormControlLabel
									value={"5"}
									control={<Radio color="primary" />}
									label="Urgent"
									labelPlacement="bottom"
								/>
							</RadioGroup>
						</FormControl>
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
						<FileUploadButton
							parentType="Doc"
							used={false}
							parentId={null}
							IconColor="white"
							iconBig={true}
							aditionalText={"Add file"}
							attachIconStyle={classes.attachIconFont}
							iconWithTextStyle={classes.iconWithTextStyle}
						/>
						<div style={{ marginTop: "20px" }}>
							<FilesViewer
								fileIds={createdFileIds}
								deletable={true}
								handler={removeSingleImgFromReducerAndDelete}
							/>
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
							border: '1px solid red'
						}}
					>
						<Typography variant="h4" className={classes.text}>
							Checklist
						</Typography>
					</Grid>
					<Grid item xs={12} md={9}>
						<TaskList taskIds={taskIds} setTaskIds={setTaskIds} />
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
					<Grid item xs={12} md={9}>
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
					<Grid item xs={12} md={9}>
						<div>{sharedPeoples}</div>
					</Grid>

				</Grid>
			</div>
		</div>
	);
}

export default CreateProfileIssue;
