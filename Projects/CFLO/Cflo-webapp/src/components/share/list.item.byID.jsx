import React, { useState, useEffect } from "react";
import ListItem from "@material-ui/core/ListItem";
import { makeStyles } from "@material-ui/core/styles";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Checkbox from "@material-ui/core/Checkbox";
import IssueSvg from "../../Assets/issue.svg";
import docImage from "../../Assets/FileIcon/docs.png";
import { Avatar, Radio, Typography } from "@material-ui/core";
import html2plaintext from "html2plaintext";

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

const EntityListItemByID = (props) => {
	const classes = useStyles();
	const Obj = props?.entity;
	const docMode = props?.docMode;
	const shared = props?.shared;
	const radioMode = props?.radioMode;
	const setShared = props?.setShared;
	const Id = Obj?._id;
	const setParentObject = props?.setParentObject;

	const handleToggle = (Id) => {
		const isShared = shared.indexOf(Id) !== -1;
		var sharedSet = new Set(shared);
		if (isShared) {
			sharedSet.delete(Id);
		} else {
			sharedSet.add(Id);
		}
		const newArr = Array.from(sharedSet);
		setShared(newArr);
	};
	const handleRadioToggle = (Id) => {
		setShared([Id]);
		if (setParentObject) {
			setParentObject(Obj);
		}
	};

	return (
		<ListItem className={classes.row}>
			<div className={classes.row}>
				<ListItemAvatar>
					<Avatar
						src={docMode ? docImage : IssueSvg}
						style={{
							height: "1.6rem",
							width: "1.6rem",
							borderRadius: "0.8rem",
						}}
						variant={docMode ? "square" : "circular"}
					/>
				</ListItemAvatar>

				<ListItemText
					style={{
						overflow: "hidden",
						textOverflow: "ellipsis",
						width: "3rem",
						flex: "0 0 100%",
					}}
					id={Obj?._id}
					primary={Obj?.title || " "}
					// could add desc in doc mode in secondary. look for list item text overflow
					secondary={
						docMode
							? html2plaintext(Obj?.description)
							: Obj?.template?.title || "No Template"
					}
					secondaryTypographyProps={{
						noWrap: true,
						style: { width: "70%" },
						component: "div",
					}}
				/>
			</div>

			{radioMode ? (
				<Radio
					color="primary"
					value={Id}
					checked={(shared || []).indexOf(Id) !== -1}
					onChange={() => handleRadioToggle(Id)}
				/>
			) : (
				<Checkbox
					edge="end"
					onChange={() => handleToggle(Id)}
					checked={shared.indexOf(Id) !== -1}
					color="primary"
				/>
			)}
		</ListItem>
	);
};

export default EntityListItemByID;
