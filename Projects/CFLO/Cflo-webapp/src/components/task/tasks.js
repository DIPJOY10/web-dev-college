import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useMediaQuery, ButtonBase } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Kanban from "./kanban";
import Paper from "@material-ui/core/Paper";
import SearchBar from "../SearchBar";
import TaskCard from "./task.card";
import { AppBar, IconButton, Box } from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { testFields } from "../pipeline/pipeline.utils";
import { useGetTaskMap } from "../task/task.hooks";
import Api from "../../helpers/Api";
import AddIcon from "@material-ui/icons/Add";
import { useParams, useHistory } from "react-router-dom";
import { addInTeam } from "./task.utils";
import { Toolbar } from "@material-ui/core";
import PaperBtn from "../styled/actionBtns/paper.btn";
import HomeIcon from "@material-ui/icons/Home";

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "auto",
    marginTop: "6rem",
  },

  tabRoot: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginBottom: "1rem",
    padding: "1rem",
    height: "4rem",
    maxHeight: "4rem",
  },

  searchBar: {
    marginBottom: 0,
    paddingBottom: 0,
    width: "24rem",
    height: "4rem",
  },
  createBtn: {
    paddingLeft: "1rem",
    padding: "0.5rem",
    paddingTop: "0.25rem",
    paddingBottom: "0.25rem",
  },

  createBtnPaper: {
    marginLeft: "1.5rem",
    marginBottom: "1.5rem",
    alignSelf: "flex-end",
  },
}));

export default function Tasks(props) {
  const history = useHistory();
  const dispatch = useDispatch();
  const classes = useStyles();
  const [searchTerm, setSearchTerm] = useState("");
  const { teamId } = useParams();
  const taskReducer = useSelector((state) => state.task);
  const { taskDictionary } = taskReducer;
  const teamReducer = useSelector((state) => state.team);
  const { teamDictionary } = teamReducer;
  const team = teamDictionary[teamId];
  const state = useSelector((state) => state);
  const task = useSelector((state) => state.task);
  const oldTaskIds = team.tasks ? team.tasks : [];
  const [taskIds, setTaskIds] = useState(oldTaskIds);
  const [cardIds, setCardIds] = useState(taskIds);

  const search = (text) => {
    const searchTaskIds = [];
    if (taskIds && taskIds.length > 0) {
      taskIds.map((taskId) => {
        const task = taskDictionary[taskId];
        const { title, description, user } = task;
        const displayName = user.displayName;

        const fieldArray = [displayName, description, title];
        const containText = testFields(fieldArray, text);
        if (containText) {
          searchTaskIds.push(taskId);
        }
      });
      setCardIds(searchTaskIds);
    } else {
      setCardIds(taskIds);
    }
  };

  useEffect(() => {
    Api.post("task/getTeamTasks", {
      team: teamId,
    }).then((tasks) => {
      addInTeam(tasks, team, state, dispatch, false);
    });
  }, []);

  useEffect(() => {
    const newTaskIds = team.tasks ? team.tasks : [];
    setTaskIds(newTaskIds);
    setCardIds(newTaskIds);
  }, [teamDictionary]);

  useEffect(() => {
    search(searchTerm);
  }, [searchTerm]);

  const getCard = (taskId) => {
    return (
      <TaskCard
        taskId={taskId}
        size={"sm"}
        onSelect={() => {
          history.push("/task/" + taskId);
        }}
      />
    );
  };

  const getStatus = (taskId) => {
    const task = taskDictionary[taskId];
    return task.status ? task.status : "Planned";
  };

  const setStatus = (taskId, state) => {
    const task = taskDictionary[taskId];
    const newtaskObject = {};
    newtaskObject[taskId] = {
      ...task,
      status: state,
    };
    dispatch({
      type: "AddTask",
      payload: {
        taskDictionary: {
          ...taskDictionary,
          ...newtaskObject,
        },
      },
    });

    Api.post("task/update", {
      _id: taskId,
      status: state,
    }).then((task) => {
      // no need to update, already updated above
    });
  };

  return (
    <div className={classes.root}>
      <Box
        flexDirection="row"
        display="flex"
        overflow="auto"
        justifyContent={"center"}
      >
        <div className={classes.searchBar}>
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>
        <Paper className={classes.createBtnPaper}>
          <ButtonBase
            className={classes.createBtn}
            onClick={() => {
              history.push("/task/" + teamId + "/create");
            }}
          >
            <Typography>Create</Typography>

            <AddIcon />
          </ButtonBase>
        </Paper>
      </Box>
      <Kanban
        cardIds={cardIds}
        getCard={getCard}
        getStatus={getStatus}
        setStatus={setStatus}
      />
    </div>
  );
}
