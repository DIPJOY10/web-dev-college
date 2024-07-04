import React, { useState, useEffect } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import InvoiceTemplateOtherSetting from './InvoiceTemplateOtherSetting';
import InvoiceTemplatePaymentSetting from './InvoiceTemplatePaymentSetting';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
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



export default function InvoiceTemplateEdit(props) {
  const classes = useStyles();
  const history = useHistory();
  const theme = useTheme();

  const {
    txTemplate, setTxTemplate, walletId
  } = props;
  const { } = classes;
  const DateNow = new Date();

  const [pageLevel, setPageLevel] = useState("otherSettings")
  const [loadingBool, setLoadingBool] = useState(false);



  return (
    <div>
      {pageLevel === "otherSettings" &&
        (walletId === txTemplate?.firstPartyWallet._id ? (
          txTemplate.status === "Paid" || txTemplate.status === "Processing" ?
            <>Something is wrong</>
            :
            <InvoiceTemplateOtherSetting
              txTemplate={txTemplate}
              setTxTemplate={setTxTemplate}
              walletId={walletId}
              setPageLevel={setPageLevel}
              setLoadingBool={setLoadingBool}
            />
        ) : (walletId === txTemplate?.secondPartyWallet?._id &&
          <>Something is wrong</>
        ))
      }

      {pageLevel === "paymentSettings" && (
        walletId === txTemplate?.firstPartyWallet?._id && txTemplate?.status !== "Paid" && txTemplate?.status !== "Processing" ? (
          <InvoiceTemplatePaymentSetting
            txTemplate={txTemplate}
            setTxTemplate={setTxTemplate}
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

