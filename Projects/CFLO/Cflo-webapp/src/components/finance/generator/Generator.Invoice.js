import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {useHistory} from 'react-router-dom';
import AddNewTxDialog from "../transaction/AddNewTxDialog";
import {useFindWallet} from '../hooks';
import TxTable from '../expenses/transactions';
import Typography from '@material-ui/core/Typography';
import { getTxByWallet, getTxTemplateByWallet } from '../transaction/api';
import SlidingSideBar from './SlidingSideBar';


const useStyles = makeStyles((theme) => ({
  root : {
     
  },
}));

export default function GeneratorInvoice(props) {
  const classes = useStyles();
  const history = useHistory();
  const walletId = useFindWallet();
  const [txTemplates, setTxTemplates] = useState([]);  
  const [empty, setEmpty] = useState(false);
  const [show, setShow] = useState(false);
  const [selectedGenerator, setSelectedGenerator] = useState()
// to get table data
  useEffect(() => { 
    getTxTemplateByWallet({walletId : walletId, type : "Invoice"}) // keep bill in an array 
    .then((data) =>{
          setTxTemplates(data);
          if(data.length === 0){
            setEmpty(true);
          }
    })
    .catch((error) =>{
          console.log(error);
    })
  }, []); 
 
  const showSideBar = (data) =>{
     console.log(data);
     setShow(true);
  }


 
  const {
    root
  } = classes;

  return (
    <div className={root}>
      <TxTable
        txs={txTemplates}
        walletId={walletId}
        txType={"invNo"}
        empty={empty}
        pathType={'/txtmplate/'} 
        showSideBar={showSideBar}
        setSelectedGenerator={setSelectedGenerator}
       />
       {show ?
      <SlidingSideBar 
        setActivitySidebar={setShow}
        activitySidebar={show}
        selectedGenerator={selectedGenerator}
        setTxTemplates={setTxTemplates}
      />:null}
    </div>
  );
}
