import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory, useParams } from "react-router-dom";
import Api from '../../../helpers/Api';
import PlaidBankAccounts from '../plaid/bankAccounts';
import AccountCard from '../BillingAccount/BillingAccountCard';
import PlaidLink from '../plaid/plaid.link.btn';
import Typography from '@material-ui/core/Typography';
import { useFindWallet, useGetWallet } from '../hooks';
import CircularProgress from '@material-ui/core/CircularProgress';



const useStyles = makeStyles((theme) => ({
  row: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  titleText: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#424242',
    margin: '1rem',
  },
}));

export default function BankAccounts(props) {
  const classes = useStyles();
  const history = useHistory();
  const { } = useParams();
  const { } = props;
  const walletId = useFindWallet();

  const {
    row, titleText
   } = classes;

  const {wallet: walletHook, plaidBankAccounts, billingAccounts} = useGetWallet(walletId);

  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [wallet, setWallet] = useState(null);

  useEffect(() => {
    if (walletHook?._id) {
      setWallet(walletHook);
      setAccounts(billingAccounts);
    }
  }, [walletHook]);

  useEffect(() => {
    if (walletId) {
      setLoading(true);
      Api.post('wallet/billing/account/find', {
        walletIds: [walletId],
      })
      .then((res) => {
          const data = res?.data || [];
          setAccounts(data);
      })
      .finally(() => setLoading(false));
    }
  }, []);

  console.log("accounts" + plaidBankAccounts);

  return (
    <>
      <Typography className={titleText} >Banks Accounts</Typography>
      <PlaidLink wallet={walletHook} />
    
      {plaidBankAccounts?.length > 0 ? (
          <>
            <PlaidBankAccounts bankAccounts={plaidBankAccounts} />
          </>
        ) : null}
      
      {accounts?.length > 0 ? (
        <>
          <div className={row}>
            
            {accounts.map((account) => {
              return <AccountCard key={account?._id} account={account} onSelect={() => { }} />;
            })}
            
          </div>
        </>
      ) : null}
      
    </>
  );
}
