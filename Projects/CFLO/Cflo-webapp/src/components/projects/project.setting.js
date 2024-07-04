import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import MemberSetting from '../team/ManageMembers/member.settings';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import AvatarGroup from '@material-ui/lab/AvatarGroup';

const useStyles = makeStyles((theme) => ({
  root: {

  },
}));

export default function ProjectSetting(props) {
  const classes = useStyles();
  const matches = useMediaQuery('(max-width:1300px)');
  const {teamId, showTeamPanel} = props;
  // console.log(teamId,' is the team id');
  return (
    <div className={classes.root}>
      <Typography>
                Project Settings
      </Typography>

      <MemberSetting teamId={teamId} showTeamPanel={showTeamPanel} />


    </div>
  );
}
