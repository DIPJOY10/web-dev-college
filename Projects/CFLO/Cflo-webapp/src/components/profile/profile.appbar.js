import React, { useRef, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import {
	AppBar,
	Divider,
	Toolbar,
	IconButton,
	Typography,
	useScrollTrigger,
	useMediaQuery,
} from "@material-ui/core";

import { useParams, useHistory } from "react-router-dom";
import AvatarLocal from "./avatar";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import Setting from "../appbar/settings";
import Notification from "../appbar/notification";

import BackspaceIcon from "@material-ui/icons/Backspace";

import { drawerWidthTheme } from "../../utils/theme.js"

const drawerWidth = drawerWidthTheme?.width;
const foldedWidth = drawerWidthTheme?.smWidth;

const useStyles = makeStyles((theme) => ({
	grow: {
		flexGrow: 0,
		flexDirection: "column",
	},

	appBarStyle: {
		borderColor: "grey",
		backgroundColor: "white",
		boxShadow: "rgba(33, 35, 38, 0.1) 0px 10px 10px -10px"
	},

	row: {
		display: "flex",
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
	},

	toolbar: {
		backgroundColor: "white",
		borderColor: "grey",
		flex: 1,
		marginTop: "-0.3rem",
		marginLeft: drawerWidth,
		[theme.breakpoints.down("sm")]: {
			marginLeft: foldedWidth,
		},
		[theme.breakpoints.down("xs")]: {
			marginLeft: 0,
		},
		color: "#48494a",
	},

	menuIcon: {
		height: "24px",
		width: "24px",
		"& path": {
			fill: "rgba(0, 0, 0, 0.26)",
		},
	},

	iconButtonStyle: {
		// marginTop: "0.5rem",
		// marginRight: "1rem",
		// marginLeft: "-1rem",
		color: theme.palette.primary.main,
	},

	nameStyle: {
		fontWeight: "bold",
		fontSize: "1.3rem",
		[theme.breakpoints.down('xs')]: {
			fontSize: "18px",
		}
	},
}));

export default function ProfileAppbar(props) {
	const { profile, name, btns, isUser, marginTop } = props;
	const classes = useStyles();
	const theme = useTheme();
	const history = useHistory();
	const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

	const dispatch = useDispatch();
	const [searchTerm, setSearchTerm] = useState("");
	const [isProfilePopoverOpen, setProfilePopoverOpen] = useState(false);
	const [isSearchShowingInMobile, setSearchShowing] = useState(false);
	const profileMenuRef = useRef();
	const trigger = useScrollTrigger({
		disableHysteresis: true,
		threshold: 0,
	});

	return (
		<AppBar elevation={trigger ? 4 : 0} className={classes.appBarStyle}>
			<Toolbar className={classes.toolbar} style={marginTop ? { marginTop: marginTop } : {}} >
				<div className={classes.row}>
					<div className={classes.row}>
						{isUser ? null : <IconButton
							className={classes.iconButtonStyle}
							onClick={() => {
								history.goBack();
							}}
						>
							<KeyboardBackspaceIcon
								style={{
									fontSize: 30,
									color: theme.palette.primary,
								}}
							/>
						</IconButton>}

						<Typography className={classes.nameStyle}>
							{name}
						</Typography>
					</div>
				</div>
				{btns ? btns : null}
				{profile?._id ? (

					<>
						{isMobile ? null : (
							<Typography>
								{profile?.parent?.displayName}
							</Typography>
						)}

						<AvatarLocal
							src={profile?.parent}
							style={{
								height: "1.5rem",
								width: "1.5rem",
								margin: "0.5rem",
							}}
						/>
					</>
				) : null}
				{isUser ? <>

					<Notification className={classes.menuIcon} />
					<Setting className={classes.menuIcon} />

				</> : null}
			</Toolbar>
		</AppBar>
	);
}
