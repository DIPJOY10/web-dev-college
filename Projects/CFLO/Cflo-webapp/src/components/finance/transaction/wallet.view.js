import React, {useEffect, useRef, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import Card from './transaction.card';
import Api from '../../../helpers/Api';
import {setTransactions} from './transaction.utils';
import {
  makeStyles,
  useTheme,
} from '@material-ui/core/styles';
import {
  useParams, useHistory,
} from 'react-router-dom';


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    overflow: 'auto',
    marginTop: '1rem',
    marginBottom: '6rem',
  },

}));

export default function Transactions(props) {
  const classes = useStyles();

  const dispatch = useDispatch();
  const walletReducer = useSelector((state)=>state.wallet);
  const {walletDictionary} = walletReducer;
  const {walletId} = props;
  const wallet = walletDictionary[walletId];
  const transactions = wallet&&wallet?.transactions?wallet.transactions:[];


  useEffect(() => {
    Api.post('wallet/getData', {
      walletId,
    }).then((res)=>{
      const {transactions, wallet} = res;
      const newWalletObject = {};
      newWalletObject[walletId] = wallet;

      setTransactions(transactions, walletId, {
        ...walletReducer,
        walletDictionary: {
          ...walletDictionary,
          ...newWalletObject,
        },
      }, dispatch);
      // console.log(res,' is the wallet data')
    });
  }, []);

  return (
    <div className={classes.root}>


      {transactions.map((transactionId)=>{
        return <Card transactionId={transactionId} />;
      })}

    </div>
  );
}
