import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {useHistory} from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import cx from 'clsx';
import TeamCard from '../team/team.card';
import EditIcon from '@material-ui/icons/Edit';
import {IconButton} from '@material-ui/core';


const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: '18rem',
    maxWidth: '26rem',
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

  titleText: {
    fontSize: '1.3rem',
    fontWeight: '500',
  },
}));

export default function AppNetworkCard(props) {
  const {
    network,
    onClick,
  } = props;
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const {
    root, row, col, titleText,
  } = classes;





  const onNetworkClick = ()=>{
    const path = '/brandAppNetwork/' + network?._id;
    history.push(path);
  };

  const reqLen = network?.reqs?.length

  return (
    <Paper className={cx(root, col)} square onClick={()=>{
      onNetworkClick();
    }}>
      <div className={row}>
        <div className={row}>
          <Typography className={titleText}>
            {network?.nickName}
          </Typography>
        </div>
        {onClick?<IconButton onClick={()=>{
          onClick();
        }}>
          <EditIcon />
        </IconButton>:null}


      </div>
      {reqLen>0?<Typography><b>{reqLen}</b> applications pending review</Typography>:null}

    </Paper>
  );
}
