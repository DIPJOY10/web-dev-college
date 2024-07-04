import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import { useTheme } from "@material-ui/core";
import {
  useMediaQuery,
  ButtonBase,
  TextField,
  InputAdornment,
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { useHistory, useLocation } from "react-router-dom";
import teamUtils from "../team/team.utils";
import taskUtils from "../task/task.utils";
import CreateBtn from "../styled/actionBtns/create.btn";
import Api from "../../helpers/Api";
import Tooltip from "@material-ui/core/Tooltip";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import SearchIcon from "@material-ui/icons/Search";
import NotificationsNoneIcon from "@material-ui/icons/NotificationsNone";
import AddIcon from "@material-ui/icons/Add";
import YoutubeTuts from "../youtubeTuts/index";
import CreateOrgDialog from "./create.org.dialog";
import UserInvites from "../team/ManageMembers/user.invites";

import IconButton from "@material-ui/core/IconButton";
import AddBoxIcon from "@material-ui/icons/AddBox";
import OrgTable from "./OrgTable";
import { AddBox } from "@material-ui/icons";
const { createTaskMap, updateTaskMap } = taskUtils;
const {
  // processTeamTree,
  // useSortedTeamHook,
  handleTeams,
} = teamUtils;

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    // overflowX: "hidden",
    paddingTop: "10px",
    paddingBottom: "10px",
    "& > *": {
      margin: theme.spacing(1),
    },
    [theme.breakpoints.down("md")]: {
      marginTop: "0px",
    },
  },
  top_bar: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
  },
  tableCont: {
    display: "flex",
    marginBottom: "0px",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
    [theme.breakpoints.down("sm")]: {
      paddingTop: "14px",
    },
  },
  createBtn: {
    // color: "#d9e5ff",
    // fontColor: "#407BFF",
    // background: "#407BFF",
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
    width: "100%",
    padding: "12px 0px 12px 14px",
    background: "#F5F4F6",
    borderRadius: "8px",
    marginLeft: "5px",
    caretColor: "#2F80ED",
    fontWidth: "400",
    // [theme.breakpoints.down("xs")]: {
    //   position: "absolute",
    //   top: "-70px",
    //   left: "50px",
    //   width: "55%",
    //   paddingLeft: "3px",
    // },
  },
  //   reqNotification: {
  //     position: "absolute",
  //     top: "-64px",
  //     left: "-7px",
  //     [theme.breakpoints.down("xs")]: {
  //       left: "-7px",
  //       top: "-64px",
  //     },
  //   },
  //   notificationNo: {
  //     position: "absolute",
  //     width: "22px",
  //     height: "22px",
  //     borderRadius: "50%",
  //     top: "10px",
  //     left: "32px",
  //     backgroundColor: theme.palette.primary.main,
  //     color: "white",
  //     display: "flex",
  //     justifyContent: "center",
  //     alignItems: "center",
  //     fontSize: "16px",
  //   },
  headerBar: {
    width: "100%",
    height: "45px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "0px",
    [theme.breakpoints.down("sm")]: {
      marginTop: "-80px",
    },
  },
  leftSideBar: {
    marginLeft: "10px",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
  },
  backIcon: {
    fontSize: "25px",
    opacity: "0.8",
    cursor: "pointer",
  },
  barTitle: {
    marginLeft: "15px",
    fontSize: "18px",
    fontWeight: "510",
  },
  rightSideBar: {
    marginRight: "10px",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
  },
}));

export default function Organizations() {
  const theme = useTheme();
  const history = useHistory();
  const classes = useStyles();
  const dispatch = useDispatch();

  const { auth, project, team: teamReducer } = useSelector((state) => state);
  const { user, userProfile } = auth;
  let { invitations: allInvitations } = useSelector((state) => state.team);
  const { teamIds, sortedProjectTeamIds, teamDictionary } = teamReducer;
  const userId = user?._id;

  const [searchQuery, setSearchQuery] = useState("");
  const [rows, setRows] = React.useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filteredRows, setFilteredRows] = useState([]);
  const [showInvitation, setShowInvitation] = useState(false);
  const [numberOfInvt, setNumberOfInvt] = useState(0);

  const matches = useMediaQuery("(max-width:1300px)");
  const smallScreen = useMediaQuery(theme.breakpoints.down("xs"));

  // useSortedTeamHook();

  const getDataFromReducer = () => {
    var tempRows = [];
    teamIds.map((teamId) => {
      var value = teamDictionary[teamId];
      if (value?.parentModelName === "Organization" && value?.parent) {
        tempRows.push(value);
      }
    });
    setRows(tempRows);
    setFilteredRows(tempRows);
  };

  useEffect(() => {
    getDataFromReducer();
  }, [teamDictionary]);

  useEffect(() => {
    let count = 0;
    allInvitations &&
      allInvitations.length > 0 &&
      allInvitations.map((invit) => {
        if (invit?.teamType === "Organization") {
          count++;
        }
      });

    setNumberOfInvt(count);
  }, [allInvitations]);

  const addCreatedOne = (newOrg) => {
    let updatedOrgs = rows || [];
    updatedOrgs.push(newOrg);

    setRows(updatedOrgs);
    setFilteredRows(updatedOrgs);
  };

  const onOrgNameChange = async (value) => {
    setSearchQuery(value);
    if (value) {
      let filteredOrgs = [];
      rows.map((org) => {
        let name = org?.parent?.displayName;
        const patt = new RegExp(value, "i");
        const res = patt.test(name);
        if (res) {
          filteredOrgs.push(org);
        }
      });

      setFilteredRows(filteredOrgs);
    } else {
      setFilteredRows(rows);
    }
  };

  return (
    <div className={classes.root}>
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
              <Typography className={classes.barTitle}>Invitations</Typography>
            </div>
            <div className={classes.rightSideBar}></div>
          </div>

          <UserInvites type={"Organization"} addCreatedOne={addCreatedOne} />
        </>
      ) : (
        <>
          <div className={classes.top_bar}>
            {/* <Tooltip
              className={classes.reqNotification}
              title="Invitations"
              placement="top"
              onClick={() => {
                setShowInvitation(true);
              }}
            >
              <IconButton>
                <NotificationsNoneIcon
                  style={{
                    color: theme.palette.primary.main,
                    fontSize: "35px",
                  }}
                />
                <div className={classes.notificationNo}>{numberOfInvt}</div>
              </IconButton>
            </Tooltip> */}
            <TextField
              placeholder="Search or Org"
              type="text"
              fullWidth
              // variant="outlined"
              // size="small"
              onChange={(e) => onOrgNameChange(e.target.value)}
              value={searchQuery}
              className={classes.searchTextBox}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                disableUnderline: true,
              }}
            />
            <IconButton
              aria-label="add org"
              className={classes.createBtn}
              onClick={() => {
                setDialogOpen(true);
              }}
              color="primary"
            >
              <AddBoxIcon />
            </IconButton>
          </div>
          <OrgTable rows={filteredRows} />
        </>
      )}
      <CreateOrgDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        addCreatedOne={addCreatedOne}
      />
    </div>
  );
}
