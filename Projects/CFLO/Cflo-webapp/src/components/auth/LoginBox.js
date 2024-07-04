import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { Checkbox, FormControlLabel, useMediaQuery } from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import iconsGoogle from "../../Assets/iconsGoogle.svg";
import Box from "@material-ui/core/Box";
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import cx from "clsx";
import { handleGoogleLogin, handleEmailPasswordLogin } from "./auth.utils";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    borderRadius: "30px",
    width: "100%"
  },
  loginSignUpCont: {
    backgroundColor: "#ffffff",
    maxWidth: "580px",
    width: "100%",
    // height: "475px",
    borderRadius: "0px",
    display: "flex",
    flexDirection: "column",
    // alignItems: "center",
  },
  button: {
    width: "271px",
    padding: "5px 0",
    color: "white",
    backgroundColor: theme.palette.primary.main,
  },
  googleButton: {
    width: "280px",
    border: "2px solid grey",
    backgroundColor: "white",
    color: "black",
    padding: "8px 0",
    width: "100%",
    borderRadius: "999rem"
  },
  icon: {
    width: "20px",
    marginRight: "10px",
  },
  smallFont: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#0f1419",
  },
  dividerCont: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    margin: "20px 0"
  },
  dividerHalfCont: {
    width: "44%",
    backgroundColor: "#a4a7a4",
    height: "1px"
  },
  freeText: {
    textAlign: "left",
    fontWeight: "550",
    fontWeight: 500,
    fontSize: "27px",
    color: "#263238",
    marginRight: "18px"
  },
  signUpCont: {
    width: "100%",
    fontSize: "15px",
    padding: "4px 40px",
    marginTop: "15px",
    fontWeight: "700",
    borderRadius: "999rem",
    boxShadow: "none",
    height: "42px",
    "&:hover": {
      boxShadow: "none",
    }
  },
  conditonStyle: {
    marginTop: "30px",
    marginBottom: "35px",
    opacity: "0.8",
    fontWeight: "400",
    fontSize: "14px",
    lineHeight: "21px",
    width: "70%",
    textAlign: "center",
    margin: "0 auto"
  },
  singInCont: {
    fontSize: "15px",
    opacity: "0.8",
    marginTop: "20px",
    textAlign: "center"
  },
  signinStyle: {
    color: "#2E73F8",
    marginLeft: "5px",
    cursor: "pointer",
  },
  linkStyle: {
    textdecoration: "underline",
    color: "#0f1419",
    fontWeight: "400",
    fontSize: "14px",
    lineHeight: "21px",
  },
  inputs: {
    marginBottom: "7px",
    width: "100%",
    borderRadius: "20px",
  },
  inputLabel: {
    fontWeight: "400",
    fontSize: "16px",
    color: "#666666",
    marginBottom: "7px",
    display: "flex",
    alignItems: "center",
  },
  forgotPassword: {
    fontWeight: 400,
    fontSize: "16px",
    lineHeight: "24px",
    textAlign: "right",
    textDecoration: "underline",
    color: "#111111",
  },
  signupCont: {
    display: "flex",
    // alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  }
}));

function LoginBox(props) {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const { setToggleState, setLoadingBool } = props
  const { auth } = useSelector((state) => state);
  const { user, redirect } = auth;
  const profile = user?.profile;
  const userId = user?._id;
  const redirectType = redirect?.type;
  const redirectPayload = redirect?.payload;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordLen, setPasswordLen] = useState(false);

  useEffect(() => {
    if (userId) {
      console.log("After Login");
      let finalLink = "/";
      let anotherLink = "/preLogin"
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

  const handleSubmit = async (event) => {
    if (email.length > 4 && password.length > 7) {
      setLoadingBool(true)
      event.preventDefault();
      handleEmailPasswordLogin(dispatch, email, password);
    } else {
      if (password.length < 8) {
        setPasswordLen(true)
      }
    }
  }

  return (
    <>
      <form className={classes.signupCont} onSubmit={handleSubmit}>
        <Box>
          <Typography className={classes.inputLabel} variant="body2" component="p">Email address or user name</Typography>
          <TextField
            style={{ marginBottom: "10px" }}
            className={classes.inputs}
            size="small"
            id="standard-basic"
            color="primary"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            variant="outlined"
          />
        </Box>
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography className={classes.inputLabel} variant="body2" component="p">Password</Typography>
            <Typography className={classes.inputLabel} variant="body2" component="p"><Box component="span" sx={{ marginRight: "10px", marginBottom: "-5px" }}><VisibilityOffIcon style={{ fontSize: 16 }} /></Box>Hide</Typography>
          </Box>
          <TextField
            className={classes.inputs}
            size="small"
            id="standard-basic"
            color="primary"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            variant="outlined"
          />
          <Typography className={classes.forgotPassword} variant="body2" component="p">Forgot your password?</Typography>
        </Box>
        <FormControlLabel control={<Checkbox style={{ paddingBottom: "0px", paddingTop: "0px" }} />} label="Remember me" />
        {passwordLen ? (<p style={{ fontSize: "14px", color: "red" }} >Password should contain at least 8 characters</p>) : null}
        <Button
          variant="contained"
          color="primary"
          type="submit"
          className={classes.signUpCont}
        >
          Sign In
        </Button>
        <Typography className={classes.singInCont} >Don’t have an acount?
          <span
            className={classes.signinStyle}
            onClick={() => { setToggleState("Sign Up") }}
          >Sign Up</span>
        </Typography>
      </form>
      <div className={classes.dividerCont} >
        <div className={classes.dividerHalfCont} ></div>
        <span style={{ fontSize: "15px", fontWeight: "500" }} >or</span>
        <div className={classes.dividerHalfCont} ></div>
      </div>
      <Button
        className={cx(classes.button, classes.googleButton)}
        onClick={(el) => {
          setLoadingBool(true)
          handleGoogleLogin(dispatch);
        }}
      >
        <img
          className={classes.icon}
          src={iconsGoogle}
          alt="google"
        />{" "}
        <Typography className={classes.smallFont}>
          Sign In using Google
        </Typography>
      </Button>
      <Typography className={classes.conditonStyle} >
        By signing in, you agree to the <Link className={classes.linkStyle} to="/terms">Terms of Service</Link> and <Link className={classes.linkStyle} to="/terms">Privacy Policy</Link>, including <Link className={classes.linkStyle} to="/terms">cookie use.</Link>
      </Typography>
    </>
  );
}

export default LoginBox;
