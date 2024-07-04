import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import teamUtils from '../team.utils';
import PlatformInviteRecieveCard from './platform.invite.receive.card';


const useStyles = makeStyles((theme) => ({
  root: {
    height: "270px",
    overflowY: "auto",
    width: "100%",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    flexWrap: "wrap",
    padding: "10px",
  }
}));

const UserInvites = (props) => {
  const { type, addCreatedOne } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  let { invitations: allInvitations } = useSelector((state) => state.team);
  const [invites, setInvites] = useState([]);

  useEffect(() => {
    let localAllInvitations = allInvitations && allInvitations.length > 0 ? allInvitations : [];
    let invitations = []

    localAllInvitations.map((invitation) => {
      if (invitation?.teamType == type) {
        invitations.push(invitation)
      }
    });

    setInvites(invitations)
  }, [allInvitations]);

  return (
    <div className={classes.root} >
      {invites.map((invitation) => {
        return (
          <PlatformInviteRecieveCard
            key={invitation._id}
            invite={invitation}
            invites={invites}
            addCreatedOne={addCreatedOne}
            setInvites={setInvites}
          />
        );
      })}
    </div>
  );
};

export default UserInvites;
