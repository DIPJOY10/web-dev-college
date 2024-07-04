import React, { useState, useEffect } from "react";
import ListItem from "@material-ui/core/ListItem";
import { makeStyles } from "@material-ui/core/styles";

import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Checkbox from "@material-ui/core/Checkbox";

import AvatarLocal from "../profile/avatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import { Radio, Typography } from "@material-ui/core";

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

const EntityListItem = (props) => {
	const classes = useStyles();

	const entity = props?.entity?.parent;
	const shared = props?.shared;
	const radioMode = props?.radioMode;
	const setShared = props?.setShared;
	const profileId = entity?.profile;
	const setCurrentProjectObj = props?.setCurrentProjectObj;
	const setParentObject = props?.setParentObject;

	const handleToggle = (profileId) => {
		if(Array.isArray(shared)) {
			const isShared = shared.indexOf(profileId) !== -1;
			var sharedSet = new Set(shared);
			if (isShared) {
				sharedSet.delete(profileId);
			} else {
				sharedSet.add(profileId);
			}
			const newArr = Array.from(sharedSet);
			setShared(newArr);
		}

	};
	const handleRadioToggle = (profileId) => {
		setShared([profileId]);
		if (setCurrentProjectObj) {
			setCurrentProjectObj(entity);
		}
		if (setParentObject) {
			setParentObject(entity);
		}
	};

	return (
		<ListItem className={classes.row}>
			<div className={classes.row}>
				<ListItemAvatar>
					<AvatarLocal
						src={entity}
						style={{
							height: "1.6rem",
							width: "1.6rem",
							borderRadius: "0.8rem",
						}}
					/>
				</ListItemAvatar>

				<ListItemText
					id={entity?._id}
					primary={entity?.displayName || []}
				/>
			</div>

			{radioMode ? (
				<Radio
					color="primary"
					value={profileId}
					checked={(shared || []).indexOf(profileId) !== -1}
					onChange={() => handleRadioToggle(profileId)}
				/>
			) : (
				<Checkbox
					edge="end"
					onChange={() => handleToggle(profileId)}
					checked={shared.indexOf(profileId) !== -1}
					inputProps={{ "aria-labelledby": entity?._id }}
					color="primary"
				/>
			)}
		</ListItem>
	);
};

export default EntityListItem;
