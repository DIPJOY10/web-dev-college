import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {useHistory} from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import cx from 'clsx';
import AddBank from './addBank';

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    minWidth: '18rem',
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

export default function RightView(props) {
  const {
    selected,
  } = props;
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const {

  } = useSelector((state) => state);

  const {
    root, row, col,
  } = classes;

  const rightView = <AddBank />;

  switch (selected) {
    case 'BankAccount':

      break;

    case 'PaymentNetwork':

      break;

    default:
      break;
  }

  return (
    <div className={root}>
            Right View
    </div>
  );
}
