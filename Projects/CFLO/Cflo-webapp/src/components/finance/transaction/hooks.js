import React, {useState, useEffect} from 'react';
import Api from '../../../helpers/Api';
import arrayToReducer from '../../../helpers/arrayToReducer';

export function useGetTx(txId) {
  const [tx, setTx] = useState(null);
  useEffect(() => {
    if (txId) {
      Api.post('transaction/get', {txId})
      .then((res) => {
        const txData = res.data;
        setTx(txData);
      })
      .catch((err) => {
        console.log(err);
      })
    }
  }, []);
  return {
    tx,
    setTx,
  };
}

export function useGetTxTemplate(txTemplateId) {
  const [txTemplate, setTxTemplate] = useState(null);
  useEffect(() => {
    if (txTemplateId) {
      Api.post('txTemplate/get', {txTemplateId})
      .then((res) => {
        const txTempData = res.data;
        console.log(txTempData);
        setTxTemplate(txTempData);
      })
      .catch((err) => {
       console.log(err);
      });
    }
  }, []);
  return {
    txTemplate, 
    setTxTemplate
  };
}


export const processReceivedTx = (tx) => {  
  const billList = tx?.billList;
  const items = billList?.items || [];

  const {newDict: billItemDictionary, idArr} = arrayToReducer(items);

  billList.items = idArr;
  tx.billList = billList?._id;

  return {
      billItemDictionary,
      billList,
  };
}; 