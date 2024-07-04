import React, { useState } from "react";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import PersonAddDisabledIcon from "@material-ui/icons/PersonAddDisabled";
import HourglassEmptyIcon from "@material-ui/icons/HourglassEmpty";
import { Avatar, IconButton, makeStyles, Typography } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import Api from "../../helpers/Api";

const useStyles = makeStyles((theme) => ({
	title: {
		cursor: "pointer",
		"&:hover": {
			textDecoration: "underline",
		},
		overflow: "hidden",
		textOverflow: "ellipsis",
	},
}));

function PostSideBarMenu({ Obj, selectedProfile }) {
	const history = useHistory();
	const classes = useStyles();
	const [followed, setFollowed] = useState(false);
	const [loading, setLoading] = useState(false);

	const follow = async () => {
		setLoading(true);
		// write a follow function here. set followed to its !prev. follow/unfollow
		const res = await Api.post("follow/follow", {
			profile: Obj?.profile?._id,
			user: selectedProfile?._id,
			userProfile: selectedProfile?.profile,
		});
		if (res?.status != 400) {
			setFollowed(Boolean(res?.data));
		}
		console.log("resf = ", res);
		setLoading(false);
	};

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
					src={
						Obj?.displayPicture?.thumbUrl ||
						Obj?.displayPicture?.url
					}
					alt={Obj?.displayName}
				/>
				<Typography
					className={classes.title}
					onClick={() => {
						history.push(`/profile/view/${Obj?.profile?._id}`);
					}}
				>
					{Obj?.displayName}
				</Typography>
			</div>
			<IconButton
				onClick={loading ? null : follow}
				style={
					loading
						? {
								cursor: "not-allowed",
								outline: "1px solid #cf2c23",
								outlineOffset: "-2px",
						  }
						: {
								outline: "1px solid rgb(33, 150, 243)",
								outlineOffset: "-2px",
						  }
				}
			>
				{loading ? (
					<HourglassEmptyIcon />
				) : !followed ? (
					<PersonAddIcon style={{ color: "#2196f3" }} />
				) : (
					<PersonAddDisabledIcon style={{ color: "#2196f3" }} />
				)}
			</IconButton>
		</div>
	);
}

export default PostSideBarMenu;
