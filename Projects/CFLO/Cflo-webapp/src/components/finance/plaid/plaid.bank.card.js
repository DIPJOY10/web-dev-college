import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {useHistory} from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import cx from 'clsx';
import {Divider} from '@material-ui/core';
import PlaidBankCardItem from './plaid.bank.card.item';

const useStyles = makeStyles((theme) => ({
  root: {},

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

  paperStyle: {
    maxWidth: '18rem',
    margin: '1rem 0.5rem',
    padding: '1rem 0.5rem',
  },

  titleText: {
    fontSize: '1.3rem',
    fontWeight: '600',
    color: '#424242',
  },
}));

export default function PlaidBankCard(props) {
  const {bankAccount, onSelect} = props;
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const {row, col, root, paperStyle, smPaperStyle, titleText, accountSubtype, accountName} = classes;

  const institution = bankAccount?.institution;
  const name = institution?.name;
  const accts = bankAccount?.accounts || [];
 
  return (
    <Paper className={cx(col, paperStyle)}>
      <Typography className={titleText}>{name}</Typography>

      {accts.map((acct) => {
        return <PlaidBankCardItem item={acct} bankAccount={bankAccount} onSelect={onSelect} />;
      })}
    </Paper>
  );
}
