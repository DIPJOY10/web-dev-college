import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import FileView from "./FileView";
import GalleryViewer from "./GalleryViewer";
import { makeStyles } from "@material-ui/core/styles";
import Api from "../../../helpers/Api";
import { setFiles } from "../fileUtils";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles({
	row: {
		flex: 1,
		display: "flex",
		flexDirection: "row",
		flexWrap: "wrap",
	},
	col: {
		flex: 1,
		display: "flex",
		flexDirection: "column",
	},
	text: {
		fontSize: "1.2rem",
		fontWeight: "600",
		margin: "1rem 0.5rem",
	},
});

const ProfilePhotoViewer = (props) => {
	const classes = useStyles();
	const fileReducer = useSelector((state) => state.file);
	const dispatch = useDispatch();
	const { row, col } = classes;
	const { fileIds, isGallery, deletable, handler } = props;
	const { fileDictionary } = fileReducer;

	useEffect(() => {
		// console.log("fileids = ", fileIds);
		const newFileIds = fileIds.filter((fileId) => {
			return fileDictionary[fileId] ? false : true;
		});

		Api.post("file/get", { files: newFileIds }).then((res) => {
			const { result: files } = res;
			setFiles(files, fileReducer, dispatch);
		});
	}, []);

	const ImageFileIds = [];
	const DocFileIds = [];

	(fileIds || []).map((fileId) => {
		const file = fileDictionary[fileId];
		if (file && file?._id) {
			if (file.type.startsWith("image/")) {
				ImageFileIds.push(fileId);
			} else {
				DocFileIds.push(fileId);
			}
		}
	});
	// console.log("file  dict = ", fileDictionary);
	// console.log("doc file ids = ", DocFileIds);

	return (
		<div>
			{ImageFileIds.length > 0 ? (
				<div>
					<Typography
						variant="h4"
						className={classes.text}
						gutterBottom
					>
						Preview
					</Typography>
					<div className={row}>
						{!isGallery ? (
							ImageFileIds.map((fileId) => {
								return (
									<FileView
										key={fileId}
										fileId={fileId}
										styleBody={props.styleBody}
										deletable={deletable}
										handler={handler}
									/>
								);
							})
						) : (
							<GalleryViewer images={ImageFileIds} />
						)}
					</div>
				</div>
			) : null}

			{/* remove bottom  */}
			{DocFileIds.length > 0 ? (
				<div>
					<Typography
						variant="h4"
						className={classes.text}
						gutterBottom
					>
						Documents
					</Typography>
					<div
						style={{
							display: "grid",
							gridGap: "6px",
							gridTemplateColumns:
								"repeat(auto-fill,minmax(220px,1fr))",
						}}
					>
						{DocFileIds.map((fileId) => {
							return (
								<FileView
									key={fileId}
									fileId={fileId}
									styleBody={props.styleBody}
								/>
							);
						})}
					</div>
				</div>
			) : null}
		</div>
	);
};

export default ProfilePhotoViewer;
