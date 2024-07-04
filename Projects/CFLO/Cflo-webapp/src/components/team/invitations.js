import React, {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import _ from 'lodash';
import {useHistory} from 'react-router-dom';
import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import moment from 'moment';
import Api from '../../helpers/Api';

const useStyles = makeStyles({

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
  createdTimeText: {
    textAlign: 'right',
    color: '#757575',
    fontSize: '12px',
  },
});

const Invitations = (props)=>{
  const classes = useStyles();
  const {
    rowDiv, avatarStyle, nameStyle,
  } = classes;
  const {invitations} = useSelector((state)=>state.team);
  const {user} = useSelector((state)=>state.auth);
  const dispatch = useDispatch();

  const clearInvite = (inviteId)=>{
    const newInvitations = invitations.filter((invitation)=>{
      return invitation._id!==inviteId;
    });
    dispatch({
      type: 'AddTeam',
      payload: {
        invitations: newInvitations,
      },
    });
  };

  const _onAccept = (inviteId)=>{
    Api.post('invite/accept', {
      invite: inviteId,
    }).then((res)=>{
      clearInvite(inviteId);
      // console.log(res,' is the updated team')
    });
  };

  const _onReject = (inviteId)=>{
    Api.post('invite/reject', {
      invite: inviteId,
    }).then((res)=>{
      clearInvite(inviteId);
      // console.log(res,' is the updated team')
    });
  };


  return (
    <div>


      {invitations.map((invite)=>{
        // console.log(invite,' is the invite')
        const {
          invitee,
          invitedById,
        } = invite;

        const {
          displayName: inviteeName,
          displayPicture: inviteeDP,
        } = invitee;

        const {
          displayName: invitedByName,
          displayPicture: invitedByDP,
        } = invitedById;

        return (
          <Grid item xs={4}>
            <Card variant="outlined">

              <CardContent>
                <div className={rowDiv}>
                  <Avatar className={avatarStyle} alt={invitedByName} src={invitedByDP.thumbUrl} />
                  <Typography className={nameStyle}>
                    {invitedByName}
                  </Typography>
                  <Chip label={'Reject'} color="disabled" />
                  <Chip label={'Accept'} color="primary" onClick={()=>_onAccept(invite._id)} />
                </div>
                <div className={rowDiv}>

                  <div className={rowDiv}>

                    <Typography className={nameStyle}>
                                        invited you to join {invite.team.parent.displayName} {invite.team.parentModelName} team
                    </Typography>

                  </div>

                </div>

              </CardContent>


            </Card>
          </Grid>

        );
      })}


    </div>
  );
};

export default Invitations;
