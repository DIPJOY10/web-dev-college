import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory, useLocation } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import ButtonBase from "@material-ui/core/ButtonBase";
import moment from "moment";
import { Typography } from "@material-ui/core";
import AssignmentIcon from "@material-ui/icons/Assignment";
import IconButton from "@material-ui/core/IconButton";
import CreateBtn from "../../styled/actionBtns/create.btn";
import AddIcon from "@material-ui/icons/Add";
import clsx from "clsx";
import IssueSvg from "../../../Assets/issue.svg";
import IssuePaperCard from "../../issue/issue.card";
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
    alignItems: "center",
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
    paddingLeft: "1rem",
    padding: "0.5rem",
    paddingTop: "0.25rem",
    paddingBottom: "0.25rem",
  },

  createBtnPaper: {
    marginLeft: "0.5rem",
    alignSelf: "flex-end",
  },
}));

export default function WorkFlowCard(props) {
  const classes = useStyles();
  const { profileId, issues } = props;

  const history = useHistory();
  const dispatch = useDispatch();

  return (
    <Paper onClick={() => {}} className={classes.root} square>
      <div className={clsx(classes.row, classes.topRow)}>
        <img className={classes.svgSize} src={IssueSvg} />

        <Typography className={classes.title} color="textSecondary">
          Workflows
        </Typography>
        <Paper className={classes.createBtnPaper}>
          <ButtonBase
            className={classes.createBtn}
            onClick={() => {
              if (profileId) {
                var path = "/issues/profile/" + profileId;
                history.push(path);
              } else {
                handleGoogleLogin(dispatch);
              }
            }}
          >
            <Typography>Add</Typography>

            <AddIcon />
          </ButtonBase>
        </Paper>
      </div>

      {issues?.length > 0 ? (
        <ButtonBase
          className={classes.column}
          onClick={() => {
            history.push("/issues/profile/" + profileId);
          }}
        >
          <>
            {issues.slice(0, 3).map((issue) => {
              return <IssuePaperCard issue={issue} size={"xs"} />;
            })}
          </>
        </ButtonBase>
      ) : (
        <>
          <div className={classes.row}>
            <ButtonBase
              onClick={() => {
                history.push("/issues/profile/" + profileId);
              }}
            >
              <Typography variant="body2" component="p">
                Create different <b>workflows</b> to track{" "}
                <b>issues, client tickets, change orders etc</b> and keep your
                team on the same page.
              </Typography>
            </ButtonBase>
          </div>
        </>
      )}
    </Paper>
  );
}
