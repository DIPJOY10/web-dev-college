import React, { useState } from "react";
import { alpha, makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRocket, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import {
	Avatar,
	Button,
	InputBase,
	Paper,
	Popper,
	Typography,
} from "@material-ui/core";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import AddIcon from "@material-ui/icons/Add";

import DoneIcon from "@material-ui/icons/Done";
import moderationNavOptions from "./moderationNavOptions";
import { Autocomplete } from "@material-ui/lab";

const styleProps = {
	lightGray: "#ededed",
};

const useStyle = makeStyles((theme) => ({
	root: {
		// display: "flex",
		display: "flex",
		justifyContent: "space-between",
		// rowGap: "10px",
		padding: "10px",
		backgroundColor: "white",
		border: "1px solid lightgray",
		// borderRadius: "2px",
	},
	navOptions: {
		display: "flex",
		// // rowGap: "10px",
		// padding: "10px",
		// backgroundColor: "white",
		// border: "1px solid lightgray",
		// // borderRadius: "2px",
	},
	navOption: {
		backgroundColor: "white",
		color: "gray",
		borderRadius: "20px",
		paddingRigt: "8px",
		paddingLeft: "8px",
		fontSize: "14px",
		textTransform: "none",
		boxShadow: "none",
		marginRight: "10px",
		"&:hover": {
			backgroundColor: styleProps.lightGray,
			boxShadow: "none",
		},
	},
	navOptionIcon: {
		marginRight: "7px",
		fontSize: "20px",
	},
	navSelect: {
		border: "none",
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

function ModerationNav({
	navValue,
	setNavValue,
	adminProfiles,
	selectedProfile,
	loading,
	setSelectedProfile,
}) {
	const classes = useStyle();
	const [anchorEl, setAnchorEl] = React.useState(null);
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = (event, reason) => {
		if (reason === "toggleInput") {
			return;
		}
		if (anchorEl) {
			anchorEl.focus();
		}
		setAnchorEl(null);
	};
	const open = Boolean(anchorEl);
	// const [navValue, setNavValue] = useState("new");

	return (
		<Paper className={classes.root}>
			<div className={classes.navOptions}>
				<div>
					<Popper
						open={open}
						anchorEl={anchorEl}
						placement="bottom-start"
						className={classes.popper}
					>
						<div className={classes.header}>
							Apply labels to this pull request
						</div>
						<Autocomplete
							open
							onClose={handleClose}
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
										className={classes.AutocompleteAvatar}
										src={option?.displayPicture?.thumbUrl}
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
				<div
					style={{
						display: "flex",
						cursor: "pointer",
						alignItems: "center",
						gap: "7px",
						whiteSpace: "nowrap",
						overflow: "hidden",
						textOverflow: "ellipsis",
					}}
					onClick={handleClick}
				>
					<Avatar src={selectedProfile?.displayPicture?.thumbUrl} />
					<Typography
						style={{
							overflow: "hidden",
							textOverflow: "ellipsis",
							fontWeight: "500",
						}}
					>
						{selectedProfile?.displayName}
					</Typography>
				</div>
			</div>
		</Paper>
	);
}

export default ModerationNav;
