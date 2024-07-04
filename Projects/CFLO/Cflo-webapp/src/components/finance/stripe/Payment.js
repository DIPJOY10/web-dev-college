import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Api from '../../helpers/Api';

import {
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useHistory,
} from 'react-router-dom';


const useStyles = makeStyles({
  root: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },

  localCardStyle: {
    flex: 1,
    width: '80%',
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 20,
    paddingBottom: 15,
    height: 60,
    maxWidth: 400,
    backgroundColor: '#fafafa',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },

});

export default function OutlinedCard() {
  const classes = useStyles();
  const {root, localCardStyle} = classes;
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState('');
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState('');
  const stripe = useStripe();
  const elements = useElements();
  const {checkoutId} = useParams();

 
  useEffect(() => {
    Api.post('stripe/createPaymentIntent', {
      checkoutId,
    }).then((paymentIntent)=>{
      setClientSecret(paymentIntent.clientSecret);
    });
  }, []);

  const cardStyle = {
    hidePostalCode: true,
    style: {
      base: {
        'color': '#32325d',
        'backgroundColor': '#fafafa',
        'fontWeight': 500,
        'fontFamily': 'Roboto, Open Sans, Segoe UI, sans-serif',
        'fontSmoothing': 'antialiased',
        'fontSize': '20px',
        'height': '55px',
        'width': '300px',
        'margin': '10px',
        'padding': '15px',
        '::placeholder': {
        },
        'borderWidth': '1px',
        'borderColor': '#32325d',
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    },
  };

  const handleChange = async (event) => {
    // Listen for changes in the CardElement
    // and display any errors as the customer types their card details
    setDisabled(event.empty);
    setError(event.error ? event.error.message : '');
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setProcessing(true);
    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });
    console.log(payload.error, ' is the payload error');
    if (payload.error) {
      setError(`Payment failed ${payload.error.message}`);
      setProcessing(false);
    }
    else {
      setError(null);
      setProcessing(false);
      setSucceeded(true);
    }
  };


  return (
    <div className={root}>

      <div className={localCardStyle}>
        <CardElement id="card-element" options={cardStyle} onChange={handleChange} />
      </div>
      <button
        disabled={processing || disabled || succeeded}
        id="submit"
      >
        <span id="button-text">
          {processing ? (
            <div className="spinner" id="spinner"></div>
          ) : (
            'Pay'
          )}
        </span>
      </button>
      {/* Show any error that happens when processing the payment */}
      {error && (
        <div className="card-error" role="alert">
          {error}
        </div>
      )}
      {/* Show a success message upon completion */}
      <p className={succeeded ? 'result-message' : 'result-message hidden'}>
        Payment succeeded, see the result in your
        <a
          href={`https://dashboard.stripe.com/test/payments`}
        >
          {' '}
          Stripe dashboard.
        </a> Refresh the page to pay again.
      </p>

    </div>
  );
}
