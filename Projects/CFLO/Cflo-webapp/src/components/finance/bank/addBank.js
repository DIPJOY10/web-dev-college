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
import ConnectDwollaBtn from '../dwolla/connect.dwolla.btn';
import PlaidLink from '../plaid/plaid.link.btn';
import PlaidBankAccounts from '../plaid/bankAccounts';
import CreateBtn from '../../styled/actionBtns/create.btn';
import BillingAccountDialog from '../BillingAccount/BillingAccountDialog';

const useStyles = makeStyles((theme) => ({
  root: {

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
  const classes = useStyles();
  const [wallet, setWallet] = useState(null);
  const history = useHistory();
  const dispatch = useDispatch();
  const walletId = useFindWallet();
  const {
    wallet: walletHook, plaidBankAccounts,
    billingAccounts,
  } = useGetWallet(walletId);

  const [accounts, setAccounts] = useState([]);
  const [open, setOpen] = useState(false);
  const {
    wallet: walletReducer,
  } = useSelector((state) => state);


  const {
    root, row, col, titleText,
  } = classes;

  useEffect(() => {
    if (walletHook?._id) {
      setWallet(walletHook);
      setAccounts(billingAccounts);
    }
  }, [walletHook]);

  useEffect(() => {
    if (walletId) {
      Api.post('wallet/billing/account/find', {
        walletIds: [walletId],
      }).then((res)=>{
        const data = res?.data || [];
        setAccounts(data);
      });
    }
  }, []);

  return (
    <div className={root}>

      {walletHook?._id?
            <>


              <Typography className={titleText}>
                    Banks Accounts
              </Typography>

              <PlaidLink
                wallet={walletHook}
              />


              {plaidBankAccounts?.length>0?<>


                <PlaidBankAccounts
                  bankAccounts={plaidBankAccounts}
                />
              </>:null}

              <div className={row}>
                <div className={row}>
                  <Typography className={titleText}>
                        Billing Accounts
                  </Typography>
                </div>
                <CreateBtn onClick={()=>{
                  setOpen(true);
                }}>
                    Add New
                </CreateBtn>
                <div className={row}></div>
              </div>

              <BillingAccountDialog
                walletId={walletId}
                open={open}
                setOpen={setOpen}
                accounts={accounts}
                setAccounts={setAccounts}
              />

              {accounts?.length>0?<>


                <div className={row}>

                  {accounts.map((account)=>{
                    return (
                      <AccountCard
                        key={account?._id}
                        account={account}
                        onSelect={()=>{

                        }}
                      />
                    );
                  })}


                </div>
              </>:null}
            </>:
            null}

    </div>
  );
}
