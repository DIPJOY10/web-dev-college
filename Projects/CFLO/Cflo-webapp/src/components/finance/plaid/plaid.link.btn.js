import React, {useState, useEffect, useCallback} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {useHistory} from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import cx from 'clsx';
import {usePlaidLink} from 'react-plaid-link';
import {generateToken} from './api';
import PlaidLogo from './plaid-logo.svg';
import PlaidBankLinkHelper from './plaid.bank.link.helper';

const useStyles = makeStyles((theme) => ({
  root: {

  },

  row: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
  },

  col: {
    display: 'flex',
    flexDirection: 'column',
  },

  paperStyle: {
    maxWidth: '18rem',
    padding: '0.5rem 1rem',

  },

  btnStyle: {
    margin: '1rem',
  },

  paraText: {
    fontSize: '0.9rem',
    fontWeight: '400',
  },

  titleText: {
    fontSize: '1.3rem',
    fontWeight: '600',
    color: '#424242',
  },

  imgStyle: {
    height: '2.5rem',
    width: '6.5rem',
    color: '#616161',
  },

}));


export default function S(props) {
  const classes = useStyles();

  const {
    root, row, col, paperStyle, btnStyle,
    titleText, paraText, imgStyle,
  } = classes;

  return (
    <PlaidBankLinkHelper {...props}>
      <Paper className={cx(col, paperStyle)}>
        <div className={row}>
          <img
            className={imgStyle}
            src={PlaidLogo}
          />
          <Typography className={titleText}> 
                        Add Bank Account
          </Typography>
        </div>

        <Typography className={paraText}>
                    We use Plaid to access your bank account. Please note each connected bank account costs <b>$1.5</b> one time, and then <b>30c</b> per month.
        </Typography>
      </Paper>
    </PlaidBankLinkHelper>
  );
}
