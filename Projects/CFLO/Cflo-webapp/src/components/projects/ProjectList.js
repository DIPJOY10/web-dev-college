import React, {useState, useEffect} from 'react';
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
import {useHistory, useLocation} from 'react-router-dom';
import Invitations from '../team/invitations';
import teamUtils from '../team/team.utils';
import taskUtils from '../task/task.utils';
import TeamList from '../team/team.list';
import Navigation from '../team/navigation';
import CreateBtn from '../styled/actionBtns/create.btn';
import UserInvites from '../team/ManageMembers/user.invites';
import Api from '../../helpers/Api';
import CreateProjectDialog from './create.project.dialog';
import Menubar from '../styled/menubar';

const {createTaskMap, updateTaskMap} = taskUtils;
const {processTeamTree, useSortedTeamHook, handleTeams} = teamUtils;



export default function ProjectList(props) {
//   const [tabIndex, setTabIndex] = useState(TABS.ALL);
const {list,setList,Data,id} = props
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const [open, setOpen] = useState(true);
//   const [dialogOpen, setDialogOpen] = useState(false);

  const {chat, profile, auth, project, team: teamReducer} = useSelector((state) => state);
  const {user, userProfile} = auth;
  const {projectIds, projectDictionary} = project;
  const {teamIds, sortedProjectTeamIds, sortedProjectMap, teamDictionary} = teamReducer;
  const userId = user?._id;
//   const classes = useStyles();
  const matches = useMediaQuery('(max-width:1300px)');
  const history = useHistory();

  // console.log(teamIds,' is allprojectteamIds')
  useSortedTeamHook();
  // show the highest permission team in project tree
  useEffect(() => {
    processTeamTree(teamReducer, dispatch);
  }, [teamIds]);

  const createProjectApi = () => {
    Api.post('project/create', {
      owner: user._id,
      ownerModelName: user.model,
      sample: true,
      user: userId,
      creator: user.model === 'User' ? userId : userProfile._id,
      participants: [user.profile],
      displayName: 'Sample Project',
      description: 'This is to demonstrate how projects will work.',
    }).then((team) => {
      handleTeams([team], state, dispatch);
    });
  };

  useEffect(() => {
    if (teamIds.length == 0) {
      createProjectApi();
    }
  }, [sortedProjectTeamIds]);

  return (
    <div >
      {sortedProjectTeamIds.map((teamId,index) => {
        return <TeamList teamId={teamId} key={teamId} list={list}
        setList={setList}
        Data={Data}
        id={id}
        index={index} />;
      })}
    </div>
  );
}
