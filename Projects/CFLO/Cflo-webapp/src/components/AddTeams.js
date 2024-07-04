import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import Api from '../helpers/Api';

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
  },

}));

export default function Basic(props) {
  const classes = useStyles();
  const {user} = useSelector((state) => state.auth);
  const {teamDictionary} = useSelector((state) => state.team);
  const {teamId} = props;
  const team = teamDictionary[teamId];
  if (team) {
    const {parent, parentModelName} = team;

    const _getProjectTeams = (projectId)=>{
      Api.post('project/getProjectTeams', {
        project: projectId,
        user: user._id,
      }).then((res)=>{
        // console.log(res,' is the res');
      });
    };

    switch (parentModelName) {
      case 'Project':
        _getProjectTeams(parent._id);
        break;

      case 'Branch':
        _getProjectTeams(parent.project._id);
        break;

      case 'Branch':
        _getProjectTeams(parent.project._id);
        break;

      default:
        break;
    }
  }


  return (
    <div className={classes.root}>

    </div>
  );
}
