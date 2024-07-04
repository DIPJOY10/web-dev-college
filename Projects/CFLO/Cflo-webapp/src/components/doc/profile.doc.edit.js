import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import { CircularProgress, Grid, IconButton, Paper, TextField, Typography, useMediaQuery } from "@material-ui/core";
import DoneIcon from "@material-ui/icons/Done";
import CreateBtn from "../styled/actionBtns/create.btn";
import Alert from "@material-ui/lab/Alert";
import { BrowserRouter as Router, Switch, Route, Link, useParams, useHistory } from "react-router-dom";
import Api from "../../helpers/Api";
import TitleInput from "../styled/title.input";
import DescriptionInput from "../styled/description.input";
import ProfileAppbar from "../profile/profile.appbar.js";
import useShared from "../share/useShared.js";
import ShareIconBtn from "../share/share.icon.btn.js";
import SharedList from "../share/sharedList.js";
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import useGetProfile from "../profile/useGetProfile";
import FilesViewer from "../file/Viewer/FilesViewer";
import FileUploadButton from "../file/Uploader/FileUploadButton";
import VersionBtn from "../styled/actionBtns/versions.btn";
import AddIcon from "@material-ui/icons/Add";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import DeleteIcon from "@material-ui/icons/Delete";
import { updateDeleteFlagForManyFiles } from "../propertyManagement/apiCall";
import { useDebounce } from "react-use";
import _ from "lodash";
import Logs from "../logs";

var isArrayEqual = function (x, y) {
	return _(x).xorWith(y, _.isEqual).isEmpty();
};

const useStyles = makeStyles((theme) => ({
	root: {
		width: "100%",
		height: "100vh",
		overflow: "hidden",
		backgroundColor: "white"
	},
	navBar: {
		width: "100%",
		height: "60px",
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		padding: "0px 7px",
	},
	mainCont: {
		width: "100%",
		height: "calc(100% - 60px)",
		padding: "10px 30px 100px",
		display: "flex",
		overflowY: "auto",
		flexDirection: "column"
	},
	flexShow: {
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		"& h3": {
			fontWeight: "500",
			fontSize: "20px"
		}
	},
	text: {
		fontSize: "20px",
		fontWeight: "500",
		margin: '20px 0px 10px'
	},
	textTitle: {
		fontSize: 19,
		fontWeight: "500",
		margin: "0rem 1rem",
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
	link: {
		color: "blue",
		fontStyle: "italic",
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

function EditProfileDoc(props) {
	const history = useHistory();
	const classes = useStyles();

	const { row, col } = classes;
	const { docId } = useParams();
	const [open, setOpen] = useState(false);
	const dispatch = useDispatch();
	const [text, setText] = useState("");

	const docReducer = useSelector((state) => state.doc);
	const reducerDoc = docReducer?.tempDoc;
	const oldDoc = reducerDoc?._id == docId ? reducerDoc : null;
	const oldTitle = oldDoc?.title || "";
	const oldDescription = oldDoc?.description || "";
	const oldFiles = oldDoc?.files || [];

	const oldShared = oldDoc?.shared?.map((profile) => profile?._id) || [];

	const [deletedImgIds, setDeletedImgIds] = useState([]);
	const [originalDoc, setOriginalDoc] = useState(null);
	const [title, setTitle] = useState(oldTitle);
	const [description, setDescription] = useState(oldDescription);
	const [files, setFiles] = useState(oldFiles);
	const [shared, setShared] = useState(oldShared);
	const [docs, setDocs] = useState(oldDoc?.versions);
	const { profileId } = useParams();
	const file = useSelector((state) => state.file);
	const { user, userProfile } = useSelector((state) => state.auth);
	const [draftTrue, setDraftTrue] = useState(false);
	const [draftLoading, setDraftLoading] = useState(false);
	const [draftSaved, setDraftSaved] = useState(false);

	const matches = useMediaQuery("(max-width:700px)");

	const userId = user._id;
	const userProfileId = user?.profile;
	const [tags, setTags] = useState([]);
	const [isPrivate, setPrivate] = useState(false);

	const sharedProps = useShared({
		initShared: shared,
		initAssigned: [],
	});

	const profile = useGetProfile(profileId);
	const { createdFileIds } = file;
	const [links, setLinks] = useState([{ title: "", link: "" }]);
	const [linkError, setLinkError] = useState(false);
	const [loading, setLoading] = useState(true);
	var { privateButton, assignButton, assigness, sharedPeoples } = SharedList(
		sharedProps,
		isPrivate,
		setPrivate
	);

	useDebounce(
		() => {
			if (!loading) {
				if (
					originalDoc?.title != title ||
					originalDoc?.description != description ||
					!isArrayEqual(links, originalDoc?.links)
				) {
					console.log("debounce ran");
					updateDocDraft({
						_id: docId,
						title,
						description,
						links,
					});
				}
			}
		},
		1000,
		[title, description, links]
	);

	const updateDocDraft = async (obj) => {
		setDraftLoading(true);
		const draftUpdate = await Api.post("doc/updateDraft", obj);
		if (draftUpdate?.updated) {
			setDraftSaved(true);
			setDraftTrue(true);
		} else {
			setDraftSaved(false);
			console.error(draftUpdate?.error);
		}
		setDraftLoading(false);
	};

	const onTitleChange = (newValue, idx) => {
		let temp = [...links];
		temp[idx]["title"] = newValue;
		setLinks([...temp]);
	};

	const onLinkChange = (newValue, idx) => {
		let temp = [...links];
		temp[idx]["link"] = newValue;
		setLinks([...temp]);
	};

	const addNew = (idx) => {
		let temp = { title: "", link: "" };
		setLinks([...links.slice(0, idx), temp, ...links.slice(idx)]);
	};

	const onDelete = (idx) => {
		if (links.length > 1) {
			setLinks([...links.slice(0, idx), ...links.slice(idx + 1)]);
		}
	};

	useEffect(() => {
		dispatch({
			type: "AddFile",
			payload: {
				createdFileIds: files,
			},
		});
	}, [files]);

	const getDocDetail = async () => {
		const res = await Api.post("doc/getDocDetail", {
			docId,
		});
		console.log(res?.data, " is the doc");
		const resDraft = await Api.post("doc/getDraft", {
			_id: docId,
		});
		const draft = resDraft?.draft;
		console.log("draft = ", draft, res.data[0]);
		if (res?.data) {
			const data = res.data[0];
			setOriginalDoc(data);
			setTitle(draft[0]?.title || data.title);
			setDescription(draft[0]?.description || data.description);
			setFiles(data.files);
			setShared(data.shared);
			setDocs(data.versions);
			setDraftTrue(draft[0]?.changes);
			if ((draft[0]?.links || []).length > 0 || data.links.length > 0) {
				setLinks(draft[0]?.links || data.links);
			}
		} else {
			console.log("res = ", res.error);
		}
		setLoading(false);
	};

	useEffect(() => {
		getDocDetail();
	}, []);


	console.log(originalDoc)


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

	const updateDocApi = async () => {
		let check = true;
		if (links.length == 1) {
			if (Boolean(links[0].title) ^ Boolean(links[0].link)) {
				check = false;
				setLinkError(true);
				setTimeout(() => {
					setLinkError(false);
				}, 4000);
			}
		} else {
			for (var i = 0; i < links.length; i++) {
				let temp = links[i];
				// console.log("for loop,", temp, i);
				if (temp.title && temp.link) {
					continue;
				} else {
					check = false;
					setLinkError(true);
					setTimeout(() => {
						setLinkError(false);
					}, 4000);
					break;
				}
			}
		}
		if (check) {
			const docObject = {
				_id: docId,
				title,
				description,
				links,
				shared: sharedProps?.shared,
				isPrivate,
				files: createdFileIds,
				activeUserId: user,
				activeUserProfile: user.profile,
			};
			const res = await Api.post("doc/update", docObject);
			// console.log(res?.activity,"ActivityID");
			// const activityObject={
			// 	data:docId,
			// 	dataModel:'Doc',
			// 	user,
			// 	// activityId:res?.activityId,
			// 	profile:user?.profile,
			// }
			// const resActivity=await Api.post('/activity/update',activityObject);

			dispatch({
				type: "AddApiAlert",
				payload: {
					success: true,
					message: "Doc updated successfully",
				},
			});

			dispatch({ type: "FileUploadReset" });

			history.goBack();
		}

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
	};

	return (
		<div className={classes.root}>
			<div className={classes.navBar} >
				<div className={classes.flexShow} >
					<KeyboardBackspaceIcon
						style={{
							fontSize: "30px",
							marginRight: "5px",
							cursor: "pointer"
						}}
						onClick={() => {
							history.goBack();
						}}
					/>
					<h3>Edit Document</h3>
				</div>
				<div className={classes.flexShow} >
					<ShareIconBtn
						open={sharedProps?.open}
						setOpen={sharedProps?.setOpen}
					/>
					<VersionBtn
						onClick={() => setOpen(true)}
						count={docs?.length || 1}
					/>
					<CreateBtn
						onClick={() => {
							updateDocApi();
						}}
					>
						Update
					</CreateBtn>
				</div>
			</div>

			<div className={classes.mainCont} >
				<Drawer anchor={"right"} open={open} onClose={() => setOpen(false)}>
					<Logs dataModelId={docId} dataModel='Doc' setOpen={setOpen} />
				</Drawer>
				{sharedProps?.shareDrawer}
				{sharedProps?.assignedDialog}
				<Grid item xs={12}>
					{draftTrue ? (
						draftLoading ? (
							<div
								style={{
									display: "flex",
									justifyContent: "flex-end",
									alignItems: "center",
								}}
							>
								<CircularProgress
									style={{
										width: "14px",
										height: "14px",
									}}
								/>
								Updating...
							</div>
						) : draftSaved ? (
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
								Saved as draft
							</div>
						) : (
							<div
								style={{
									display: "flex",
									justifyContent: "flex-end",
									alignItems: "center",
									gap: "2px",
								}}
							>
								<ErrorOutlineIcon
									style={{
										color: "red",
										width: "14px",
										height: "14px",
										gap: "2px",
									}}
								/>
								Unable to save as draft
							</div>
						)
					) : null}
				</Grid>

				<TitleInput
					title={title}
					type={"Template"}
					placeholder={"Doc Title"}
					setTitle={setTitle}
				/>

				<div style={{ width: "100%", marginTop: "20px" }} >
					<DescriptionInput
						description={description}
						placeholder={"Doc Description ( optional )"}
						setDescription={setDescription}
					/>
				</div>

				<Typography className={classes.text}>Supporting Links</Typography>
				{links.map((obj, idx) => (
					<Grid
						container
						style={{ width: "100%" }}
						spacing={1}
					>
						<Grid item xs={5}>
							<TextField
								label="Title"
								fullWidth
								value={links[idx]["title"]}
								onChange={(e) =>
									onTitleChange(e.target.value, idx)
								}
								size="small"
								style={{ marginTop: "7px" }}
								placeholder="Enter Title"
								variant="outlined"
							></TextField>
						</Grid>
						<Grid item xs={5}>
							<TextField
								label="Link"
								fullWidth
								value={links[idx]["link"]}
								onChange={(e) =>
									onLinkChange(e.target.value, idx)
								}
								size="small"
								style={{ marginTop: "7px" }}
								inputProps={{ className: classes.link }}
								placeholder="Enter Hyperlink"
								variant="outlined"
							></TextField>
						</Grid>
						<Grid item xs={2}>
							<IconButton
								style={{ display: "50%" }}
								onClick={() => addNew(idx)}
							>
								<AddIcon />
							</IconButton>
							<IconButton
								style={{ display: "50%" }}
								disabled={links.length == 1}
								onClick={() => onDelete(idx)}
							>
								<DeleteIcon />
							</IconButton>
						</Grid>
					</Grid>
				))}
				{linkError && (
					<Alert severity="error">
						Please fill all fields or delete them if not
						required.
					</Alert>
				)}

				<Typography variant="h4" className={classes.text}>Files</Typography>
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

				<Typography variant="h4" className={classes.text}>Shared</Typography>
				<div>{sharedPeoples}</div>
			</div>
		</div>
	);
}

export default EditProfileDoc;
