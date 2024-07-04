import React, { useState, useEffect } from "react";
import ListItem from "@material-ui/core/ListItem";
import { makeStyles } from "@material-ui/core/styles";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Checkbox from "@material-ui/core/Checkbox";
import IssueSvg from "../../../Assets/issue.svg";
import { Avatar, Radio, Typography } from "@material-ui/core";
import html2plaintext from "html2plaintext";
import arrayToReducer from "../../../helpers/arrayToReducer";

const useStyles = makeStyles((theme) => ({
	row: {
		flex: 1,
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
	},

	itemStyle: {
		minWidth: "18rem",
	},
}));

const EntityListItemByID = ({entity}) => {
	const classes = useStyles();


	return (

			<div className={classes.row}>
				<ListItemAvatar>
					<Avatar
						src={IssueSvg}
						style={{
							height: "1.6rem",
							width: "1.6rem",
							borderRadius: "0.8rem",
						}}
						variant={"square"}
					/>
				</ListItemAvatar>

				<ListItemText
					style={{
						overflow: "hidden",
						textOverflow: "ellipsis",
						width: "3rem",
						flex: "0 0 100%",
					}}
					id={entity?._id}
					primary={entity?.title || " "}
					// could add desc in doc mode in secondary. look for list item text overflow

				/>
			</div>

	);
};

export default EntityListItemByID;
