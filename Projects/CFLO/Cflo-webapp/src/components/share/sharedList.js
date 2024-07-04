import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { Button, Chip, Divider, Switch } from "@material-ui/core";
import AvatarLocal from "../profile/avatar";
import BootstrapTooltip from "../styled/tooltip";
import AssignBtn from "./assign.icon.btn";
import LockIcon from "@material-ui/icons/Lock";
import PublicIcon from "@material-ui/icons/Public";
import LockOpenIcon from "@material-ui/icons/LockOpen";

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
		// flex: 1,
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		flexWrap: "wrap",
	},

	divider: {
		margin: "1rem",
	},

	paperStyle: {
		padding: "1rem",
		maxWidth: "34rem",
	},

	chipStyle: {
		marginRight: "0.5rem",
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

const SharedList = (sharedProps, isPrivate, setPrivate) => {
	const classes = useStyles();
	let {
		sharedDict,
		shared,
		setShared,
		assignableIds,
		assigned,
		setAssigned,
		openDialog,
		setOpenDialog,
		open,
		setOpen,
	} = sharedProps || {};
	console.log('sharedlist called with ', sharedDict, shared, assigned);

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

	const handleDeleteAssigned = (profileId) => {
		const isShared = shared.indexOf(profileId) !== -1;
		var sharedSet = new Set(shared);
		if (isShared) {
			sharedSet.delete(profileId);
		}
		const newArr = Array.from(sharedSet);
		setShared(newArr);
	};
	let privateButton = (
		<BootstrapTooltip title="Admin eyes means that only admins and assigned people can see private issue">
			<Button
				color={isPrivate ? "secondary" : "primary"}
				startIcon={isPrivate ? <LockIcon /> : <LockOpenIcon />}
				onClick={() => {
					setPrivate(!isPrivate);
				}}
			>
				{isPrivate ? "Only admin eyes (Private)" : "Shared with all"}
			</Button>
			{/* <Switch
				checked={isPrivate}
				onChange={(event) => {
					const checked = event.target.checked;
					setPrivate(checked);
				}}
				color="primary"
				name="checkedB"
				inputProps={{
					"aria-label": "primary checkbox",
				}}
			/> */}
		</BootstrapTooltip>
	);
	let assignButton = <AssignBtn setOpen={setOpenDialog} />;
	let assigness = (
		<div className={row}>
			{assigned?.length > 0 ? (
				<>
					{assigned.map((profileId) => {
						const profile = sharedDict[profileId];
						const entity = profile?.parent;
						if (entity?._id) {
							return (
								<Chip
									// size="small"
									variant="outlined"
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
										handleDeleteAssigned(profileId);
									}}
								/>
							);
						} else {
							return null;
						}
					})}
				</>
			) : (
				<Typography variant="h6">
					No Assigness. Click Add to add people.
				</Typography>
			)}
		</div>
	);
	let sharedPeoples = (
		<div className={row}>
			{(shared || []).map((profileId) => {
				const profile = sharedDict[profileId];
				const entity = profile?.parent;
				if (entity?._id) {
					return (
						<Chip
							// size="small"
							variant="outlined"
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
	);

	return { privateButton, assignButton, assigness, sharedPeoples };
};

export default SharedList;
