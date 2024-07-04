import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import Typography from '@material-ui/core/Typography';
import {useParams, useHistory} from 'react-router-dom';

import Dialog from '@material-ui/core/Dialog';
import PersonIcon from '@material-ui/icons/Person';
import AddIcon from '@material-ui/icons/Add';
import {blue} from '@material-ui/core/colors';
import EditBtn from '../styled/actionBtns/edit.btn';
import CloseBtn from '../styled/actionBtns/close.btn';
import _ from 'lodash';
import Api from '../../helpers/Api';
import Paper from '@material-ui/core/Paper';
import CreateBtn from '../styled/actionBtns/create.btn';
import TitleInput from '../styled/title.input';
import DescriptionInput from '../styled/description.input';
import Divider from '@material-ui/core/Divider';
import ButtonBase from '@material-ui/core/ButtonBase';
import clsx from 'clsx';
import EditIcon from '@material-ui/icons/Edit';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import PanToolIcon from '@material-ui/icons/PanTool';
import TocIcon from '@material-ui/icons/Toc';

import LinearProgress from '@material-ui/core/LinearProgress';
import teamUtils from '../team/team.utils';


const {
  handleTeams, handleProjectTeams,
} = teamUtils;


const useStyles = makeStyles((theme) => ({
  listStyle: {
    padding: '1rem',
    paddingBottom: '2rem',
    paddingTop: 0,
    minWidth: '17rem',
    width: '90vw',
    maxWidth: '32rem',
  },

  row: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
  },

  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  margin: {
    margin: '1rem',
  },

  col: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    margin: '1rem',
    textAlign: 'center',
    fontSize: '1.2rem',
    minWidth: '17rem',
  },

  selectText: {
    textAlign: 'center',
    fontWeight: '700',
    fontSize: '1.2rem',
    marginTop: '1rem',
  },

  createButtonText: {
    marginLeft: '0.5rem',
    color: theme.palette.primary.main,
  },

}));

export default function SimpleDialog(props) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const projectReducer = useSelector((state)=>state.project);
  const teamReducer = useSelector((state) => state.team);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const {setOpen, open, parentTeamId, setCallBool} = props;
  const [loading, setloading] = useState(false);
  const [text, setText] = useState('');
  const state = useSelector((state) => state);
  const {user, userProfile} = useSelector((state)=>state.auth);
  const [owner, setOwner] = useState(user);
  const userId = user._id;

  const {teamDictionary} = teamReducer;
  const team = teamDictionary[parentTeamId];

  const history = useHistory();

  const handleClose = () => {
    // do not close
    setOpen(true);
  };


  const createBranchApi = ()=>{
    setloading(true);
    Api.post('project/branch/create', {
      parentTeam: parentTeamId,
      owner: user._id,
      ownerModelName: user.model,
      taskMap: team.taskMap?team.taskMap:false,
      ancestors: [...team.ancestors, parentTeamId],
      user: userId,
      creator: user.model==='User'?userId:userProfile._id,
      participants: [user.profile],
      displayName: title,
      description,
      wallet: team.wallet,
    }).then((team)=>{
      setloading(false);

      handleTeams([team], state, dispatch);
      handleProjectTeams([team], projectReducer, dispatch);
      setCallBool(true);
      setOpen(false);
    });
  };


  return (

    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>


      <div className={clsx(classes.row, classes.center, classes.margin)}>
        <div className={clsx(classes.row, classes.center)}>
          <Typography className={classes.margin}>
                        🗂
          </Typography>
          <Typography variant='button' >
            <b>Create Branch</b>
          </Typography>
        </div>


        <CreateBtn onClick={()=>{
          createBranchApi();
        }}>
                    Save
        </CreateBtn>
        <CloseBtn
          onClick={()=>setOpen(false)}
        />

      </div>
      {loading?<LinearProgress />:null}

      <TitleInput
        title={title}
        placeholder={'Branch Title'}
        setTitle={setTitle}
      />

      <DescriptionInput
        description={description}
        placeholder={'Branch Description (Optional)'}
        setDescription={setDescription}

      />


    </Dialog>

  );
}
