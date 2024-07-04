import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory, useLocation } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import ButtonBase from "@material-ui/core/ButtonBase";
import { Typography } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import CreateBtn from "../../styled/actionBtns/create.btn";
import AddIcon from "@material-ui/icons/Add";
import clsx from "clsx";
import AnalysisSvg from "../../../Assets/analysis.svg";
import { handleGoogleLogin } from "../../auth/auth.utils";

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    marginLeft: "1rem",
    width: "16rem",
    maxWidth: "16rem",
    display: "flex",
    padding: "1rem",
    flexDirection: "column",
    minHeight: "8rem",
    marginTop: "1rem",
    textAlign: "center",
  },

  svgSize: {
    display: "flex",
    height: "35px",
    width: "35px",
  },

  header: {
    textAlign: "center",
  },

  row: {
    display: "flex",
    flexDirection: "row",
  },

  column: {
    display: "flex",
    flexDirection: "column",
  },

  topRow: {
    marginBottom: "1rem",
  },

  title: {
    marginLeft: "1rem",
  },

  createBtn: {
    paddingLeft: "0.6rem",
    padding: "0.6rem",
    paddingTop: "0.15rem",
    paddingBottom: "0.25rem",
  },

  createBtnPaper: {
    marginLeft: "2.0rem",
    alignSelf: "flex-end",
  },
}));

export default function AnalysisCard(props) {
  const classes = useStyles();
  const { teamId } = props;
  const teamReducer = useSelector((state) => state.team);
  const { teamDictionary } = teamReducer;
  const team = teamDictionary[teamId];
  const history = useHistory();
  const dispatch = useDispatch();

  return (
    <Paper onClick={() => {}} className={classes.root} square>
      <div className={clsx(classes.row, classes.topRow)}>
        <img key={"timeline"} className={classes.svgSize} src={AnalysisSvg} />
        <Typography className={classes.title} color="textSecondary">
          Project Analysis
        </Typography>

        {/* <Paper className={classes.createBtnPaper}>
          <ButtonBase
            className={classes.createBtn}
            onClick={() => {
              if (team && team?._id) {
                history.push("/analysis/" + teamId + "/create");
              } else {
                handleGoogleLogin(dispatch);
              }
            }}
          >
            <Typography>Add</Typography>

            <AddIcon />
          </ButtonBase>
        </Paper> */}


      </div>
      {team?.parentModelName && (
        <div className={classes.row}>
          <ButtonBase
            onClick={() => {
              if (team && team?._id) {
                history.push("/analysis/" + teamId);
              }
            }}
          >
            <Typography variant="body2" component="p">
              Analyze Properties,track the purchase breakdown, cashflow and
              investment returns for any property.
            </Typography>
          </ButtonBase>
        </div>
      )}
    </Paper>
  );
}
