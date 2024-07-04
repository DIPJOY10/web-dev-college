import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import ButtonBase from "@material-ui/core/ButtonBase";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import moment from "moment";


const useStyles = makeStyles((theme) => ({
	root: {
		flex: 1,
		display: "flex",
		flexDirection: "row",
		minWidth:'15rem'
	},
	row: {
		flex: 1,
		display: "flex",
		flexDirection: "row",
	},
	row1: {
		flex: 1,
		display: "flex",
		flexDirection: "row",
	},
	titleText: {
		fontSize: "1rem",
		fontWeight: "600",
	},
	nameText: {
		fontSize: (props) => {
			if (props.size == "xs") {
				return "0.8rem";
			} else {
				return "1.0rem";
			}
		},
		fontWeight: "500",
	},

	avatarBox: {
		width: "2rem",
		padding: "0.7rem",
		[theme.breakpoints.down("sm")]: {
			padding: "0.3rem",
			marginRight: "0.4rem",
		},
	},
	dP: (props) => {
		if (props.size == "xs") {
			return {
				height: "1.1rem",
				width: "1.1rem",
			};
		} else {
			return {
				height: "1.2rem",
				width: "1.2rem",
			};
		}
	},
	textBox: {
		flex: 1,
		flexDirection: "column",
	},
}));

export default function IssuePaperCard(props) {
	const { issue, onSelect, size, counter, profileId } = props;
	const issueId = issue?._id;
	const history = useHistory();
	const classes = useStyles({ size });
	const user = issue?.user;
	const displayName = user?.displayName;
	const displayPicture = user?.displayPicture;

	return (
		<Paper

			className={classes.root}
			variant="outlined"
			square
		>
			<div className={classes.avatarBox}>
				<Avatar
					alt={displayName}
					src={displayPicture?.thumbUrl}
					className={classes.dP}
				/>
			</div>

			<div className={classes.textBox}>
				<div className={classes.row}>
					<div className={classes.row}>
						<Typography className={classes.nameText}>
							{displayName}
						</Typography>
					</div>
				</div>
				<div
					className={classes.row}

				>
					<Typography className={classes.titleText}>
						{issue?.title?.slice(0, 40)}
					</Typography>
				</div>
			</div>
		</Paper>
	);
}
