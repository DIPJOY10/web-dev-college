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
import Link from '@material-ui/core/Link';
import ConnectStripeBtn from '../stripe/connect.stripe.btn';
import StripeCustomer from '../stripe/stripe.customer';

import ConnectDwollaBtn from '../dwolla/connect.dwolla.btn';
import DwollaCustomer from '../dwolla/dwolla.customer';
import WalletPaymentNetworks from './wallet.payment.networks';

const useStyles = makeStyles((theme) => ({
  root: {},

  paper: { 
    margin: '1rem',
    width: '90%',
    padding: '1rem',
    maxWidth: '42rem',
  },

  row: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  col: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },

  titleText: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#424242',
    margin: '1rem',
  },

  paraText: {
    fontSize: '1rem',
    fontWeight: '400',
    color: '#424242',
    margin: '1rem',
  },
}));

export default function PaymentNetworkPage(props) {
  const classes = useStyles();
  const [wallet, setWallet] = useState(null);
  const history = useHistory();
  const dispatch = useDispatch();
  const walletId = useFindWallet();
  const {wallet: walletHook, plaidBankAccounts, billingAccounts} = useGetWallet(walletId);

  const {root, row, paper, col, titleText, paraText} = classes;

  return (
    <div className={root}>
      <Paper className={paper}>
        <Typography className={titleText}>Choose Payment Networks</Typography>
        <Typography className={paraText}>
          You can choose to connect to both Dwolla and Stripe with same bank account/s. Dwolla costs $1, Stripe is free.
        </Typography>
        {/* <Typography className={paraText}>
                    Dwolla is preferred for US 🇺🇸 based businesses using ACH. It costs few cents in fees (0.5% - 50 cents max) but it takes 5-7 days to reconcile. We will negotiate <b>same day ACH</b> soon. It costs <b>$1 for an account</b>.
                </Typography>
                <Typography className={paraText}>
                    Stripe is available <Link onClick={()=>{
                        const url = 'https://stripe.com/global'
                        window.open(url,'_blank')
                    }}>internationally</Link>. Supports multiple
                        payment methods ( we currently support bank transfers (ACH) in US only, <Link onClick={()=>{
                        const url = 'mailto:team@contractflo.com'
                        window.open(url,'_blank')
                    }}>reach out</Link> to us for your country specific payments). Stripe account is <b>free</b>.
                </Typography>

                <Typography className={paraText}>
                    Dwolla enables you to send money to <b>anyone</b> with bank account info (ACH US only), Stripe lets you send money <b>only</b> to people on Stripe network.
                </Typography> */}
      </Paper>
      <WalletPaymentNetworks walletId={walletId} />
    </div>
  );
}
