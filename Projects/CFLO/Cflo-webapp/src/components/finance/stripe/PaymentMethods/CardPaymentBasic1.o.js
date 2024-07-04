import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Api from '../../../../helpers/Api';
import Button from '@material-ui/core/Button';
import {ButtonBase} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';




import {
  CardElement,
  useStripe,
  useElements, 
  PaymentElement
} from '@stripe/react-stripe-js';

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
    width: '90%',
    maxHeight: '3rem',
    minWidth: '32rem',
    maxWidth: '32rem',
    margin: '0.7rem',
    padding: '0.8rem 0.5rem',
    backgroundColor: '#fafafa',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },

  btnStyle: {
    flex: 1,
    width: '320px',
    maxHeight: '3rem',
    minWidth: '32rem',
    maxWidth: '32rem',
    margin: '0.7rem',
    fontSize: '1.2rem',
    padding: '0.5rem',
    color: 'white',
    fontWeight: '500',
    backgroundColor: '#2979ff',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },

});

export default function CardPaymentBasic({
  clientSecret, btnText, onSuccess,
}) {
  const classes = useStyles();
  const {root, localCardStyle, btnStyle} = classes;

  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState('');
  const [disabled, setDisabled] = useState(true);

  const stripe = useStripe();
  const elements = useElements();


  const cardStyle = {
    hidePostalCode: true,
    style: {
      base: {
        'color': '#616161',
        'fontFamily': 'Arial, sans-serif',
        'fontSmoothing': 'antialiased',
        'fontSize': '20px',
        'height': '40px',
        'padding': '8px',
        '::placeholder': {
          color: '#9e9e9e',
        },
        'backgroundColor': '#fafafa',
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
        card: elements.getElement(PaymentElement),
      },
    });

    if (payload.error) {
      setError(`Payment failed ${payload.error.message}`);
      setProcessing(false);
    }
    else {
      setError(null);
      setProcessing(false);
      setSucceeded(true);
      if (onSuccess) {
        onSuccess();
      }
    }

    
  };




  return (
    <div className={root}>
    
    <form>
      <PaymentElement onChange={handleChange} />
    </form>

      {error && (
        <div className="card-error" role="alert">
          {error}
        </div>
      )}
    </div>
  );
}
