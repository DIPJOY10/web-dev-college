import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {useHistory} from 'react-router-dom';
import AddNewTxDialog from "../transaction/AddNewTxDialog";
import {useFindWallet} from '../hooks';
import TxTable from './transactions';
import { getTxByWallet } from '../transaction/api';

const useStyles = makeStyles((theme) => ({
  root: {

  }
}));

export default function Expenses(props) {
  const classes = useStyles();
  const walletId = useFindWallet();
  const [txs, setTxs] = useState([]);  
  const [empty, setEmpty] = useState(false);

  useEffect(() => {
    getTxByWallet({walletId : walletId, type : "Bill"}) // keep bill in an array 
    .then((data) =>{
          setTxs(data);
          if(data.length === 0){
            setEmpty(true);
          }
    })
    .catch((error) =>{
          console.log(error);
          setEmpty(true);
    })
  }, []);
 
  const {
    root
  } = classes;
 
  return (
    <div className={root}>
      <TxTable
        txs={txs}
        walletId={walletId}
        txType={"billNo"}
        empty={empty}
        pathType={'/tx/'}
       />
    </div>
  );
}
