import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { Link, useHistory } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import ButtonBase from "@material-ui/core/ButtonBase";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { handleGoogleLogin, handleEmailPasswordSignup } from "./auth.utils";
import cx from "clsx";
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import Api from "../../helpers/Api";
import { Palette } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
  },
  center: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  backIconCont: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "23px",
    marginBottom: "8px"
  },
  inputs: {
    marginBottom: "7px",
    width: "271px",
  },
  singinStyle: {
    fontSize: "21px",
    fontWeight: "500"
  },
  button: {
    width: "271px",
    padding: "5px 0",
    color: "white",
    backgroundColor: theme.palette.primary.main,
    marginTop: "10px"
  },
  icon: {
    width: "25px",
    marginRight: "10px",
  },
  terms: {
    width: "271px",
    marginBottom: "10px",
    fontSize: "11px",
    opacity: "0.8",
    fontWeight: "400",
    marginTop: "10px"
  },
  link: {
    color: theme.palette.primary.main,
  },
  googleButton: {
    width: "271px",
    padding: "5px 0",
    color: "white",
    backgroundColor: theme.palette.primary.main,
    border: "1px solid lightGrey",
    backgroundColor: "white",
    color: "black",
    padding: "7px 15px",
    marginTop: "45px"
  },
  smallFont: {
    fontSize: "15px",
    fontWeight: "500",
  },
}));

function SignUp(props) {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const { setToggleState, setLoadingBool, handleGoogleLogin } = props
  const { auth } = useSelector((state) => state);
  const { user, redirect } = auth;
  const profile = user?.profile;
  const userId = user?._id;
  const redirectType = redirect?.type;
  const redirectPayload = redirect?.payload;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    console.log("hello");
    if (userId) {
      let finalLink = "/";
      if (redirect) {
        switch (redirectType) {
          case "Invite":
            finalLink = `/invitation/${redirectPayload}`;
        }
      }
      dispatch({
        type: "AddAuth",
        payload: {
          redirect: null,
        },
      });
      history.push(finalLink);
    }
  }, [userId]);

  function handleSubmit(event) {
    setLoadingBool(true)
    event.preventDefault();
    handleEmailPasswordSignup(dispatch, email, password, name);
  }

  return (
    <div className={classes.root} >
      <div className={classes.backIconCont} >
        <KeyboardBackspaceIcon
          style={{ fontSize: "35px", color: "#2196F3", cursor: "pointer", marginLeft: "15px" }}
          onClick={() => { setToggleState("signupSigninOption") }}
        />
        <Typography className={classes.singinStyle} >Sign Up</Typography>

        <Button
          variant="contained"
          color="primary"
          style={{ marginRight: "20px" }}
          onClick={() => { setToggleState("signin") }}
        >
          <span style={{ textTransform: "uppercase" }} >S</span>
          <span style={{ textTransform: "lowercase" }} >ign in</span>
        </Button>
      </div>
      <form className={classes.center} onSubmit={handleSubmit}>
        <TextField
          className={classes.inputs}
          id="standard-basic"
          size="small"
          label="Name"
          color="primary"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <TextField
          className={classes.inputs}
          size="small"
          id="standard-basic"
          label="Email"
          color="primary"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <TextField
          className={classes.inputs}
          size="small"
          id="standard-basic"
          label="Password"
          color="primary"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <Typography variant="body2" className={classes.terms}>
          By signing up, you indicate that you agree to the ContractFlo{" "}
          <Link to="/terms" className={classes.link}>
             Terms & Conditions.
          </Link>
        </Typography>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          type="submit"
        >
          <span style={{ textTransform: "uppercase" }} >S</span>
          <span style={{ textTransform: "lowercase" }} >ign up</span>
        </Button>
      </form>
      
      <Button
        className={classes.googleButton}
        onClick={(el) => {
          setLoadingBool(true)
          handleGoogleLogin(dispatch);
        }}
      >
        <img
          className={classes.icon}
          src='https://i.ibb.co/9VK76tX/1298745-google-brand-branding-logo-network-icon.png"'
        />{" "}
        <Typography className={classes.smallFont}>
          {" "}
          <span style={{ textTransform: "uppercase" }} >S</span>
          <span style={{ textTransform: "lowercase" }} >ign up using <span style={{ textTransform: "uppercase" }} >G</span>oogle</span>
        </Typography>
      </Button>
    </div>
  );
}

export default SignUp;
