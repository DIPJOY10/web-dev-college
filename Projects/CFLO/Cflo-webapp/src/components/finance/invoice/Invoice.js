import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import AddNewTxDialog from "../transaction/AddNewTxDialog";
import { useFindWallet } from '../hooks';
import TxTable from '../expenses/transactions';
import { getTxByWallet } from '../transaction/api';


const useStyles = makeStyles((theme) => ({


}));

export default function Invoices(props) {
  const classes = useStyles();
  const walletId = useFindWallet();
  const [txs, setTxs] = useState([]);
  const [empty, setEmpty] = useState(false);
  // to get table data
  useEffect(() => {
    getTxByWallet({ walletId: walletId, type: "Invoice" }) // keep bill in an array 
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

  } = classes;

  return (
    <div>
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
