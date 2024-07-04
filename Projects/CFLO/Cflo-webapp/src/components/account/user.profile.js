import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {useHistory} from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import cx from 'clsx';
import {useFindWallet, useGetWallet} from '../finance/hooks';
import ProfileBasic from '../styled/Profile/basic';
import ConnectStripeBtn from '../finance/stripe/connect.stripe.btn';

const useStyles = makeStyles((theme) => ({
  root: {},

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

export default function S(props) {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const walletId = useFindWallet();
  const {wallet: walletHook} = useGetWallet(walletId);

  const {root, row, col} = classes;

  const [wallet, setWallet] = useState(null);

  return (
    <div className={root}>
      <h1>USER PROFILE PAGE</h1>{' '}
    </div>
  );
}
