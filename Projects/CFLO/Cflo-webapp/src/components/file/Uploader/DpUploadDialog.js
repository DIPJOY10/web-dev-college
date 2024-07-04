import React, { useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
// import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import UploadZone from "./UploadZone";
import FileUploadingView from "../Viewer/FileUploadingView";
import FilesViewer from "../Viewer/FilesViewer";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import ProfilePhotoViewer from "../Viewer/ProfilePhotoViewer";

const styles = (theme) => ({
	root: {
		margin: 0,
		padding: theme.spacing(2),
	},
	closeButton: {
		position: "absolute",
		right: theme.spacing(1),
		top: theme.spacing(1),
		color: theme.palette.grey[500],
	},
});

const DialogTitle = withStyles(styles)((props) => {
	const { children, classes, onClose, ...other } = props;
	return (
		<MuiDialogTitle disableTypography className={classes.root} {...other}>
			<Typography variant="h6">{children}</Typography>
			{onClose ? (
				<IconButton
					aria-label="close"
					className={classes.closeButton}
					onClick={onClose}
				>
					<CloseIcon />
				</IconButton>
			) : null}
		</MuiDialogTitle>
	);
});

const DpUploadDialog = (props) => {
	const fileReducer = useSelector((state) => state.file);
	const { createdFileIds } = fileReducer;
	const { open, setOpen, parentType, isDP, acceptImage, uploadImg } = props;
	const state = useSelector((state) => state);

	const { user, organizationIds } = useSelector((state) => state.auth);
	const dispatch = useDispatch();
	const handleClose = () => {
		// console.log('handle close getting called')
		setOpen(false);
		dispatch({ type: "FileUploadReset" });
	};
	// console.log(createdFileIds,' is the createdFileIds')

	return (
		<div>
			<Dialog
				open={open}
				onClose={handleClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle onClose={handleClose}>Profile Photo</DialogTitle>
				<DialogContent dividers>
					<UploadZone
						parentType={parentType}
						isDP={isDP}
						acceptImage={acceptImage}
					/>
					<FileUploadingView />
					<ProfilePhotoViewer fileIds={createdFileIds} />
				</DialogContent>

				<DialogActions>
					<Button
						autoFocus
						variant="outlined"
						color="primary"
						onClick={() => {
							uploadImg("DP");
							setOpen(false);
							dispatch({ type: "FileUploadReset" });
						}}
					>
						Upload
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

export default DpUploadDialog;
