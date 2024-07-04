import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useMediaQuery, ButtonBase } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Fab from "@material-ui/core/Fab";
import DashboardIcon from "@material-ui/icons/Dashboard";
import FormatListBulletedIcon from "@material-ui/icons/FormatListBulleted";
import Paper from "@material-ui/core/Paper";
import SearchBar from "../SearchBar";
import IssueCard from "./issue.card";
import { AppBar, IconButton, Box, Toolbar } from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { testFields } from "../pipeline/pipeline.utils";
import Api from "../../helpers/Api";
import AddIcon from "@material-ui/icons/Add";
import { useParams, useHistory } from "react-router-dom";
import Kanban from "../pipeline/kanban";
import Drawer from "./issue.drawer";
import List from "./issue.list";
import _ from "lodash";
import { addInTeam } from "./issue.utils";

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "auto",
    marginTop: "6rem",
  },
  iconButton: {
    height: "3rem",
    width: "3rem",
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

export default function Issues(props) {
  const history = useHistory();
  const dispatch = useDispatch();
  const classes = useStyles();
  const state = useSelector((state) => state);
  const [pipeline, setPipeline] = useState(null);
  const [kanbanView, setKanbanView] = useState(false);
  const [pipeIssueMap, setPipeIssueMap] = useState({});
  const [issuePipelineIds, setIssuePipelineIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { teamId } = useParams();

  const issueReducer = useSelector((state) => state.issue);
  const { issueDictionary } = issueReducer;
  const teamReducer = useSelector((state) => state.team);
  const { teamDictionary } = teamReducer;
  const team = teamDictionary[teamId];
  const issue = useSelector((state) => state.issue);

  const allIssueIds = team.issues ? team.issues : [];

  const [cardIds, setCardIds] = useState(allIssueIds);

  const search = (text) => {
    const searchIssueIds = [];
    if (cardIds && cardIds.length > 0) {
      cardIds.map((issueId) => {
        const issue = issueDictionary[issueId];
        const { title, description, user } = issue;
        const displayName = user.displayName;

        const fieldArray = [displayName, description, title];
        const containText = testFields(fieldArray, text);
        if (containText) {
          searchIssueIds.push(issueId);
        }
      });
      setCardIds(searchIssueIds);
    } else {
      setCardIds(cardIds);
    }
  };

  useEffect(() => {
    search(searchTerm);
  }, [searchTerm]);

  const getCard = (issueId) => {
    return (
      <IssueCard
        issueId={issueId}
        size={"sm"}
        onSelect={() => {
          history.push("/issue/" + issueId);
        }}
      />
    );
  };

  const getStatus = (issueId) => {
    const issue = issueDictionary[issueId];
    return issue.status;
  };

  const setStatus = (issueId, state) => {
    const issue = issueDictionary[issueId];
    const newissueObject = {};
    newissueObject[issueId] = {
      ...issue,
      status: state,
    };
    // console.log(newissueObject,' is the newIssueObject')
    dispatch({
      type: "AddIssue",
      payload: {
        issueDictionary: {
          ...issueDictionary,
          ...newissueObject,
        },
      },
    });

    Api.post("issue/update", {
      _id: issueId,
      status: state,
    }).then((issue) => {
      // no need to update, already updated above
    });
  };

  useEffect(() => {
    Api.post("issue/getTeamIssues", {
      team: teamId,
    }).then((issues) => {
      // console.log(' In getTeamIssues ',issues)
      addInTeam(issues, team, state, dispatch, false);
    });
  }, []);

  useEffect(() => {
    const newIssueIds = team.issues ? team.issues : [];
    setCardIds(newIssueIds);
  }, [teamDictionary]);

  return (
    <div className={classes.root}>
      <Drawer
        teamId={teamId}
        pipeline={pipeline}
        setPipeline={setPipeline}
        setIssueIds={setCardIds}
      />

      <Box
        flexDirection="row"
        display="flex"
        overflow="auto"
        justifyContent={"center"}
        alignItems="center"
        marginTop="1.5rem"
      >
        <div className={classes.searchBar}>
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>

        {pipeline ? (
          <ButtonBase
            className={classes.createBtn}
            onClick={() => {
              setKanbanView(true);
            }}
          >
            <IconButton className={classes.iconButton}>
              <DashboardIcon />
            </IconButton>
            <Typography>Kanban</Typography>
          </ButtonBase>
        ) : null}

        <ButtonBase
          className={classes.createBtn}
          onClick={() => {
            setKanbanView(false);
          }}
        >
          <IconButton className={classes.iconButton}>
            <FormatListBulletedIcon />
          </IconButton>
          <Typography>List</Typography>
        </ButtonBase>

        <Paper className={classes.createBtnPaper}>
          <ButtonBase
            className={classes.createBtn}
            onClick={() => {
              history.push("/issue/" + teamId + "/create");
            }}
          >
            <Typography>Add</Typography>

            <AddIcon />
          </ButtonBase>
        </Paper>
      </Box>

      {pipeline && kanbanView ? (
        <Kanban
          pipelineId={pipeline}
          cardIds={cardIds}
          getCard={getCard}
          getStatus={getStatus}
          setStatus={setStatus}
        />
      ) : (
        <List issueIds={cardIds} />
      )}
    </div>
  );
}
