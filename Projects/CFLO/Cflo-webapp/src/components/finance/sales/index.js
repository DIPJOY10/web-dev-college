// not using 

import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {useHistory} from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import {useFindWallet} from '../hooks';
import TopBar from '../topbar';
import Api from '../../../helpers/Api';
import arrayToReducer from '../../../helpers/arrayToReducer';
import InvCard from '../invoice/invoice.card';
import SaleTable from './table';

const useStyles = makeStyles((theme) => ({
  root: {},

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
}));

export default function S(props) {
  const classes = useStyles();
  const walletId = useFindWallet();
  const history = useHistory();
  const dispatch = useDispatch();

  const {} = useSelector((state) => state);

  const {root, row, col} = classes;

  const [invIds, setInvIds] = useState([]);
  const [invDict, setInvDict] = useState({});

  const getInvoices = async () => {
    if (walletId) {
      const res = await Api.post('wallet/invoice/wallet/get', {
        walletIds: [walletId],
      });

      const data = res?.data;

      if (data && data.length > 0) {
        const {newDict, idArr} = arrayToReducer(data);

        setInvIds(idArr);
        setInvDict(newDict);
      }
    }
  };

  const invs = invIds.map((invId) => invDict[invId]);

  useEffect(() => {
    getInvoices();
  }, [walletId]);

  return (
    <div className={root}>
      <TopBar walletId={walletId} />

      {/* <Paper>
        <Typography>Settings</Typography>
        <Typography>Email password settings</Typography>
        <Typography>Inv counter setting</Typography>
      </Paper> */}

      {/* <div className={col}>
        {invIds.map((invId) => {
          const inv = invDict[invId];
          return <InvCard invoice={inv} />;
        })}
      </div> */}


      <SaleTable invs={invs} />
    </div>
  );
}
