import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import Paper from "@material-ui/core/Paper";
import { makeStyles, useTheme, withStyles } from "@material-ui/core/styles";
import teamUtils from "./team.utils";
import Typography from "@material-ui/core/Typography";
import { AppBar, Box, Toolbar } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import TuneIcon from "@material-ui/icons/Tune";
import TimelineIcon from "@material-ui/icons/Timeline";
import { useParams, useHistory } from "react-router-dom";
import TeamHome from "./team.home";
import HomeIcon from "@material-ui/icons/Home";
import MemberSetting from "./ManageMembers/member.settings";
import TeamSetting from "./TeamSettings/index";
import TeamAbout from "./about/index";
import PropertyDescription from "../ProjectAnalysis/Property.Description";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import CreateBranchDialog from "../projects/create.branch.dialog";

import _ from "lodash";
import FileUploadButton from "../file/Uploader/FileUploadButton";
import Avatar from "@material-ui/core/Avatar";
import EditIcon from "@material-ui/icons/Edit";
import { IconButton } from "@material-ui/core";
import DomainIcon from "@material-ui/icons/Domain";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import GroupIcon from "@material-ui/icons/Group";
import PostAddIcon from "@material-ui/icons/PostAdd";
import InfoIcon from "@material-ui/icons/Info";
import WorkIcon from "@material-ui/icons/Work";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import Button from "@material-ui/core/Button";
import Api from "../../helpers/Api";
import EditProjectDialog from "../projects/edit.project.dialog";
import EditOrgDialog from "../organization/edit.org.dialog";
import PagePath from "../styled/CommonComponents/Page.Path";

const {
  // processTeamTree,
  // useSortedTeamHook,
  handleTeams,
  handleTeamParentData,
  updateOrgInfo,
  handleMemberProfiles,
} = teamUtils;

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    marginTop: "1rem",
    justifyContent: "center",
    alignItems: "center",
    padding: "1rem",
    paddingBottom: "6rem",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "800",
    textAlign: "center",
  },
  appBar: {
    backgroundColor: "white",
    height: "4rem",
    marginTop: "1rem",
  },
  settingBtn: {
    paddingLeft: "1rem",
    padding: "0.5rem",
    paddingTop: "0.25rem",
    paddingBottom: "0.25rem",
  },
  settingText: {
    marginLeft: "0.5rem",
  },
  settingBtnPaper: {
    marginRight: "1rem",
  },
  actionList: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: "2rem",
    marginBottom: "1rem",
    backgroundColor: "#fafafa",
    padding: "1rem",
    justifyContent: "center",
  },
  tabRoot: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginBottom: "1rem",
    padding: "1rem",
  },
  svgSize: {
    fontSize: 20,
    height: 25,
    width: 25,
    marginTop: 10,
    color: "grey",
  },
  chipStyleSm: {
    marginTop: "1.5rem",
  },
  chipStyle: {
    marginTop: 0,
    marginRight: "1rem",
  },
  profileHeader: {
    width: "100%",
    height: "auto",
    paddingBottom: "1rem",
    marginBottom: "1rem",
  },
  overlay: {
    position: "relative",
    backgroundColor: (props) => (props.cover ? "none" : "#C9CCD5"),
    backgroundImage: (props) => (props.cover ? `url(${props.cover})` : "none"),
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    height: "15rem",
    width: "100%",
  },
  coverUploadButton: {
    position: "absolute",
    right: "10px",
    backgroundColor: "white",
    border: "1px solid #2296f3",
    borderRadius: "100%",
    top: "10px",
  },
  header_buttons: {
    marginLeft: "1.5rem",
    marginTop: "1rem",
    "& $Button": {
      marginRight: "1rem",
    },
  },
  imgParent: {
    position: "absolute",
    zIndex: 100,
    cursor: "pointer",
    top: "130px",
    left: "20px",
    "&:hover": {
      "& $hoverUploadButton": {
        opacity: 1,
      },
    },
  },
  imgAvatar: {
    height: "10rem",
    width: "10rem",
    backgroundSize: "cover",
    border: "4px solid white",
  },
  hoverUploadButton: {
    transition: ".5s ease",
    position: "absolute",
    opacity: 0,
    backgroundColor: "white",
    border: "1px solid white",
    borderRadius: "100%",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  content_left: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "left",
    "& $p": {
      fontSize: "1rem",
      color: "grey",
    },
  },
  editIcon: {
    textAlign: "right",
    marginTop: "0.5rem",
    marginLeft: "auto",
    marginRight: "1rem",
    height: "8vh",
  },
  profileContent: {
    display: "flex",
    justifyContent: "space-between",
    marginLeft: "1.5rem",
    "& $h2": {
      fontSize: "1.8rem",
      fontWeight: "normal",
      display: "inline",
    },
  },
  imgDefaultIcon: {
    height: "9rem",
    width: "9rem",
  },
  tab__section: {
    width: "100%",
    backgroundColor: "#fafafa",
  },
  tabs__panel: {
    marginTop: "1rem",
    paddingLeft: "5px",
    borderTop: "2px solid #fafafa",
    flexGrow: 1,
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
}));

const CustomTab = withStyles({
  root: {
    textTransform: "none",
    fontSize: "1rem",
    minWidth: 50
  },
})(Tab);

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

export default function TeamView(props) {
  const { viewMode, viewedTeamId } = props;
  const history = useHistory();

  let { teamId } = useParams();
  teamId = viewMode ? viewedTeamId : teamId;
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const { auth } = state;
  const { createdFileIds } = useSelector((state) => state.file);
  const teamReducer = useSelector((state) => state.team);
  const { teamDictionary, sortedProjectTeamIds, teamIds } = teamReducer;
  const team = teamDictionary[teamId];
  const parent = team?.parent;
  const parentModelName = team?.parentModelName;
  const ancestors = team?.ancestors;
  const topTeamId = _.intersection(sortedProjectTeamIds, ancestors)[0] || teamId;
  const defaultDisplayPic = "https://firebasestorage.googleapis.com/v0/b/contractflo.appspot.com/o/company.png?alt=media&token=357e859b-cd94-4ddb-9407-bcda8b79bce7";

  const [activitySidebar, setActivitySidebar] = useState(false);
  const [openBranchCreate, setOpenBranchCreate] = useState(false);
  const [view, setView] = useState("Home");
  const [callBool, setCallBool] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [callProfileBool, setCallProfileBool] = useState(true);
  const [projectData, setProjectData] = useState({});
  const [cover, setCover] = useState(parent?.cover?.url || "");
  const [displayPicture, setDisplayPicture] = useState(parent?.displayPicture?.url || "");
  const [value, setValue] = useState(0);

  const isMobile = useMediaQuery("(max-width:408px)");
  const classes = useStyles({ cover });


  // useSortedTeamHook();

  // useEffect(() => {
  //   processTeamTree(teamReducer, dispatch);
  // }, [teamIds]);



  let View = TeamAbout;

  const uploadImg = async (fileType) => {
    let res;
    if (team?.parentModelName === "Project") {
      res = await Api.post("project/updatePicture", {
        projId: parent?._id,
        fileId: createdFileIds[0],
        fileType: fileType,
      });
    } else {
      res = await Api.post("organization/updatePicture", {
        orgId: parent?._id,
        fileId: createdFileIds[0],
        fileType: fileType,
      });
    }
    if (res?.data) {
      if (fileType === "DP") {
        handleTeamParentData(
          teamId,
          {
            displayPicture: res.data,
          },
          state,
          dispatch
        );
        setDisplayPicture(res.data.url);
      } else {
        handleTeamParentData(
          teamId,
          {
            cover: res.data,
          },
          state,
          dispatch
        );
        setCover(res.data.url);
      }
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    setProjectData(team?.parent);
    setDisplayPicture(parent?.displayPicture?.url);
    setCover(parent?.cover?.url);
  }, []);



  switch (view) {
    case "Home":
      View = viewMode ? TeamAbout : TeamHome;
      break;

    case "About":
      if (team.parentModelName === "Project") {
        View = PropertyDescription;
      } else {
        View = TeamAbout;
      }
      break;

    case "Settings":
      View = TeamSetting;
      break;

    case "People":
      View = MemberSetting;
      break;

    default:
      break;
  }

  const pathArr = [
    {
      text: "Projects",
      onClick: () => {
        history.push("/projects")
      }
    },
    {
      text: "Project",
    }
  ]




  return (
    <div className={classes.root}>
      <PagePath
        pathArr={pathArr}
      />
      <Paper className={classes.profileHeader}>
        <div className={classes.overlay}>
          {!viewMode ? (
            <div className={classes.coverUploadButton}>
              <FileUploadButton
                parentType="Organization"
                used={true}
                parentId={teamId}
                isDP={true}
                isCover={true}
                uploadImg={uploadImg}
              />
            </div>
          ) : null}
          <div className={classes.imgParent}>
            {displayPicture && displayPicture !== defaultDisplayPic ? (
              <Avatar
                className={classes.imgAvatar}
                variant="square"
                style={{ objectFit: "cover" }}
                src={displayPicture}
              />
            ) : (
              <Avatar
                className={classes.imgAvatar}
                variant="square"
                style={{ objectFit: "cover" }}
              >
                <DomainIcon className={classes.imgDefaultIcon} fontSize="large" />
              </Avatar>
            )}
            {!viewMode ? (
              <div className={classes.hoverUploadButton}>
                <FileUploadButton
                  parentType="Organization"
                  used={true}
                  parentId={teamId}
                  isDP={true}
                  isCover={false}
                  uploadImg={uploadImg}
                />
              </div>
            ) : null}
          </div>
        </div>
        <div className={classes.editIcon}>
          {!viewMode ? (
            <div>
              <IconButton className={classes.editBtn} onClick={() => {
                setEditDialogOpen(true);
              }}>
                <EditIcon reverse />
              </IconButton>
              {team?.parentModelName === "Project" ? <EditProjectDialog
                open={editDialogOpen}
                setOpen={setEditDialogOpen}
                team={team}
              /> : <EditOrgDialog
                open={editDialogOpen}
                setOpen={setEditDialogOpen}
                team={team}
              />
              }
            </div>
          ) : null}
        </div>
        <div className={classes.profileContent}>
          <div className={classes.content_left}>
            <h2>{parent?.displayName}</h2>
            {parent?.tagline ? <p>{parent?.tagline}</p> : null}
            {parent?.industry ? <p>{parent?.industry}</p> : null}
          </div>
          <div className={classes.content_right}></div>
        </div>
        <div className={classes.header_buttons}>
          <Button
            style={{ textTransform: "none", borderRadius: '1.2rem' }}
            variant="outlined"
            color="primary"
            startIcon={<AddIcon fontSize="large" />}
          >
            Follow
          </Button>
          {!viewMode && (
            <Button
              style={{ textTransform: "none", borderRadius: '1.2rem' }}
              variant="outlined"
              color="primary"
              onClick={() => history.push("/organizations/" + teamId + "/orgView")}
              startIcon={<FontAwesomeIcon icon={faUpRightFromSquare} size="sm" />}
            >
              View
            </Button>
          )}
        </div>
        <div className={classes.tabs__panel}>
          <div>
            <Tabs
              value={value}
              onChange={handleChange}
              TabIndicatorProps={{
                style: {
                  backgroundColor: "#17804f",
                },
              }}
              variant="scrollable"
              scrollButtons="auto"
              aria-label="scrollable auto tabs example"
            >
              {!viewMode ? (
                <CustomTab
                  label={
                    <div>
                      <HomeIcon style={{ verticalAlign: "middle" }} /> Home
                    </div>
                  }
                  onClick={() => {
                    setView("Home");
                    setActivitySidebar(false);
                  }}
                />
              ) : null}
              {!viewMode ? (<CustomTab
                label={
                  <div>
                    <InfoIcon style={{ verticalAlign: "middle" }} /> About
                  </div>
                }
                onClick={() => {
                  setView("About");
                  setActivitySidebar(false);
                }}
              />) : (null)}
              {team?.parentModelName !== "Project" ? (
                <CustomTab
                  label={
                    <div>
                      <PostAddIcon style={{ verticalAlign: "middle" }} /> Posts
                    </div>
                  }
                  onClick={() => {
                    setView("Posts");
                    setActivitySidebar(false);
                  }}
                />
              ) : null}
              {/* {team?.parentModelName !== "Project" && viewMode ? (
                <CustomTab
                  label={
                    <div>
                      <WorkIcon style={{ verticalAlign: "middle" }} /> Jobs
                    </div>
                  }
                />
              ) : null} */}
              {!viewMode ? (
                <CustomTab
                  label={
                    <div>
                      <GroupIcon style={{ verticalAlign: "middle" }} /> People
                    </div>
                  }
                  onClick={() => {
                    setView("People");
                    setActivitySidebar(false);
                  }}
                />
              ) : null}
              {!viewMode ? (
                <CustomTab
                  label={
                    <div>
                      <TimelineIcon style={{ verticalAlign: "middle" }} />{" "}
                      Activities
                    </div>
                  }
                  onClick={() => {
                    setView("Home");
                    setActivitySidebar(true);
                  }}
                />
              ) : null}
              {/* {parentModelName === "Project" ? (
                <CustomTab
                  label={
                    <div>
                      <AddIcon style={{ verticalAlign: "middle" }} /> Add Branch
                    </div>
                  }
                  onClick={() => {
                    setOpenBranchCreate(true);
                  }}
                />
              ) : null} */}
              {!viewMode && team?.parentModelName !== "Project" ? (
                <CustomTab
                  label={
                    <div>
                      <TuneIcon style={{ verticalAlign: "middle" }} /> Settings
                    </div>
                  }
                  onClick={() => {
                    setView("Settings");
                    setActivitySidebar(false);
                  }}
                />
              ) : null}
            </Tabs>
          </div>
        </div>
      </Paper>

      <CreateBranchDialog
        open={openBranchCreate}
        setOpen={setOpenBranchCreate}
        parentTeamId={teamId}
        setCallBool={setCallBool}
      />

      <View
        activitySidebar={activitySidebar}
        setActivitySidebar={setActivitySidebar}
        teamId={teamId}
        tabMode={true}
        isAppBar={false}
        projectData={projectData}
        setProjectData={setProjectData}
      />
    </div>
  );
}
