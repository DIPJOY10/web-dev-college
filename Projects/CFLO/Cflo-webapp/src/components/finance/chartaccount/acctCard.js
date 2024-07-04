import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {useHistory} from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import EditBtn from '../../styled/actionBtns/edit.btn';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '12rem',
    margin: '0.6rem',
    padding: '0.4rem',
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
  title: {
    fontSize: '0.8rem',
  },
}));

export default function ChartAcctCard(props) {

  const {
    acct,
  } = props;
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const {
    root, row, col, title,
  } = classes;

  return (
    <Paper className={root} square>
      <Typography className={title}>{acct.name}</Typography>
      <span className={row}>
        <span className={row}>
          <Typography>&#36;{acct.balance}</Typography>
        </span>
        <EditBtn onClick={()=>{

        }} />

      </span>

    </Paper>
  );
}
