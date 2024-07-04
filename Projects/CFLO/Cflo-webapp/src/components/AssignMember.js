import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import _ from 'lodash';
import {useHistory} from 'react-router-dom';
import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActionArea from '@material-ui/core/CardActionArea';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import Chip from '@material-ui/core/Chip';
import Autocomplete from './Autocomplete';

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },

  cardStyle: {
    padding: -25,
  },

  cardContentStyle: {
    margin: -10,
    marginTop: -5,
  },

  addMemberDiv: {
    margin: 20,
  },
  rowDiv: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
  },
  avatarStyle: {
    height: 25,
    width: 25,
  },
  nameStyle: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 10,
    color: '#424242',
    flex: 1,
  },
  chipStyle: {

    margin: 5,
    marginTop: 15,
  },
  inviteChipStyle: {
    height: 28,
    width: 70,
  },
});

const AssignMember = (props)=>{
  const {teamId, assigned} = props;

  const classes = useStyles();
  const {
    rowDiv, avatarStyle, nameStyle, cardStyle, cardContentStyle, addMemberDiv,
    chipStyle, inviteChipStyle,
  } = classes;

  const [edit, setEdit] = useState(false);
  const {memberIds, setMemberIds, members, setMembers} = props;
  let assignedMembers = [];

  if (assigned) {
    // if assigned exists => (Task, Issue etc exist)
    // this is being used for editing assigned people
    setEdit(true);
    assignedMembers = assigned;
  }
  else {
    // if assigned dne
    // this is used during creation

  }

  return (
    <div>

      <Autocomplete
        teamId={teamId}
        memberIds={memberIds}
        members={members}
        setMemberIds={setMemberIds}
        setMembers={setMembers}
        placeholder={'Assign Members'}
      />

      {members.map((user)=>{
        const {
          displayName,
          displayPicture,
        } = user;

        return (
          <Chip
            className={chipStyle}
            avatar={<Avatar src={displayPicture.thumbUrl} />} variant="outlined" label={displayName} />

        );
      })}

    </div>
  );
};

export default AssignMember;
