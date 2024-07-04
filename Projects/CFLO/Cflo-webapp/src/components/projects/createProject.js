import React, {useEffect, useRef, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import {useMediaQuery, ButtonBase} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import AddIcon from '@material-ui/icons/Add';
import Api from '../../helpers/Api';
import InputBase from '@material-ui/core/InputBase';
import teamUtils from '../team/team.utils';
import {
  useParams,
  useHistory,
} from 'react-router-dom';
import TitleInput from '../styled/title.input';
import DescriptionInput from '../styled/description.input';
import ProjectSelect from '../styled/profile.select';


const {
  handleTeams, handleProjectTeams,
} = teamUtils;


const useStyles = makeStyles((theme) => ({
  root: {
    'flexGrow': 1,
    'display': 'flex',
    'flexDirection': 'column',
    '& > *': {
      margin: theme.spacing(1),
    },
    'marginTop': '6rem',
  },

  selectOwner: {
    maxWidth: '30rem',
    padding: '1rem',
    textAlign: 'center',
    justifyContent: 'center',
  },

  projectBar: {
    marginTop: '-2rem',
    marginLeft: '-5rem',
  },

  cardStyle: {
    marginLeft: '-5rem',
    marginTop: '4rem',
    width: '25rem',
  },

  tabButton: {
    margin: '0.5rem',
    marginTop: '1rem',
    marginBottom: '-0.5rem',
    height: '3rem',
    paddingLeft: '1.0rem',
    paddingRight: '1.0rem',
    borderWidth: '1px',
    backgroundColor: theme.palette.primary,
  },

  tabButtonText: {
    color: '#404040',
  },

  createButtonText: {
    marginLeft: '0.5rem',
    color: theme.palette.primary.main,
  },
}));

export default function CreateProject(props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const classes = useStyles();
  const {teamId} = useParams();
  // console.log(teamId,' is the teamId')
  const matches = useMediaQuery('(max-width:1300px)');
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const {user, userProfile} = useSelector((state)=>state.auth);
  const [owner, setOwner] = useState(user);
  const userId = user._id;
  const history = useHistory();
  // console.log(owner,' is the owner');

  const createProjectApi = ()=>{
    Api.post('project/create', {
      owner: owner._id,
      ownerModelName: owner.model,

      user: userId,
      creator: user.model==='User'?userId:userProfile._id,
      participants: [userId],
      allTimeMembers: [{
        modelId: userId,
        modelName: user.model,
      }],
      displayName: title,
      description,
    }).then((team)=>{
      handleTeams([team], state, dispatch);
      history.push('/projects');
    });
  };

  useEffect(() => {


  }, []);


  return (
    <div className={classes.root}>

      <Paper className={classes.selectOwner}>
        <Typography>Select project owner / Create new organization</Typography>
        <ProjectSelect
          owner={owner}
          onChange={(event, value) => {
            setOwner(value);
          }}
        />

        <ButtonBase onClick={()=>{
          history.push('/account/organizations/create');
        }}>
          <AddIcon color="primary"/>
          <Typography className={classes.createButtonText}>New Organization</Typography>
        </ButtonBase>
      </Paper>


      <TitleInput
        title={title}
        placeholder={'Project Title'}
        setTitle={setTitle}

      />

      <DescriptionInput
        description={description}
        placeholder={'Project Description(Optional)'}
        setDescription={setDescription}

      />


      <div>
        <ButtonBase className={classes.tabButton} onClick={()=>createProjectApi()}>
          <AddIcon color="primary"/>
          <Typography className={classes.createButtonText}>Submit</Typography>
        </ButtonBase>
      </div>

    </div>
  );
}
