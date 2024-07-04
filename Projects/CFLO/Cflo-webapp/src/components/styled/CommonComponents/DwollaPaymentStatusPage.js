import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory, useParams } from "react-router-dom";
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import DoneIcon from '@material-ui/icons/Done';
import { makeTxPaid, retrievePaymentIntentPlatform } from '../../brandApp/feePayment/api';
import { useLocation } from "react-router-dom";
import { retrievePaymentIntentTx, txPaymentUpdate } from '../../finance/payBackTx/api';
import CancelIcon from '@material-ui/icons/Cancel';
import ErrorIcon from '@material-ui/icons/Error';
import WatchLaterIcon from '@material-ui/icons/WatchLater';
import CloseIcon from '@material-ui/icons/Close';
import { getDwollaTx, updateTx } from '../../finance/payBackTx/api'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  mainContSuccess: {
    boxShadow: "rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px",
    width: "50%",
    height: "60%",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "column",
  },
  trs: {

  },
  ths: {
    textAlign: "right",
    paddingRight: "50px",
    paddingTop: "10px",
    paddingBottom: "10px",
  },
  tds: {
    paddingTop: "10px",
    paddingBottom: "10px",
  }
}));

export default function DwollaPaymentStatusPage(props) {
  const DateNow = new Date()
  const classes = useStyles();
  const history = useHistory();
  const { dwollaTxId, txId } = useParams();
  const { } = props;
  const { root, mainContSuccess, trs, ths, tds } = classes;

  const location = useLocation();

  const [txDwolla, setTxDwolla] = useState()

  useEffect(() => {

    getDwollaTx({dwollaTxId})
    .then((data) => {
      console.log(data)
      console.log(data.status);
      setTxDwolla(data?.body)

      let status

      if(data?.body?.status === "failed" || data?.body?.status === "cancelled"){
           status = "Failed"
      }else if(data?.body?.status === "pending"){
           status = "Processing"
      }else if(data?.body?.status === "processed") {
           status = "Paid"
      }
      updateTx({
        _id: txId,
        paymentType: 'Marketplace',
        paymentProvider: 'Dwolla',
        achBankPaymentAccount: true,
        dwollaTxId,
        status
      })
      .then((data) => {
         console.log(data)
         const path = `/`;
         history.push(path);
      })
      .catch((err) => {
         console.log(err)
      })
    })
    .catch((err) => {
      console.log(err);
    })
  }, [])



  return (
    <div className={root} >
      <div className={mainContSuccess} >
        {txDwolla ? (<>
          {txDwolla?.status === 'failed' ?
            (<>
              <Typography style={{ color: 'red', fontSize: '30px' }} >Payment Failed</Typography>
              <CancelIcon style={{ color: 'red', fontSize: '70px' }} />
            </>)
            : null}
          {txDwolla?.status === 'cancelled' ?
            (<>
              <Typography style={{ color: '#F4C91A', fontSize: '30px' }} >Payment Canceled</Typography>
              <ErrorIcon style={{ color: '#F4C91A', fontSize: '70px' }} />
            </>)
            : null}
          {txDwolla?.status === 'pending' ?
            (<>
              <Typography style={{ color: '#6FBFCC', fontSize: '30px' }} >Payment Under Processing</Typography>
              <WatchLaterIcon style={{ color: '#6FBFCC', fontSize: '70px' }} />
            </>)
            : null}
          {txDwolla?.status === 'processed' ?
            (<>
              <Typography style={{ color: 'green', fontSize: '30px' }} >Payment Successful</Typography>
              <CheckCircleIcon style={{ color: 'green', fontSize: '70px' }} />
            </>)
            : null}
          <table style={{ width: "250px" }} >
            <tr className={trs} >
              <th className={ths} >Amount Paid</th>
              <td className={tds} >{txDwolla?.amount?.value} $</td>
            </tr>
            <tr className={trs} >
              <th className={ths} >Payment Method</th>
              <td className={tds} >Dwolla ACH</td>
            </tr>
            <tr className={trs} >
              <th className={ths} >isSuccessful</th>
              {txDwolla?.status === 'processed' ?
                (<>
                  <td className={tds} ><DoneIcon style={{ color: 'green' }} /></td>
                </>) :
                (<>
                  <td className={tds} ><CloseIcon style={{ color: 'red' }} /></td>
                </>)}
            </tr>
            <tr className={trs} >
              <th className={ths} >Payment Status</th>
              <td className={tds} >{txDwolla?.status}</td>
            </tr>
            <tr className={trs} >
              <th className={ths} >Date</th>
              <td className={tds} >{DateNow.getMonth() + 1}/{DateNow.getDate()}/{DateNow.getFullYear()}</td>
            </tr>
          </table>
        </>) : null}
      </div>
    </div>
  );
}
