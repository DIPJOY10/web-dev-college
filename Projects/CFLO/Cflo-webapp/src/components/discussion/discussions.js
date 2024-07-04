import React, {useEffect, useRef, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useMediaQuery, ButtonBase} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import DashboardIcon from '@material-ui/icons/Dashboard';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import Paper from '@material-ui/core/Paper';
import SearchBar from '../SearchBar';
import DiscussionCard from './discussion.card';
import {AppBar, IconButton, Box, Toolbar} from '@material-ui/core';
import {
  makeStyles,
  useTheme,
} from '@material-ui/core/styles';
import {testFields} from '../pipeline/pipeline.utils';
import Api from '../../helpers/Api';
import AddIcon from '@material-ui/icons/Add';
import {
  useParams,
  useHistory,
} from 'react-router-dom';
import Kanban from '../pipeline/kanban';


import DiscussionPaperCard from './discussion.card';
import _ from 'lodash';

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
    marginTop: '6rem',
  },
  iconButton: {
    height: '3rem',
    width: '3rem',
  },
  searchBar: {

    marginBottom: 0,
    paddingBottom: 0,
    width: '24rem',
    height: '4rem',
  },
  createBtn: {
    paddingLeft: '1rem',
    padding: '0.5rem',
    paddingTop: '0.25rem',
    paddingBottom: '0.25rem',

  },

  createBtnPaper: {
    marginLeft: '1.5rem',
    marginBottom: '1.5rem',
    alignSelf: 'flex-end',

  },
}));

export default function Discussions(props) {
  const history = useHistory();
  const dispatch = useDispatch();
  const classes = useStyles();
  const [pipeline, setPipeline] = useState(null);
  const [kanbanView, setKanbanView] = useState(false);
  const [pipeDiscussionMap, setPipeDiscussionMap] = useState({});
  const [discussionPipelineIds, setDiscussionPipelineIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const {
    teamId,
  } = useParams();

  const discussionReducer = useSelector((state) => state.discussion);
  const {
    discussionDictionary,
  } = discussionReducer;
  const teamReducer = useSelector((state)=>state.team);
  const {
    teamDictionary,
  } = teamReducer;
  const team = teamDictionary[teamId];
  const discussion = useSelector((state)=>state.discussion);


  const allDiscussionIds = team.discussions?team.discussions:[];


  // console.log(allDiscussionIds,' is the discussions ids')

  return (
    <div className={classes.root}>


      {allDiscussionIds.map((discussionId)=>{
        return (
          <DiscussionCard discussionId={discussionId} onSelect={()=>{
            history.push('/discussion/'+discussionId);
          }}/>
        );
      })}

    </div>
  );
}
