import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import DomainIcon from "@material-ui/icons/Domain";
import { Paper, TextField } from "@material-ui/core";
import { Button } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    padding: "1rem",
    border: "1px solid white",
    borderRadius: "10px",
    fontSize: "1rem",
    color: "grey",
  },
  header: {
    color: "black",
    fontWeight: "normal",
  },
  subHeader: {
    color: "black",
    fontWeight: "400",
    paddingTop: "1rem",
  },
  description__section: {
    width: "90%",
  },
}));

const OverviewSection = ({ profile }) => {
  const classes = useStyles();

  const { root, header, subHeader, description__section } = classes;

  return (
    <Paper className={root}>
      <h2 className={header}>Overview</h2>
      <p className={description__section}>{profile?.parent?.description}</p>
      {profile?.parent?.website ? (
        <div>
          <p className={subHeader}>Website</p>
          <p>{profile?.parent?.website}</p>
        </div>
      ) : null}
      {profile?.parent?.industry ? (
        <div>
          <p className={subHeader}>Industry</p>
          <p>{profile?.parent?.industry}</p>
        </div>
      ) : null}
      {profile?.parent?.companySize ? (
        <div>
          <p className={subHeader}>Company Size</p>
          <p>{profile?.parent?.companySize}</p>
        </div>
      ) : null}

      {/* todo */}
      {/* <p>Specialities</p> */}
    </Paper>
  );
};

export default OverviewSection;
