import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {useHistory} from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import cx from 'clsx';
import DwollaSvg from './dwolla.svg';

import Api from '../../../helpers/Api';
import configObject from '../../../config/index';

import CustomerTypeDialog from './customer.type.dialog';

const useStyles = makeStyles((theme) => ({

  btnStyle: {
    margin: '1rem',
  },


  paperStyle: {
    maxWidth: '18rem',
    padding: '0.5rem 1rem',
  },

  paraText: {
    fontSize: '0.9rem',
    fontWeight: '400',
    marginTop: '0.5rem',
  },

  titleText: {
    fontSize: '1.3rem',
    fontWeight: '600',
    color: '#424242',
  },

  imgStyle: {
    height: '2.4rem',
    width: '11.36rem',
    marginTop: '1rem',
    alignSelf: 'center',
  },


  opacity: {
    opacity: '0.5',
  },

  row: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
  },

  col: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },

}));

export default function DwollaIavLink(props) {
  const {
    wallet,
    txId,
    paymentPage
  } = props;


  const walletId = wallet?._id;
  const dwollaCustomerId = wallet?.dwollaCustomer

  const auth = useSelector((state) => state.auth);
  const {
    user,
  } = auth;


  const attachDwollaIav = async ()=>{
    if (walletId) {
      const token = localStorage.getItem('token');
      const data = {
        walletId, 
        dwollaCustomerId,
        client: 'web',
        user: user?._id,
        token,
        action: 'iav',
        txId : txId,
        paymentPage : paymentPage
      };
      const dwollaWebapp = configObject.dwollaWebapp;
      const searchParams = new URLSearchParams(data);
      const url = dwollaWebapp +'iav/?'+ searchParams;
      if (url) {
        window.location.replace(url);
      }
    }
  };


  return (

    <ButtonBase onClick={()=>{
      attachDwollaIav();
    }}>
      {props.children}
    </ButtonBase>
  );
}
