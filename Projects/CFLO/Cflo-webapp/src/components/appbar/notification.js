import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import NotificationsIcon from "@material-ui/icons/Notifications";
import ButtonBase from "@material-ui/core/ButtonBase";
import Popover from "@material-ui/core/Popover";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import Badge from "@material-ui/core/Badge";
import IconButton from "@material-ui/core/IconButton";
import ActivityCard from "../activity/notify.card";
import { Box, Tooltip } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
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
    maxHeight: "4rem",
    maxWidth: "19rem",
    // width: "80%",
    padding: "1rem",
  },

  popoverButton: {
    width: "11rem",
    height: "3.0rem",
    paddingRight: "2rem",
    display: "flex",
    borderRadius: "5%",
  },
  center: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    cursor: "pointer"
  },
  menuIcon: {
    "& path": {
      fill: "rgba(0, 0, 0, 0.26)",
    },
  },
  text: {
    color: "rgba(0, 0, 0, 0.26)",
    marginTop: "-5%",
    fontWeight: "500",
    fontSize: "12px",
    display: "flex",
    [theme.breakpoints.down('sm')]: {
      display: "none"
    }
  },
}));
export default function S(props) {
  const classes = useStyles();
  const { activityDictionary, topNotificationIds } = useSelector(
    (state) => state.activity
  );
  const [anchorEl, setAnchorEl] = React.useState(null);

  //   console.log({
  //     activityDictionary,
  //     topNotificationIds,
  //   });

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <>
      {/* <IconButton
        onClick={handleClick}
        aria-label="show 17 new notifications"
        color="inherit"
        className={classes.menuButton}
      >
        <Badge badgeContent={0} color="primary">
          <NotificationsIcon className={classes.NotificationsIconStyle} />
        </Badge>
      </IconButton> */}
      <Tooltip title="Notifications" >
        <Box
          aria-label="show 17 new notifications"
          color="disabled"
          className={classes.center}
          onClick={handleClick}
        >
          <NotificationsIcon sx={{ fontSize: 32 }} className={classes.menuIcon} />
        </Box>
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
        {topNotificationIds && topNotificationIds.length > 0 ? (
          <>
            {topNotificationIds.map((notId) => {
              return <ActivityCard actId={notId} />;
            })}
          </>
        ) : (
          <Paper elevation={3} className={classes.popoverStyle}>
            {/* <ButtonBase className={classes.popoverButton}> */}
            <Typography className={classes.typography}>
              No Activity
            </Typography>
            {/* </ButtonBase> */}
          </Paper>
        )}
      </Popover>
    </>
  );
}
