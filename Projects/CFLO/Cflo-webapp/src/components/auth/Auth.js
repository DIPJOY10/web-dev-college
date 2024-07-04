import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import SocialAuth from "./SocialAuth";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";


const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    height: "100vh",
    width: "100vw",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.palette.primary.main,
  },

  paper: {
    maxWidth: 400,
    alignSelf: "center",
    margin: `2rem auto`,
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: "3rem",
    [theme.breakpoints.down("xs")]: {
      marginLeft: "1rem",
      marginRight: "1rem",
    },
  },

  logoBox: {
    display: "flex",
  },

  logoImg: {
    height: "2.5rem",
    width: "2.5rem",
  },

  logoText: {
    textAlign: "center",
    fontSize: 20,
    fontFamily: "Ovo",
    fontWeight: "600",
    marginBottom: 10,
    overflow: "none",
    margin: "0.5rem",
  },

  textDescriptionMain: {
    fontSize: 18,
    fontFamily: "Ovo",
    fontWeight: "400",
    marginBottom: 10,
    overflow: "none",
    marginTop: "1rem",
  },
  textDescriptionSub: {
    fontSize: 15,
    fontFamily: "Ovo",
    color: "#737373",
  },
}));

export default function AuthPage() {
  const classes = useStyles();

  return (
    <Grid
      container
      spacing={0}
      align="center"
      justify="center"
      direction="column"
      className={classes.root}
    >
      <Grid item>
        <Paper className={classes.paper}>
          <Grid
            item
            justify="center"
            direction="row"
            className={classes.logoBox}
          >
            <Avatar
              alt="Logo"
              className={classes.logoImg}
              src={require("../../Assets/LogoV3.svg")}
            />
            <Typography className={classes.logoText}>ContractFlo</Typography>
          </Grid>
          <Divider />
          <Typography className={classes.textDescriptionMain}>
            Project management, made simple
          </Typography>
          <Typography className={classes.textDescriptionSub}>
            On ContractFlo, investors, project managers and professionals
            coordinate, track, and update their work in one place, so projects
            stay optimally financed, transparent and on schedule.
          </Typography>
          <SocialAuth />
        </Paper>
      </Grid>
    </Grid>
  );
}
