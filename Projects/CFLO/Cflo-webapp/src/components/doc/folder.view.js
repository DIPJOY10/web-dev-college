import React, { useEffect } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import { Typography, useMediaQuery } from "@material-ui/core";
import { useParams, useHistory } from "react-router-dom";
import useGetProfile from "../profile/useGetProfile";
import useGetFolders from "./useGetFolders";
import useGetDocs from "./useGetDocs";
import SelectDocDialog from "./select.dialog";
import ProfileAppbar from "../profile/profile.appbar";
import FolderCard from "./profile.folder.card";
import DocTable from "./profile.doc.table";
import EmptyFolder from "../../Assets/FileIcon/emptyfolder.png";
import { Loadinglogo } from "../../helpers/loadinglogo";
import YoutubeTuts from "../youtubeTuts";
import DocCard from "./profile.doc.card"
const useStyles = makeStyles((theme) => ({
	root: {
		marginTop: "4rem",
	},
}));

export default function FolderView(props) {
	const classes = useStyles();
	const { folderId } = useParams();
	const profileId = folderId;
	const theme = useTheme();
	const profile = useGetProfile(profileId);
	const {
		folderIds,
		setFolderIds,
		folderDictionary,
		setFolderDictionary,
		loadingFolder,
	} = useGetFolders(folderId);
	const { docIds, setDocIds, docDictionary, setDocDictionary, loadingDocs } =
		useGetDocs(folderId);
	const parentFolder = Object.values(folderDictionary).filter(
		(obj) => obj?.profile == folderId
	)[0];
	const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

	return (
		<div className={classes.root}>
			{!loadingDocs && !loadingFolder ? (
				<div>
					<ProfileAppbar name={parentFolder?.title} />
					<div
						style={{
							display: "flex",
							justifyContent: "flex-end",
							alignItems: "center",
						}}
					>
						{/* <DocsBreadcrumbs /> */}
						<SelectDocDialog profileId={profileId} />
						<YoutubeTuts
							name={'Documents'}
							dialogTitle={'Document Management'}
						/>
					</div>
					{folderIds.length > 1 ? (
						<>
							<Typography
								gutterBottom
								variant="h5"
								style={{
									marginBottom: "1rem",
									fontWeight: "600",
								}}
							>
								Folders
							</Typography>
							<FolderCard
								parentFolder={parentFolder}
								folderIds={folderIds}
								folderDictionary={folderDictionary}
							/>
						</>
					) : null}
					{docIds.length > 0 ? (
						<>
							<Typography
								variant="h5"
								gutterBottom
								style={{
									margin: "1rem 0",
									fontWeight: "600",
								}}
							>
								Documents
							</Typography>
							{!isMobile ? <DocTable
								docIds={docIds}
								docDictionary={docDictionary}
							/> : docIds.map((docId) => {
								return (
									<DocCard
										key={docId}
										doc={docDictionary[docId]}
									/>
								)
							})}
						</>
					) : null}
					{folderIds.length == 1 && docIds.length == 0 ? (
						<div
							style={{
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								flexDirection: "column",
								height: "76vh",
							}}
						>
							<img
								src={EmptyFolder}
								style={{
									width: "18rem",
								}}
							/>
							<Typography>
								No Folders or Documents to Show
							</Typography>
						</div>
					) : null}
				</div>
			) : (
				<Loadinglogo />
			)}
		</div>
	);
}
