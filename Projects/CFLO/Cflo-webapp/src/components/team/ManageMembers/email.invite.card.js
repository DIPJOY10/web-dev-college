import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Paper, Tooltip } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActionArea from "@material-ui/core/CardActionArea";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import Badge from "@material-ui/core/Badge";
import Chip from "@material-ui/core/Chip";
import MemberAutocomplete from "../Autocomplete";
import teamUtils from "../team.utils";
import EmailForm from "../../styled/email.form";
import Api from "../../../helpers/Api";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import AssignmentIndIcon from "@material-ui/icons/AssignmentInd";

const {
	checkRole,
	_evaluateMutualPermission,
	_createInvites,
	_createEmailInvite,
} = teamUtils;

const useStyles = makeStyles({
	root: {
		flex: 1,
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		paddingTop: "3rem",
	},

	cardStyle: {
		display: "flex",
		maxWidth: "100%",
		borderRadius: "8px",
	},

	addMemberDiv: {
		margin: 20,
		maxWidth: "32rem",
	},
	rowDiv: {
		flex: 1,
		display: "flex",
		flexDirection: "row",
	},
	avatarStyle: {
		height: 25,
		width: 25,
	},
	nameStyle: {
		fontSize: 14,
		fontWeight: "500",
		marginLeft: 10,
		color: "#424242",
		flex: 1,
	},
	chipStyle: {
		height: 23,
		margin: 5,
		marginBottom: -15,
	},
	inviteChipStyle: {
		height: 28,
		width: 100,
	},
	inviteAllChipStyle: {
		height: 38,
		width: 100,
		fontSize: "1.0rem",
		alignSelf: "flex-end",
		marginLeft: "30%",
		marginBottom: "2rem",
	},
});

const EmailCard = (props) => {
	const { teamId, invite, team: teamProp } = props;
	const classes = useStyles();
	const {
		root,
		cardStyle,
		rowDiv,
		avatarStyle,
		nameStyle,
		addMemberDiv,
		chipStyle,
		inviteChipStyle,
		inviteAllChipStyle,
	} = classes;

	const [emailRoleMap, setEmailRoleMap] = useState({});

	const { teamDictionary, selectedMembers } = useSelector(
		(state) => state.team
	);
	const [newTeamMemberRole, setNewTeamMemberRole] = useState({});

	const { user } = useSelector((state) => state.auth);
	const dispatch = useDispatch();
	const role = invite?.role;
	const email = invite?.email;
	const team = teamDictionary[teamId] || teamProp;

	return (
		<Paper variant="outlined" className={cardStyle}>
			<CardContent
				style={{
					overflow: "hidden",
					paddingBottom: "15px",
					display: "flex",
					flexDirection: "column",
					gap: "7px",
					padding: "0.9rem 0.7rem",
				}}
			>
				<Tooltip title={email}>
					<div className={rowDiv}>
						<MailOutlineIcon className={avatarStyle} />

						<Typography
							className={nameStyle}
							style={{
								overflow: "hidden",
								textOverflow: "ellipsis",
							}}
						>
							{email}
						</Typography>
					</div>
				</Tooltip>

				{
					<div className={rowDiv}>
						{_evaluateMutualPermission(
							false,
							user.profile,
							team
						).roles.map((role) => {
							const isChipSelected =
								role === "Viewer" ? true : false;

							return (
								<Chip
									label={role}
									size="small"
									variant="outlined"
									style={{
										borderColor: "#a9a9a9",
									}}
									icon={<AssignmentIndIcon />}

									// onClick={() => {
									// 	setEmailRoleMap({
									// 		...emailRoleMap,
									// 		..._.set({}, email, role),
									// 	});
									// }}
								/>
							);
						})}
					</div>
				}
			</CardContent>
		</Paper>
	);
};

export default EmailCard;
