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
    flexDirection: 'column',
    flexWrap: 'wrap',
  },

  col: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
}));

export default function WalletPaymentNetworks(props) {
  const classes = useStyles();
  const [wallet, setWallet] = useState(null);
  const history = useHistory();
  const dispatch = useDispatch();
  const {walletId} = props;
  const {wallet: walletHook, plaidBankAccounts, billingAccounts} = useGetWallet(walletId);

  const [accounts, setAccounts] = useState([]);
  const [paymentConfig, setPaymentConfig] = useState(null);
  const {wallet: walletReducer} = useSelector((state) => state);

  const {root, row, paper, col, titleText, paraText} = classes;

  useEffect(() => {
    if (walletHook?._id) {
      setWallet(walletHook);
    }
  }, [walletHook]);

  const getWalletConfig = async () => {
    const res = await Api.post('wallet/payment/config/get', {
      wallet: walletId,
    });

    const data = res?.data;

    if (data?.config) {
      const config = data?.config;

      setPaymentConfig(config);
    }
  };

  const dwollaConfig = paymentConfig ? paymentConfig['dwolla'] : null;

  useEffect(() => {
    getWalletConfig();
  }, []);

  return ( 
    <>


      {walletHook?._id ? (
        <div className={row}>

          {walletHook?.dwollaCustomer ? (
            <DwollaCustomer wallet={walletHook} dwollaConfig={dwollaConfig} plaidBankAccounts={plaidBankAccounts} />
          ) : (
          <> 
           <ConnectDwollaBtn wallet={walletHook} setWallet={setWallet} />
          </>
          )}


 

          {walletHook?.stripeConnectAccountId ? (
            <StripeCustomer wallet={walletHook} setWallet={setWallet} />
          ) : (
            <ConnectStripeBtn wallet={walletHook} setWallet={setWallet} />
          )}
        </div>
      ) : null}
    </>
  );
}
