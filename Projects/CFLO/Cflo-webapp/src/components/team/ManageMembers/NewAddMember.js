import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import EmailAdd from "./email.add";
import PlatformAdd from "./platform.add";

const useStyles = makeStyles((theme) => ({
	root: {
		flex: 1,
		display: "flex",
		gap: "1rem",
		width: "100%",
		flexDirection: "row",
		// justifyContent: 'center',
		// justifyContent: "space-around",

		alignItems: "center",
		margin: "2rem auto",
		// paddingTop: "3rem",
		[theme.breakpoints.down("sm")]: {
			alignItems: "center",
			flexDirection: "column",
		},
	},
	item: {
		flex: 1,
	},
}));

const AddMember = (props) => {
	const classes = useStyles();

	return (
		<div className={classes.root}>
			<div className={classes.item} style={{ order: "-1" }}>
				<PlatformAdd {...props} />
			</div>
			<div
				style={{
					// minHeight: "3rem",
					// minWidth: "10px",
					border: "0.5px solid #d3d3d3",
					alignSelf: "stretch",
				}}
			></div>
			<div className={classes.item}>
				<EmailAdd {...props} />
			</div>
		</div>
	);
};

export default AddMember;
