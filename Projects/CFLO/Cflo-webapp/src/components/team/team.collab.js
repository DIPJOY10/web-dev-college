import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Paper from "@material-ui/core/Paper";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import teamUtils from "./team.utils";

import { useParams, useHistory } from "react-router-dom";
import ProfileData from "../profile/cards";


const useStyles = makeStyles((theme) => ({
  actionList: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: "2rem",
    marginBottom: "2rem",
    padding: "1rem",
    justifyContent: "center",
  },
}));

export default function TeamCollab(props) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const { teamId } = useParams();
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const teamReducer = useSelector((state) => state.team);
  const { teamDictionary } = teamReducer;
  const { teamIds, sortedProjectTeamIds } = teamReducer;
  const team = teamDictionary[teamId];
  const profileId = team?.parent?.profile;
  const parent = team?.parent;
  const walletId = team?.wallet;



  return (
    <>
        <ProfileData 
          walletId={walletId} 
          profileId={profileId} 
          teamId={teamId}
          isAdmin={true} 
          cards={team?.parentModelName=='Project'?
            ['Analysis','Accounting','Workflow','Docs','PM']:
            ['Accounting','Workflow','Docs']}
        />
    </>
  );
}
