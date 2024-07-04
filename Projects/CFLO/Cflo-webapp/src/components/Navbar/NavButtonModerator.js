import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useMediaQuery, ButtonBase, Box } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
	buttonStyle: {
		alignSelf: "center",
		display: "flex",
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		width: "15rem",
		height: "2.8rem",
		borderRadius: "3%",
		boxShadow: "none",
		borderWidth: "1px",
		marginLeft: "2rem",

		[theme.breakpoints.down("sm")]: {
			maxWidth: "100%",
			marginLeft: 0,
			marginBottom: 0,
		},
	},

	fabStyle: {
		height: "1rem",
		width: "1rem",
	},
	iconStyles: {
		color: theme.palette.action.disabled,
		margin: 0,
	},
	iconStylesSelected: {
		color: theme.palette.primary.main,
		margin: 0,
	},
	gridStyle: {
		// display:'flex',
		borderWidth: 0,
		borderColor: "grey",
	},
	textStyle: {
		fontSize: "1.2rem",
		marginTop: "3px",
		marginLeft: "1rem",
		color: theme.palette.action.disabled,
		fontWeight: "600",
		alignSelf: "flex-start",
	},
	selected: {
		color: theme.palette.primary.main,
	},
	imgStyle: {
		marginLeft: "2rem",
	},
}));

export default function NavbuttonModeration(props) {
	const classes = useStyles();
	const location = useLocation();
	const pathname = location["pathname"];
	const theme = useTheme();
	const history = useHistory();
	const dispatch = useDispatch();
	const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
	const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
	const Icon = props.icon;
	const index = props.index;
	const link = props.link;
	const text = props.text;
	const selected = location.search === `?${link}` ? true : false;

	const iconClass = selected
		? classes.iconStylesSelected
		: classes.iconStyles;
	return (
		<Box
			marginBottom={isMobile ? "0.5rem" : "1rem"}
			marginTop={isMobile ? "0.5rem" : "0"}
			display={"flex"}
			flexDirection={"row"}
			justifyContent="center"
			width={isSmall ? (isMobile ? "20%" : "100%") : "15rem"}
			maxWidth={isSmall ? "100%" : "15rem"}
		>
			<ButtonBase
				classes={{
					root: classes.buttonStyle,
				}}
				className={classes.buttonStyle}
				onClick={() => {
					history.push({
						pathname: pathname,
						search: `${link}`,
					});
				}}
			>
				{isSmall ? (
					<Icon fontSize="large" className={iconClass} />
				) : (
					<Box
						display={"flex"}
						flexDirection={"row"}
						alignItems="center"
						width={"100%"}
					>
						<Icon fontSize="large" className={iconClass} />
						<Typography
							className={clsx(
								classes.textStyle,
								selected && classes.selected
							)}
						>
							{text}
						</Typography>
					</Box>
				)}
			</ButtonBase>
		</Box>
	);
}
