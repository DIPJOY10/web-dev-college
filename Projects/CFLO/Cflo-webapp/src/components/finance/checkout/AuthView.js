import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import SocialAuth from '../../auth/SocialAuth';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';

const useStyles = makeStyles((theme) => ({
  divRoot: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  root: {
    maxWidth: '300px',
    display: 'flex',
    flex: 1,
  },
  cardContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
  },
  avatarDivStyle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0.7rem',
  },
  nameStyle: {

  },
}));

export default function AuthView() {
  const classes = useStyles();
  const {user, userProfile} = useSelector((state)=>state.auth);

  let profile = user;

  const notSignedInView = (
    <Card className={classes.root} variant="outlined">
      <CardContent>
        <SocialAuth />
      </CardContent>
    </Card>
  );

  let AuthView = notSignedInView;

  let signedInView = null;

  if (user?._id) {
    profile = user?.model==='User'?user:userProfile;
    signedInView = (
      <div className={classes.divRoot}>
        <Card variant="outlined" className={classes.root}>
          <CardContent className={classes.cardContent}>
            <div className={classes.avatarDivStyle}>
              <Avatar alt={profile?.displayName+'\'s profile picture'} className={classes.imgStyle} src={profile?.displayPicture?.thumbUrl} />
            </div>
            <div>
              <Typography className={classes.nameStyle}>
                {profile?.displayName}
              </Typography>
            </div>
          </CardContent>
        </Card>
      </div>

    );

    AuthView = signedInView;
  }


  return AuthView;
}
