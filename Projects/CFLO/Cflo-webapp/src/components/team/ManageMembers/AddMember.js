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
		// flexDirection: 'column',
		justifyContent: "space-around",
		// justifyContent: 'center',
		// alignItems: "center",
		paddingTop: "3rem",
	},

	cardStyle: {
		maxWidth: "32rem",
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

const AddMember = (props) => {
	const { teamId, invites, setInvites } = props;
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

	const [emails, setEmails] = useState([]);
	const [emailMemberMap, setEmailMemberMap] = useState({});
	const [emailRoleMap, setEmailRoleMap] = useState({});

	const { teamDictionary, selectedMembers } = useSelector(
		(state) => state.team
	);
	const [newTeamMemberRole, setNewTeamMemberRole] = useState({});

	const { user } = useSelector((state) => state.auth);
	const dispatch = useDispatch();

	const team = teamDictionary[teamId];
	const inviteeIds = [];
	const inviteeEmails = [];
	invites.map((invite) => {
		if (invite?.invitee?._id) {
			inviteeIds.push(invite.invitee._id);
		}

		if (invite?.email) {
			inviteeEmails.push(invite.email);
		}

		return null;
	});

	const _createPlatformInvites = (memberRoles, team, user) => {
		_createInvites(memberRoles, team, user).then((res) => {
			const results = res.result;
			if (results && results.length > 0) {
				setInvites([...invites, ...results]);
			}
		});
	};

	const searchAndEmailAdd = (email) => {
		const newSet = new Set(emails);
		newSet.add(email);

		setEmails(Array.from(newSet));

		Api.post("search/email", {
			email,
		}).then((res) => {
			const { entities } = res;

			if (entities.length > 0) {
				const member = entities[0];
				setEmailMemberMap({
					...emailMemberMap,
					..._.set({}, email, member),
				});
			}
		});
	};

	return (
		<div className={root}>
			<div>
				<Typography>Search and invite by email</Typography>
				<EmailForm
					addEmail={searchAndEmailAdd}
					label={"Add Email to invite"}
				/>
			</div>
			<div>
				<Typography>Search on our network</Typography>
				<MemberAutocomplete />
			</div>

			<>
				{/* below checks email invites and show cards for the same */}
				{emails.map((email) => {
					const isInvited =
						inviteeEmails.indexOf(email) === -1 ? false : true;

					return (
						<Paper variant="outlined" className={cardStyle}>
							<CardContent>
								<div className={rowDiv}>
									<MailOutlineIcon className={avatarStyle} />

									<Typography className={nameStyle}>
										{email}
									</Typography>
									{isInvited ? (
										<Chip
											label={
												isInvited
													? "Resend Mail"
													: "Send Mail"
											}
											color="disabled"
										/>
									) : (
										<Chip
											label={"Send Invite"}
											color="primary"
											className={inviteChipStyle}
											onClick={() => {
												const role = _.hasIn(
													emailRoleMap,
													email
												)
													? _.get(emailRoleMap, email)
													: "Editor";

												_createEmailInvite(
													email,
													role,
													team,
													user
												);
											}}
										/>
									)}
								</div>

								{
									<div className={rowDiv}>
										{_evaluateMutualPermission(
											false,
											user,
											team
										).roles.map((role) => {
											let isChipSelected =
												role === "Viewer"
													? true
													: false;

											if (_.hasIn(emailRoleMap, email)) {
												const oldRole = _.get(
													emailRoleMap,
													email
												);
												isChipSelected =
													role === oldRole;
											}

											return (
												<Chip
													label={role}
													className={chipStyle}
													color={
														isChipSelected
															? "primary"
															: "disabled"
													}
													onClick={() => {
														setEmailRoleMap({
															...emailRoleMap,
															..._.set(
																{},
																email,
																role
															),
														});
													}}
												/>
											);
										})}
									</div>
								}
							</CardContent>
						</Paper>
					);
				})}
{/*  below is for search in our network invites. the autocomplete stores selectedmembers in redux store and we access them here */}
				{selectedMembers.map((member) => {
					const memberId = member._id;
					const participants = team?.participants
						? team.participants
						: [];
					if (participants.indexOf(memberId) === -1) {
						const { displayName, displayPicture } = member;

						const roleObject = checkRole(member, team);
						const isMember = roleObject.isMember;
						const isInvited =
							inviteeIds.indexOf(member._id) === -1
								? false
								: true;

						return (
							<Paper variant="outlined" className={cardStyle}>
								<CardContent>
									<div className={rowDiv}>
										<Avatar
											className={avatarStyle}
											alt={displayName}
											src={displayPicture.thumbUrl}
										/>
										<Typography className={nameStyle}>
											{member.displayName}
										</Typography>
										{isMember || isInvited ? (
											<Chip
												label={
													isInvited
														? "Invited"
														: roleObject.role
												}
												color="disabled"
											/>
										) : (
											<Chip
												label={"Send Invite"}
												color="primary"
												className={inviteChipStyle}
												onClick={() => {
													const memberRole = {
														member,
														role: _.hasIn(
															newTeamMemberRole,
															member._id
														)
															? _.get(
																	newTeamMemberRole,
																	member._id
															  )
															: "Viewer",
													};
													// console.log(memberRole,' is the memeberRole')
													_createPlatformInvites(
														[memberRole],
														team,
														user
													);
												}}
											/>
										)}
									</div>

									{isMember || isInvited ? null : (
										<div className={rowDiv}>
											{_evaluateMutualPermission(
												member,
												user,
												team
											).roles.map((role) => {
												let isChipSelected =
													role === "Viewer"
														? true
														: false;

												if (
													_.hasIn(
														newTeamMemberRole,
														member._id
													)
												) {
													const oldRole = _.get(
														newTeamMemberRole,
														member._id
													);
													isChipSelected =
														role === oldRole;
												}

												return (
													<Chip
														label={role}
														className={chipStyle}
														color={
															isChipSelected
																? "primary"
																: "disabled"
														}
														onClick={() => {
															setNewTeamMemberRole(
																{
																	...newTeamMemberRole,
																	..._.set(
																		{},
																		member._id,
																		role
																	),
																}
															);
														}}
													/>
												);
											})}
										</div>
									)}
								</CardContent>
							</Paper>
						);
					} else {
						return null;
					}
				})}
			</>
		</div>
	);
};

export default AddMember;
