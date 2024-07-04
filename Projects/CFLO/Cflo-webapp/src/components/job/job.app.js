import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {useHistory, useLocation} from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    width: '17rem',
    display: 'flex',
    flexDirection: 'row',
    minHeight: '8rem',
    marginTop: '6rem',
  },
  avatarBox: {
    width: '5rem',
    padding: '0.7rem',
    [theme.breakpoints.down('sm')]: {
      width: '3rem',
      padding: '0.3rem',
      marginRight: '0.4rem',
    },
  },

}));

export default function JobAppView(props) {
  const classes = useStyles();
  const dashboard = useSelector((state)=>state.dashboard);
  const {appDictionary} = dashboard;
  const {appId, onSelect} = props;
  const app = appDictionary[appId];
  const history = useHistory();
  const profile = app?.profile?.parent;
  const displayName = profile?.displayName;
  const displayPicture = profile?.displayPicture;
  let text = app?.topComment?.text?.slice(0, 80);
  if (text?.length==80) {
    text = text + '...';
  }


  return (
    <Paper onClick={()=>{
      if (onSelect) {
        onSelect();
      }
    }} className={classes.root} variant="outlined" square >
      <ButtonBase>
        <div className={classes.avatarBox}>
          <Avatar alt={displayName} src={displayPicture?.thumbUrl} />
        </div>
      </ButtonBase>

    </Paper>
  );
}

