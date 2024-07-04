import React, {useState, useEffect} from 'react';
import {
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import {makeStyles} from '@material-ui/core/styles';
import {ButtonBase} from '@material-ui/core';
import {useSelector, useDispatch} from 'react-redux';
import Api from '../../../../helpers/Api';
import arrayToReducer from '../../../../helpers/arrayToReducer';
import {useHistory} from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';

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
    width: '90%',
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


export default function SubscriptionPayment(props) {
  const classes = useStyles();
  const {
    product, account,
  } = props;
  const {
    root, localCardStyle, btnStyle,
  } = classes;
  const {
    createSubscription, subscriptionIds, subscriptionDictionary,
  } = useSelector((state) => state.auth);
  const history = useHistory();
  const dispatch = useDispatch();
  const [, setLoading] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState('');
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState('');
  const stripe = useStripe();
  const elements = useElements();


  const handleChange = async (event) => {
    // Listen for changes in the CardElement
    // and display any errors as the customer types their card details
    setDisabled(event.empty);
    setError(event.error ? event.error.message : '');
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setProcessing(true);

    const res = await Api.post('stripe/subscription/create', {
      priceId: product.priceStripeId,
      accountId: account._id,
    });
    const subscription = res.data;


    const payload = await stripe.confirmCardPayment(subscription.stripeClientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (payload.error) {
      setError(`Payment failed ${payload.error.message}`);
      setProcessing(false);
    }
    else {
      setError(null);

      setSucceeded(true);

      const newData = await Api.post('stripe/subscription/defaultPM', {
        subscriptionId: subscription._id,
      });

      const {
        newDict, idArr,
      } = arrayToReducer([newData]);

      const newArrSet = new Set([...idArr, ...subscriptionIds]);
      const newArr = Array.from(newArrSet);

      dispatch({
        type: 'AddAuth',
        payload: {
          subscriptionIds: newArr,
          subscriptionDictionary: {
            ...subscriptionDictionary,
            ...newDict,
          },
        },
      });
      setProcessing(false);
      history.push('/');
    }
  };


  return (
    <form className={root} id="payment-form" onSubmit={handleSubmit}>
      <div className={localCardStyle}>
        <CardElement id="card-element"
          options={{
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
          }}
          onChange={handleChange}
        />
      </div>

      <ButtonBase
        disabled={processing || disabled || succeeded}
        id="submit"
        className={btnStyle}
        onClick={handleSubmit}
      >
        <span id="button-text">

          {processing ? (
            <CircularProgress />
          ) : (
            'Subscribe Now'
          )}
        </span>
      </ButtonBase>
      {/* Show any error that happens when processing the payment */}

    </form>
  );
}
