import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory, useParams } from 'react-router-dom';
import { getChartAccounts } from '../chartaccount/api';
import ChartAccounts from "../chartaccount/chartOfAccounts";
import MyNavBar from '../../styled/CommonComponents/MyNavBar';
import AddNewTxDialog from '../transaction/AddNewTxDialog';
import JournalEntry from '../journalEntry';
import AllReports from './AllReports';



const useStyles = makeStyles((theme) => ({
  root: {

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
}));

export default function S(props) {
  const {
    walletId,
  } = useParams();
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const {

  } = useSelector((state) => state);

  const {
    root, row, col,
  } = classes;

  const [nav, setNav] = useState('Reports');

  const [accts, setAccts] = useState([])

  const [show, setShow] = useState("reports")

  useEffect(() => {
    getChartAccounts(walletId)
      .then(data => {
        if (data.length > 0) {
           setAccts(data)
           
        }
      })
  }, [walletId])


  return (
    <div className={root}>

      <MyNavBar
        title={"Financial Statements"}
        show={show}
        setShow={setShow}
        walletId={walletId}
        Component={AddNewTxDialog}
        isMenu={true}
        options={[
          {
            value: "reports",
            label: "Reports",
            Component: <AllReports
              walletId={walletId}
              accts={accts}
            />
          },
          {
            value: "chart_of_accounts",
            label: "Chart Of Accounts",
            Component: <ChartAccounts
              accts={accts}
            />
          },
          {
            value: "journal_entry",
            label: "Journal Entry",
            Component: <JournalEntry />
          }
        ]}
      />

    </div>
  );
}
