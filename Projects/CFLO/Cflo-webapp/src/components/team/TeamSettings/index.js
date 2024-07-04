import React, { useState } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import InfoSetting from "./InfoSetting";
import OverviewSetting from "./OverviewSetting";
import ProjectSetting from "./ProjectSetting";
import LicenseSetting from "./LicenseSetting";
import AwardSetting from "./AwardSetting";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
  },
  left_col: {
    flex: "0.3",
    paddingLeft: "1px",
  },
  right_col: {
    flex: "0.7",
  },
  tabs: {
    "& button[aria-selected='true']": {
      backgroundColor: "white",
    },
  },
}));

const CustomTab = withStyles({
  root: {
    textTransform: "none",
    fontSize: "1rem",
    minWidth: 50,
    borderRight: "2px solid #fafafa",
    // color: "#17804f",
  },
})(Tab);

const TeamSetting = (props) => {
  const classes = useStyles();

  const { root, left_col, right_col } = classes;

  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const { user, organizationIds } = useSelector((state) => state.auth);
  const fileReducer = useSelector((state) => state.file);
  const { createdFileIds } = fileReducer;

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [Section, setSection] = useState("Info");

  let View = InfoSetting;

  switch (Section) {
    case "Info":
      View = InfoSetting;
      break;

    case "Overview":
      View = OverviewSetting;
      break;
    case "Projects":
      View = ProjectSetting;
      break;
    case "Licenses":
      View = LicenseSetting;
      break;
    case "Awards":
      View = AwardSetting;
      break;

    default:
      break;
  }

  return (
    <div className={root}>
      <div className={left_col}>
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={value}
          onChange={handleChange}
          aria-label="Vertical tabs example"
          className={classes.tabs}
          TabIndicatorProps={{
            style: {
              backgroundColor: "#17804f",
              left: 0,
            },
          }}
        >
          <CustomTab
            label="Page info"
            onClick={() => {
              setSection("Info");
            }}
          />
          <CustomTab
            label="Overview"
            onClick={() => {
              setSection("Overview");
            }}
          />
          <CustomTab
            label="Projects"
            onClick={() => {
              setSection("Projects");
            }}
          />
          <CustomTab
            label="Licenses"
            onClick={() => {
              setSection("Licenses");
            }}
          />
          <CustomTab
            label="Awards"
            onClick={() => {
              setSection("Awards");
            }}
          />
        </Tabs>
      </div>
      <div className={right_col}>
        <View />
      </div>
    </div>
  );
};

export default TeamSetting;
