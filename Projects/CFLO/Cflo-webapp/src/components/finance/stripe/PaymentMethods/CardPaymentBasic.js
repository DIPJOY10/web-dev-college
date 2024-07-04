import React, { useEffect, useState } from "react";
import CircularProgress from '@material-ui/core/CircularProgress';
import {makeStyles} from '@material-ui/core/styles';

import {
  PaymentElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";

const useStyles = makeStyles((theme) =>({
  payMentForm : {

  } ,
 SubmitBtn : {
   width : '100%',
   paddingTop : '5px',
   paddingBottom : '5px',
   backgroundColor : theme.palette.primary.main,
   borderStyle : 'none',
   color : 'white',
   fontSize : '18px',
   marginTop : '5px',
   cursor: "pointer",
 }
}))

export default function CardPaymentBasic(props) {
  const stripe = useStripe();
  const elements = useElements();
  const { clientSecret, btnText, return_url } = props;

  const classes = useStyles();
  const {SubmitBtn, payMentForm } = classes;

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!stripe) { 
      return;
    }
    if (!clientSecret) {
      return;
    }
    console.log(clientSecret)
    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      console.log(paymentIntent);
      switch (paymentIntent?.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("");
          // setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }
    setIsLoading(true);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url
      },
    });
    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error) {
        if (error.type === "card_error" || error.type === "validation_error") {
            setMessage(error.message);
          } else {
            setMessage("An unexpected error occured.");
          }
    }else{
        setMessage(null)
    }
    setIsLoading(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}  className={payMentForm} >
      <PaymentElement id="payment-element" />
      <button disabled={isLoading || !stripe || !elements} className={SubmitBtn} id="submit">
        <span id="button-text">
          {isLoading ? <div className="spinner" id="spinner">  <CircularProgress /> </div> : btnText}
        </span>
      </button>

      {message && <div id="payment-message">{message}</div>}
    </form>
  );
}