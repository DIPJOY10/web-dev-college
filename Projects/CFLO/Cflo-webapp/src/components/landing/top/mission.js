import React, { useEffect, useState } from "react";
import { useTheme, makeStyles } from "@material-ui/core/styles";
import { useMediaQuery } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Typed from "react-typed";
import { useDispatch } from "react-redux";

const useStyles = makeStyles((theme) => ({
  subText: {
    fontSize: "23px",
    fontWeight: "600",
    color: "#2e73f8",
    textAlign: 'left',
    letterSpacing: "0.5px",
    marginTop: "10px",
    [theme.breakpoints.down("sm")]: {
      fontSize: "18px",
      marginTop: "0",
      width: "95%",
    },
  },
  WAN: {
    fontSize: "23px",
    fontWeight: "600",
    fontFamily: "'Raleway', sans-serif",
    borderBottom: `3px solid #80fdf5`,
    [theme.breakpoints.down("sm")]: {
      fontSize: "19px",
    }
  },
  subMissionText: {
    fontSize: "15px",
    fontWeight: "500",
    textAlign: "left",
    marginBottom: "20px",
    marginTop: "15px",
    [theme.breakpoints.down("sm")]: {
      fontSize: "14px",
    }
  }
}));

export default function Mission() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));


  return (
    <Box
      flexDirection="column"
      display="flex"
      overflow="hidden"
      width={isSmall ? "100%" : "71vh"}
      padding="0 20px"
      textAlign="center"
      alignItems="center"
    >
      <Typography className={classes.subText}>
        {`Transforming how the real estate industry `}
        {/* { `We are building the digital infrastructure for transforming how the real estate industry ` } */}
        <b className={classes.WAN} >
          {/* <Typed
            strings={[" works and networks"]}
            typeSpeed={40}
            backSpeed={60}
            loop
          /> */}
          works and networks
        </b>
      </Typography>
      <Typography className={classes.subMissionText} >
        ContractFlo is a real estate super-app. Save time from juggling multiple apps and stop paying for costly software. ContractFlo provides a one-stop solution for real estate investors and construction & property managers. 
      </Typography>
    </Box>
  );
}
