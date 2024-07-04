import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import Api from '../../../../helpers/Api';

import HandleBillingAccount from './billing.account';
import ProductCards from './product.cards.view';
import HandlePayment from './payment';


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },

}));


const CheckoutSubscription = (props) =>{
  const classes = useStyles();


  const {user, userProfile} = useSelector((state)=>state.auth);

  const dispatch = useDispatch();

  let profile = user;
  if (user?._id) {
    profile = user?.model==='User'?user:userProfile;
  }

  // if Product selected and not in Edit mode then move ahead to account

  const [product, setProduct] = useState(null);
  const [productEdit, setProductEdit] = useState(true);

  // if Account selected and not in Edit mode then move ahead to payment

  const [account, setAccount] = useState(null);
  const [accountEdit, setAccountEdit] = useState(false);

  const walletId = user?.model==='User'?user?.wallet:userProfile?.wallet;
  const [accounts, setAccounts] = useState([]);

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
    <div className={classes.root}>

      {product&&!productEdit?<>
        {account&&!accountEdit?<HandlePayment
          product={product}
          setProductEdit={()=>{
            setProductEdit(true);
          }}
          account={account}
          setAccountEdit={()=>{
            setAccountEdit(true);
          }}
          onSelect={(acct)=>{
            setAccount(acct);
            setAccountEdit(false);
          }}
        />:<HandleBillingAccount
          accounts={accounts}
          setAccounts={setAccounts}
          product={product}
          setProductEdit={()=>{
            setProductEdit(true);
          }}
          onSelect={(acct)=>{
            setAccount(acct);
            setAccountEdit(false);
          }}
        />}

      </>:<>
        <ProductCards
          onSelect={(prod)=>{
            setProduct(prod);
            setProductEdit(false);
          }}
        />
      </>}

    </div>
  );
};

export default CheckoutSubscription;
