import React from 'react';
import {useSelector} from 'react-redux';
import {
  makeStyles,
  useTheme,
} from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import ListItem from '@material-ui/core/ListItem';
import {
  Typography,
} from '@material-ui/core';
import {
  useParams,
  useHistory,
} from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    boxShadow: '0 1px 1px 1px #eeeeee',
  },
  divRoot: {
    display: 'flex',
    flexDirection: 'row',
    minHeight: '4rem',

  },
  avatarBox: {
    width: '5rem',
    padding: '0.7rem',
  },
  textBox: {
    flexDirection: 'column',
  },
  nameTimeBox: {
    display: 'flex',
    flexDirection: 'row',
  },
  nameBox: {
    flex: 1,
    height: '1.5rem',
    marginTop: '0.4rem',
    fontSize: '0.95rem',
    color: '#212121',
    textAlign: 'left',
  },
  rightTimeText: {
    textAlign: 'right',
    color: '#9e9e9e',
    fontSize: '11px',
    width: '4rem',
    marginTop: '0.5rem',
    marginLeft: '6rem',
  },
  messageBox: {
    flex: 1,
    fontSize: '0.9rem',
    color: '#424242',
  },
}));

const NewUserMessageItem = (props)=>{
  const classes = useStyles();
  const history = useHistory();
  const chat = useSelector((state)=>state.chat);
  const {
    selectedProfileId, profileDictionary,
  } = useSelector((state)=>state.profile);

  // console.log(selectedProfileId,profileDictionary,' is the person')
  let person;
  let displayName;
  let displayPicture;
  if (selectedProfileId) {
    const profile = profileDictionary[selectedProfileId];
    if (profile) {
      const parent = profile?.parent;
      displayName = parent.displayName;
      displayPicture = parent.displayPicture;
    }
  }


  return (
    <ListItem button className={classes.root} onClick={()=>{
      history.push('/messages');
    }}>
      <div className={classes.divRoot}>

        <ButtonBase>
          <div className={classes.avatarBox}>
            <Avatar alt={displayName} src={displayPicture?.thumbUrl} />
          </div>
        </ButtonBase>

        <div className={classes.textBox}>
          <div className={classes.nameTimeBox}>
            <Typography className={classes.nameBox}>
              {displayName}
            </Typography>

          </div>


          <Typography className={classes.messageBox}>

          </Typography>
        </div>

      </div>

    </ListItem>

  );
};

export default NewUserMessageItem;
