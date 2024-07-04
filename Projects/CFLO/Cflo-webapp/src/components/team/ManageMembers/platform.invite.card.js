import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Paper } from "@material-ui/core";
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
import moment from "moment";
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
	cardContent: {
		width: "100%",
		display: "flex",
		paddingBottom: "0",
		gap: "12px",
		padding: "0.9rem 0.7rem",
		flexDirection: "column",
	},

	addMemberDiv: {
		margin: 20,
		maxWidth: "32rem",
	},
	rowDiv: {
		flex: 1,
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
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
	createdTimeText: {
		textAlign: "right",
		fontSize: "0.8rem",
		fontFamily: "Inter",
		fontWeight: "400",
		lineHeight: "1",
	},
});

const EmailCard = (props) => {
	const { teamId, invite } = props;
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
	const invitee = invite?.invitee;
	const invitedById = invite?.invitedById;

	const inviteeName = invitee?.parent?.displayName;

	const inviteeDP = invitee?.parent?.displayPicture;
	const inviteeDPUrl = inviteeDP?.thumbUrl
		? inviteeDP?.thumbUrl
		: inviteeDP?.url;
	const invitedByName = invitedById?.parent?.displayName;

	const invitedByDP = invitedById?.parent?.displayPicture;

	return (
		<Paper variant="outlined" className={classes.cardStyle}>
			<CardContent
				className={classes.cardContent}
				style={{ paddingBottom: "15px" }}
			>
				<div className={rowDiv}>
					<Avatar
						className={avatarStyle}
						alt={inviteeName}
						src={inviteeDPUrl}
					/>
					<Typography className={nameStyle}>{inviteeName}</Typography>
					<Chip label={"Invited"} color="disabled" size={"small"} />
				</div>
				<div>
					<Typography className={classes.createdTimeText}>
						{moment(invite.createdAt).format("DD MMM YYYY")}
					</Typography>
					<div>
						<Chip
							label={role}
							size="small"
							variant="outlined"
							style={{
								borderColor: "#a9a9a9",
							}}
							icon={<AssignmentIndIcon />}
						/>
					</div>
				</div>
			</CardContent>
		</Paper>
	);
};

export default EmailCard;
