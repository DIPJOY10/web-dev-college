import React, { useState } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import { TextField } from "@material-ui/core";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
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
  dropdown_section: {
    display: "flex",
    // alignItems: "center",
  },
  dropdown_select: {
    flex: "0.5",
    marginRight: "1rem",
  },
  saveBtn: {
    textAlign: "right",
    marginTop: "1rem",
  },
}));

const OverviewSetting = (props) => {
  const classes = useStyles();

  const {
    root,
    name_field,
    section,
    header,
    select_input,
    dropdown_section,
    dropdown_select,
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

  const [description, setDescription] = useState(parent?.description || "");
  const [website, setWebsite] = useState(parent?.website || "");
  const [industry, setIndustry] = useState(parent?.industry || "");
  const [companySize, setCompanySize] = useState(parent?.companySize || "");
  const [companyType, setCompanyType] = useState(parent?.companyType || "");

  const compSizeArray = [
    "0-1 employees",
    "2-10 employees",
    "11-50 employees",
    "51-200 employees",
    "201-500 employees",
    "501-1,000 employees",
    "1,001-5,000 employees",
    "5,001-10,000 employees",
    "10,000+ employees",
  ];
  const compTypeArray = [
    "Public company",
    "Self-employed",
    "Government agency",
    "Nonprofit",
    "Sole proprietorship",
    "Privately held",
    "Partnership",
  ];

  return (
    <div className={root}>
      <p className={header}>Provide details to display on your page</p>
      <div className={section}>
        <p>Description*</p>
        <TextField
          id="description"
          multiline
          rows={2}
          variant="outlined"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
          fullWidth
        />
      </div>
      <div className={section}>
        <p>Website URL</p>
        <TextField
          value={website}
          onChange={(e) => {
            setWebsite(e.target.value);
          }}
          variant="outlined"
          fullWidth
        />
      </div>
      <div className={section}>
        <p>Industry *</p>
        <TextField
          required
          value={industry}
          onChange={(e) => {
            setIndustry(e.target.value);
          }}
          variant="outlined"
          className={name_field}
        />
      </div>
      <div className={dropdown_section}>
        <div className={dropdown_select}>
          <p>Company Size</p>
          <FormControl variant="outlined" className={select_input} fullWidth>
            <Select
              native
              value={companySize}
              onChange={(e) => {
                setCompanySize(e.target.value);
              }}
              label="Select company size"
            >
              <option aria-label="None" value="" />
              {compSizeArray.map((entry, index) => {
                return (
                  <option key={index} value={entry}>
                    {entry}
                  </option>
                );
              })}
            </Select>
          </FormControl>
        </div>
        <div className={dropdown_select}>
          <p>Company Type</p>
          <FormControl variant="outlined" className={select_input} fullWidth>
            <Select
              native
              value={companyType}
              onChange={(e) => {
                setCompanyType(e.target.value);
              }}
              label="Select company type"
            >
              <option aria-label="None" value="" />
              {compTypeArray.map((entry, index) => {
                return (
                  <option key={index} value={entry}>
                    {entry}
                  </option>
                );
              })}
            </Select>
          </FormControl>
        </div>
      </div>
      <div className={saveBtn}>
        <Button
          color="primary"
          variant="outlined"
          style={{ textTransform: "none" }}
          onClick={async () => {
            const orgInfo = {
              description,
              website,
              industry,
              companySize,
              companyType,
            };
            const updatedOrg = await updateOrgInfo(
              {
                orgId: parent?._id,
                orgInfo: orgInfo,
              },
              dispatch
            ); //returns the updated organization
            console.log(updatedOrg);
            handleTeamParentData(teamId, orgInfo, state, dispatch);
          }}
        >
          Save Overview
        </Button>
      </div>
    </div>
  );
};

export default OverviewSetting;
