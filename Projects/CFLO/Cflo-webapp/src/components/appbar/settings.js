import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import ButtonBase from "@material-ui/core/ButtonBase";
import Popover from "@material-ui/core/Popover";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import Badge from "@material-ui/core/Badge";
import IconButton from "@material-ui/core/IconButton";
import ExitToAppOutlinedIcon from "@material-ui/icons/ExitToAppOutlined";
import SettingsOutlinedIcon from "@material-ui/icons/SettingsOutlined";
import firebase from "firebase";
import { Tooltip } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  logoImg: {
    height: "1.6rem",
    width: "1.6rem",
    borderRadius:"0.8rem",
    marginLeft: "0.5rem",
  },

  menuButton: {
    marginTop: "-2px",
    marginRight: 0,
    [theme.breakpoints.down("sm")]: {
      marginRight: "-0.6rem",
    },
    [theme.breakpoints.down("xs")]: {
      marginRight: "-1.05rem",
    },
  },

  NotificationsIconStyle: {
    color: theme.palette.action.disabled,
    fontSize: "1.7rem",
  },

  popoverStyle: {
    height: "8rem",
    width: "13rem",
    padding: "1rem",
  },

  popoverButton: {
    width: "11rem",
    height: "3.0rem",
    paddingRight: "2rem",
    display: "flex",
    borderRadius: "5%",
  },
}));
export default function S(props) {
  const history = useHistory();
  const dispatch = useDispatch();
  const classes = useStyles();
  const { user } = useSelector((state) => state.auth);

  const displayPicture =
    user?.displayPicture?.thumbUrl || user?.displayPicture?.url;

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const logout = () => {
    firebase
      .auth()
      .signOut()
      .then(function () {
        dispatch({
          type: "REMOVE_AUTH_USER",
        });

        dispatch({
          type: "TeamReset",
        });

        dispatch({
          type: "FeedReset",
        });

        dispatch({
          type: "FileReset",
        });

        dispatch({
          type: "IssueReset",
        });

        dispatch({
          type: "WalletReset",
        });

        dispatch({
          type: "PipelineReset",
        });

        dispatch({
          type: "DashboardReset",
        });

        dispatch({
          type: "CommentReset",
        });

        dispatch({
          type: "ProjectReset",
        });

        dispatch({
          type: "ChatReset",
        });

        localStorage.removeItem("token");
      })
      .catch(function (error) {
        // An error happened.
      });
  };

  return (
    <>
      <Tooltip title={user.displayName}>
        <ButtonBase onClick={handleClick}>
          <img alt="displayPicture" className={classes.logoImg} src={displayPicture} />
        </ButtonBase>
      </Tooltip>


      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Paper elevation={3} className={classes.popoverStyle}>
          <ButtonBase
            className={classes.popoverButton}
            onClick={() => {
              const path = "/account/?path=Settings";
              history.push(path);
            }}
          >
            <IconButton>
              <SettingsOutlinedIcon />
            </IconButton>
            <Typography className={classes.typography}>Settings</Typography>
          </ButtonBase>
          <ButtonBase className={classes.popoverButton} onClick={logout}>
            <IconButton>
              <ExitToAppOutlinedIcon />
            </IconButton>
            <Typography className={classes.typography}>Logout</Typography>
          </ButtonBase>
        </Paper>
      </Popover>
    </>
  );
}
