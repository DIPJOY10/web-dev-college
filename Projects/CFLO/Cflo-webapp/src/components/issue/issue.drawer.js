import React, {useEffect, useRef, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useMediaQuery, ButtonBase} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import Divider from '@material-ui/core/Divider';
import {AppBar, IconButton, Box, Toolbar} from '@material-ui/core';
import {
  makeStyles,
  useTheme,
} from '@material-ui/core/styles';

import Api from '../../helpers/Api';

import {
  useParams,
  useHistory,
} from 'react-router-dom';
import {setPipelines} from '../pipeline/pipeline.utils';
import _ from 'lodash';

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
    marginTop: '6rem',
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.only('xs')]: {
      width: '100%',
    },
  },

  list: {
    display: 'flex',
    flex: 1,
    width: '100%',
    flexDirection: 'column',
  },

  listItem: {
    display: 'flex',
    flex: 1,
  },
  chipStyle: {
    marginLeft: '1rem',
  },
  listItemText: {
    flex: 1,
  },

}));

export default function IssueDrawer(props) {
  const history = useHistory();
  const dispatch = useDispatch();
  const classes = useStyles();

  const [pipeIssueMap, setPipeIssueMap] = useState({});
  const [issuePipelineIds, setIssuePipelineIds] = useState([]);

  const {
    teamId,
    pipeline,
    setPipeline,
    setIssueIds,
  } = props;

  const pipelineReducer = useSelector((state) => state.pipeline);
  const issueReducer = useSelector((state) => state.issue);
  const {
    issueDictionary,
  } = issueReducer;
  const teamReducer = useSelector((state)=>state.team);
  const {
    teamDictionary,
  } = teamReducer;
  const team = teamDictionary[teamId];
  const issue = useSelector((state)=>state.issue);
  const {
    pipelineDictionary,
    pipelineIds,
  } = pipelineReducer;


  const issueIds = team.issues?team.issues:[];


  useEffect(() => {
    const typePipelineIds = pipelineIds.filter((pipelineId)=>{
      const pipeline = pipelineDictionary[pipelineId];
      return pipeline.type === 'Issue';
    });

    setIssuePipelineIds(typePipelineIds);
    const pipeSet = new Set();
    const issues = issueIds.map((issueId)=>{
      const issue = issueDictionary[issueId];
      const pipeline = issue.pipeline;
      pipeSet.add(pipeline);
      return issue;
    });
    const pipeArr = Array.from(pipeSet);
    const pipeDic = _.groupBy(issues, 'pipeline');
    const pipelineIssueMap = {};
    pipeArr.map((pipeId)=>{
      const pipeIssues = pipeDic[pipeId];
      pipelineIssueMap[pipeId] = {
        num: pipeIssues.length,
        issueIds: pipeIssues.map((issue)=>issue._id),
      };
    });
    const pipeDiff = _.difference(pipeArr, pipelineIds);

    // console.log(pipelineIssueMap,' is the pipelineIssueMap')
    setPipeIssueMap(pipelineIssueMap);
    if (pipeDiff&&pipeDiff.length>0) {
      Api.post('pipeline/get', {
        pipelines: pipeDiff,
      }).then((res)=>{
        const pipelines = res.result;
        setPipelines(pipelines, pipelineReducer, dispatch);
        // no need to update, already updated above
      });
    }
  }, [pipelineIds, issueIds, issueDictionary]);

  return (
    <div className={classes.root}>
      <List component="div" disablePadding className={classes.list}>

        <ListItem button onClick={()=>{
          setPipeline(null);
          setIssueIds(issueIds);
        }}
        className={classes.listItem}
        >
          <Typography className={classes.listItemText}>
                        All Issues
          </Typography>
          <Chip label={issueIds.length+' Issues'} />
        </ListItem>
        <Divider />

        {issuePipelineIds.map((pipelineId)=>{
          const pipeObj = pipelineDictionary[pipelineId];
          const issueLength = pipeIssueMap[pipelineId]?
                                        pipeIssueMap[pipelineId].num:0;
          const pipeIssueIds = pipeIssueMap[pipelineId]?
                            pipeIssueMap[pipelineId].issueIds:[];
          return (
            <>
              <ListItem button onClick={()=>{
                setPipeline(pipelineId);
                setIssueIds(pipeIssueIds);
              }}
              className={classes.listItem}
              >
                <Typography className={classes.listItemText}>
                  {pipeObj?.name||''}
                </Typography>
                <Chip label={issueLength+' Issues'} />
              </ListItem>
              <Divider />
            </>

          );
        })}
      </List>
    </div>
  );
}
