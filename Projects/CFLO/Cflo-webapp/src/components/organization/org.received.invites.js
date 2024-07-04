import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import RecievedInvitesCard from "../team/ManageMembers/platform.invite.receive.card";


const useStyles = makeStyles((theme) => ({
	tableBodyCont: {
		width: "100%",
		display: "flex",
		justifyContent: "space-around",
		alignItems: "center",
		flexWrap: "wrap",
		[theme.breakpoints.down('sm')]: {

		},
		[theme.breakpoints.down('xs')]: {

		},
	},
}))


function ReceivedInvite(props) {
	const history = useHistory();
	const classes = useStyles();
	const dispatch = useDispatch();
	const theme = useTheme();
	const { addCreatedOne } = props;

	let { invitations: allInvitations } = useSelector((state) => state.team);
	const { auth } = useSelector((state) => state);
	const { user } = auth;
	const profile = user?.profile;
	const [invites, setInvites] = useState([]);

	useEffect(() => {
        let invites = [];
        allInvitations.map((invit) => {
            if (invit?.teamType === "Organization") {
                invites.push(invit)
            }
        })

        setInvites(invites)
    }, [allInvitations])


	return (
		<>
			<div className={classes.tableBodyCont} >
				{invites && invites.len > 0 && (<>
					{invites.map((invite) => (
						<RecievedInvitesCard
							key={invite._id}
							invite={invite}
							invites={invites}
							setInvites={setInvites}
							addCreatedOne={addCreatedOne}
						/>
					))}
				</>)}
			</div>
		</>
	);
}
export default ReceivedInvite;