import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";

import {
	Avatar,
	Box,
	Button,
	Drawer,
	FormControl,
	FormControlLabel,
	Grid,
	IconButton,
	ListItem,
	ListItemAvatar,
	ListItemIcon,
	ListItemText,
	Radio,
	RadioGroup,
	Slide,
	TextField,
	Typography,
	useMediaQuery,
} from "@material-ui/core";
import IssueSvg from "../../Assets/issue.svg";
import CreateBtn from "../styled/actionBtns/create.btn";
import EditIcon from "@material-ui/icons/Edit";
import CloseIcon from "@material-ui/icons/Close";
import { useHistory } from "react-router-dom";
import Api from "../../helpers/Api";
import DescriptionInput from "../styled/description.input";
import TaskList from "../task/smart.task.list.js";
import ProfileAppbar from "../profile/profile.appbar.js";
import TemplateAttach from "./template.attach.js";
import StatusPicker from "./status.picker.js";
import useShared from "../share/useShared.js";
import ShareIconBtn from "../share/share.icon.btn.js";
import SharedList from "../share/sharedList.js";
import useDatePickerMap from "../styled/datepicker/index.js";
import useGetTemplates from "./useGetTemplates";
import FileUploadButton from "../file/Uploader/FileUploadButton";
import FilesViewer from "../file/Viewer/FilesViewer";
import { Alert } from "@material-ui/lab";
import { updateDeleteFlagForManyFiles } from "../propertyManagement/apiCall";
// import Choose from "../select/choose";
// import SubjectIssue from "./subject.issue";
import docImage from "../../Assets/FileIcon/docs.png";
import PaperBtn from "../styled/actionBtns/paper.btn";
import RestoreIcon from '@material-ui/icons/Restore';
import IssueLogs from "./profile.issue.logs";
import Logs from "../logs";
import Response from "../responses/response";
const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});
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

		marginTop: "3rem",
		justifyContent: "center",
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
		fontSize: 20,
		fontWeight: "bold",
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

function EditProfileIssue(props) {
	const history = useHistory();
	const classes = useStyles();
	const { issue, setIssue } = props;
	const { row, col } = classes;
	const dispatch = useDispatch();
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const profileId = issue?.profile?._id;
	const { user, userProfile } = useSelector((state) => state.auth);
	const matches = useMediaQuery("(max-width:700px)");
	const userId = issue?.user._id;
	const userProfileId = userId;
	const [tags, setTags] = useState([]);
	const [isPrivate, setPrivate] = useState(issue?.isPrivate);
	const sharedProps = useShared({
		initShared: [],
		initAssigned: [],
	});
	const [openDialog, setOpenDialog] = useState(false);
	const handleClickOpen = () => {
		setOpenDialog(true);
	};
	const handleClose = () => {
		setOpenDialog(false);
	};
	const [deletedImgIds, setDeletedImgIds] = useState([]);
	const [template, setTemplate] = useState("");
	const [status, setStatus] = useState("");
	const [parent, setParent] = useState(null);
	const [parentModel, setParentModel] = useState("Organization");
	const [parentObject, setParentObject] = useState({});
	const [issueCreated, setIssueCreated] = useState(false);
	const [publish, setPublish] = useState(false);
	const [taskIds, setTaskIds] = useState([]);
	const file = useSelector((state) => state.file);
	const { createdFileIds } = file;
	const [priority, setPriortiy] = useState("3");
	const [open, setOpen] = useState(false);
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
				value: issue?.startDate,
			},
			{
				label: "End Time",
				value: issue?.finishDate,
			},
		],
	});

	useEffect(() => {
		setTitle(issue?.title);
		setDescription(issue?.description);
		let statusObj = issue?.template?.pipeline.filter(
			(obj) => obj?._id == issue?.status
		)[0];
		setTemplate(issue?.template);
		setStatus(statusObj);
		setPriortiy((issue?.priority || 3).toString());
		if (issue?.parent) {
			if (["Organization", "Project"].includes(issue?.parentModelName)) {
				setParent([issue?.parent?.profile]);
			} else {
				setParent([issue?.parent?._id]);
			}
			setParentObject(issue?.parent);
			setParentModel(issue?.parentModelName);
		}

		let imgs = issue?.files;
		let imgIds = [];

		imgs?.length > 0 &&
			imgs.map((img) => {
				imgIds.push(img?._id);
			});

		dispatch({
			type: "AddFile",
			payload: {
				createdFileIds: imgIds,
			},
		});
	}, [issue]);

	const {
		templateIds,
		setTemplateIds,
		templateDictionary,
		setTemplateDictionary,
	} = useGetTemplates(issue?.profile?._id);

	var templates = [];
	templateIds.map((tempId) => {
		var temp = templateDictionary[tempId];
		if (temp?._id) {
			templates.push(temp);
			templates = templates.filter((templates) => (templates?.type === 'Issue' && templates?.title.length > 0));
		} else {
		}
	});

	const removeSingleImgFromReducerAndDelete = async (selectedId) => {
		const filteredFileIds = createdFileIds.filter((id) => id != selectedId);
		let deletedImgs = deletedImgIds;
		deletedImgs.push(selectedId);
		setDeletedImgIds(deletedImgs);

		dispatch({
			type: "AddFile",
			payload: {
				createdFileIds: [...filteredFileIds],
			},
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

	const updateIssueApi = async () => {
		let parentId = getParentId();
		const issueObject = {
			_id: issue?._id,
			title,
			description,
			checklist: taskIds,
			template: template?._id,
			closed: template?.finalStates.includes(status?._id),
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

		const res = await Api.post("issue/update", issueObject);

		dispatch({
			type: "AddApiAlert",
			payload: {
				success: true,
				message: "Issue updated successfully",
			},
		});

		if (deletedImgIds?.length > 0) {
			await updateDeleteFlagForManyFiles({ fileIds: deletedImgIds })
				.then((data) => {
					setDeletedImgIds([]);
					console.log(data);
				})
				.catch((err) => {
					console.log(err);
				});
		}
		dispatch({ type: "FileUploadReset" });
		history.goBack();
	};

	const manageFormRes = async () => {

		const res = await Api.post("form/manageRes", {
			issueId: issue?._id
		});
		const issueRes = res?.data;
		console.log(issueRes, ' is manageRes data');
		if (issueRes?._id) {
			setIssue(issueRes)
		}
	}

	useEffect(() => {
		if (issue?._id) {
			manageFormRes()
		}
	}, [issue?._id])



	console.log("issue =", issue);
	return (
		<div className={classes.root}>
			<ProfileAppbar
				name={"Edit Issue"}
				btns={
					<>
						{privateButton}
						<ShareIconBtn
							open={sharedProps?.open}
							setOpen={sharedProps?.setOpen}
						/>
						<PaperBtn
							icon={<RestoreIcon />}
							text={'Logs'}
							onClick={() => setOpen(true)}
						/>
						<CreateBtn
							onClick={() => {
								updateIssueApi();
							}}
						>
							Update Issue
						</CreateBtn>
					</>
				}
			/>
			<Drawer anchor={"right"} open={open} onClose={() => setOpen(false)}>
				<Logs dataModelId={issue?._id} dataModel='Issue' setOpen={setOpen} />
				{/* <IssueLogs issueId={issue?._id} /> */}
			</Drawer>
			{sharedProps?.shareDrawer}
			{sharedProps?.assignedDialog}
			<div
				style={{
					flexGrow: "1",
					padding: "1rem"
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
					<Grid item xs={12}>
						<Grid container fullWidth>
							<Grid
								item
								sm={12}
								md={3}
								style={{
									display: "flex",
									alignItems: "center",
								}}
							>
								<Typography variant="h4" className={classes.text}>
									Description
								</Typography>
							</Grid>
							<Grid item sm={12} md={9}>
								<DescriptionInput
									NoTitle
									description={description}
									placeholder={"Issue Description"}
									setDescription={setDescription}
								/>
							</Grid>
						</Grid>
					</Grid>
					{/* <Grid
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
							parentObject={parentObject}
							setParentObject={setParentObject}
							parentModel={parentModel}
							setParentModel={setParentModel}
						/>
					</Grid> */}
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
							Status
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
						{/* <div>
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
						</div> */}

						{template?.pipeline?.length > 0 ? (
							<StatusPicker
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
					{/* <Grid
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
					</Grid> */}

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

					{/* <Grid
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
							Checklist
						</Typography>
					</Grid>
					<Grid item xs={12} md={9}>
						<TaskList
							issue={issue}
							taskIds={taskIds}
							setTaskIds={setTaskIds}
						/>
					</Grid> */}

					<Grid
						item
						sm={12}
						md={3}
						xs={12}
						style={{
							display: "flex",
							alignItems: "center",
							marginTop: "1rem",
							marginBottom: "1rem",
						}}
					>
						<Typography variant="h4" className={classes.text}>
							Shared
						</Typography>
					</Grid>
					<Grid item xs={12} md={9}>
						<div>{sharedPeoples}</div>
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

					<Grid item xs={12}>
						<Box width="100%" marginTop="3rem">
							<Grid container spacing={2}>
								<Grid
									item
									sm={12}
									md={2}
									xs={12}
									style={{
										display: "flex",
										alignItems: "start",
									}}
								>
									<Typography variant="h4" className={classes.text}>
										Form
									</Typography>
								</Grid>
								<Grid
									item
									sm={12}
									md={10}
									xs={12}
									style={{
										display: "flex",
										alignItems: "center",
									}}
								>
									<Response questions={issue?.template?.form?.questions} issue={issue} />
								</Grid>
							</Grid>
						</Box>
					</Grid>
				</Grid>
			</div>
		</div>
	);
}
export default EditProfileIssue;
