import React, { useEffect } from "react";
import { useTheme, alpha, makeStyles } from "@material-ui/core/styles";
import Popper from "@material-ui/core/Popper";
import SettingsIcon from "@material-ui/icons/Settings";
import CloseIcon from "@material-ui/icons/Close";
import DoneIcon from "@material-ui/icons/Done";
import Autocomplete from "@material-ui/lab/Autocomplete";
import ButtonBase from "@material-ui/core/ButtonBase";
import InputBase from "@material-ui/core/InputBase";
import StopIcon from "@material-ui/icons/Stop";

const useStyles = makeStyles((theme) => ({
	root: {
		width: 221,
		fontSize: 13,
		margin: "1rem 0",
		border: "1px solid #c7c7c7",
	},
	button: {
		fontSize: 13,
		width: "100%",
		textAlign: "left",
		paddingBottom: 8,
		color: "#586069",
		backgroundColor: "white",
		padding: "0.5rem 0.5rem",
		fontWeight: 600,
		"&:hover,&:focus": {
			color: "#0366d6",
		},
		"& span": {
			width: "100%",
		},
		"& svg": {
			width: 16,
			height: 16,
		},
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

export default function StatusPicker(props) {
	const classes = useStyles();
	const {
		status,
		setStatus,
		pipeline = [],
		startState = "",
		viewMode,
	} = props;
	// console.log("logging status ", props);

	const [anchorEl, setAnchorEl] = React.useState(null);
	const [value, setValue] = React.useState(status);

	const theme = useTheme();

	const handleClick = (event) => {
		// setStatus(value);
		setAnchorEl(event.currentTarget);
	};

	const handleClose = (event, reason) => {
		if (reason === "toggleInput") {
			return;
		}
		setValue(status);
		if (anchorEl) {
			anchorEl.focus();
		}
		setAnchorEl(null);
	};

	const open = Boolean(anchorEl);
	const id = open ? "github-label" : undefined;

	useEffect(() => {
		if (!viewMode) {
			if (!status && pipeline?.length > 0) {
				let startStatearr = pipeline.filter(
					(obj) => obj?._id == startState
				)[0];
				if (startStatearr?.length == 0) {
					startStatearr = pipeline[0];
				}
				setStatus(startStatearr);
				setValue(startStatearr);
			}
		}
	}, [pipeline]);

	return (
		<React.Fragment>
			<div className={classes.root}>
				<ButtonBase
					disableRipple
					className={classes.button}
					aria-describedby={id}
					onClick={handleClick}
				>
					<span>Status</span>
					<SettingsIcon />
				</ButtonBase>
				{status?._id ? (
					<div
						key={status?._id}
						className={classes.tag}
						style={{
							// backgroundColor: status?.color,
							// color: theme.palette.getContrastText(status?.color)
							fontWeight: 600,
							color: "black",
							borderTop: "1px solid #c7c7c7",
						}}
					>
						<div
							style={{
								display: "flex",
								alignItems: "center",
							}}
						>
							<div
								style={{
									width: "1em",
									height: "1em",
									backgroundColor: status?.color,
									marginRight: "0.5rem",
									borderRadius: "5px",
								}}
							>
								{" "}
							</div>
							{status?.text}
						</div>
					</div>
				) : null}
			</div>

			<Popper
				id={id}
				open={open}
				anchorEl={anchorEl}
				placement="bottom-start"
				className={classes.popper}
			>
				<div className={classes.header}>Choose status of the Issue</div>
				<Autocomplete
					open
					onClose={handleClose}
					classes={{
						paper: classes.paper,
						option: classes.option,
						popperDisablePortal: classes.popperDisablePortal,
					}}
					options={pipeline || []}
					value={status}
					onChange={(event, newValue) => {
						setStatus(newValue);
						setValue(newValue);
						// handleClose();
					}}
					// disableCloseOnSelect
					disablePortal
					renderOption={(option, { selected }) => (
						<React.Fragment>
							<span
								className={classes.color}
								style={{ backgroundColor: option?.color }}
							/>
							<div className={classes.text}>
								{option?.text}
								<br />
								{option?.description}
							</div>
						</React.Fragment>
					)}
					getOptionLabel={(option) => option?.text}
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
		</React.Fragment>
	);
}
