import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {useParams, useHistory, useLocation} from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import cx from 'clsx';
import {addRelation} from '../network/api';
import SearchAndAddOffering from '../offering/autocomplete';
import List from '../BillList/bill.list.edit';
import Api from '../../../helpers/Api';
// import TopBar from './tx.topbar';
import {useDebounce} from 'react-use';
import {useGetTx} from './hooks';
import {DescriptionInput} from '../styles';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
// import TxBasic from './tx.basic';
import PaymentConfig from '../payment/payment.config';
import BillEdit from '../bill/bill.edit';
import InvoiceEdit from '../invoice/invoice.edit';
import { updateTx } from './api';


const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: '6rem',
    width: '100%',
  }
}));

export default function TxEdit(props) {
  const {
    walletId, txId,
  } = useParams();
  const classes = useStyles();
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch(); 

  const {
    user,
    userProfile,
  } = useSelector((state) => state.auth);

  const {
    tx, setTx,
  } = useGetTx(txId);
  
  const {
    root
  } = classes;

  let TxView = null; 
 
  switch (tx?.type) {
    case 'Bill':
      TxView = <BillEdit 
          tx={tx}
          setTx={setTx} 
          updateApi={updateTx}
          walletId={walletId}
      />
    break;
    case 'Invoice':
      TxView = <InvoiceEdit 
          tx={tx}
          setTx={setTx} 
          updateApi={updateTx}
          walletId={walletId}
      />
      break;
    default:
      break;
  }


  useEffect(() => {
    if (tx?.billList?._id) {
    }
  }, [tx?._id]);


  return (
    <div className={root}>

        {TxView}


    </div>
  );
}
