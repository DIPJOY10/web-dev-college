import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';

import List from '../BillList/bill.list.edit';

import { processReceivedTx } from './hooks';


const useStyles = makeStyles((theme) => ({
  root: {
    marginLeft: '1.5rem',
    marginBottom: '6rem',

  },

  top: {
    marginTop: '2rem',
    marginBottom: '1rem',
  },

  row: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
  },

  col: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },

  datePicker: {
    width: 150,
  },  
}));

export default function TxBillListEdit(props) {
  const {
    tx, setTx, showGL, updateApi, setLoadingBool
  } = props;

  const [billList, setBillList] = useState(null);
  const [billItemDictionary, setBillItemDictionary] = useState({});

  useEffect(() => {
    if (tx?.billList?._id) {
      const {
        billItemDictionary: newBillItemDict,
        billList: newBillList,
      } = processReceivedTx(tx);

      setBillItemDictionary(newBillItemDict);
      setBillList(newBillList);
    }
  }, [tx?._id]);

 
  useEffect(() => {
    setTx({
        ...tx,
        billList:{
            ...billList,
            items:billList?.items.map(itemId=>billItemDictionary[itemId])
        }
    })
  }, [billList, billItemDictionary])

  return (
    <>
      {
                billList?._id?<List
                  tx={tx}
                  setTx={setTx}
                  updateApi={updateApi}
                  billList={billList}
                  setBillList={setBillList}
                  billItemDictionary={billItemDictionary}
                  setBillItemDictionary={setBillItemDictionary}
                  showGL={showGL}
                  setLoadingBool={setLoadingBool}
                />:null
      }
    </>
  );
}
