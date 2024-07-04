import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import AddNewTxDialog from "../transaction/AddNewTxDialog";
import { useFindWallet } from '../hooks';
import TxTable from '../expenses/transactions';
import Typography from '@material-ui/core/Typography';
import { getBothSideTxByWallet } from '../transaction/api';


const useStyles = makeStyles((theme) => ({


}));

export default function AllSales(props) {
  const classes = useStyles();
  const walletId = useFindWallet();
  const [txs, setTxs] = useState([]);
  const [empty, setEmpty] = useState(false);


  // to get table data
  useEffect(() => {
    getBothSideTxByWallet({ walletId: walletId, type: "Invoice" }) // keep bill in an array 
      .then((data) => {
        setTxs(data);
        if (data.length === 0) {
          setEmpty(true);
        }
      })
      .catch((error) => {
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
        txType={"invNo"}
        empty={empty}
        pathType={'/tx/'}
       />
    </div>
  );
}
