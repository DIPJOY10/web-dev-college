import { Avatar, Paper, Typography } from "@material-ui/core";
import folderIcon from "../../Assets/FileIcon/folder.png";
import React from "react";
import { useHistory } from "react-router-dom";
import arrayToReducer from "../../helpers/arrayToReducer";

function FolderCard(props) {
	const { folderIds, folderDictionary, parentFolder, onClick } = props;
	const history = useHistory();
	let filterFolderIds = [...folderIds];

	if (parentFolder) {
		filterFolderIds = folderIds.filter((obj) => obj != parentFolder?._id);
		// console.log("here filter ", filterFolderIds);
	}
	return (
		<div>
			<div
				style={{
					display: "grid",
					gridGap: "6px",
					gridTemplateColumns: "repeat(auto-fill,minmax(222px,1fr))",
				}}
			>
				{filterFolderIds.map((folderId, idx) => (
					<Paper
						key={idx}
						onClick={() => {
							if (onClick) {
								// used in issue subject dialog
								onClick(
									folderId,
									folderDictionary[folderId]?.profile
								);
							} else {
								var path =
									"/doc/folder/" +
									folderDictionary[folderId]?.profile;
								history.push(path);
							}
						}}
						style={{
							display: "flex",
							maxWidth: "100%",
							cursor: "pointer",
						}}
					>
						<img
							src={folderIcon}
							alt="icons"
							style={{
								width: "2rem",
								height: "auto",
								margin: "0.8rem",
							}}
						/>
						<Typography
							style={{
								margin: "0.8rem",
								alignSelf: "center",
							}}
						>
							{folderDictionary[folderId]?.title}
						</Typography>
					</Paper>
				))}
			</div>
		</div>
	);
}

export default FolderCard;
