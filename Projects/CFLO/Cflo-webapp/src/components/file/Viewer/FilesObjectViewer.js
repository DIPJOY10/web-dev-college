import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import FileView from "./FileView";
import GalleryViewer from "./GalleryViewer";
import { makeStyles } from "@material-ui/core/styles";
import Api from "../../../helpers/Api";
import { setFiles } from "../fileUtils";
import arrayToReducer from "../../../helpers/arrayToReducer";

const useStyles = makeStyles({
	row: {
		flex: 1,
		display: "flex",
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "center",
	},
	col: {
		flex: 1,
		display: "flex",
		flexDirection: "column",
	},
});

const FileObjectViewer = (props) => {
	const classes = useStyles();
	const fileReducer = useSelector((state) => state.file);
	const dispatch = useDispatch();
	const { row, col } = classes;
	const { files = [], isGallery } = props;
	const { fileDictionary } = fileReducer;
	const [imageFileIds, setImageFileIds] = useState([]);
	const [docFileIds, setDocFileIds] = useState([]);
	const [fileIds, setFileIds] = useState([]);
	const [fileDict, setFileDict] = useState([]);

	useEffect(() => {
		const { newDict, idArr } = arrayToReducer(files);
		setFileIds(idArr);
		setFileDict(newDict);
	}, [files?.length]);

	console.log(files)

	useEffect(() => {
		const ImageFileIdsArr = [];
		const DocFileIdsArr = [];

		fileIds.map((fileId) => {
			const file = fileDict[fileId];
			if (file && file?._id) {
				if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
					ImageFileIdsArr.push(fileId);
				} else {
					DocFileIdsArr.push(fileId);
				}
			}
		});
		setImageFileIds(ImageFileIdsArr);
		setDocFileIds(DocFileIdsArr);
	}, [fileIds?.length]);

	return (
		<div className={col}>
			{docFileIds.length > 0 ? (
				<div className={col}>
					{docFileIds.map((fileId) => {
						return (
							<FileView
								key={fileId}
								fileId={fileId}
								styleBody={props.styleBody}
								fileObject={true}
								file={fileDict[fileId]}
							/>
						);
					})}
				</div>
			) : null}

			{imageFileIds.length > 0 ? (
				<div className={row}>
					{!isGallery ? (
						imageFileIds.map((fileId) => {
							return (
								<FileView
									key={fileId}
									fileId={fileId}
									styleBody={props.styleBody}
									fileObject={true}
									file={fileDict[fileId]}
								/>
							);
						})
					) : (
						<GalleryViewer
							images={imageFileIds}
							fileObject={true}
							files={files}
						/>
					)}
				</div>
			) : null}
		</div>
	);
};

export default FileObjectViewer;
