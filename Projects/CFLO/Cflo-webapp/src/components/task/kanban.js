import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { AppBar, Box, Toolbar } from "@material-ui/core";
import DraggableCardList from "../pipeline/DraggableCardList";

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "auto",
  },
  paper: {
    padding: "1rem",
    width: "18rem",
    minHeight: "60rem",
    margin: "0.5rem",
  },
  row: {
    flex: 1,
    flexDirection: "row",
    display: "flex",
  },
  statusTop: {
    flex: 1,
    height: "4rem",
  },
}));

export default function Kanban(props) {
  const classes = useStyles();
  const pipelineReducer = useSelector((state) => state.pipeline);
  const taskReducer = useSelector((state) => state.task);
  const { taskDictionary } = taskReducer;
  const { pipelineId, cardIds, getCard, getStatus, setStatus } = props;

  const stateColor = {
    Planned: "#42a5f5",
    "In Progress": "#00e5ff",
    Completed: "#00e676",
  };
  const states = ["Planned", "In Progress", "Completed"];

  const [stateObject, setStateObject] = useState({});

  const processCardIds = () => {
    const baseState = states[0];
    const basicStateObject = {};
    if (states && states.length > 0) {
      states.map((state) => {
        basicStateObject[state] = [];
      });

      if (cardIds && cardIds.length > 0) {
        cardIds.map((cardId) => {
          const status = getStatus(cardId);
          if (status && states.indexOf(status) !== -1) {
            basicStateObject[status].push(cardId);
          } else {
            basicStateObject[baseState].push(cardId);
          }
        });
      }
    }

    setStateObject(basicStateObject);
  };

  useEffect(() => {
    processCardIds();
  }, [cardIds, taskDictionary]);

  return (
    <div className={classes.root}>
      <Box
        flexDirection="row"
        flexGrow={1}
        display="flex"
        overflow="auto"
        width="72%"
        position="absolute"
        pr={"10rem"}
      >
        <DraggableCardList
          stateColor={stateColor}
          stateObject={stateObject}
          setStatus={setStatus}
          setStateObject={setStateObject}
          getCard={getCard}
          states={states}
        />
      </Box>
    </div>
  );
}
