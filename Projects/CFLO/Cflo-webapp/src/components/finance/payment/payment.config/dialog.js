import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {makeStyles} from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import Paper from '@material-ui/core/Paper';

import ButtonBase from '@material-ui/core/ButtonBase';

import Typography from '@material-ui/core/Typography';
import {useParams, useHistory} from 'react-router-dom';
import ListIcon from '@material-ui/icons/List';
import Dialog from '@material-ui/core/Dialog';

import _ from 'lodash';

import clsx from 'clsx';
import {IconButton} from '@material-ui/core';

import AddIcon from '@material-ui/icons/Add';

import Api from '../../../../helpers/Api';
import {useGetWallet} from '../../hooks';
import WalletPaymentNetworks from '../wallet.payment.networks';


const useStyles = makeStyles((theme) => ({

  minWidth: {
    minWidth: '18rem',
  },

  row: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
  },

  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  margin: {
    margin: '1rem',
  },

  col: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },

  cardPaperStyle: {
    maxWidth: '18rem',
  },
  cardTitleText: {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#212121',
    margin: '0.5rem 0.5rem',
  },
  cardParaText: {
    fontSize: '0.9rem',
    fontWeight: '500',
    color: '#424242',
    textAlign: 'left',
    margin: '0 1rem 0.5rem 1rem',
  },

}));

export default function PaymentConfigDialog(props) {
  const classes = useStyles();
  const dispatch = useDispatch();


  const {setOpen, open, walletId} = props;

  const history = useHistory();


  const {
    margin, col, row, center,
    minWidth, cardPaperStyle,
    cardTitleText, cardParaText,
  } = classes;

  const handleClose = () => {
    // do not close
    setOpen(false);
  };


  return (

    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>


      <div className={clsx(row, center, margin, minWidth)}>
        <div className={clsx(row, center)}>
          <Typography className={margin}>
                        🏛
          </Typography>
          <Typography variant='button' >
            <b>Payment Setup</b>
          </Typography>
        </div>
      </div>

      <WalletPaymentNetworks
        walletId={walletId}
      />

    </Dialog>

  );
}
