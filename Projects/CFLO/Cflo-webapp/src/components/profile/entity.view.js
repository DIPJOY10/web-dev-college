import React, {useState, useEffect} from 'react';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import {useSelector, useDispatch} from 'react-redux';
import {useParams, useHistory} from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Avatar from './avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import ActionBtnCircle from '../action.btn.circle';
import Api from '../../helpers/Api';
import {setConvAndMessages} from '../chat/chatUtils';

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
    [theme.breakpoints.down('sm')]: {
      height: '7rem',
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
    marginLeft: '1rem',
    fontFamily: 'ovo',
    fontSize: '1.4rem',
    color: 'black',
    [theme.breakpoints.down('sm')]: {
      fontSize: '1rem',
    },
  },
  msgIconStyle: {
    fontSize: '1.8rem',
  },
}));

const EntityProfile = (props) => {
  const history = useHistory();
  const classes = useStyles();
  
  const { profile } = useParams();
  const { profileId } = useParams();

  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const {entity: entityMin, profileDictionary} = useSelector((state) => state.profile);
  const {user, organizationIds} = useSelector((state) => state.auth);
  const [ownProfile, setOwnProfile] = useState(false);
  const {conversationDictionary, userConversation } = useSelector((state) => state.chat);

  const [entity, setEntity] = useState(profile);
  const entityId = profile?._id

  const {displayName, displayPicture} = entity?.parent;
  let messagePath;
  const conversations = userConversation[entityId];
  const [convId, setConvId] = useState(null);
  // console.log('conversation is the ',conversations);

  useEffect(() => {
    Api.post('chat/mutual', {
      userId: user?.profile,
      personId: profile?._id,
    }).then((res) => {
      const convAndMessages = res.result;

      if (convAndMessages?.length > 0) {
        const convAndMessage = convAndMessages[0];
        const conv = convAndMessage.conversation;
        setConvId(conv?._id);
        setConvAndMessages(convAndMessages, state, dispatch);
      }
      else {
      }
    });
  }, []);

  const goToMessage = () => {
    const newProfileObject = {};
    const profileId = entity?._id;
    newProfileObject[profileId] = entity;

    dispatch({
      type: 'AddProfile',
      payload: {
        profileDictionary: {
          ...profileDictionary,
          ...newProfileObject,
        },
        selectedProfileId: profileId,
      },
    });

    const convPath = convId ? '' + convId : '';
    const path = '/messages/' + convPath;

    history.push(path);
  };

  return (
    <Paper className={classes.paper}>
      <div className={classes.paperTop}></div>
      <Grid container className={classes.gridTop}>
        <Grid item xs={5}>
          <div className={classes.avatarDivStyle}>
            <Avatar className={classes.imgStyle} src={entity?.parent} />
          </div>

          <Typography className={classes.nameStyle}>{displayName}</Typography>
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

export default EntityProfile;
