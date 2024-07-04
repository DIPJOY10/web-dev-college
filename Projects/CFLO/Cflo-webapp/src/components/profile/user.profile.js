import React, {useState, useEffect} from 'react';
import {
  makeStyles,
  useTheme,
} from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import {useSelector, useDispatch} from 'react-redux';
import {
  useParams,
  useHistory,
} from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import ActionBtnCircle from '../action.btn.circle';

const useStyles = makeStyles((theme) => ({
  avatarDivStyle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0.7rem',
  },
  paper: {
  },
  paperTop: {
    backgroundColor: 'grey',
    height: '10rem',
    marginTop: '4rem',
    [theme.breakpoints.down('sm')]: {
      paddingTop: '4rem',
    },
  },
  gridTop: {
    marginTop: '-5.5rem',
    zIndex: 1,
    [theme.breakpoints.down('sm')]: {
      marginTop: '-4.5rem',
    },
  },
  imgStyle: {
    marginLeft: '2rem',
    height: '7.8rem',
    width: '7.8rem',
    margin: '4rem',
    marginTop: '1rem',
    [theme.breakpoints.down('sm')]: {
      height: '4.8rem',
      width: '4.8rem',
    },
  },
  nameDiv: {
    display: 'flex',
    marginTop: '1rem',
  },
  actionDiv: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flex: 1,
    paddingTop: '1rem',
    [theme.breakpoints.down('sm')]: {
      paddingTop: '1rem',
    },
  },
  nameStyle: {
    marginTop: '-4.3rem',
    marginBottom: '2rem',
    marginLeft: '-2rem',
    fontFamily: 'ovo',
    fontSize: '1.4rem',
    color: 'black',
    textAlign: 'center',
    [theme.breakpoints.down('sm')]: {
      fontSize: '1rem',
    },
  },
  msgIconStyle: {
    fontSize: '1.8rem',
  },
}));

const UserProfile = (props)=>{
  const history = useHistory();
  const classes = useStyles();
  const {personId} = useParams();
  const dispatch = useDispatch();
  const {personDictionary} = useSelector((state)=>state.profile);
  const {user} = useSelector((state)=>state.auth);
  const {conversationDictionary, userConversation, selectedPersonId} = useSelector((state)=>state.chat);
  const person = personDictionary[personId];
  const userId = user._id;
  const ownProfile = (userId===personId)?true:false;
  const {displayName, displayPicture} = person;
  let messagePath;
  const conversations = userConversation[personId];
  // console.log('conversation is the ',conversations);

  useEffect(() => {


  }, []);

  const goToMessage = ()=>{
    dispatch({
      type: 'SelectPerson',
      payload: {
        selectedPersonId: personId,
      },
    });

    if (conversations) {
      for (let index = 0; index < conversations.length; index++) {
        const conversationId = conversations[index];
        const conversation = conversationDictionary[conversationId];
        if (conversation.participants.length===2) {
          messagePath = '/messages/'+conversationId;

          history.push(messagePath);
        }
      }
    }
    else {
      messagePath = '/messages/';

      history.push(messagePath);
    }
  };

  return (
    <Paper className={classes.paper}>
      <div className={classes.paperTop}>

      </div>
      <Grid container className={classes.gridTop} >
        <Grid item xs={5}>
          <div className={classes.avatarDivStyle}>
            <Avatar alt={displayName+'\'s profile picture'} className={classes.imgStyle} src={displayPicture.thumbUrl} />
          </div>
          <div>
            <Typography className={classes.nameStyle}>
              {displayName}
            </Typography>
          </div>
        </Grid>

        <Grid item xs={7} className={classes.actionDiv}>

          <ActionBtnCircle disabled={ownProfile} link={'/messages'} actionFn={goToMessage}>
            <MailOutlineIcon className={classes.msgIconStyle} />
          </ActionBtnCircle>

        </Grid>
      </Grid>
    </Paper>

  );
};

export default UserProfile;
