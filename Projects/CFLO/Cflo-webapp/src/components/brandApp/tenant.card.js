import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {useHistory} from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import cx from 'clsx';
import Avatar from '../profile/avatar';

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    width: '95%',
    maxWidth: '30rem',
    minWidth: '16rem',
    margin: '0.5rem 0.5rem',
    padding: '0.5rem',
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
  },

  nameText: {
    marginLeft: '1rem',
    fontWeight: '600',
  },

  avatarStyle: {
    height: '2rem',
    width: '2rem',
  },
}));

export default function TenantCard(props) {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const {

  } = useSelector((state) => state);

  const {
    tenant: tenantRel,
    onClick,
  } = props;

  const {
    root, row, col, avatarStyle,
    nameText,
  } = classes;

  const {
    team,
    tenant,
    unit,
  } = tenantRel;

  const project = team.parent;

  return (
    <Paper className={cx(root, col)} onClick={()=>{
      if (onClick) {
        onClick();
      }
    }}>
      <div className={row}>
        <Avatar src={tenant} className={avatarStyle} />
        <Typography className={nameText}>{tenant?.displayName}</Typography>
      </div>


      <div className={row}>
        <div className={row}>
          <Typography>{project?.displayName}</Typography>
          <div className={row}>
          </div>
          <Typography><b>{unit?.name}</b></Typography>
        </div>
      </div>


    </Paper>
  );
}
