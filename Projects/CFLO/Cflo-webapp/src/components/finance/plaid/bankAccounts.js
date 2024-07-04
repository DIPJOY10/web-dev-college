import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {useHistory} from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import cx from 'clsx';
import {useFindWallet, useGetWallet} from '../hooks';
import Api from '../../../helpers/Api';

import AccountCard from '../BillingAccount/BillingAccountCard';
import ConnectStripeBtn from '../stripe/connect.stripe.btn';
import PlaidLink from '../plaid/plaid.link.btn';

import PlaidBankCard from './plaid.bank.card';

const useStyles = makeStyles((theme) => ({
  root: {},

  row: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  wrapCenter: {
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },

  col: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },

  paperStyle: {
    maxWidth: '18rem',
    padding: '0.5rem 1rem',
    margin: '1rem',
  },

  smPaperStyle: {
    maxWidth: '18rem',
    padding: '0.5rem 1rem',
    margin: '0.3rem 0.15rem',
  },

  paraText: {
    fontSize: '0.9rem',
    fontWeight: '400',
  }, 
}));

export default function PlaidBankAccount(props) {
  const classes = useStyles();
  
  const {bankAccounts} = props;

  const {root, row, col, wrapCenter, paperStyle, smPaperStyle, paraText, titleText, accountName, accountSubtype} = classes;

  return (
    <div className={root}>
      <div className={cx(row)}>
        {bankAccounts.map((bankAcct) => {
          return bankAcct.account && (bankAcct.accountType === 'PlaidBankAccount' ? <PlaidBankCard bankAccount={bankAcct.account} /> : null);
        })}
      </div>
    </div>
  );
}
