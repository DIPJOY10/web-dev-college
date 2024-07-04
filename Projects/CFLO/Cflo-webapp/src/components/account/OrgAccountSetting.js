import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {ButtonBase} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import {useParams, useHistory} from 'react-router-dom';
import ProfileSetting from '../profile/profile.setting';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    marginTop: '7rem',
  },

}));

const Account = (props)=>{
  const auth = useSelector((state) => state.auth);
  const classes = useStyles();
  const {user} = auth;
  const [create, setCreate] = useState(false);

  useEffect(() => {
    if (user.profile) {

    }
    else {

    }
  }, [user]);

  return (
    <div className={classes.root}>
      {user?.profile?<ProfileSetting profileId={user.profile} />:null}
    </div>
  );
};

export default Account;
