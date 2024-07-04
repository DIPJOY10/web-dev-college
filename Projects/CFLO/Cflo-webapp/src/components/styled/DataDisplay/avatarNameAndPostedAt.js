import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
  root: {
    'display': 'flex',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  row: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
  },
  col: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    marginLeft: '0.5rem',
  },

  avatarStyle: {
    height: '1.9rem',
    width: '1.9rem',
  },
}));

export default function ImageAvatars(props) {
  const {user, subText, showDate, time} = props;
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.row}>
        <Avatar className={classes.avatarStyle} src={user?.displayPicture?.thumbUrl} alt={user?.displayName} />
        <div className={classes.col}>
          <Typography variant="button"><b>{user?.displayName}</b></Typography>
          <Typography variant="caption" >{subText}{showDate?moment(time).format('DD MMM YYYY'):null}</Typography>

        </div>
      </div>
    </div>
  );
}
