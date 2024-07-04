import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
  makeStyles,
  useTheme,

} from '@material-ui/core/styles';
import {
  useMediaQuery,
} from '@material-ui/core';
import {
  useParams,
  useHistory,
} from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import AppBar from '@material-ui/core/AppBar';
import {IconButton} from '@material-ui/core';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import Toolbar from '@material-ui/core/Toolbar';
import {
  Typography,
} from '@material-ui/core';
import ButtonBase from '@material-ui/core/ButtonBase';

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: 'white',
    height: '4rem',
  },
  nameBox: {
    color: '#616161',
    marginTop: '0.5rem',
    marginLeft: '0.8rem',
  },
  avatarStyle: {
    marginTop: '0.5rem',
    fontSize: '0.4rem',
  },
  iconButtonStyle: {
    marginTop: '0.5rem',
    marginRight: '1rem',
    marginLeft: '-1rem',
    color: theme.palette.primary.main,
  },
}));

const Appbar = (props)=>{
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const history = useHistory();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const isOnlyMd = useMediaQuery(theme.breakpoints.only('md'));
  const {user} = useSelector((state)=>state.auth);
  const {conversationDictionary} = useSelector((state)=>state.chat);
  const {profileDictionary, selectedProfileId} = useSelector((state) => state.profile);
  const {conversationId} = props;
  let primaryUser;
  let displayPicture;
  let displayName;
  // console.log(isOnlyMd,' is only md')

  if (conversationId) {
    const conversation = conversationDictionary[conversationId];

    if (conversation&&conversation.participants) {
      const participants = conversation.participants;

      const otherUsers = participants.filter((participant)=>(participant._id!==user.profile));

      primaryUser = otherUsers[0];
      if (primaryUser) {
        displayName = primaryUser?.parent?.displayName;
        displayPicture = primaryUser?.parent?.displayPicture;
      }
    }
  }
  else {
    primaryUser = profileDictionary[selectedProfileId];
    // console.log(primaryUser,selectedProfileId);
    if (primaryUser) {
      displayName = primaryUser?.parent?.displayName;
      displayPicture = primaryUser?.parent?.displayPicture;
    }
  }


  return (
    <AppBar position="static" className={classes.appBar}>
      <Toolbar variant="dense">
        {
                    isMobile?<IconButton className={classes.iconButtonStyle} onClick={()=>{
                      dispatch({type: 'ToggleView', payload: false});
                    }}>
                      <KeyboardBackspaceIcon style={{fontSize: 30, color: theme.palette.primary}} />
                    </IconButton>:null
        }
        {conversationId||primaryUser?( <ButtonBase onClick={()=>{
          if (primaryUser?._id) {
            const path = '/profile/'+primaryUser?._id;
            history.push(path);
          }
        }}>
          <Avatar alt={displayName}
            src={displayPicture?.thumbUrl}
            className={classes.avatarStyle}/>
          <Typography className={classes.nameBox}>
            {displayName}
          </Typography>
        </ButtonBase>):null}


      </Toolbar>
    </AppBar>
  );
};

export default Appbar;
