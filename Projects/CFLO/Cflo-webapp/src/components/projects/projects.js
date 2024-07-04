import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import { useTheme } from "@material-ui/core";
import {
  useMediaQuery, ButtonBase, TextField,
  InputAdornment, IconButton,
} from "@material-ui/core";
import PeopleIcon from '@material-ui/icons/People';
import Typography from "@material-ui/core/Typography";
import { useHistory, useLocation } from "react-router-dom";
import teamUtils from "../team/team.utils";
import taskUtils from "../task/task.utils";
import CreateBtn from "../styled/actionBtns/create.btn";
import Api from "../../helpers/Api";
import YoutubeTuts from "../youtubeTuts/index";
import ProfileAppbar from "../profile/profile.appbar";
import Tooltip from "@material-ui/core/Tooltip";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import SearchIcon from "@material-ui/icons/Search";
import NotificationsNoneIcon from "@material-ui/icons/NotificationsNone";
import AddIcon from "@material-ui/icons/Add";
import ProjectsTable from "./projects.table";
import CreateProjectDialog from "./create.project.dialog";
import UserInvites from "../team/ManageMembers/user.invites";
import GoogleMapComponent from "../styled/CommonComponents/Google.Map";
import MyNavBar from "../styled/CommonComponents/MyNavBar.js"
import CommonNavbar from "../styled/CommonComponents/Common.navbar";
import CustomBtn from "../styled/CommonComponents/CustomBtn.js"
const { createTaskMap, updateTaskMap } = taskUtils;
const {
  // processTeamTree, 
  // useSortedTeamHook, 
  handleTeams } = teamUtils;

const TABS = {
  ALL: 0,
  PERSONAL: 1,
  ORG: 2,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    overflowX: "hidden",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  tableCont: {
    display: "flex",
    marginTop: "0px",
    marginBottom: "0px",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
    marginTop: "75px",
    [theme.breakpoints.down("sm")]: {
      paddingTop: "90px",
      marginTop: "64px",
    },
  },
  createBtn: {
    position: "absolute",
    top: "14px",
    right: "3px",
    [theme.breakpoints.down("xs")]: {
      right: "-8px",
    },
  },
  headerCont: {
    width: "98%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0px",
    marginBottom: "2px",
    marginTop: "2px",
  },
  KeyboardBackspaceIconSty: {
    fontSize: "35px",
    [theme.breakpoints.down("md")]: {
      marginLeft: "-20px",
      fontSize: "1.7rem",
    },
  },
  displayFlex: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  searchTextBox: {
    width: "60%",
    padding: "14px",
    [theme.breakpoints.down("sm")]: {
      position: "absolute",
      top: "13px",
      left: "50px",
    },
    [theme.breakpoints.down("xs")]: {
      position: "absolute",
      top: "13px",
      left: "53px",
      width: "55%",
      paddingLeft: "3px",
    },
  },
  reqNotification: {
    position: "absolute",
    top: "0px",
    left: "4px",
    [theme.breakpoints.down("xs")]: {
      left: "-6px",
      top: "17px",
    },
  },
  notificationNo: {
    position: "absolute",
    width: "22px",
    height: "22px",
    borderRadius: "50%",
    top: "10px",
    left: "32px",
    backgroundColor: theme.palette.primary.main,
    color: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "16px",
  },
  headerBar: {
    width: "100%",
    height: "60px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "-15px",
    [theme.breakpoints.down("sm")]: {
      marginTop: "-90px",
    },
  },
  leftSideBar: {
    marginLeft: "10px",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
  },
  backIcon: {
    fontSize: "35px",
    opacity: "0.8",
    cursor: "pointer",
  },
  barTitle: {
    marginLeft: "15px",
    fontSize: "23px",
    fontWeight: "510",
  },
  rightSideBar: {
    marginRight: "10px",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
  },
  mainCont: {
    position: "relative",
  },
  tableMapCont: {
    width: "100%",
    height: "calc(100vh - 165px)",
    display: "flex",
    justifyContent: "space-between",
    [theme.breakpoints.down("xs")]: {
      height: "calc(100vh - 220px)",
    }
  },
  mapCont: {
    width: "44%",
    maxHeight: "100%",
    overflowY: "hidden",
    [theme.breakpoints.down("md")]: {
      width: "100%",
    }
  }
}));

export default function Projects() {
  const theme = useTheme();
  const [tabIndex, setTabIndex] = useState(TABS.ALL);
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const [rows, setRows] = React.useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filteredRows, setFilteredRows] = useState([]);
  const [geoPointers, setGeoPointers] = useState([]);
  const [showInvitation, setShowInvitation] = useState(false);
  const [numberOfInvt, setNumberOfInvt] = useState(0);
  const [showCom, setShowCom] = useState("projectView")
  const { auth, project, team: teamReducer } = useSelector((state) => state);
  const { user, userProfile } = auth;
  let { invitations: allInvitations } = useSelector((state) => state.team);
  const {
    teamIds,
    sortedProjectTeamIds,
    teamDictionary,
  } = teamReducer;
  const userId = user?._id;
  const classes = useStyles();
  const matches = useMediaQuery("(max-width:1300px)");
  const history = useHistory();

  const smallScreen = useMediaQuery(theme.breakpoints.down("xs"));
  const mdScreen = useMediaQuery(theme.breakpoints.down("md"));

  const getDataFromReducer = () => {
    var tempRows = [];
    teamIds.map((teamId) => {
      var value = teamDictionary[teamId];
      if (value?.parentModelName === "Project" && value?.parent) {
        tempRows.push(value);
      }
    });
    setRows(tempRows);
    setFilteredRows(tempRows);
  };

  useEffect(() => {
    getDataFromReducer();
  }, [teamDictionary]);

  const addCreatedOne = (newProject) => {
    let updatedProjects = rows || [];
    updatedProjects.push(newProject);

    setRows(updatedProjects);
  };

  // useSortedTeamHook();

  // useEffect(() => {
  //   processTeamTree(teamReducer, dispatch);
  // }, [teamIds]);

  const onProjectNameChange = async (value) => {
    setSearchQuery(value);
    if (value) {
      let filteredProjects = [];
      rows.map((project) => {
        let name = project?.parent?.displayName;
        const patt = new RegExp(value, "i");
        const res = patt.test(name);
        if (res) {
          filteredProjects.push(project);
        }
      });

      setFilteredRows(filteredProjects);
    } else {
      setFilteredRows(rows);
    }
  };
  useEffect(() => {
    let count = 0;
    if (Array.isArray(allInvitations))
      allInvitations.map((invit) => {
        if (invit?.teamType === "Project") {
          count++;
        }
      });

    setNumberOfInvt(count);
  }, [allInvitations]);

  console.log(user)


  // this is to create the sample project
  const createProjectApi = () => {
    Api.post("project/create", {
      owner: user._id,
      ownerModelName: user.model,
      sample: true,
      user: userId,
      ownerModelName: "User",
      ownerProfile: user?.profile,
      creator: user.model === "User" ? userId : userProfile._id,
      participants: [user.profile],
      displayName: "Sample Project",
      description: "This is to demonstrate how projects will work.",
    }).then((team) => {
      handleTeams([team], state, dispatch);
    });
  };

  // this is also to create the sample project
  useEffect(() => {
    if (teamIds.length == 0) {
      createProjectApi();
    }
  }, [sortedProjectTeamIds]);

  useEffect(() => {
    let mapPointerArr = [];

    filteredRows.map((datarow) => {
      if (datarow?.parent?.latitude && datarow?.parent?.longitude) {
        mapPointerArr.push({
          latitude: datarow?.parent?.latitude,
          longitude: datarow?.parent?.longitude,
          label: datarow?.parent?.displayName,
          character: datarow?.parent?.displayName ? datarow?.parent?.displayName.charAt(0) : "P",
          marker_color: "FF5F1F",
          marker_text_color: "ffffff",
        })
      }
    })

    setGeoPointers(mapPointerArr)
  }, [filteredRows])


  return (
    <div className={classes.root}>
      <ProfileAppbar
        marginTop={"-10px"}
        name={"Projects"}
        isUser={true}
        btns={
          <>
            <YoutubeTuts
              name={'Projects'}
              dialogTitle={'Projects Home'}
            />
          </>
        }
      />
      <Paper
        className={classes.tableCont}
        style={showInvitation ? { height: "calc(100vh - 83px)" } : {}}
      >
        {showInvitation ? (
          <>
            <div className={classes.headerBar}>
              <div className={classes.leftSideBar}>
                <KeyboardBackspaceIcon
                  onClick={() => {
                    setShowInvitation(false);
                  }}
                  className={classes.backIcon}
                />
                <Typography className={classes.barTitle}>
                  Invitations
                </Typography>
              </div>
              <div className={classes.rightSideBar}></div>
            </div>
            <UserInvites type={"Project"} addCreatedOne={addCreatedOne} />
          </>
        ) : (
          <>
            <Tooltip
              className={classes.reqNotification}
              title="Invitations"
              placement="top"
              onClick={() => {
                setShowInvitation(true);
              }}
            >
              <IconButton>
                <PeopleIcon
                  style={{
                    color: theme.palette.primary.main,
                    fontSize: "35px",
                  }}
                />
                <div className={classes.notificationNo}>{numberOfInvt}</div>
              </IconButton>
            </Tooltip>
            <TextField
              placeholder="Search By Project Name"
              type="text"
              variant="outlined"
              size="small"
              onChange={(e) => onProjectNameChange(e.target.value)}
              value={searchQuery}
              className={classes.searchTextBox}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <CustomBtn
              text={smallScreen ? "New" : "New Project"}
              style={smallScreen ? { position: "absolute", top: "25px", right: "6px", padding: "7px 3px" } : { position: "absolute", top: "10px", right: "10px" }}
              onClick={() => { setDialogOpen(true); }}
              startPart={<AddIcon />}
            />
            <div className={classes.tableMapCont} >
              {mdScreen ? (
                <>
                  <CommonNavbar
                    show={showCom}
                    setShow={setShowCom}
                    options={[
                      {
                        value: "projectView",
                        label: "Project List",
                        Component: <ProjectsTable rows={filteredRows} />
                      },
                      {
                        value: "mapView",
                        label: "Map View",
                        Component: <>
                          <div className={classes.mapCont} >
                            <GoogleMapComponent
                              marks={geoPointers}
                              MakerType={"maker"}
                              height={smallScreen ? 350 : 520}
                              redius={800}
                            />
                          </div>
                        </>
                      }
                    ]}
                  />
                </>
              ) : (
                <>
                  <ProjectsTable rows={filteredRows} />
                  <div className={classes.mapCont} >
                    <GoogleMapComponent
                      marks={geoPointers}
                      MakerType={"maker"}
                      height={575}
                      redius={800}
                    />
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </Paper>
      <CreateProjectDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        addCreatedOne={addCreatedOne}
      />
    </div>
  );
}
