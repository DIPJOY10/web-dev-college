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
import Menubar from '../../styled/menubar';
import PlaidBankCard from '../plaid/plaid.bank.card';
import PlaidBankLinkHelper from '../plaid/plaid.bank.link.helper';
import DwollaIavLink from './dwolla.iav.link';
import Api from '../../../helpers/Api';

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

export default function SelectBankAccountDialog(props) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const {setOpen, open, wallet, dwollaCustomer, plaidBankAccounts, txId, paymentPage} = props;
  const [loading, setloading] = useState(false);
  const [text, setText] = useState('');
  const state = useSelector((state) => state);
  // const {user, userProfile} = useSelector((state) => state.auth);
  // const [owner, setOwner] = useState(user);
  // const userId = user?._id;
  const history = useHistory();
  const navOld = plaidBankAccounts?.length > 0 ? 'Select' : 'Add';
  const [nav, setNav] = useState(navOld);

  const {margin, col, row, center, minWidth, cardPaperStyle, cardTitleText, cardParaText} = classes;

  const handleClose = () => {
    // do not close
    setOpen(false);
  };

  console.log(plaidBankAccounts)

  const onPlaidItemSelect = async (obj) => {
    try {
      const plaidAccount = obj?.bankAccount;
      const item = obj?.item;

      const res = await Api.post('dwolla/addFundingSrc', {
        item,
        plaidAccount,
        customerUrl: dwollaCustomer?.dwollaPath,
      });
    }
    catch (error) {}
  };

  const PlaidAccountView = (
    <div className={col}>
      {plaidBankAccounts?.length > 0 ?
        plaidBankAccounts.map((bankAcct, index) => {
          return <PlaidBankCard key={index} bankAccount={bankAcct} onSelect={onPlaidItemSelect} />;
        }) :
        null}
    </div>
  );

  const NewAccountView = (
    <div className={col}>
      <DwollaIavLink wallet={wallet} txId={txId} paymentPage={paymentPage}>
        <Paper className={cardPaperStyle}>
          <Typography className={cardTitleText}>Dwolla</Typography>
          <Typography className={cardParaText}>It free and works with Dwolla only</Typography>
        </Paper>
      </DwollaIavLink>

      <PlaidBankLinkHelper>
        <Paper className={cardPaperStyle}>
          <Typography className={cardTitleText}>Plaid</Typography>
          <Typography className={cardParaText}>
            It cost's $5 per account, but it's works with both Dwolla & Stripe. You also get access to bank account transactions.
          </Typography>
        </Paper>
      </PlaidBankLinkHelper>
    </div>
  );

  let AccountView = null;

  switch (nav) {
    case 'Select':
      AccountView = PlaidAccountView;
      break;

    case 'Add':
      AccountView = NewAccountView;
      break;

    default:
      break;
  }

  return (
    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
      <div className={clsx(row, center, margin, minWidth)}>
        <div className={clsx(row, center)}>
          <Typography className={margin}>🏛</Typography>
          <Typography variant="button">
            <b>Bank Accounts</b>
          </Typography>
        </div>
      </div>

      <Menubar
        navState={nav}
        setNav={setNav}
        items={[
          {
            Icon: null,
            text: 'Select',
            navText: 'Select',
          },

          {
            Icon: null,
            text: 'Add New',
            navText: 'Add',
          },
        ]}
      />

      {AccountView}
    </Dialog>
  );
}
