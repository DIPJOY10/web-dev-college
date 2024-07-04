import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory, useParams } from "react-router-dom";
import WalletPaymentNetworks from '../payment/wallet.payment.networks';


const useStyles = makeStyles((theme) => ({
 
}));

export default function PaymentMethods(props) {
  const classes = useStyles();
  const history = useHistory();
  const { walletId } = useParams();
  const {  } = props;
  const {  } = classes;

  return (
    <div>
         <WalletPaymentNetworks walletId={walletId} />
    </div>
  );
}
