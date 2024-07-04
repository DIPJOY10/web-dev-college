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
    height: 23,
    margin: 5,
    marginBottom: -15,
  },
  inviteChipStyle: {
    height: 28,
    width: 70,
  },
});

const NotifyMember = (props)=>{
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
        memberIds={memberIds}
        members={members}
        setMemberIds={setMemberIds}
        setMembers={setMembers}
        placeholder={'Search Members'}
      />

      {members.map((user)=>{
        const {
          displayName,
          displayPicture,
        } = user;

        return (
          <Grid item xs={3}>
            <Card variant="outlined" className={cardStyle}>

              <CardContent className={cardContentStyle}>
                <div className={rowDiv}>
                  <Avatar className={avatarStyle} alt={displayName} src={displayPicture.thumbUrl} />
                  <Typography className={nameStyle}>
                    {user.displayName}
                  </Typography>
                  <Chip label={'Remove'} onClick={()=>{
                    const filteredMembers = members.filter((member)=>(member._id!==user._id));
                    const filteredMemberIds = memberIds.filter((memberId)=>(memberId!==user._id));
                    setMemberIds(filteredMemberIds);
                    setMembers(filteredMembers);
                  }}/>
                </div>
              </CardContent>


            </Card>
          </Grid>

        );
      })}

    </div>
  );
};

export default NotifyMember;
