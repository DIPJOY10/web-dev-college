import React, { useState } from "react";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  expandIcon: {
    cursor: "pointer",
    color: "#1684EA",
    "&:hover": {
      color: "#1684ea",
    },
    marginLeft: "auto",
  },
  ExpandedContainer: {
    display: "flex",
    flexDirection: "column",
  },
  list_container: {
    width: "calc(100% - 16px)",
    display: "flex",
    justifyContent: "space-between",
    marginLeft: "25px",
    marginBottom: "5px"
  },
  expandedCont: {
    width: "100%",
    height: "20px",
    textAlign: "right",
    marginTop: "-6px"
  }
}));

function DropDown({ list, openCloseBool, isMonthly }) {
  const classes = useStyles();
  const { expandIcon, ExpandedContainer, list_container, root } = classes;
  const [expanded, setExpanded] = useState(false);

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  return (
    <div className={root}>
      {openCloseBool && (
        <div className={ExpandedContainer}>
          {list.map((entry, index) => (
            <div className={list_container}>
              <p>{entry.name}</p>
              <p>$ {numberWithCommas(parseFloat(entry.value).toFixed(1))} {isMonthly && "/mo"} </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DropDown;
