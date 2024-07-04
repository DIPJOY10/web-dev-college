import React, { useRef, useState, useCallback } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import ButtonBase from "@material-ui/core/ButtonBase";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  actionDivBtn2: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "1rem",
    // marginLeft: "1rem",
    marginTop: "3rem",
    borderColor: "black",
    borderRadius: "50%",
    height: "2.7rem",
    width: "2.7rem",
    backgroundColor: theme.palette.primary.light,
  },
  actionDivBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderColor: "black",
    borderRadius: "50%",
    height: "2.4rem",
    width: "2.4rem",
    backgroundColor: "white",
  },
  actionBtnStyle: {
    marginTop: 0,
    borderWidth: 1,
    height: "3rem",
    width: "3rem",
    borderRadius: "50%",
    borderWidth: "1px",
    borderColor: theme.palette.primary.main,
    fontSize: "1rem",
    color: theme.palette.primary.light,
  },
}));

const ActionBtnCircle = (props) => {
  const classes = useStyles();
  const link = props.link;
  const disabled = props.disabled;
  const { actionFn } = props;
  const history = useHistory();

  const navigateToLink = () => {
    history.push(link);
  };

  return (
    <div className={classes.actionDivBtn2}>
      <div className={classes.actionDivBtn}>
        <ButtonBase
          disabled={disabled}
          className={classes.actionBtnStyle}
          onClick={() => actionFn()}
        >
          <div>{props.children}</div>
        </ButtonBase>
      </div>
    </div>
  );
};

export default ActionBtnCircle;
