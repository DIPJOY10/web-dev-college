import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {useHistory} from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import cx from 'clsx';


const useStyles = makeStyles((theme) => ({

  row: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },

  col: {
    flex: 1,
    display: 'flex',
    height: '100vh',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  mainText: {
    fontSize: '3rem',
    fontWeight: '600',
    textAlign: 'center',
  },

  mainTextBlock: {
    marginTop: '20vh',
    marginBottom: '8vh',
  },

}));


export default function StripeConnectHandle(props) {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const {
    stripeWalletId,
  } = useSelector((state) => state.wallet);
  const {
    onSelect,
  } = props;

  const {
    row, col, mainText, mainTextBlock,
  } = classes;

  const path = '/admin/' + stripeWalletId +'/'+'payment_setup';

  useEffect(() => {
    history.push(path);
  }, []);

  return (
    <div className={col}>
      <div className={cx(row, mainTextBlock)}>
        <Typography className={mainText}>
                    Stripe Authentication
        </Typography>
      </div>
      <div className={row}>

      </div>
    </div>

  );
}
