import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import {useHistory} from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import cx from 'clsx';
import configObject from '../../../../config';
import ProductCard from './product.card.view';

import AccountCard from '../../BillingAccount/BillingAccountCard';
import Api from '../../../../helpers/Api';
import arrayToReducer from '../../../../helpers/arrayToReducer';
import {Divider} from '@material-ui/core';
import BillingAddressForm from '../../BillingAccount/BillingAddressForm';
import StripePayment from './stripe.subscription.payment';
import PoweredByStripe from '../../stripe/powered-by-stripe.png';
import {useMediaQuery} from '@material-ui/core';


const useStyles = makeStyles((theme) => ({

  row: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },

  root: {

    display: 'flex',
    flexDirection: 'row',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
    },
  },


  sidebar: {
    width: '33vw',
    height: '100vh',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '4vw',

  },

  right: {
    width: '66vw',
    height: '100vh',
    paddingBottom: '4vw',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },


  col: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  mainText: {
    fontSize: '2.2rem',
    fontWeight: '600',
    textAlign: 'center',
    color: '#424242',
    marginTop: '4rem',
  },

  mainTextBlock: {
    margin: '2rem 0',
  },

  imgStyle: {
    height: '20vh',
    width: '30vw',
    maxHeight: '13rem',
    maxWidth: '30rem',
    [theme.breakpoints.down('md')]: {
      height: '27vh',
      width: '55vw',
    },
  },

  divider: {
    margin: '2rem',
  },


}));


export default function HandlePayment(props) {
  const theme = useTheme();
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const [accounts, setAccounts] = useState([]);
  const [edit, setEditMode] = useState(false);
  const {
    user, userProfile, createSubscription,
    subscriptionIds, subscriptionDictionary,
  } = useSelector((state) => state.auth);

  const {
    onSelect, product, setProductEdit,
    account, setAccountEdit,
  } = props;

  console.log(createSubscription,
      subscriptionIds, subscriptionDictionary);

  const {
    row, root, col, mainText, sidebar, right, addNewBtn, divider,
  } = classes;

  const walletId = user?.model==='User'?user?.wallet:userProfile?.wallet;
  const isSmall = useMediaQuery('(max-width:1280px)');


  // useEffect(() => {


  //     if(createSubscription){}else{
  //         Api.post('stripe/subscription/create',{
  //             priceId: product.priceStripeId,
  //             accountId: account._id
  //         }).then(res=>{
  //             const data = res.data;
  //             const {
  //                 newDict, idArr
  //             } = arrayToReducer([data])

  //             var newArrSet = new Set([...idArr, ...subscriptionIds])
  //             var newArr = Array.from(newArrSet)

  //             dispatch({
  //                 type:'AddAuth',
  //                 payload:{
  //                     createSubscription:data
  //                 }
  //             })
  //         })
  //     }

  // }, [])


  return (

    <div className={root}>

      {isSmall?<>

        <Typography className={mainText}>
                        Payment
        </Typography>


        <StripePayment
          product={product}
          account={account}
        />

        <Divider className={divider} />

        <ProductCard
          product={product}
          onSelect={()=>{
            setProductEdit();
          }}
        />

        <Divider className={divider} />

        <AccountCard
          key={account?._id}
          account={account}
          onSelect={()=>{
            setAccountEdit();
          }}
        />

      </>:<>
        <div className={sidebar}>

          <ProductCard
            product={product}
            onSelect={()=>{
              setProductEdit();
            }}
          />

          <AccountCard
            key={account?._id}
            account={account}
            onSelect={()=>{
              setAccountEdit();
            }}
          />

        </div>

        <Divider
          orientation={'vertical'}
        />

        <div className={right}>

          <Typography className={mainText}>
                        Payment
          </Typography>


          <StripePayment
            product={product}
            account={account}
          />


          <img
            key={'stripe-secured'}
            className={classes.imgStyle}
            src={PoweredByStripe}
          />

        </div>
      </>}

    </div>

  );
}
