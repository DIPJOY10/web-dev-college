import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useMediaQuery } from "@material-ui/core";
import AppBar from "../appbar/Appbar";
import Drawer from "../drawer/Drawer";
import BottomAppbar from "../BottomAppbar/BottomAppbar";
import { useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "row",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  childrenStyle: {
    flexGrow: 1,
  },
}));

export default function Dashboard(props) {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  // TO GET THE PROFILE ID FOR TEMPORARY DEVELOPEMENT PURPOSES.
  const state = useSelector((state) => state.auth);
  console.log("state is ", state);

  const noAppbar = props.noAppbar;

  return (
    <div className={classes.root}>
      {noAppbar ? null : <AppBar />}
      {isMobile ? <BottomAppbar /> : <Drawer />}
      <div className={classes.childrenStyle}>{props.children}</div>
    </div>
  );
}
