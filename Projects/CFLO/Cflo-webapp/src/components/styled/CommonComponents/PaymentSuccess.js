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

export default function PaymentSuccess(props) {
  const DateNow = new Date()
  const classes = useStyles();
  const history = useHistory();
  const { txId, appId, paymentpurpose, relatedinfo } = useParams();
  const { } = props;
  const { root, mainContSuccess, trs, ths, tds } = classes;

  const location = useLocation();

  let payment_intent, payment_intent_client_secret, redirect_status

  const [intentData, setIntentData] = useState(null)

  console.log(relatedinfo)

  useEffect(() => {
    if (paymentpurpose === 'stripePayBackTx') {
      
      const intentId = new URLSearchParams(location.search).get('payment_intent')
      retrievePaymentIntentTx({ intentId, stripeAccount: relatedinfo })
        .then((data) => {

          console.log(data)
          setIntentData(data)

          let achBank

          if (data?.payment_method_types[0] === 'us_bank_account') {
            achBank = true
          } else {
            achBank = false
          }

          let status       

          if( data?.status === 'canceled' || data?.status === 'requires_payment_method' || data?.status === 'requires_confirmation' || data?.status === 'requires_action' || data?.status === 'requires_capture' ){
              status = 'Failed'
          }else if(data?.status === 'processing'){
              status = 'Processing'
          }else if(data?.status === 'succeeded'){
              status = 'Paid'
          }


          txPaymentUpdate({
            transactionId: txId,
            paymentType: 'Marketplace',
            paymentProvider: 'Stripe',
            achBankPaymentAccount: achBank,
            intentId: data?.id,
            client_secret: data?.client_secret,
            amount : data?.amount/100,
            status
          })
            .then((data) => {
              console.log(data)
              const path = `/`;
              history.push(path);
            })
            .catch((err) => {
              console.log(err);
            })
        })
        .catch((err) => {
          console.log(err)
        })
    } else if (paymentpurpose === 'brandApp') {
      const intentId = new URLSearchParams(location.search).get('payment_intent')
      retrievePaymentIntentPlatform({ intentId })
        .then((data) => {
          console.log(data)
          setIntentData(data)

          let achBank

          if (data?.payment_method_types[0] === 'us_bank_account') {
            achBank = true
          } else {
            achBank = false
          }

          makeTxPaid({
            transactionId: txId,
            appId: relatedinfo,
            paymentType: 'Platform',
            paymentProvider: 'Stripe',
            achBankPaymentAccount: achBank,
            intentId: data?.id,
            client_secret: data?.client_secret,
          })
            .then((data) => {
              console.log(data)
              const path = `/brandApp/${relatedinfo}/view`;
              history.push(path);
            })
            .catch((err) => {
              console.log(err);
            })
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }, [relatedinfo])




  return (
    <div className={root} >
      <div className={mainContSuccess} >

        {(paymentpurpose === 'brandApp' || paymentpurpose === 'stripePayBackTx') && intentData ? (<>

          {intentData?.status === 'requires_payment_method' ||
            intentData?.status === 'requires_confirmation' ||
            intentData?.status === 'requires_action' ||
            intentData?.status === 'requires_capture' ?
            (<>
              <Typography style={{ color: 'red', fontSize: '30px' }} >Payment Failed</Typography>
              <CancelIcon style={{ color: 'red', fontSize: '70px' }} />
            </>)
            : null}

          {intentData?.status === 'canceled' ?
            (<>
              <Typography style={{ color: '#F4C91A', fontSize: '30px' }} >Payment Canceled</Typography>
              <ErrorIcon style={{ color: '#F4C91A', fontSize: '70px' }} />
            </>)
            : null}

          {intentData?.status === 'processing' ?
            (<>
              <Typography style={{ color: '#6FBFCC', fontSize: '30px' }} >Payment Under Processing</Typography>
              <WatchLaterIcon style={{ color: '#6FBFCC', fontSize: '70px' }} />
            </>)
            : null}

          {intentData?.status === 'succeeded' ?
            (<>
              <Typography style={{ color: 'green', fontSize: '30px' }} >Payment Successful</Typography>
              <CheckCircleIcon style={{ color: 'green', fontSize: '70px' }} />
            </>)
            : null}


          <table style={{ width: "250px" }} >
            <tr className={trs} >
              <th className={ths} >Amount Paid</th>
              <td className={tds} >{intentData?.amount / 100} $</td>
            </tr>
            <tr className={trs} >
              <th className={ths} >Payment Method</th>
              <td className={tds} >{intentData?.payment_method_types[0]}</td>
            </tr>
            <tr className={trs} >
              <th className={ths} >isSuccessful</th>
              {intentData?.status === 'succeeded' ?
                (<>
                  <td className={tds} ><DoneIcon style={{ color: 'green' }} /></td>
                </>) :
                (<>
                  <td className={tds} ><CloseIcon style={{ color: 'red' }} /></td>
                </>)}
            </tr>
            <tr className={trs} >
              <th className={ths} >Payment Status</th>
              <td className={tds} >{intentData?.status}</td>
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
