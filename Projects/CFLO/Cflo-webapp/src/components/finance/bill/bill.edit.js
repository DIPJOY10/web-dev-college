import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import BillOtherSettings from './BillOtherSettings';
import BillPaymentSettings from './BillPaymentSettings';
import BillOtherSettingsView from './BillOtherSettingsView';
import CircularProgress from '@material-ui/core/CircularProgress';



const useStyles = makeStyles((theme) => ({
  col: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  loaderCont: {
    position: 'fixed',
    top: "0px",
    right: "0px",
    width: "100vw",
    height: "100vh",
    zIndex: "1000",
    paddingLeft: "100px",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    [theme.breakpoints.down('xs')]: {
      paddingLeft: "0px",
    },
  }

}));

export default function BillEdit(props) {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const theme = useTheme();

  const {
    tx, setTx, updateApi, walletId
  } = props;
  const {
    col
  } = classes;


  const [pageLevel, setPageLevel] = useState("otherSettings")
  const [loadingBool, setLoadingBool] = useState(false);




  return (
    <div className={col}>

      {pageLevel === "otherSettings" &&
        (walletId === tx?.firstPartyWallet._id ? (
          tx.status === "Paid" || tx.status === "Processing" ? (
            <BillOtherSettingsView
              tx={tx}
              setTx={setTx}
              updateApi={updateApi}
              walletId={walletId}
              setPageLevel={setPageLevel}
            />
          ) : (
            <BillOtherSettings
              tx={tx}
              setTx={setTx}
              updateApi={updateApi}
              walletId={walletId}
              setPageLevel={setPageLevel}
              setLoadingBool={setLoadingBool}
            />
          )
        ) : (walletId === tx?.secondPartyWallet._id &&
          <BillOtherSettingsView
            tx={tx}
            setTx={setTx}
            updateApi={updateApi}
            walletId={walletId}
            setPageLevel={setPageLevel}
          />
        ))
      }



      {pageLevel === "paymentSettings" && (
        walletId === tx?.firstPartyWallet._id && tx.status !== "Paid" && tx.status !== "Processing" ? (
          <BillPaymentSettings
            tx={tx}
            setTx={setTx}
            updateApi={updateApi}
            walletId={walletId}
            setPageLevel={setPageLevel}
            setLoadingBool={setLoadingBool}
          />
        ) : (
          <div>
            Something went wrong
          </div>
        )
      )}

      {loadingBool &&
        <div className={classes.loaderCont} >
          <CircularProgress
            size={60}
            thickness={3}
            style={{ color: 'rgb(92, 144, 242)' }}
          />
        </div>
      }
    </div>
  );
}
