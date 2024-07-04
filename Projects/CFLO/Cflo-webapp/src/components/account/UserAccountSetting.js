import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {ButtonBase} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import {useParams, useHistory} from 'react-router-dom';
import UserSetting from '../profile/user.setting';
import ProfileSetting from '../profile/profile.setting';
import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    display: 'flex',
  },
  userDivStyle: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    maxHeight: '12rem',
    maxWidth: '30rem',
  },
  avatarDivStyle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0.7rem',
  },
  nameAndAboutDiv: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  imgStyle: {
    marginLeft: '2rem',
    height: '4.8rem',
    width: '4.8rem',
    margin: '1rem',
    marginTop: '1rem',
  },
  nameStyle: {
    marginLeft: '-2rem',
    fontFamily: 'ovo',
    fontSize: '1.4rem',
    color: 'black',
    textAlign: 'center',
    [theme.breakpoints.down('sm')]: {
      fontSize: '1rem',
    },
  },

  descriptionText: {
    fontSize: '0.9rem',
    color: '#424242',
  },
  editButtonDiv: {
    display: 'flex',
    justifyContent: 'flex-end',
    width: '5rem',
    height: '5rem',
    margin: '1rem',
  },
}));

const Account = (props) => {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const classes = useStyles();
  const {user} = auth;
  const [activeStep, setActiveStep] = useState(0);
  const [create, setCreate] = useState(false);

  const userDiv = (
    <Paper className={classes.userDivStyle}>
      <div className={classes.avatarDivStyle}>
        <Avatar alt={user.displayName + '\'s profile picture'} className={classes.imgStyle} src={user.displayPicture.url} />
      </div>
      <div className={classes.nameAndAboutDiv}>
        <Typography>{user.displayName}</Typography>
        <Typography className={classes.descriptionText}>
          {user?.description && user.description.length > 0 ? user.description : 'Add information about yourself'}
        </Typography>
      </div>
      <div className={classes.editButtonDiv}>
        <IconButton
          onClick={() => {
            setActiveStep(1);
          }}
        >
          <EditIcon />
        </IconButton>
      </div>
    </Paper>
  );

  return (
    <div className={classes.root}>
      {activeStep == 1 ? <UserSetting setActiveStep={setActiveStep} /> : userDiv}
      {user?.profile ? <ProfileSetting profileId={user.profile} setActiveStep={setActiveStep} /> : null}
    </div>
  );
};

export default Account;
