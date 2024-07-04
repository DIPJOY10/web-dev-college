import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import TeamCard from '../../team/team.card';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import AddIcon from '@material-ui/icons/Add';

import CreateProject from '../../projects/createProject';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import teamUtils from '../../team/team.utils';
import { setJobs } from '../../job/job.utils';
import Api from '../../../helpers/Api';
import CreateProjectDialog from '../../projects/create.project.dialog';
import CreateOrgDialog from '../../organization/create.org.dialog';
import {
  useHistory,
} from 'react-router-dom';

// const { processTeamTree } = teamUtils;

const useStyles = makeStyles((theme) => ({

  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '6rem',
    marginTop: '6rem',
  },

  rowDiv: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',

  },
  colDiv: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paperText: {
    margin: '1rem',
    fontWeight: '700',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  openButtonText: {
    marginLeft: '0.5rem',
    color: theme.palette.primary.main,
  },
}));

const CreateJob = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [type, setType] = React.useState('Project');
  const { user, userProfile } = useSelector((state) => state.auth);
  const { team: teamReducer } = useSelector((state) => state);
  const dashboard = useSelector((state) => state.dashboard);
  const { teamIds, projectTeamIds: oldProjectTeamIds, orgTeamIds: oldOrgTeamIds } = teamReducer;

  const projIds = oldProjectTeamIds && oldProjectTeamIds.length > 0 ? oldProjectTeamIds : [];
  const orgIds = oldOrgTeamIds && oldOrgTeamIds.length > 0 ? oldOrgTeamIds : [];

  const [projectTeamIds, setprojectTeamIds] = useState(projIds);
  const [orgTeamIds, setOrgTeamIds] = useState(orgIds);

  const [teamSelected, setTeamSelected] = useState(false);
  const [team, setTeam] = useState(null);
  const [org, setOrg] = useState(null);
  const userId = user.model === 'User' ? user._id : userProfile._id;

  // console.log(user,userId,' is the userId')

  const handleChange = (event) => {
    const type = event.target.value;
    setType(type);
    setTeam(null);
  };

  const onParentSelect = (teamId) => {
    Api.post('job/create', {
      parentTeam: teamId,
      user: userId,
      participants: [userId],
      type,
    })
      .then((job) => {
        setJobs([job], dashboard, dispatch);
        const path = '/dashboard/edit/job/' + job._id;
        history.push(path);
      });
  };


  // show the highest permission team in project tree
  // useEffect(() => {
  //   processTeamTree(teamReducer, dispatch);
  // }, [teamIds]);

  const CreateOrSelectView = (
    <div className={classes.root}>

      <div className={classes.colDiv}>
        <Typography variant="h6" gutterBottom className={classes.paperText}>
          Select Team Type
        </Typography>


        <FormControl className={classes.formControl}>

          <RadioGroup aria-label="type" name="jobtype" value={type} onChange={handleChange}>
            <FormControlLabel value="Project" control={<Radio color="primary" />} label="Project" />
            <FormControlLabel value="Organization" control={<Radio color="primary" />} label="Organization" />
          </RadioGroup>
        </FormControl>

      </div>


      <div className={classes.colDiv}>
        <Typography variant="h6" gutterBottom className={classes.paperText}>
          Select Team
        </Typography>

        <ButtonBase onClick={() => {
          setOpen(true);
        }}>
          <AddIcon color="primary" />
          <Typography className={classes.openButtonText}>New {type}</Typography>
        </ButtonBase>

      </div>


      {type == 'Project' ?
        <>


          <CreateProjectDialog
            open={open}
            setOpen={setOpen}
          />

          {projectTeamIds.map((teamId) => {
            return <TeamCard key={teamId} teamId={teamId} onClick={() => {
              onParentSelect(teamId);
              setTeamSelected(true);
            }} />;
          })}
        </> : <>

          <CreateOrgDialog
            open={open}
            setOpen={setOpen}
          />

          {orgTeamIds.map((teamId) => {
            return <TeamCard key={teamId} teamId={teamId} onClick={() => {
              onParentSelect(teamId);
              setTeamSelected(true);
            }} />;
          })}
        </>}
    </div>
  );

  return CreateOrSelectView;
};

export default CreateJob;
