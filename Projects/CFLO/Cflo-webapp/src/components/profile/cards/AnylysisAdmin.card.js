import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory, useLocation } from "react-router-dom";
import AnalysisCardSvg from "../../../Assets/analysisCard.svg";
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

const useStyles = makeStyles((theme) => ({
  cardCont: {
    width: "320px",
    backgroundColor: "white",
    display: "flex",
    padding: "0px 20px 20px",
    borderRadius: "15px",
    margin: "10px",
    alignItems: "center",
    flexDirection: "column",
    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.15)",
    "& img": {
      width: "160px",
      height: "auto",
    },
    "& h2": {
      fontSize: "24px",
      fontWeight: "510",
      color: "#193B56",
      marginBottom: "5px"
    },
    "& h4": {
      fontSize: "12px",
      color: "#696969",
      fontWeight: "400",
      textAlign: "center",
      marginBottom: "4px"
    },
    "& p": {
      color: theme.palette.primary.main,
      fontWeight: "510",
      marginBottom: "5px"
    },
    "& h5": {
      fontSize: "14px",
      color: "#626060",
      fontWeight: "450",
      cursor: "pointer",
      marginBottom: "2px"
    },
    "& div": {
      display: "flex",
      alignItems: "center",
      marginTop: "6px",
      cursor: "pointer",
      color: theme.palette.primary.main,
      "& h3": {
        fontSize: "15px",
        fontWeight: "500",
      }
    }
  }
}));

export default function AnalysisAdminCard(props) {
  const classes = useStyles();

  const history = useHistory();
  const dispatch = useDispatch();

  return (
    <div className={classes.cardCont} >

      <img src={AnalysisCardSvg} />

      <h2>Investment Analysis</h2>
      <h4>Analyze real estate investment properties (Rentals, BRRRRs, Flips)</h4>
      <p>Features</p>

      <h5
        onClick={() => { history.push("/investment/analysis/criteria/management"); }}
      >Criteria Management</h5>
      <h5
        onClick={() => { history.push("/investment/analysis/compare"); }}
      >Compare Report</h5>

      <div
        onClick={() => { history.push("/investment/analysis/new"); }}
      >
        <h3>Create Report</h3>
        <ArrowForwardIosIcon style={{ marginLeft: "7px", fontSize: "14px" }} />
      </div>
    </div>
  );
}
