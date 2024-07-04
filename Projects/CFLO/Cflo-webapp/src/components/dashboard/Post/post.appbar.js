import React, { useRef, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import {
  AppBar,
  Divider,
  Toolbar,
  IconButton,
  Typography,
  useScrollTrigger,
  useMediaQuery,
} from "@material-ui/core";

import { useParams, useHistory } from "react-router-dom";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";

import BackspaceIcon from "@material-ui/icons/Backspace";
import PhotoIcon from "@material-ui/icons/Photo";
import AvatarLocal from "../../profile/avatar";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import Menubar from "../../styled/menubar";
import DoneIcon from "@material-ui/icons/Done";
import BookmarkBorderOutlinedIcon from "@material-ui/icons/BookmarkBorderOutlined";
const drawerWidth = "17rem";
const foldedWidth = "6rem";

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 0,
    flexDirection: "column",
  },

  appBarStyle: {
    borderColor: "grey",
  },

  row: {
    display: "flex",
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  toolbar: {
    backgroundColor: "white",
    borderColor: "grey",
    flex: 1,
    marginTop: "-0.3rem",
    marginLeft: "17rem",
    [theme.breakpoints.down("sm")]: {
      marginLeft: foldedWidth,
    },
    [theme.breakpoints.down("xs")]: {
      marginLeft: 0,
    },
    color: "#48494a",
  },

  iconButtonStyle: {
    marginTop: "0.5rem",
    marginRight: "1rem",
    marginLeft: "-1rem",
    color: theme.palette.primary.main,
  },

  nameStyle: {
    fontWeight: "bold",
    fontSize: "1.3rem",
  },
}));

export default function PostAppbar(props) {
  const { profile, name, btns } = props;
  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  const dispatch = useDispatch();
  // const [nav, setNav] = useState('Jobs');
  const profileMenuRef = useRef();
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return (
    <AppBar elevation={trigger ? 4 : 0} className={classes.appBarStyle}>
      <Toolbar className={classes.toolbar}>
        <div className={classes.row}>
          <div className={classes.row}>
            <IconButton
              className={classes.iconButtonStyle}
              onClick={() => {
                history.push("/dashboard");
              }}
            >
              <KeyboardBackspaceIcon
                style={{ fontSize: 30, color: theme.palette.primary }}
              />
            </IconButton>
            {/* <Typography className={classes.nameStyle}>{name}</Typography> */}
            <Menubar
              navState={props?.nav}
              setNav={props?.setNav}
              items={[
                {
                  Icon: <PhotoIcon />,
                  text: `Posts`,
                  navText: "Posts",
                },
                {
                  Icon: <InsertDriveFileIcon />,
                  text: "Draft",
                  navText: "Draft",
                },
                {
                  Icon: <BookmarkBorderOutlinedIcon />,
                  text: "Saved",
                  navText: "Saved",
                },
              ]}
            />
          </div>
        </div>
        {btns ? btns : null}
        {profile?._id ? (
          <>
            {isMobile ? null : (
              <Typography>{profile?.parent?.displayName}</Typography>
            )}

            <AvatarLocal
              src={profile?.parent}
              style={{ height: "1.5rem", width: "1.5rem", margin: "0.5rem" }}
            />
          </>
        ) : null}
      </Toolbar>
    </AppBar>
  );
}