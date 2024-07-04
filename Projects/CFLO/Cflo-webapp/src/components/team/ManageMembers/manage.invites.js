import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import ButtonBase from "@material-ui/core/ButtonBase";
import Typography from "@material-ui/core/Typography";
import Invites from "./invites";

const useStyles = makeStyles((theme) => ({
	root: {
		width: "100%",
		marginTop: "1rem",
	},

	row: {
		flex: 1,
		display: "flex",
		flexDirection: "row",
	},

	row: {
		flex: 1,
		display: "flex",
		flexDirection: "column",
	},
}));
export default function ManageInvites(props) {
	const { teamId, invites, invitesLoading } = props;
	const classes = useStyles();
	const history = useHistory();
	const dispatch = useDispatch();

	const {} = useSelector((state) => state);

	const { root, row, col } = classes;

	return (
		<div className={root}>
			<Invites
				teamId={teamId}
				invites={invites}
				invitesLoading={invitesLoading}
			/>
		</div>
	);
}
