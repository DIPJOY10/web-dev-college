import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {useHistory} from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Avatar from './avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: '0.5rem',
    maxWidth: '24rem',
    paddingTop: '0.5rem',
    paddingBottom: '0.5rem',
    paddingLeft: '1rem',
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
    marginLeft: '1rem',
    paddingBottom: '0.45rem',
  },

  avatarStyle: {
    height: '2.2rem',
    width: '2.2rem',
  },

  nameText: {

  },

  modelText: {
    fontSize: '0.7rem',
    color: '#757575',
  },
}));
export default function S(props) {
  const {
    entity,
  } = props;
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const {

  } = useSelector((state) => state);

  const {
    root, row, col, avatarStyle,
    nameText, modelText,
  } = classes;

  return (

    <Paper key={entity?._id} onClick={()=>{
        history.push('/profile/view/'+ entity._id);
    }} className={root} variant="outlined">

      <div className={row}>
        <Avatar src={entity?.parent} className={avatarStyle} />
        <div className={col}>
          <Typography className={nameText}>
            {entity?.parent?.displayName}
          </Typography>
          <Typography className={modelText}>
            {entity?.parent?.model}
          </Typography>
        </div>

      </div>
    </Paper>
  );
}
