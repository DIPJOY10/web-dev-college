import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import ButtonBase from "@material-ui/core/ButtonBase";
import Typography from "@material-ui/core/Typography";
import cx from "clsx";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import arrayToReducer from "../../helpers/arrayToReducer";
import Api from "../../helpers/Api";
import EntityListItem from "./user.list.item";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import List from "@material-ui/icons/List";
import useSharedData from "./useSharedData";
import { Chip, Switch } from "@material-ui/core";
import AvatarLocal from "../profile/avatar";

import ShareIconBtn from "./share.icon.btn";
import BootstrapTooltip from "../styled/tooltip";

const useStyles = makeStyles((theme) => ({
	root: {
		display: "flex",
		flexDirection: "column",
		minWidth: "18rem",
		maxWidth: "32rem",
		width: "90%",
		margin: "1rem",
	},

	row: {
		flex: 1,
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
	},

	paperStyle: {
		padding: "1rem",
		maxWidth: "32rem",
	},

	chipStyle: {
		margin: "0.5rem",
		maxWidth: "8rem",
	},
	shared: {
		fontWeight: "600",
		fontSize: "1.1rem",
	},
	private: {
		fontWeight: "500",
		fontSize: "0.95rem",
		margin: "0.5rem 0.5rem",
	},
}));

export default function AssignedList(props) {
	const classes = useStyles();
	const history = useHistory();
	const dispatch = useDispatch();

	const {
		sharedDict,
		shared,
		setShared,
		open,
		setOpen,
		isPrivate,
		setPrivate,
	} = props;

	//   console.log('sharedlist called with ',sharedDict, shared);

	const { root, row, col, paperStyle, chipStyle } = classes;

	const handleDelete = (profileId) => {
		const isShared = shared.indexOf(profileId) !== -1;
		var sharedSet = new Set(shared);
		if (isShared) {
			sharedSet.delete(profileId);
		}
		const newArr = Array.from(sharedSet);
		setShared(newArr);
	};

	return (
		<Paper className={cx(root, paperStyle)}>
			<div className={row}>
				<div className={row}>
					<Typography className={classes.shared}>Assigned</Typography>
				</div>

				<ShareIconBtn setOpen={setOpen} />
			</div>
			<div className={row}>
				{shared.map((profileId) => {
					const profile = sharedDict[profileId];
					const entity = profile?.parent;
					if (entity?._id) {
						return (
							<Chip
								size="small"
								className={chipStyle}
								avatar={
									<AvatarLocal
										src={entity}
										style={{
											height: "1.6rem",
											width: "1.6rem",
											borderRadius: "0.8rem",
										}}
									/>
								}
								label={entity?.displayName}
								onDelete={() => {
									handleDelete(profileId);
								}}
							/>
						);
					} else {
						return null;
					}
				})}
			</div>
		</Paper>
	);
}
