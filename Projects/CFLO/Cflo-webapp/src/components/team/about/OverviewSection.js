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
    position: "relative",
    top: "0",
    bottom: "0",
    display: "flex",
    flexDirection: "column",
    background: "white",
    maxHeight: "100%",
    minWidth: "63rem",
    overflow: "auto",
    boxShadow: "-10px 0px 20px 0px #00000030",
  },
  header: {
    color: "black",
    fontWeight: "normal",
    width:'100%',
    padding:'1rem'
  },
  subHeader: {
    color: "black",
    fontWeight: "400",
    width:'100%'

  },
  description__section: {
    width: "100%",
    padding:'1rem'
  },
}));

const OverviewSection = (props) => {
  const classes = useStyles();

  const { root, header, subHeader, description__section } = classes;

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
    <Paper className={root}>
      <h2 className={header}>Overview</h2>
      <p className={description__section}>{parent?.description}</p>
      {parent?.website ? (
        <div style={{padding:'1rem'}}>
          <p className={subHeader}>Website</p>
          <p>{parent?.website}</p>
        </div>
      ) : null}
      {parent?.industry ? (
        <div style={{padding:'1rem'}}>
          <p className={subHeader}>Industry</p>
          <p>{parent?.industry}</p>
        </div>
      ) : null}
      {parent?.companySize ? (
        <div style={{padding:'1rem'}}>
          <p className={subHeader}>Company Size</p>
          <p>{parent?.companySize}</p>
        </div>
      ) : null}
    </Paper>
  );
};

export default OverviewSection;
