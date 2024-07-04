import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useParams, useHistory } from 'react-router-dom';
import {
  getTx,
  createStripePaymentIntentExpense,
  createStripePaymentIntentAccPay,
  checkAvaliablePaymentMethod,
  getAllDwollaBankAccounts,
  makePayment,
  getWallet
} from './api';
import logo from '../../../Assets/LogoText.png'
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CardPaymentBasic from '../stripe/PaymentMethods/CardPaymentBasic';
import config from '../../../config/index'
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Slide from '@material-ui/core/Slide';
import TxInfo from './TxInfo';
import PaymentMethods from './PaymentMethods'
import DwollaBankPayment from './DwollaBankPayment'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import moment from 'moment';
import CreateReceiveOnlyCustomer from './CreateReceiveOnlyCustomer';
import AddReceiveOnlyFundingSoutce from './AddReceiveOnlyFundingSoutce';

const useStyles = makeStyles((theme) => ({
  txPayCont: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#d9dee3',
    paddingTop: "70px",
    paddingBottom: "70px",
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
    },

  },
  paymentCont: {
    width: "350px",
    minHeight: "320px",
    boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px",
    backgroundColor: "white",
    borderRadius: "10px",
    marginLeft: "25px",
    padding: "30px",
    [theme.breakpoints.down('md')]: {
      marginLeft: "0px",
      marginTop: "30px"
    },
    [theme.breakpoints.down('sm')]: {
      width: "330px"
    },
  },
  logoCont: {
    maxWidth: "100vw",
    boxShadow: "rgba(17, 17, 26, 0.1) 0px 1px 0px",
  },
  logosty: {
    width: "auto",
    height: "50px",
    marginTop: "10px",
    marginLeft: "15px"
  },
  spaceBetween: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    position: "relative",
    left: "-20px",
    top: "-10px"
  },
}));


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function PayBackTx(props) {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { txId } = useParams();

  const {
    txPayCont,
    spaceBetween,
    paymentCont,
    logosty,
    logoCont,
  } = classes;

  const [tx, setTx] = useState({});
  const [clientSecret, setClientSecret] = useState('');
  const [dwollaAccUrl, setDwollaAccUrl] = useState("");
  const [stripeAccId, setStripeAccId] = useState("");
  const [dwollaAccOpen, setDwollaAccOpen] = useState(false)
  const [stripeCardOpen, setStripeCardOpen] = useState(false)
  const [personalDwollaBankAccounts, setPersonalDwollaBankAccounts] = useState([])
  const [selectedDwollaAcc, setSelectedDwollaAcc] = useState(null)
  const [dwollaFailMsg, setDwollaFailMsg] = useState("")
  const [palView, setPalView] = useState("PalShow")


  const [stripePromise, setStripePromise] = useState(() => loadStripe(config.stripePk, {
    stripeAccount: tx?.type === "Payment" || tx?.type === "Bill" ? tx?.secondPartyWallet?.stripeConnectAccountId : tx?.firstPartyWallet?.stripeConnectAccountId
  }))


  var return_url = `${config.BASE_URL}stripePayBackTx/paid/success/${stripeAccId}/${txId}`;

  useEffect(() => {
    getTx(txId)
      .then((data) => {

        console.log("txData", data)

        checkAvaliablePaymentMethod({
          dwollaAccUrl: data?.dwollaConfig?.receiverDwollaBankAcc,
          stripeAccId: data?.stripeConfig?.receiverStripeAcc,
          firstPartyWalletId: (data?.type === "Payment" || data?.type === "Bill") ? data?.secondPartyWallet?._id : data?.firstPartyWallet?._id,
          txId: data?._id
        })
          .then((availableMethods) => {

            console.log("availableMethods", availableMethods)

            setDwollaAccUrl(availableMethods?.newDwolla);
            setStripeAccId(availableMethods?.newStripe);


          })
          .catch((err) => {
            console.log(err);
          })
        setTx(data)

        const stripeAcc = data?.type === "Payment" || data?.type === "Bill" ? data?.secondPartyWallet?.stripeConnectAccountId : data?.firstPartyWallet?.stripeConnectAccountId

        const newLoadStripe = loadStripe(config.stripePk, {
          stripeAccount: stripeAcc
        });
        setStripePromise(newLoadStripe)

      })
      .catch((error) => {
        console.log(error);
      })
  }, [txId])






  const onBack = () => {
    setDwollaAccOpen(false);
    setStripeCardOpen(false);
  }

  const OnStripeCardSelect = async () => {
    setStripeCardOpen(true)

    let am
    const d2 = moment(tx?.dueDate).format("YYYY-M-D")
    const d1 = moment().format("YYYY-M-D")

    if (d2 > d1) {
      am = tx?.finalAmount || 0
    } else {
      am = tx?.finalAmount || 0 + tx?.lateFeeAmount
    }

    const totalAm = am + am * (3 / 100)
    const obj = {
      amount: totalAm,
      currency: 'usd',
      stripeAccount: stripeAccId
    }
    await createStripePaymentIntentExpense(obj)
      .then((data) => {
        console.log(data);
        setClientSecret(data.client_secret);
      })
      .catch(err => {
        console.log(err);
      })
  }

  const OnStripeAccountSelect = async () => {

    let am
    const d2 = moment(tx?.dueDate).format("YYYY-M-D")
    const d1 = moment().format("YYYY-M-D")

    if (d2 > d1) {
      am = tx?.finalAmount || 0
    } else {
      am = tx?.finalAmount || 0 + tx?.lateFeeAmount
    }

    const totalAm = am + am * (3 / 100)
    const obj = {
      amount: totalAm,
      currency: 'usd',
      stripeAccount: tx?.type === "Payment" || tx?.type === "Bill" ? tx?.secondPartyWallet?.stripeConnectAccountId : tx?.firstPartyWallet?.stripeConnectAccountId,
      email: tx?.type === "Payment" || tx?.type === "Bill" ? tx?.firstParty?.parent?.email : tx?.secondParty?.parent?.email,
      name: tx?.type === "Payment" || tx?.type === "Bill" ? tx?.firstParty?.parent?.displayName : tx?.secondParty?.parent?.displayName,
      address: tx?.type === "Payment" || tx?.type === "Bill" ? tx?.firstParty?.parent?.address : tx?.secondParty?.parent?.address,
      secondPartyWalletId: tx?.type === "Payment" || tx?.type === "Bill" ? tx?.firstPartyWallet?._id : tx?.secondPartyWallet?._id,
      firstPartyWalletId: tx?.type === "Payment" || tx?.type === "Bill" ? tx?.secondParty?._id : tx?.firstParty?._id,
      stripeCustomerIdCFlo: tx?.type === "Payment" || tx?.type === "Bill" ? tx?.firstPartyWallet?.stripeCustomerId : tx?.secondPartyWallet?.stripeCustomerId,
      txId: txId
    }
    await createStripePaymentIntentAccPay(obj)
      .then((data) => {
        console.log(data);
        setClientSecret(data.client_secret);
      })
      .catch(err => {
        console.log(err);
      })
  }

  const OnDwollaAccountSelect = async (data) => {
    setDwollaAccOpen(true);
    await getAllDwollaBankAccounts({
      userWalletId: user?.wallet
    })
      .then((data) => {
        setPersonalDwollaBankAccounts(data.accounts)
        setSelectedDwollaAcc(data?.defaultDwollaAcc)
      })
      .catch(err => {
        console.log(err)
      })
  }

  const onBankAccountSelect = (data) => {
    setSelectedDwollaAcc(data)
  }


  const pay = async () => {
    let am
    const d2 = moment(tx?.dueDate).format("YYYY-M-D")
    const d1 = moment().format("YYYY-M-D")

    if (d2 > d1) {
      am = tx?.finalAmount || 0
    } else {
      am = tx?.finalAmount || 0 + tx?.lateFeeAmount
    }

    await makePayment({
      amount: am,
      receiverUrl: dwollaAccUrl,
      senderUrl: selectedDwollaAcc?.url,
      tx
    })
      .then((data) => {
        if (data.status === 200) {
          const goUrl = `/invoice/payment/status/${data?.data}/${txId}`
          history.push(goUrl);
        } else {
          setDwollaFailMsg(data.data.message)
          setOpen(true);
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const appearance = {
    theme: 'stripe',
  };

  const options = {
    clientSecret,
    appearance,
  }

  console.log(tx)

  return (
    <>
      <div className={logoCont} >
        <img src={logo} alt={"logo"} className={logosty} />
      </div>
      <div className={txPayCont} >

        {tx?.processed ? (<>

          {tx?.status === "Paid" ? (<div>
            {tx.type} is already paid
          </div>) : (tx.status === "Processing" ? (<>
            {tx.type} is under Processing
          </>) : <>
            <TxInfo myTx={tx} />

            <>{
              (tx && tx?.secondParty?.parentModelName === "Pal" && palView === "PalShow" ) ? (<>
                {
                  !tx?.secondPartyWallet?.dwollaCustomer ? 
                  (<div className={paymentCont} >
                    <CreateReceiveOnlyCustomer
                      tx={tx}
                      setTx={setTx}
                    />
                  </div>) : 
                  (<div className={paymentCont} >
                    <AddReceiveOnlyFundingSoutce 
                      tx={tx}
                      setTx={setTx}
                      setPalView={setPalView}
                      setDwollaAccUrl={setDwollaAccUrl}
                    />
                  </div>)
                }
              </>) : (<>
                <div className={paymentCont} >
                  {!stripeCardOpen && !dwollaAccOpen ?
                    <PaymentMethods
                      tx={tx}
                      OnStripeAccountSelect={OnStripeAccountSelect}
                      stripeAccId={stripeAccId}
                      OnDwollaAccountSelect={OnDwollaAccountSelect}
                      OnStripeCardSelect={OnStripeCardSelect}
                      dwollaAccUrl={dwollaAccUrl}
                    />
                    : (stripeCardOpen && clientSecret !== '' ?
                      <div>
                        <div className={spaceBetween} >
                          <ArrowBackIcon onClick={() => onBack()} style={{ cursor: "pointer" }} />
                          <div></div>
                        </div>
                        <Elements stripe={stripePromise} options={options}  >
                          <CardPaymentBasic
                            clientSecret={clientSecret}
                            btnText={'Lets get Started'}
                            return_url={return_url}
                          />
                        </Elements>
                      </div>
                      : (dwollaAccOpen ?
                        <DwollaBankPayment
                          onBack={onBack}
                          selectedDwollaAcc={selectedDwollaAcc}
                          personalDwollaBankAccounts={personalDwollaBankAccounts}
                          onBankAccountSelect={onBankAccountSelect}
                          pay={pay}
                          userprofile={user?.profile}
                          walletId={user?.wallet}
                          user={user}
                          tx={tx}
                          setPersonalDwollaBankAccounts={setPersonalDwollaBankAccounts}
                        />
                        : null
                      )
                    )}
                </div>


              </>)
            }</>



            <Dialog
              open={open}
              TransitionComponent={Transition}
              keepMounted
              onClose={handleClose}
              aria-labelledby="alert-dialog-slide-title"
              aria-describedby="alert-dialog-slide-description"
            >
              <DialogTitle id="alert-dialog-slide-title" style={{ color: 'red' }} >{dwollaFailMsg}</DialogTitle>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  ok
                </Button>
              </DialogActions>
            </Dialog>

          </>)}
        </>) : (<div>{!tx?.processed && <>{tx.type} is not submitted</>}</div>)}
      </div>
    </>
  );
}
