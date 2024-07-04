import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { makeStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import cx from "clsx";
import PersonIcon from "@material-ui/icons/Person";
import VisibilityIcon from "@material-ui/icons/Visibility";
import LockIcon from "@material-ui/icons/Lock";
import CloseIcon from "@material-ui/icons/Close";
import LoadingButton from "../styled/actionBtns/loading.btn";
import Api from "../../helpers/Api";
import { Avatar, Grid, Tooltip } from "@material-ui/core";
import FileUploadButton from "../file/Uploader/FileUploadButton";

const grayColor = "rgb(124, 124, 124)";
const lightGrayColor = "rgb(237, 239, 241)";

const useStyle = makeStyles((theme) => ({
	dialogBox: {
		width: "525px",
		padding: "0 17px 17px",
		fontSize: "0.9rem",
		[theme.breakpoints.down("md")]: {
			width: "auto",
		},
	},
	dialogBoxHeadingPrimary: {
		fontSize: "16px",
	},
	dialogBoxCaption: {
		fontSize: "11.5px",
		color: grayColor,
	},
	dialogBoxHeader: {},
	dialogBoxName: {
		marginTop: "15px",
	},
	dialogBoxInputBox: {
		marginTop: "17px",
	},
	dialogBoxInputBoxCaption: {
		marginTop: "10px",
	},
	dialogBoxInput: {
		width: "100%",

		// "& .MuiOutlinedInput-root": {
		//   "& fieldset": {
		//     borderColor: "black",
		//   },
		//   "&:hover fieldset": {
		//     borderColor: "black",
		//   },
		// },
	},
	dialogBoxTypeBox: {
		marginTop: "30px",
	},
	dialogBoxRadioButtonLabelBox: {
		marginBottom: "16px",
		marginRight: "0",
		marginLeft: "-7px",
	},
	dialogBoxRadioButtonLabel: {
		display: "flex",
		alignItems: "center",
	},
	dialogBoxRadioButtonLabelIcon: {
		fontSize: "19px",
		color: grayColor,
		// margin: "0 2px",
	},
	dialogBoxRadioButtonLabelHeading: {
		fontSize: "14px",
		marginLeft: "4px",
	},
	dialogBoxRadioButtonLabelCaption: {
		marginLeft: "5px",
	},
	dialogBoxRadioButtonIcon: {
		padding: "0px 4px 0 8px",
		"& svg": {
			width: "20px",
			height: "20px",
			// color: theme.palette.primary.main,
		},
	},

	dialogBoxActionsBox: {
		marginTop: "23px",
		display: "flex",
		justifyContent: "flex-end",
		columnGap: "10px",
		backgroundColor: lightGrayColor,
		padding: "16px",
	},
	dialogBoxActionButton: {
		borderRadius: "20px",
	},
}));

function RadioButtonLabel({ icon, heading, text }) {
	const classes = useStyle();
	return (
		<div className={classes.dialogBoxRadioButtonLabel}>
			{icon}{" "}
			<Typography
				variant="h6"
				className={classes.dialogBoxRadioButtonLabelHeading}
			>
				{heading}
			</Typography>
			<Typography
				variant="caption"
				className={cx(
					classes.dialogBoxCaption,
					classes.dialogBoxRadioButtonLabelCaption
				)}
			>
				{text}
			</Typography>
		</div>
	);
}

function CreateCommunity({ open, setOpen }) {
	const classes = useStyle();
	const dispatch = useDispatch();

	const { auth } = useSelector((state) => state);
	const { user } = auth;
	const profile = user?.profile;

	const [name, setName] = React.useState("");
	const [type, setType] = useState("public");
	const [description, setDescription] = useState("");
	const [invalidNameMessage, setInvalidNameMessage] = useState("");
	const [submitLoading, setSubmitLoading] = useState(false);
	const [invalidDescriptionMessage, setInvalidDescriptionMessage] =
		useState("");

	async function handleSubmit() {
		setSubmitLoading(true);
		const nameValidaterRegex = /^[a-zA-Z0-9_]+$/;

		if (
			!(
				name.length >= 3 &&
				name.length <= 31 &&
				nameValidaterRegex.test(name)
			)
		) {
			setInvalidNameMessage(
				"Community names must be between 3–21 characters, and can only contain letters, numbers, or underscores."
			);
			setSubmitLoading(false);
			return;
		}

		if (!(description.length >= 3)) {
			setInvalidDescriptionMessage(
				"Community Description must be more than 3 characters."
			);
			setSubmitLoading(false);
			return;
		}

		// console.log("createCommunity Obj", {
		//   displayName: name,
		//   userProfile: profile,
		//   user: user?._id,
		//   moderators: [profile],
		// });

		const community = await Api.post("community/create", {
			displayName: name,
			description: description,
			userProfile: profile,
			user: user?._id,
			moderators: [profile],
		});
		console.log("createCommunity", community);
		setSubmitLoading(false);
		handleClose();
	}

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	function handleNameChange(newName) {
		if (newName.length <= 21) setName(newName);
	}

	function handleNameChangeOnBlur() {
		//
		const nameValidaterRegex = /^[a-zA-Z0-9_]+$/;

		if (!name) setInvalidNameMessage("A Community name is required");
		else if (
			name.length < 3 ||
			name.length >= 21 ||
			!nameValidaterRegex.test(name)
		)
			setInvalidNameMessage(
				"Community names must be between 3–21 characters, and can only contain letters, numbers, or underscores."
			);
		else setInvalidNameMessage("");
	}
	function handleDescriptionChangeOnBlur() {
		if (!description)
			setInvalidDescriptionMessage("A Community description is required");
		else setInvalidDescriptionMessage("");
	}

	return (
		<div>
			{/* <Tooltip title="Create New Community" arrow>
				<Button
					variant="contained"
					color="primary"
					onClick={handleClickOpen}
					style={props?.style}
					startIcon={props?.startIcon}
					className={props?.className}
				>
					{props?.buttonText}
				</Button>
			</Tooltip> */}
			<Dialog
				open={open}
				onClose={handleClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle style={{ margin: "2%", padding: "0px 9px" }}>
					<Grid
						container
						justifyContent="space-between"
						alignItems="center"
					>
						<Typography
							variant="h6"
							className={cx(
								classes.dialogBoxHeader,
								classes.dialogBoxHeadingPrimary
							)}
						>
							Create a community
						</Typography>
						<CloseIcon
							onClick={handleClose}
							style={{ cursor: "pointer" }}
						/>
					</Grid>
				</DialogTitle>
				<div className={classes.dialogBox}>
					<div className={classes.dialogBoxName}>
						<Typography
							variant="h6"
							className={classes.dialogBoxHeadingPrimary}
						>
							Name
						</Typography>
						<Typography
							variant="caption"
							className={classes.dialogBoxCaption}
						>
							Community names including capitalization cannot be
							changed.
						</Typography>
					</div>
					<div className={classes.dialogBoxInputBox}>
						<TextField
							//   label="With normal TextField"
							id="standard-start-adornment"
							className={classes.dialogBoxInput}
							value={name}
							onChange={(event) =>
								handleNameChange(event.target.value)
							}
							onFocus={() => setInvalidNameMessage(false)}
							onBlur={() => handleNameChangeOnBlur()}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										c/
									</InputAdornment>
								),
								style: {
									padding: "5px 10px",
									height: "40px",
									//   outline: "2px solid black",
									fontSize: "14px",
								},
							}}
							variant="outlined"
						/>

						<Typography
							variant="caption"
							className={cx(
								classes.dialogBoxInputBoxCaption,
								classes.dialogBoxCaption
							)}
							component="div"
						>
							{21 - name.length} Characters remaining
						</Typography>
						<Typography
							variant="caption"
							className={cx(
								// classes.dialogBoxInputBoxCaption,
								classes.dialogBoxCaption
							)}
							style={{ color: "red" }}
							component="div"
						>
							{invalidNameMessage}
						</Typography>
						<Typography
							variant="h6"
							className={classes.dialogBoxHeadingPrimary}
						>
							Description
						</Typography>
						<TextField
							//   label="With normal TextField"
							id="standard-start-adornment"
							className={classes.dialogBoxInput}
							value={description}
							onChange={(event) =>
								setDescription(event.target.value)
							}
							onFocus={() => setInvalidDescriptionMessage(false)}
							onBlur={() => handleDescriptionChangeOnBlur()}
							variant="outlined"
						/>
						<Typography
							variant="caption"
							className={cx(
								// classes.dialogBoxInputBoxCaption,
								classes.dialogBoxCaption
							)}
							style={{ color: "red" }}
							component="div"
						>
							{invalidDescriptionMessage}
						</Typography>
					</div>
					<div className={classes.dialogBoxTypeBox}>
						<Typography
							variant="h6"
							className={classes.dialogBoxHeadingPrimary}
						>
							Community Type
						</Typography>

						<RadioGroup
							aria-label="type"
							name="type"
							value={type}
							onChange={(event) => setType(event.target.value)}
							style={{ marginTop: "8px" }}
						>
							<FormControlLabel
								className={classes.dialogBoxRadioButtonLabelBox}
								value="public"
								selected
								control={
									<Radio
										color="primary"
										className={
											classes.dialogBoxRadioButtonIcon
										}
									/>
								}
								label={
									<RadioButtonLabel
										icon={
											<PersonIcon
												className={
													classes.dialogBoxRadioButtonLabelIcon
												}
											/>
										}
										heading="Public"
										text="Anyone can view, post, and comment to this community"
									/>
								}
							/>
							<FormControlLabel
								className={classes.dialogBoxRadioButtonLabelBox}
								value="restricted"
								control={
									<Radio
										color="primary"
										className={
											classes.dialogBoxRadioButtonIcon
										}
									/>
								}
								label={
									<RadioButtonLabel
										icon={
											<VisibilityIcon
												className={
													classes.dialogBoxRadioButtonLabelIcon
												}
											/>
										}
										heading="Restricted"
										text="Anyone can view this community, but only approved users can post"
									/>
								}
							/>
							<FormControlLabel
								className={classes.dialogBoxRadioButtonLabelBox}
								value="private"
								control={
									<Radio
										color="primary"
										className={
											classes.dialogBoxRadioButtonIcon
										}
									/>
								}
								label={
									<RadioButtonLabel
										icon={
											<LockIcon
												className={
													classes.dialogBoxRadioButtonLabelIcon
												}
											/>
										}
										heading="Private"
										text="Only approved users can view and submit to this community"
									/>
								}
							/>
						</RadioGroup>
					</div>
				</div>
				<div className={classes.dialogBoxActionsBox}>
					<Button
						variant="outlined"
						color="primary"
						className={classes.dialogBoxActionButton}
						onClick={handleClose}
					>
						Cancel
					</Button>

					<LoadingButton
						variant="contained"
						color="primary"
						loading={submitLoading}
						text="Create Community"
						styleBody={{
							borderRadius: "20px",
							padding: "auto 20px",
						}}
						progressStyle={{ color: "white" }}
						onClick={handleSubmit}
					/>
				</div>
			</Dialog>
		</div>
	);
}

export default CreateCommunity;
