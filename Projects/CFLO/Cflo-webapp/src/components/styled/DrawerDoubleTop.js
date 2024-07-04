import React, { useState, useEffect } from "react";
import { useSelectedor, useDispatch } from "react-redux";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import { AppBar, Box, useMediaQuery } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import ButtonBase from "@material-ui/core/ButtonBase";
import Typography from "@material-ui/core/Typography";
import cx from "clsx";

const useStyles = makeStyles((theme) => ({
  root: {},

  row: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
  },

  full: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },

  left: {
    width: "40%",
    height: "100%",
    minWidth: "18rem",
    maxWidth: "20rem",
    height: "100%",
    position: "relative",
    top: 0,
    left: 0,
  },

  right: {
    height: "100%",
    minWidth: "18rem",
    height: "100%",
    position: "relative",
    top: 0,
    right: 0,
  },

  col: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
}));

export default function S(props) {
  const {
    leftWidth,
    left: Left,
    leftTopBar: LeftTopBar,
    right: Right,
    rightTopBar: RightTopBar,
    selected,
    setSelected,
  } = props;

  const classes = useStyles({ leftWidth });
  const theme = useTheme();

  const history = useHistory();
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);

  const { root, row, col, full, left, right } = classes;

  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      {isSmall ? (
        <>
          {open ? (
            <Box
              flexDirection="column"
              overflow="auto"
              height="100%"
              width="100%"
              position="absolute"
            >
              {RightTopBar ? <RightTopBar setOpen={setOpen} /> : null}
              {Right ? <Right setOpen={setOpen} selected={selected} /> : null}
            </Box>
          ) : (
            <Box
              flexDirection="column"
              overflow="auto"
              height="100%"
              width="100%"
              position="absolute"
            >
              {LeftTopBar ? <LeftTopBar /> : null}
              <Left
                setOpen={setOpen}
                selected={selected}
                setSelected={setSelected}
              />
            </Box>
          )}
        </>
      ) : (
        <div className={cx(row, full)}>
          <div className={cx(col, left)}>
            {LeftTopBar ? <LeftTopBar /> : null}
            <Left selected={selected} setSelected={setSelected} />
          </div>
          <Paper className={cx(col, right)}>
            {RightTopBar ? <RightTopBar selected={selected} /> : null}
            {Right ? <Right selected={selected} /> : null}
          </Paper>
        </div>
      )}
    </>
  );
}
