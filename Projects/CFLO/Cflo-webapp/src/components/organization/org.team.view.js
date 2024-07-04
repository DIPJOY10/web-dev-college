import React, {useEffect, useRef, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import Paper from '@material-ui/core/Paper';
import {makeStyles, useTheme} from '@material-ui/core/styles';

import teamUtils from '../team/team.utils';
import Card from '@material-ui/core/Card';
import Chip from '@material-ui/core/Chip';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import MenuRoundedIcon from '@material-ui/icons/MenuRounded';
import {AppBar, Box, Toolbar} from '@material-ui/core';

import Navigation from '../team/navigation';
import CreateBtn from '../styled/actionBtns/create.btn';
import AddIcon from '@material-ui/icons/Add';
import TuneIcon from '@material-ui/icons/Tune';
import ButtonBase from '@material-ui/core/ButtonBase';
import {useParams, useHistory} from 'react-router-dom';
import TeamHome from '../team/team.collab';
import HomeIcon from '@material-ui/icons/Home';
import MemberSetting from '../team/ManageMembers/member.settings';
const {handleTeamData, handleMemberProfiles} = teamUtils;

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    marginTop: '1rem',
    marginLeft: '17rem',
    [theme.breakpoints.down('sm')]: {
      marginLeft: 0,
    },
    padding: '1rem',
  },

  appBar: {
    backgroundColor: 'white',
    height: '4rem',
    marginTop: '1rem',
  },

  settingBtn: {
    paddingLeft: '1rem',
    padding: '0.5rem',
    paddingTop: '0.25rem',
    paddingBottom: '0.25rem',
  },

  settingText: {
    marginLeft: '0.5rem',
  },

  settingBtnPaper: {
    marginRight: '1rem',
  },

  actionList: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: '2rem',
    marginBottom: '1rem',
    backgroundColor: '#fafafa',
    padding: '1rem',
    justifyContent: 'center',
  },

  tabRoot: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: '1rem',
    padding: '1rem',
  },

  svgSize: {
    fontSize: 20,
    height: 25,
    width: 25,
    marginTop: 10,
    color: 'grey',
  },
}));

export default function TeamView(props) {
  const classes = useStyles();
  const [view, setView] = useState('Home');
  const [open, setOpen] = useState(true);
  const {teamId} = useParams();
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const teamReducer = useSelector((state) => state.team);
  const {teamDictionary} = teamReducer;
  const {teamIds, sortedProjectTeamIds, sortedProjectMap} = teamReducer;
  const team = teamDictionary[teamId];
  const {parentModelName} = team;

  useEffect(() => {
    if (teamId) {
      handleTeamData(teamId, state, dispatch);
    }
  }, [teamId]);

  let View = TeamHome;

  switch (view) {
    case 'Home':
      View = TeamHome;
      break;

    case 'Settings':
      View = MemberSetting;
      break;

    case 'Add/Remove':
      View = TeamHome;
      break;

    default:
      break;
  }

  return (
    <div className={classes.root}>
      {/* <TeamInvestmentCard teamId={teamId}/>
            <Divider /> */}

      <Toolbar variant="dense" className={classes.tabRoot}>
        <Paper className={classes.settingBtnPaper}>
          <ButtonBase
            className={classes.settingBtn}
            onClick={() => {
              setView('Home');
            }}
          >
            <HomeIcon />
            <Typography className={classes.settingText}>Home</Typography>
          </ButtonBase>
        </Paper>

        <Paper className={classes.settingBtnPaper}>
          <ButtonBase
            className={classes.settingBtn}
            onClick={() => {
              setView('Settings');
            }}
          >
            <TuneIcon />
            <Typography className={classes.settingText}>Settings</Typography>
          </ButtonBase>
        </Paper>
        <Chip
          color={'#8bc34a'}
          label="Add/Remove People"
          onClick={() => {
            setView('Add/Remove');
          }}
        />
        <CreateBtn startIcon={<AddIcon />} onClick={() => {}}>
          Add Branch
        </CreateBtn>
      </Toolbar>

      <Navigation open={open} setOpen={setOpen} teamIds={sortedProjectTeamIds} teamMap={sortedProjectMap} />

      <View />
    </div>
  );
}
