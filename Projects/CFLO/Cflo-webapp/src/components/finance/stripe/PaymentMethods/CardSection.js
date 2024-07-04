import React from 'react';
import {CardElement} from '@stripe/react-stripe-js';
import {makeStyles} from '@material-ui/core/styles';

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

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      'color': '#32325d',
      'fontFamily': '"Helvetica Neue", Helvetica, sans-serif',
      'fontSmoothing': 'antialiased',
      'fontSize': '16px',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
};

function CardSection() {
  const classes = useStyles();
  const {root, localCardStyle} = classes;
  return (
    <div className={root}>
      <div className={localCardStyle}>
        <CardElement options={CARD_ELEMENT_OPTIONS} />
      </div>
    </div>
  );
};

export default CardSection;
