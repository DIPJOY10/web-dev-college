import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles, useTheme } from "@material-ui/core/styles";

import { Grid, Typography, useMediaQuery } from "@material-ui/core";

import CreateBtn from "../styled/actionBtns/create.btn";

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

import ProfileAppbar from "../profile/profile.appbar.js";
import useShared from "../share/useShared.js";
import ShareIconBtn from "../share/share.icon.btn.js";
import SharedList from "../share/sharedList.js";
import useGetProfile from "../profile/useGetProfile";
import FilesViewer from "../file/Viewer/FilesViewer";
import FileUploadButton from "../file/Uploader/FileUploadButton";

const useStyles = makeStyles((theme) => ({
	root: {
		display: "flex",
		flex: 1,
		flexDirection: "column",
		marginTop: "4rem",
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "white",
		padding: "1rem",
		gap: "8px",
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
	text: {
		fontSize: 20,
		fontWeight: "bold",
		margin: "0rem 1rem",
	},
}));

function CreateProfileFolder(props) {
	const history = useHistory();
	const classes = useStyles();

	const { row, col } = classes;

	const dispatch = useDispatch();
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const { profileId } = useParams();
	// console.log("profile id is = ", profileId);
	const file = useSelector((state) => state.file);
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

	const profile = useGetProfile(profileId);
	var { privateButton, assignButton, assigness, sharedPeoples } = SharedList(
		sharedProps,
		isPrivate,
		setPrivate
	);

	const createFolderApi = async () => {
		const folderObject = {
			user: user._id,
			// profile: profileId,
			title,
			description,
			shared: sharedProps?.shared,
			assigned: sharedProps?.assigned,
			isPrivate,
		};
		try {
			const res = await Api.post("doc/folder/create", folderObject);
		} catch (error) {
			console.info("error in folder creartion", error);
		}

		dispatch({
			type: "AddApiAlert",
			payload: {
				success: true,
				message: "Folder created successfully",
			},
		});

		history.goBack();
	};

	return (
		<div className={classes.root}>
			<ProfileAppbar
				name={"Add Folder"}
				profile={profile}
				btns={
					<>
						<ShareIconBtn
							open={sharedProps?.open}
							setOpen={sharedProps?.setOpen}
						/>

						<CreateBtn
							onClick={() => {
								createFolderApi();
							}}
						>
							Save
						</CreateBtn>
					</>
				}
			/>

			{sharedProps?.shareDrawer}
			{sharedProps?.assignedDialog}
			<TitleInput
				title={title}
				placeholder={"Folder Title"}
				setTitle={setTitle}
			/>

			<DescriptionInput
				description={description}
				placeholder={"Folder Description ( optional )"}
				setDescription={setDescription}
			/>
			<Grid container style={{ marginTop: "2rem", gap: "16px" }}>
				<Grid
					item
					sm={12}
					xs={12}
					style={{ display: "flex", alignItems: "center" }}
				>
					<Typography variant="h4" className={classes.text}>
						Assigned
					</Typography>
				</Grid>
				<Grid item xs={12}>
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							flexWrap: "wrap",
							padding: "0 1rem",
						}}
					>
						<>{assigness}</>
						<>{assignButton}</>
					</div>
				</Grid>
				<Grid
					item
					sm={12}
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
				<Grid item xs={12}>
					<div>{sharedPeoples}</div>
				</Grid>
			</Grid>
		</div>
	);
}

export default CreateProfileFolder;
