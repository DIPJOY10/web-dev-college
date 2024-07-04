import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory, useParams } from "react-router-dom";
import BillingAccountDialog from '../BillingAccount/BillingAccountDialog';
import Api from '../../../helpers/Api';
import { useFindWallet, useGetWallet } from '../hooks';
import { ButtonBase } from '@material-ui/core';


const useStyles = makeStyles((theme) => ({
    addNewBtn: {
        height: '2rem',
        width: '8rem',
        marginRight: '4rem',
        fontSize: '0.9rem',
        fontWeight: '700',
        backgroundColor: '#00c853',
        color: 'white',
        borderRadius: '1rem',
        [theme.breakpoints.down('sm')]: {
          marginRight: '10px',
        },
      },

}));

export default function AddNewTxDialog(props) {
    const classes = useStyles();
    const history = useHistory();
    const { } = useParams();
    const { } = props;
    const walletId = useFindWallet();
  
    const { addNewBtn } = classes;
  
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


  const [open, setOpen] = useState(false);

  return (
    <div>

    <ButtonBase
        className={addNewBtn}
        onClick={()=>{
            setOpen(!open);
        }}
        >
            Add Account
    </ButtonBase>

       <BillingAccountDialog 
           walletId={walletId} 
           open={open} 
           setOpen={setOpen} 
           accounts={accounts} 
           setAccounts={setAccounts} 
       />
    </div>
  );
}
