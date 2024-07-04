import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
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

const OrgAbout = ({ profile }) => {
  const classes = useStyles();

  const { root } = classes;

  return (
    <div className={root}>
      <OverviewSection profile={profile} />
      <ProjectSection profile={profile} />
      <LicenseSection profile={profile} />
      <AwardSection profile={profile} />
    </div>
  );
};

export default OrgAbout;
