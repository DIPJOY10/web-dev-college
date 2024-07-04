import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import ButtonBase from "@material-ui/core/ButtonBase";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Api from "../../helpers/Api";
import AddIcon from "@material-ui/icons/Add";
import cx from "clsx";
import DoneIcon from "@material-ui/icons/Done";
import HourglassEmptyIcon from "@material-ui/icons/HourglassEmpty";
import { createGenerateClassName, IconButton } from "@material-ui/core";
// import baseStyle from "./styled/base/index";

const useStyles = makeStyles((theme) => ({
	paper: {
		padding: "10px",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
	},

	title: {
		color: "rgba(0, 0, 0, 0.80)",
	},

	caption: {
		color: "rgba(0, 0, 0, 0.67)",
	},

	button: {
		color: "white",
		backgroundColor: theme.palette.primary.main,
		width: "100%",
		marginTop: "40px",
		cursor: "pointer",
	},

	avatar: {
		// backgroundColor: theme.palette.primary.light,
		width: "60px",
		height: "60px",
		marginBottom: "10px",
		border: `2px solid ${theme.palette.primary.main}`,
	},
	title: {
		cursor: "pointer",
		"&:hover": {
			textDecoration: "underline",
		},
		overflow: "hidden",
		textOverflow: "ellipsis",
	},
}));

function Community({ community, selectedProfile }) {
	const classes = useStyles();
	const history = useHistory();
	const dispatch = useDispatch();
	const [joined, setJoined] = useState(false);
	const [loading, setLoading] = useState(false);
	const communityName = community?.displayName
	const joinCommunity = async () => {
		setLoading(true);
		const joinRes = await Api.post("join/create", {
			user: selectedProfile?._id,
			profile: selectedProfile?.profile,
			community: community?._id,
			communityProfile: community?.profile,
		});
		setJoined(Boolean(joinRes?.join));
		setLoading(false);
	};
	// console.log(followers);
	return (
		<div
			style={{
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center",
				marginBottom: "0.7rem",
			}}
		>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					gap: "7px",
					flex: 1,
					whiteSpace: "nowrap",
					overflow: "hidden",
					textOverflow: "ellipsis",
				}}
			>
				<Avatar
					src={community?.displayPicture || "https://cdn3.iconfinder.com/data/icons/dashboard-ui-element/32/Dashboard_icon_design_expanded-28-512.png"}
					alt={community?.displayName || "/c"}
				/>
				<Typography
					className={classes.title}
					onClick={() => {
						history.push("/explore/forum/communities/" + community?.slug);
					}}
				>
					{"c/" + communityName}
				</Typography>
			</div>
			<IconButton
				onClick={loading ? null : joinCommunity}
				style={loading ? { cursor: "not-allowed" } : null}
			>
				{loading ? (
					<HourglassEmptyIcon />
				) : joined ? (
					<DoneIcon style={{ color: "green" }} />
				) : (
					<AddIcon style={{ color: "#2196f3" }} />
				)}
			</IconButton>
		</div>
	);
}

export default Community;
