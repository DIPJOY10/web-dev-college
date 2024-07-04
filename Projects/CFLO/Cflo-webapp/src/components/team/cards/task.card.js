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
import TaskSvg from "../../../Assets/tasks.svg";
import TaskPaperCard from "../../task/task.card";
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
    paddingLeft: "1rem",
    padding: "0.5rem",
    paddingTop: "0.25rem",
    paddingBottom: "0.25rem",
  },

  createBtnPaper: {
    marginLeft: "3.5rem",
    alignSelf: "flex-end",
  },
}));

export default function TaskCard(props) {
  const classes = useStyles();
  const { teamId } = props;
  const teamReducer = useSelector((state) => state.team);
  const { teamDictionary } = teamReducer;
  const team = teamDictionary[teamId];
  const task = useSelector((state) => state.task);
  const taskIds = team?.tasks ? team?.tasks : [];
  const history = useHistory();
  const dispatch = useDispatch();

  // console.log(taskIds, task,' are task id and task reducer')

  return (
    <Paper onClick={() => {}} className={classes.root} square>
      <div className={clsx(classes.row, classes.topRow)}>
        <img key={"timeline"} className={classes.svgSize} src={TaskSvg} />
        <Typography className={classes.title} color="textSecondary">
          Tasks
        </Typography>
        <Paper className={classes.createBtnPaper}>
          <ButtonBase
            className={classes.createBtn}
            onClick={() => {
              if (team && team?._id) {
                history.push("/task/" + teamId + "/create");
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

      {team?.numTasks > 0 ? (
        <ButtonBase
          className={classes.column}
          onClick={() => {
            if (team && team?._id) {
              history.push("/tasks/" + teamId);
            }
          }}
        >
          <>
            {taskIds.slice(0, 3).map((taskId) => {
              return <TaskPaperCard taskId={taskId} size={"xs"} />;
            })}
          </>
        </ButtonBase>
      ) : (
        <>
          <div className={classes.row}>
            <ButtonBase
              onClick={() => {
                if (team && team?._id) {
                  history.push("/tasks/" + teamId);
                }
              }}
            >
              <Typography variant="body2" component="p">
                Create tasks, track progress. Tasks can have other{" "}
                <b>tasks as dependencies</b>. We evaluate <b>critical tasks</b>{" "}
                and <b>schedule</b> for you.
              </Typography>
            </ButtonBase>
          </div>
        </>
      )}
    </Paper>
  );
}
