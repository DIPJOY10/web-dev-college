import React, {useEffect, useRef, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useMediaQuery, ButtonBase} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import Grid from '@material-ui/core/Grid';
import {useHistory} from 'react-router-dom';
import {
  makeStyles,
  useTheme,
} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
  },
  gridStyle: {
    flex: 1,
    marginTop: '1rem',
  },

  branchTextStyle: {
    marginTop: '0.2rem',
  },

  createDivStyle: {
    marginLeft: '12rem',
    marginTop: '0.2rem',
  },

  createButtonText: {
    marginLeft: '0.5rem',
    color: theme.palette.primary.main,
  },
}));

export default function Branches(props) {
  const classes = useStyles();
  const [createBranch, setCreateBranch] = useState(false);
  const projectReducer = useSelector((state)=>state.project);
  const {projectDictionary} = projectReducer;
  const history = useHistory();
  const teamReducer = useSelector((state)=>state.team);
  const {teamDictionary} = teamReducer;
  const {teamId, showTeamPanel} = props;

  const team = teamDictionary[teamId];

  const projectId = team.parent._id;
  const project = projectDictionary[projectId];

  const {branches} = project;
  // console.log(branches,' in branches')


  const {branchDictionary} = projectReducer;


  return (
    <div className={classes.root}>
      <Grid container xs={8}>
        <Typography className={classes.branchTextStyle} >
                    Project Branches
        </Typography>

        <div className={classes.createDivStyle}>
          <ButtonBase className={classes.tabButton} onClick={()=>{
            const path = '/projects/team/create/'+ teamId;
            history.push(path);
          }}>
            <AddIcon color="primary"/>
            <Typography className={classes.createButtonText}>Create New Branch</Typography>
          </ButtonBase>
        </div>

      </Grid>
    </div>
  );
}
