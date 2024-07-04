import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
	InputBase,
	Paper,
	Button,
	useMediaQuery,
	useTheme,
	Grid,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Slide,
	Typography,
	Popper,
	alpha,
} from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import PublicIcon from "@material-ui/icons/Public";
import PollIcon from "@material-ui/icons/Poll";
import EmojiEmotionsIcon from "@material-ui/icons/EmojiEmotions";
import PermMediaIcon from "@material-ui/icons/PermMedia";
import CloseIcon from "@material-ui/icons/Close";
import { default as UPB } from "../dashboard/Post/create.postBox";
import PostAddIcon from "@material-ui/icons/PostAdd";
import { Autocomplete } from "@material-ui/lab";
import DoneIcon from "@material-ui/icons/Done";

const useStyles = makeStyles((theme) => ({
	root: {
		// border: "1px solid rgba(175, 175, 175, 0.8)",
		width: "75%",
		margin: "0 auto",
		marginBottom: "40px",
		borderRadius: "7px",
		backgroundColor: "white",
		padding: "20px 15px",
		border: "1.5px solid rgba(0, 0, 0, 0.12)",
		boxShadow: "none",
		[theme.breakpoints.down("md")]: {
			width: "100%",
		},
	},

	flexRow: {
		display: "flex",
		flexDirection: "row",
	},

	flexColumn: {
		display: "flex",
		flexDirection: "column",
	},

	topBox: {
		display: "flex",
		alignItems: "center",
		width: "100%",
	},

	createInput: {
		flexGrow: "1",
		// marginLeft: "10px",
		backgroundColor: "#f1f3f4",
		borderRadius: "23px",
		cursor: "pointer",
		padding: "15px 12px",
		color: "#6e676b",
		border: "1px solid lightgrey",
		"&:hover": {
			backgroundColor: "#ededed",
		},
	},

	midBox: {
		color: theme.palette.primary.main,
		fontWeight: "500",
		marginTop: "15px",
		display: "flex",
		alignItems: "center",
	},

	bottomBox: {
		marginTop: "17px",
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		borderTop: "1px solid rgb(209,209,209)",
		paddingTop: "0.3rem",
	},
	iconBox: {
		//
	},
	icon: {
		color: theme.palette.primary.main,
		marginRight: "10px",
	},
	button: {
		height: "35px",
	},
	AutocompleteAvatar: {
		width: "25px",
		height: "25px",
		marginTop: "0px",
		flexShrink: "0",
		marginRight: "8px",
	},
	text: {
		flexGrow: 1,
		alignSelf: "center",
	},
	iconSelected: {
		width: 17,
		height: 17,
		marginRight: 5,
		marginLeft: -2,
	},
	tag: {
		marginTop: 3,
		height: 20,
		padding: ".15em 4px",
		fontWeight: 600,
		lineHeight: "15px",
		borderRadius: 2,
	},
	popper: {
		border: "1px solid rgba(27,31,35,.15)",
		boxShadow: "0 3px 12px rgba(27,31,35,.15)",
		borderRadius: 3,
		width: 300,
		zIndex: 1,
		fontSize: 13,
		color: "#586069",
		backgroundColor: "#f6f8fa",
	},
	header: {
		borderBottom: "1px solid #e1e4e8",
		padding: "8px 10px",
		fontWeight: 600,
	},
	inputBase: {
		padding: 10,
		width: "100%",
		borderBottom: "1px solid #dfe2e5",
		"& input": {
			borderRadius: 4,
			backgroundColor: theme.palette.common.white,
			padding: 8,
			transition: theme.transitions.create([
				"border-color",
				"box-shadow",
			]),
			border: "1px solid #ced4da",
			fontSize: 14,
			"&:focus": {
				boxShadow: `${alpha(
					theme.palette.primary.main,
					0.25
				)} 0 0 0 0.2rem`,
				borderColor: theme.palette.primary.main,
			},
		},
	},
	paper: {
		boxShadow: "none",
		margin: 0,
		color: "#586069",
		fontSize: 13,
	},
	option: {
		minHeight: "auto",
		alignItems: "flex-start",
		padding: 8,
		'&[aria-selected="true"]': {
			backgroundColor: "transparent",
		},
		'&[data-focus="true"]': {
			backgroundColor: theme.palette.action.hover,
		},
	},
	popperDisablePortal: {
		position: "relative",
	},
	iconSelected: {
		width: 17,
		height: 17,
		marginRight: 5,
		marginLeft: -2,
	},
	color: {
		width: 14,
		height: 14,
		flexShrink: 0,
		borderRadius: 3,
		marginRight: 8,
		marginTop: 2,
	},
	text: {
		flexGrow: 1,
	},
	close: {
		opacity: 0.6,
		width: 18,
		height: 18,
	},
}));
const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});
function UploadPostBox({
	adminProfiles,
	selectedProfile,
	setSelectedProfile,
	loading,
}) {
	const classes = useStyles();
	const history = useHistory();
	const theme = useTheme();
	const { auth } = useSelector((state) => state);
	const { user } = auth;
	const matches = useMediaQuery((theme) => theme.breakpoints.down("md"));
	const buttonMatches = useMediaQuery((theme) =>
		theme.breakpoints.down("sm")
	);
	const [anchorEl, setAnchorEl] = React.useState(null);
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleCloseMenu = (event, reason) => {
		if (reason === "toggleInput") {
			return;
		}
		if (anchorEl) {
			anchorEl.focus();
		}
		setAnchorEl(null);
	};
	const openMenu = Boolean(anchorEl);
	const [open, setOpen] = React.useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const openPostUrl = () => {
		//true if screen size is less than md
		if (matches) {
			history.push("/dashboard/create/post");
		} else {
			handleClickOpen();
		}
	};

	return (
		<Paper className={classes.root}>
			<div className={classes.flexRow}>
				<div onClick={handleClick} style={{ cursor: "pointer" }}>
					<Avatar
						imgProps={{
							referrerPolicy: "no-referrer",
						}}
						src={selectedProfile?.displayPicture?.thumbUrl}
						style={{
							marginTop: "1px",
							width: "2.7rem",
							height: "2.7rem",
							cursor: "pointer",
						}}
					/>
					<div>
						<Popper
							open={openMenu}
							anchorEl={anchorEl}
							placement="bottom-start"
							className={classes.popper}
						>
							<div className={classes.header}>
								Select Viewing Profile
							</div>
							<Autocomplete
								open={openMenu}
								onClose={handleCloseMenu}
								autoSelect={false}
								options={adminProfiles}
								disablePortal
								classes={{
									paper: classes.paper,
									option: classes.option,
									popperDisablePortal:
										classes.popperDisablePortal,
								}}
								renderTags={() => null}
								loading={loading}
								loadingText={"Loading..."}
								value={selectedProfile}
								onChange={(event, newValue) => {
									setSelectedProfile(newValue);
								}}
								noOptionsText="No Profiles Found"
								getOptionLabel={(option) => option.displayName}
								renderOption={(option, { selected }) => (
									<div style={{ display: "flex" }}>
										<DoneIcon
											className={classes.iconSelected}
											style={{
												visibility: selected
													? "visible"
													: "hidden",
											}}
										/>
										<Avatar
											className={
												classes.AutocompleteAvatar
											}
											src={
												option?.displayPicture?.thumbUrl
											}
										/>
										<div className={classes.text}>
											{option?.displayName}
										</div>
									</div>
								)}
								renderInput={(params) => (
									<InputBase
										ref={params.InputProps.ref}
										inputProps={params.inputProps}
										autoFocus
										className={classes.inputBase}
									/>
								)}
							/>
						</Popper>
					</div>
				</div>
				<div
					className={classes.flexColumn}
					style={{ flexGrow: 1, marginLeft: "10px" }}
				>
					<div className={classes.topBox} onClick={openPostUrl}>
						<span
							className={classes.createInput}
							inputProps={{ style: { cursor: "pointer" } }}
						>
							Have something on mind?
						</span>
					</div>
					{/* <div className={classes.midBox}>
						<PublicIcon /> Everyone can view
					</div> */}
					<div className={classes.bottomBox}>
						<Grid container spacing={3}>
							<Grid item xs={4}>
								<Button
									onClick={openPostUrl}
									startIcon={
										<PollIcon
											style={{ color: "#15a0f9" }}
										/>
									}
									fullWidth
									style={{
										borderRadius: "23px",
									}}
								>
									{buttonMatches ? null : "Add a Poll"}
								</Button>
							</Grid>
							<Grid item xs={4}>
								<Button
									onClick={openPostUrl}
									startIcon={
										<PermMediaIcon
											style={{ color: "#45bd62" }}
										/>
									}
									fullWidth
									style={{
										borderRadius: "23px",
									}}
								>
									{buttonMatches ? null : "Photo/Video"}
								</Button>
							</Grid>
							<Grid item xs={4}>
								<Button
									onClick={openPostUrl}
									startIcon={
										<PostAddIcon
											style={{ color: "#f3425f" }}
										/>
									}
									fullWidth
									style={{
										borderRadius: "23px",
									}}
								>
									{buttonMatches ? null : "Files"}
								</Button>
							</Grid>
						</Grid>
						<Dialog
							open={open}
							fullWidth
							maxWidth={"sm"}
							TransitionComponent={Transition}
							keepMounted
							onClose={handleClose}
						>
							<DialogTitle
								style={{ margin: "2%", padding: "0px 9px" }}
							>
								<Grid
									container
									justifyContent="space-between"
									alignItems="center"
								>
									<Typography variant="div">
										Create Post
									</Typography>
									<CloseIcon
										onClick={handleClose}
										style={{ cursor: "pointer" }}
									/>
								</Grid>
							</DialogTitle>
							<DialogContent style={{ padding: "0" }}>
								<UPB handleClose={handleClose} />
							</DialogContent>
						</Dialog>
					</div>
				</div>
			</div>
		</Paper>
	);
}

export default UploadPostBox;
