import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import Chip from "@material-ui/core/Chip";
import moment from "moment";
import Paper from "@material-ui/core/Paper";
import EmailInviteCard from "./email.invite.card";
import PlatformInviteCard from "./platform.invite.card";
import { CircularProgress } from "@material-ui/core";

const useStyles = makeStyles({
	rowDiv: {
		flex: 1,
		display: "flex",
		flexDirection: "row",
		flexWrap: "wrap",
	},

	grid: {
		display: "grid",
		gridGap: "6px",
		gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
	},

	paperStyle: {
		maxWidth: "17rem",
		margin: "0.5rem",
	},

	chipStyle: {
		marginLeft: "1rem",
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
	createdTimeText: {
		textAlign: "right",
		color: "#757575",
		fontSize: "12px",
	},
});

const Invites = (props) => {
	const { teamId, invites, invitesLoading } = props;
	const classes = useStyles();
	const { rowDiv, avatarStyle, nameStyle } = classes;

	const { user } = useSelector((state) => state.auth);
	const dispatch = useDispatch();

	const [emailInvites, setEmailInvites] = useState([]);
	const [platformInvites, setPlatformInvites] = useState([]);

	useEffect(() => {
		const eInvites = [];
		const pInvites = [];

		invites.map((invite) => {
			if (invite.email) {
				eInvites.push(invite);
			} else {
				pInvites.push(invite);
			}

			setEmailInvites(eInvites);
			setPlatformInvites(pInvites);
		});
	}, [invites]);
	return (
		<div>
			{invitesLoading ? (
				<div style={{ display: "flex", justifyContent: "center" }}>
					<CircularProgress />
				</div>
			) : (
				<>
					{emailInvites.length == 0 && platformInvites.length == 0 ? (
						<div>
							<Typography
								align="center"
								gutterBottom
								variant="h6"
								style={{
									marginBottom: "1rem",
									fontWeight: "500",
								}}
							>
								{" "}
								You have no Invites. To invite someone, go to
								Add People
							</Typography>
						</div>
					) : (
						<>
							{emailInvites.length > 0 && (
								<Typography
									gutterBottom
									variant="h6"
									style={{
										marginBottom: "1rem",
										fontWeight: "500",
									}}
								>
									Email Invites
								</Typography>
							)}
							<div
								className={classes.grid}
								style={{ marginBottom: "1rem" }}
							>
								{emailInvites.map((invite) => {
									return (
										<EmailInviteCard
											teamId={invite?.team?._id}
											invite={invite}
											team={invite.team}
										/>
									);
								})}
							</div>
							{platformInvites.length > 0 && (
								<Typography
									gutterBottom
									variant="h6"
									style={{
										marginBottom: "1rem",
										fontWeight: "500",
									}}
								>
									Platform Invites
								</Typography>
							)}
							<div className={classes.grid}>
								{platformInvites.map((invite) => {
									return (
										<PlatformInviteCard
											teamId={teamId}
											invite={invite}
										/>
									);
								})}
							</div>
						</>
					)}
				</>
			)}
		</div>
	);
};

export default Invites;
