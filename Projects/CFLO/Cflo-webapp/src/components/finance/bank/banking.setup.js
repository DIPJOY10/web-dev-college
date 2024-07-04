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
import PlaidLink from '../plaid/plaid.link.btn';
import PlaidBankAccounts from '../plaid/bankAccounts';

import DrawerDoubleTop from '../../styled/DrawerDoubleTop';
import LeftList from './leftList';
import LeftTopBar from './LeftTopBar';
import RightView from './rightView';
import RightTopBar from './RightTopBar';

const useStyles = makeStyles((theme) => ({
  root: {},

  paper: {
    margin: '1rem',
    width: '90%',
    maxWidth: '42rem',
  },

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

  submitBtn: {
    marginTop: '2rem',
    marginLeft: '10rem',
    maxWidth: '8rem',
    padding: '0.4rem',
    [theme.breakpoints.down('sm')]: {
      marginLeft: '4rem',
      marginRight: '1rem',
    },
  },

  paperStyle: {
    maxWidth: '18rem',
    padding: '0.5rem 1rem',
  },
}));

export default function Bank(props) {
  const {open: openMain} = props;

  const classes = useStyles();
  const [selected, setSelected] = useState('BankAccount');
  const [wallet, setWallet] = useState(null);
  const history = useHistory();
  const dispatch = useDispatch();
  const walletId = useFindWallet();
  const {wallet: walletHook, plaidBankAccounts, billingAccounts} = useGetWallet(walletId);

  const [accounts, setAccounts] = useState([]);
  const [open, setOpen] = useState(false);
  const {wallet: walletReducer} = useSelector((state) => state);

  const {root, row, paper, col, titleText, paraText} = classes;

  useEffect(() => {
    if (walletHook?._id) {
      setWallet(walletHook);
    }
  }, [walletHook]);

  return (
    <div className={col}>
      <Typography className={titleText}>Banks Accounts</Typography>
      <div>
        <PlaidLink wallet={walletHook} />
      </div>

      {plaidBankAccounts?.length > 0 ? <PlaidBankAccounts bankAccounts={plaidBankAccounts} /> : null}
    </div>
  );
}
