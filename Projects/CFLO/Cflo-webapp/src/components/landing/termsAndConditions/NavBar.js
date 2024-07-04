import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    backgroundColor: "#2e73f8",
  },
  contentBox: {
    width: "90%",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    [theme.breakpoints.down("md")]: {
      width: "90%",
    },
  },

  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },

  logoBox: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
  },

  logoStyle: {
    width: "3rem",
    marginRight: "10px",
  },

  logoTextSize: {
    fontSize: "1.25rem",
  },
}));

export default function NavBar() {
  const classes = useStyles();
  const history = useHistory();

  return (
    <div className={classes.root}>
      <AppBar className={classes.appBar} position="fixed">
        <Toolbar className={classes.contentBox}>
          <div
            className={classes.logoBox}
            onClick={() => {
              history.push("/");
            }}
          >
            <img
              src="/static/media/LogoWhite.45d2fff3.svg"
              className={classes.logoStyle}
            />
            <Typography variant="h4" className={classes.logoTextSize}>
              ContractFlo
            </Typography>
          </div>
          <div>
            {/* <Button
              onClick={() => {
                history.push("/");
              }}
              color="inherit"
            >
              Home
            </Button> */}
            <Button
              onClick={() => {
                history.push("/authenticate");
              }}
              color="inherit"
            >
              Join Now
            </Button>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}
