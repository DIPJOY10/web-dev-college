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

  postedByText: {
    fontSize: '0.8rem',
  },

  postedAtText: {
    fontSize: '0.7rem',
  },

}));

export default function ImageAvatars(props) {
  const {user, subText, time} = props;
  const classes = useStyles();
  const dP = user?.displayPicture;
  const imgUrl = dP?.thumbUrl?dP.thumbUrl:dP?.url;

  return (
    <div className={classes.root}>
      <div className={classes.row}>
        <Avatar className={classes.avatarStyle} src={imgUrl} alt={user?.displayName} />
        <div className={classes.col}>
          <Typography variant="body2" component="p">
            <b>{subText}</b>
          </Typography>
          <Typography className={classes.postedByText}>
                            Posted by {user?.displayName}
          </Typography>
          <Typography className={classes.postedAtText}>
            {moment(time).fromNow()}
          </Typography>

        </div>
      </div>
    </div>
  );
}
