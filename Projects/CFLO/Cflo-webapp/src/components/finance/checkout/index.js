import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import Api from '../../../helpers/Api';
import {makeStyles} from '@material-ui/core/styles';
import {useLocation} from 'react-router-dom';

import PlatformCheckout from './subscription/index';
import {useParams} from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flex: 1,
    width: '100vw',
    flexDirection: 'row',
  },

  leftHalf: {
    flex: 1,
    width: '50vw',
    minHeight: '100vh',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.palette.primary.main,
  },

  rightHalf: {
    flex: 1,
    display: 'flex',
    width: '50vw',
    minHeight: '100vh',
    backgroundColor: 'white',
    flexDirection: 'column',
  },

  paper: {
    flex: 1,
    maxWidth: 400,
    alignSelf: 'center',
    margin: `2rem auto`,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: '3rem',
    [theme.breakpoints.down('xs')]: {
      marginLeft: '1rem',
      marginRight: '1rem',
    },
  },
}));

const CheckoutForm = () => {
  const {user, userProfile} = useSelector((state) => state.auth);
  const [checkout, setCheckout] = useState(false);
  const [activeStep, setActiveStep] = React.useState(0);
  const classes = useStyles();
  const dispatch = useDispatch();
  const {checkoutId} = useParams();
  const {root, leftHalf, rightHalf} = classes;
  let CheckoutPage = null;

  const location = useLocation();
  // console.log (location,' is the location');
  const s = useLocation().search;
  const tokenUrl = new URLSearchParams(s).get('token');

  let profile = user;
  if (user?._id) {
    profile = user?.model === 'User' ? user : userProfile;
  }

  useEffect(() => {
    if (profile && profile._id) {
      Api.post('wallet/get', {
        wallet: profile.wallet,
      }).then((wallet) => {
        dispatch({
          type: 'AddWallet',
          payload: {
            userWallet: wallet,
          },
        });
      });
    }
  }, [user]);

  useEffect(() => {
    Api.post('checkout/get', {
      checkoutId,
    }).then((checkout) => {
      // console.log(checkout,' is the checkout')
      setCheckout(checkout);
      dispatch({
        type: 'AddWallet',
        payload: {checkout},
      });
    });
  }, []);

  // console.log(checkout,' is the checkout');
  if (checkout && checkout._id && checkout.type) {
    // console.log(' inside if ',checkout)
    switch (checkout.type) {
      case 'Platform':
        CheckoutPage = <PlatformCheckout />;
        break;

      default:
        break;
    }
  }

  return CheckoutPage;
};

export default CheckoutForm;
