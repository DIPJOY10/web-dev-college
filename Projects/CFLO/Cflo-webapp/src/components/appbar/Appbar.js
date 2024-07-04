import React, { useRef, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  useScrollTrigger,
  useMediaQuery,
  Tooltip,
  Box,
} from "@material-ui/core";

import SearchBar from "./SimpleSearchBar";
import { useParams, useHistory } from "react-router-dom";
import LinearScaleIcon from "@material-ui/icons/LinearScale";
import BriefcaseIcon from "@material-ui/icons/BusinessCenter";
import Notification from "./notification";
import PipeSvg from "../../Assets/pipe.svg";
import { ReactComponent as InvestIcon } from "../../Assets/invest_icon.svg";
import { ReactComponent as ForumIcon } from "../../Assets/forum_icon.svg";
import Setting from "./settings";
import IconWithText from "./IconWithText";
const drawerWidth = "17rem";
const foldedWidth = "6rem";

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 0,
    flexDirection: "column",
  },
  appBarStyle: {
    // borderColor: "grey",
    // boxShadow: "0px 0px 20px 1px #00000030",
    boxShadow: "none",
    borderButtom: "1.5px solid rgba(0, 0, 0, 0.12)",

    // [theme.breakpoints.up('sm')]: {
    //   width: `calc(100% - ${drawerWidth})`,
    //   marginLeft: drawerWidth,
    // },
    // [theme.breakpoints.only('sm')]: {
    //   width: `calc(100% - ${foldedWidth})`,
    //   marginLeft: foldedWidth,
    // },
  },
  searchContainerStyle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  containerBorder: {
    borderBottomColor: "#d9d9d9",
  },
  flexColumn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  menuButton: {
    height: "60px",
    width: "60px",
    marginRight: 0,
    [theme.breakpoints.down("sm")]: {
      marginRight: "-0.6rem",
    },
    [theme.breakpoints.down("xs")]: {
      marginRight: "-1.05rem",
    },
  },
  menuIcon: {
    height: "24px",
    width: "24px",
    "& path": {
      fill: "rgba(0, 0, 0, 0.26)",
    },
  },
  activePage: {
    color: theme.palette.primary.main,
    "& path": {
      fill: theme.palette.primary.main,
    },
    "& $menuButtonLabel": {
      color: theme.palette.primary.main,
    },
  },
  menuButtonLabel: {
    fontSize: "12px",
    lineHeight: "18px",
  },
  pipeImg: {
    height: "2rem",
    width: "2rem",
  },

  toolbar: {
    backgroundColor: "white",
    borderColor: "grey",
    flex: 1,
    flexDirection: "row-reverse",
    gap: "2rem",
    [theme.breakpoints.down('sm')]: {
      gap: "1rem",
    }
  },
  center: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    cursor: "pointer"
  },
  text: {
    color: "rgba(0, 0, 0, 0.26)",
    marginTop: "-10%",
    fontWeight: "500",
    fontSize: "12px",
    display: "flex",
    [theme.breakpoints.down('sm')]: {
      display: "none"
    }
  },
}));

export default function AppbarComponent() {
  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory();
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [isProfilePopoverOpen, setProfilePopoverOpen] = useState(false);
  const [isSearchShowingInMobile, setSearchShowing] = useState(false);
  const profileMenuRef = useRef();
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });
  const { user } = useSelector((state) => state.auth);
  const displayPicture =
    user && user.displayPicture ? user.displayPicture.thumbUrl : null;
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  const activePage = history.location?.pathname;

  return (
    <>
      <AppBar
        position="relative"
        elevation={trigger ? 4 : 0}
        className={classes.appBarStyle + " appbar-main"}
      >
        <Toolbar className={classes.toolbar}>
          <Setting className={classes.menuIcon} />
          <Notification />
          <Tooltip title="Forum" >
            <Box
              aria-label="goto forum"
              color="disabled"
              className={
                ` ${(activePage === "/explore/forum") || (activePage === "/explore/forum/yourforums") ? classes.activePage : ""} ` + classes.center
              }
              onClick={() => {
                history.push('/explore/forum');
              }}
            >
              <ForumIcon className={`${(activePage === "/explore/forum") || (activePage === "/explore/forum/yourforums") ? classes.activePage : ""} ` + classes.menuIcon} />
            </Box>
          </Tooltip>

          {/* <IconButton
            aria-label="goto forum"
            color="disabled"
            className={
              classes.menuButton +
              ` ${activePage === "/explore/forum" ? classes.activePage : ""}`
            }
            onClick={() => {
              history.push('/explore/forum');
            }}
          >
            <ForumIcon className={classes.menuIcon} />
          </IconButton> */}
          {/* </Tooltip> */}

          {/* <IconButton
            aria-label="goto jobs"
            color="disabled"
            className={
              classes.menuButton +
              ` ${activePage === "/explore/jobs" ? classes.activePage : ""}`
            }
            onClick={() => history.push("/explore/jobs")}
          >
            <div className={classes.flexColumn}>
              <BriefcaseIcon className={classes.menuIcon} />
              <span className={classes.menuButtonLabel}>Jobs</span>
            </div>
          </IconButton>

          <IconButton
            aria-label="goto invest"
            color="disabled"
            className={
              classes.menuButton +
              ` ${activePage === "/explore/invest" ? classes.activePage : ""}`
            }
            onClick={() => {
              history.push("/explore/invest");
            }}
          >
            <div className={classes.flexColumn}>
              <InvestIcon className={classes.menuIcon} />
              <span className={classes.menuButtonLabel}>Invest</span>
            </div>
          </IconButton> */}

          {/* <IconButton
            aria-label="goto pipeline"
            color="inherit"
            className={classes.menuButton}
            onClick={() => {
              history.push('/pipeline/manage');
            }}
          >
            <img src={PipeSvg} className={classes.pipeImg} />
          </IconButton> */}
          <div className={classes.searchContainerStyle}>
            <SearchBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onSearchClose={() => setSearchShowing(false)}
            />
          </div>
        </Toolbar>
      </AppBar>
    </>
  );
}
