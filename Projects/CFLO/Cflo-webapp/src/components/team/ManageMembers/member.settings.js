import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Invites from "./invites";
import TeamMembers from "./team.members";
import AddMember from "./NewAddMember";
import Api from "../../../helpers/Api";
import teamUtils from "../team.utils";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import ManageInvites from "./manage.invites";
import { Tab, Tabs } from "@material-ui/core";
import InsertInvitationIcon from "@material-ui/icons/InsertInvitation";
import PeopleIcon from "@material-ui/icons/People";
import PersonAddIcon from "@material-ui/icons/PersonAdd";

const { _createInvites } = teamUtils;

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "1rem",
  },
  row: {
    flex: 1,
    flexDirection: "row",
    display: "flex",
  },
  tabs: {
    backgroundColor: theme.palette.background.paper,
    width: "100%",
  },
}));

const MemberSetting = (props) => {
  const classes = useStyles();
  const [view, setView] = useState("Members");
  const [value, setValue] = React.useState("Members");
  const { teamId } = props;
  const [invites, setInvites] = useState([]);
  const [invitesLoading, setInvitesLoading] = useState(true);
  const [invitees, setInvitees] = useState([]);
  const dispatch = useDispatch();
  const [members, setMembers] = useState([]);
  const [permissions, setPermissions] = useState({});
  const [membersLoading, setMembersLoading] = useState(true);

  useEffect(() => {
    const getProfieInfo = async () => {
      setMembersLoading(true);
      const profiles = await Api.post("team/getProfiles", {
        teamIds: [teamId],
      });
      console.log("teamProfiles", profiles?.data[0]?.participants, profiles);
      //profiles?.data[0]?.participants

      setMembers(profiles?.data[0]?.participants || []);
      setPermissions(profiles?.data[0]?.permissions || {});
      setMembersLoading(false);
    };

    getProfieInfo();
  }, [teamId]);
  //   console.log("team members", members, permissions);

  useEffect(() => {
    setInvitesLoading(true);
    Api.post("invite/getTeamInvites", {
      team: teamId,
    }).then((res) => {
      // console.log(res,' is the invites res')
      const invites = res.invites;
      setInvites(invites);
      setInvitesLoading(false);
    });
  }, []);
  const handleChange = (event, newValue) => {
    setView(newValue);
    setValue(newValue);
  };

  let View = (
    <AddMember
      teamId={teamId}
      invites={invites}
      setInvites={setInvites}
      invitesLoading={invitesLoading}
    />
  );

  switch (view) {
    case "Add People":
      View = (
        <AddMember
          teamId={teamId}
          invites={invites}
          setInvites={setInvites}
          invitesLoading={invitesLoading}
        />
      );
      break;

    case "Invites":
      View = (
        <ManageInvites
          teamId={teamId}
          invites={invites}
          invitesLoading={invitesLoading}
        />
      );
      break;

    case "Members":
      View = (
        <TeamMembers
          teamId={teamId}
          members={members}
          permissions={permissions}
          setMembers={setMembers}
          setPermissions={setPermissions}
          setLoading={setMembersLoading}
          loading={membersLoading}
        />
      );
      break;

    default:
      break;
  }

  return (
    <div className={classes.root}>
      {/* <ButtonGroup
				className={classes.btnGrp}
				variant="contained"
				color="primary"
				aria-label="outlined primary button group"
			>
				<Button
					onClick={() => {
						setView("Members");
					}}
					color="primary"
				>
					Members
				</Button>
				<Button
					onClick={() => {
						setView("Add People");
					}}
					color={view == "Add People" ? "primary" : null}
				>
					Add People
				</Button>
				<Button
					onClick={() => {
						setView("Invites");
					}}
				>
					Invites
				</Button>
			</ButtonGroup> */}

      <div className={classes.tabs}>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          centered
        >
          <Tab icon={<PeopleIcon />} label="Members" value={"Members"} />
          <Tab
            icon={<PersonAddIcon />}
            label="Add People"
            value={"Add People"}
          />
          <Tab
            icon={<InsertInvitationIcon />}
            label="Invites"
            value={"Invites"}
          />
        </Tabs>
      </div>

      {View}
    </div>
  );
};

export default MemberSetting;
