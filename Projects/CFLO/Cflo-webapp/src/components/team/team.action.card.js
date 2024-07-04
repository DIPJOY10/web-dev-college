import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {useHistory} from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import {Paper, Chip, ButtonBase} from '@material-ui/core';
import cx from 'clsx';

const useStyles = makeStyles({
  root: {
    flex: 1,
    width: '95%',
    maxWidth: '30rem',
    minWidth: '16rem',
    margin: '0.5rem 0.5rem',
    padding: '0.5rem',
  },

  avatarStyle: {
    height: 25,
    width: 25,
  },

  parentModelName: {
    marginLeft: '0.5rem',
    fontSize: '0.9rem',
  },

  row: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
  },

  nameText: {
    fontSize: '1rem',
    fontWeight: '500',
    color: '#424242',
  },

  participantText: {
    fontSize: '0.9rem',
    fontWeight: '400',
    color: '#424242',
  },
  marginTop: {
    marginTop: '0.25rem 1rem',
  },
  btnTextStyle: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#424242',
    margin: '1rem',
  },
});

export default function TeamActionCard(props) {
  const {teamId, onClick, btnText} = props;
  const history = useHistory();
  const classes = useStyles();
  const teamReducer = useSelector((state)=>state.team);
  const auth = useSelector((state) => state.auth);
  const {
    user,
  } = auth;
  const {teamDictionary} = teamReducer;

  const team = teamDictionary[teamId];
  const parentModelName = team?.parentModelName;

  const userRole = team?.permissions[user?.profile]||null;

  const {
    row, participantText, nameText,
    marginTop, btnTextStyle,
  } = classes;

  const numParticipants = ()=>{
    const numP = team.participants.length;
    return numP>1?`${numP} participant`:`${numP} participant`;
  };

  const isPublic = parentModelName=='Project'?(team.parent.public?true:false):false;

  const gotoLocation = ()=>{
    let path;
    switch (parentModelName) {
      case 'Project':
        path = '/projects/'+ teamId;

        break;


      default:
        break;
    }

    history.push(path);
  };

  const onClickHandler = onClick?onClick:gotoLocation;

  if (team&&team?.parent&&team.parent?._id) {
    const {parent, parentModelName} = team;
    const dP = parent?.displayPicture;

    return (
      <Paper className={classes.root} variant="square">

        <div className={classes.row}>
          <div className={classes.row}>
            <img key={'timeline'} className={classes.avatarStyle} src={dP?.thumbUrl?dP.thumbUrl:dP.url} />
            <Typography className={classes.parentModelName} color="textSecondary" gutterBottom>
              {parentModelName}
            </Typography>
          </div>
          <ButtonBase onClick={onClickHandler}>
            <Typography className={btnTextStyle}>
              {btnText}
            </Typography>
          </ButtonBase>
        </div>
        <div>


          <div className={cx(row, marginTop)}>
            <div className={row}>
              <Typography className={nameText}>
                {parent.displayName}
              </Typography>
            </div>

          </div>
        </div>

      </Paper>
    );
  }
  else {
    return null;
  }
}
