import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory, useLocation } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import ButtonBase from "@material-ui/core/ButtonBase";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { handleResetPassword } from "./auth.utils";
import cx from "clsx";

import Api from "../../helpers/Api";
const useStyles = makeStyles((theme) => ({
  paperRoot: {
    padding: "20px",
  },
  root: {
    paddingTop: "40px",
  },
  center: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  inputs: {
    marginBottom: "20px",
  },

  button: {
    width: "271px",
    padding: "8px 0",
    color: "white",
    backgroundColor: theme.palette.primary.main,
  },

  leftBox: {
    display: "flex",
    alignItems: "center",
    padding: "20px 0",
    justifyContent: "center",
  },
  logoStyle: {
    width: "80px",
  },
  logoTextSize: {
    color: "rgba(0, 0, 0, 0.54)",
    fontWeight: "700",
    marginLeft: "20px",
  },
}));

function ResetPassword({ path }) {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const location = useLocation();
  const { auth } = useSelector((state) => state);
  const { user } = auth;
  const profile = user?.profile;
  const userId = user?._id;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (userId) {
      const finalPath = path || "/";
      history.push(finalPath);
    }
  }, [userId]);

  function handleSubmit(event) {
    console.log({ location });
    event.preventDefault();
    if (password !== confirmPassword) {
      console.log("passwords doesNot matched");
      return;
    }
    const queryParam = new URLSearchParams(location.search);
    const oobCode = queryParam.get("oobCode");
    // handleEmailPasswordSignup(dispatch, email, password, name);
    // handleResetPassword(email);
    handleResetPassword(oobCode, password);
  }

  return (
    <div className={cx(classes.root, classes.center)}>
      <Paper className={classes.paperRoot} elevation={2}>
        <div className={classes.leftBox}>
          <img
            src="/static/media/LogoV3.3044ea80.svg"
            className={classes.logoStyle}
          />
          <Typography variant="h4" className={classes.logoTextSize}>
            ContractFlo
          </Typography>
        </div>
        <form className={classes.center} onSubmit={handleSubmit}>
          <TextField
            className={classes.inputs}
            id="password"
            size="small"
            label="Password"
            variant="outlined"
            color="primary"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <TextField
            className={classes.inputs}
            id="confirmPassword"
            size="small"
            label="Confirm Password"
            variant="outlined"
            color="primary"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
          <Button className={classes.button} type="submit">
            Reset
          </Button>
        </form>
      </Paper>
    </div>
  );
}

export default ResetPassword;
