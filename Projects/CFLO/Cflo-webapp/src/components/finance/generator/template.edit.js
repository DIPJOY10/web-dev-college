import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {useParams, useHistory, useLocation} from 'react-router-dom';
import {useDebounce} from 'react-use';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import cx from 'clsx';
import SearchAndAddOffering from '../offering/autocomplete';
import List from '../BillList/bill.list.edit';
import Api from '../../../helpers/Api';
import PaymentConfig from '../payment/payment.config';
import { useGetTxTemplate } from '../transaction/hooks';
import { updateTx } from '../transaction/api';
import BillTemplateEdit from '../generatorBill/bill.template.edit';
import InvoiceTemplateEdit from '../generatorInvoice/invoice.template.edit';


const useStyles = makeStyles((theme) => ({
  root: {
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

export default function TxTemplateEdit(props) {
  const {
    walletId, txtemplateId,
  } = useParams();

  const classes = useStyles();
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch(); 
  const [customer, setCustomer] = useState(null);
  const [offering, setOffering] = useState(null);
  const {
    user,
    userProfile,
  } = useSelector((state) => state.auth);
  const DateNow = new Date();
  const [dueDate, setDueDate] = useState(''+DateNow);

  const [billList, setBillList] = useState(null);
  const [billItemDictionary, setBillItemDictionary] = useState({});

  

  const {
    txTemplate, setTxTemplate
  } = useGetTxTemplate(txtemplateId);
  
  const {
    root, row, col, top,
  } = classes;

  let TxView = null;  
 
  switch (txTemplate?.type) {
    case 'Bill':
      TxView = <BillTemplateEdit 
          txTemplate={txTemplate}
          setTxTemplate={setTxTemplate} 
          walletId={walletId}
      />
    break;
    case 'Invoice':
      TxView = <InvoiceTemplateEdit 
          txTemplate={txTemplate}
          setTxTemplate={setTxTemplate} 
          walletId={walletId}
      />
      break;
    default:
      break;
  }


  useEffect(() => {
    if (txTemplate?.billList?._id) {
    }
  }, [txTemplate?._id]);


  return (
    <div className={root} >
        {TxView}
    </div>
  );
}
