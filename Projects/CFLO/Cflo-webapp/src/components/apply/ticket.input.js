import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import NumberFormat from 'react-number-format';
import TextField from '@material-ui/core/TextField';
import { InputBase } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '32rem',
    justifyContent: 'center',
    alignItems: 'center',
  },

  row: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    margin: '1rem',
  },

  col: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },

  card2Style: {
    marginTop: '1.5rem',
  },

  container: {
    flex: 1,
    flexDirection: 'column',
    display: 'flex',
    maxWidth: '32rem',
  },

  boxWidth: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '9rem',
    margin: '0.5rem',
  },
}));

export default function S(props) {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const explore = useSelector((state) => state.explore);

  const {
    investmentDictionary,
  } = explore;

  const {
    investmentId, setTicket,
  } = props;


  const {
    root, row, col,
  } = classes;

  const investment = investmentDictionary[investmentId];


  const [amount, setAmount] = useState(investment?.header?.minTicket);


  useEffect(() => {
    setTicket({
      amount,
      currency: 'usd',
    });
  }, [amount]);


  return (
    <div className={root}>
      <Typography variant="h6">
        <b> Investment Size Quote </b>
      </Typography>
      <NumberFormat value={amount} thousandSeparator={true} prefix={'$'} customInput={TextField} onValueChange={(values) => {
        const { value } = values;
        setAmount(value);
      }} />

    </div>
  );
}
