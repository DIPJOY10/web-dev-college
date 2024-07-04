import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {useHistory} from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import PMEdit from './payment.milestone.edit';
import PMCreate from './payment.milestone.create';

const useStyles = makeStyles((theme) => ({
  root: {

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
}));
export default function S(props) {
  const {
    scheduleId,
  } = props;


  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const scheduleReducer = useSelector((state) => state.schedule);
  const {
    paymentScheduleDictionary,
  } = scheduleReducer;
  const schedule = paymentScheduleDictionary[scheduleId];

  const {
    root, row, col,
  } = classes;

  return (
    <div className={root}>

    </div>
  );
}
