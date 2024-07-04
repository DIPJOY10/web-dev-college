import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import OverviewSection from "./OverviewSection";
import ProjectSection from "./ProjectSection";
import LicenseSection from "./LicenseSection";
import AwardSection from "./AwardSection";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
  },
}));

const TeamAbout = (props) => {
  const classes = useStyles();

  const { root } = classes;

  const { teamId } = useParams();
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const { user, organizationIds } = useSelector((state) => state.auth);
  const fileReducer = useSelector((state) => state.file);
  const { createdFileIds } = fileReducer;
  const teamReducer = useSelector((state) => state.team);
  const { teamDictionary } = teamReducer;
  const team = teamDictionary[teamId];
  const parent = team?.parent;

  return (
    <div className={root}>
      <OverviewSection />
      {team?.parentModelName === "Organization" ? (
        <div>
          <ProjectSection />
          <LicenseSection />
          <AwardSection />
        </div>
      ) : null}
    </div>
  );
};

export default TeamAbout;
