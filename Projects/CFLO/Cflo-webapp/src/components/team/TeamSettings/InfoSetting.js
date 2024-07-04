import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import DomainIcon from "@material-ui/icons/Domain";
import { TextField } from "@material-ui/core";
import { Button } from "@material-ui/core";
import teamUtils from "../team.utils";
import { updateOrgInfo } from "../../organization/organization.utils";

const { handleTeamParentData } = teamUtils;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    padding: "1rem",
    backgroundColor: "white",
    border: "1px solid white",
    borderRadius: "10px",
  },
  imgAvatar: {
    height: "5rem",
    width: "5rem",
    objectFit: "cover",
    border: "4px solid white",
    // borderRadius: "100%",
  },
  imgDefaultIcon: {
    height: "4rem",
    width: "4rem",
  },
  header: {
    color: "black",
    fontSize: "1rem",
    marginBottom: "1rem",
  },
  name_field: {
    width: "40%",
  },
  section: {
    marginBottom: "0.5rem",
  },
  saveBtn: {
    textAlign: "right",
    marginTop: "1rem",
  },
}));

const InfoSetting = (props) => {
  const classes = useStyles();

  const {
    root,
    imgAvatar,
    imgDefaultIcon,
    name_field,
    section,
    header,
    saveBtn,
  } = classes;

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

  const [displayName, setDisplayName] = useState(parent?.displayName || "");
  const [tagline, setTagline] = useState(parent?.tagline || "");

  return (
    <div className={root}>
      <p className={header}>
        Update basic information to increase Page Discovery
      </p>
      <div className={section}>
        <p>Page logo</p>
        <Avatar className={imgAvatar} variant="square">
          <DomainIcon className={imgDefaultIcon} fontSize="large" />
        </Avatar>
      </div>
      <div className={section}>
        <p>Name *</p>
        <TextField
          className={name_field}
          required
          id="displayName"
          value={displayName}
          onChange={(e) => {
            setDisplayName(e.target.value);
          }}
          variant="outlined"
          fullWidth
        />
      </div>
      <div className={section}>
        <p>Tagline</p>
        <TextField
          id="tagline"
          // label="add tagline"
          multiline
          rows={2}
          variant="outlined"
          value={tagline}
          onChange={(e) => {
            setTagline(e.target.value);
          }}
          fullWidth
        />
      </div>
      <div className={saveBtn}>
        <Button
          color="primary"
          variant="outlined"
          style={{ textTransform: "none" }}
          onClick={async () => {
            const updatedOrg = await updateOrgInfo(
              {
                orgId: parent?._id,
                orgInfo: {
                  displayName,
                  tagline,
                },
              },
              dispatch
            ); //returns the updated organization
            console.log(updatedOrg);
            handleTeamParentData(
              teamId,
              {
                displayName,
                tagline,
              },
              state,
              dispatch
            );
          }}
        >
          Save Info
        </Button>
      </div>
    </div>
  );
};

export default InfoSetting;
