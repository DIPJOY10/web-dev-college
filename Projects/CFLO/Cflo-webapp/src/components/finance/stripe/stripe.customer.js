import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import cx from 'clsx';
import ConnectStripeSVG from './ConnectWithStripe.svg';
import Link from '@material-ui/core/Link';
import Api from '../../../helpers/Api';
import stripeText from '../../../Assets/stripeText.png'
import stripeLogo from '../../../Assets/stripeLogo.png'
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';

const useStyles = makeStyles((theme) => ({

  dwollaMainConst: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: "20px",
    paddingTop: "20px"
  },

  paperStyle: {
    width: '95%',
    padding: '0.5rem 1rem',
    paddingBottom: '20px',
    border: "1px solid #989898",
    paddingTop: "20px"
  },

  dwollaHeader: {
    width: "95%",
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },


  btnStyle: {
    padding: "5px 10px",
    backgroundColor: theme.palette.primary.main,
    color: "white",
    fontSize: "18px",
    borderRadius: "5px"
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
    height: "35px",
    width: "auto",
  },

  img2Style: {
    height: "30px",
    width: "auto",
  },

  img3Style: {
    height: "35px",
    width: "auto",
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

export default function StripeCustomer(props) {
  const {
    wallet, setWallet,
  } = props;
  const [loading, setLoading] = useState(false);
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const walletId = wallet?._id;
  const {
    wallet: walletReducer,
  } = useSelector((state) => state);


  const {
    dwollaMainConst, dwollaHeader, img3Style,
    imgStyle, btnStyle, opacity, img2Style,
    row, col, paperStyle, paraText, titleText,
  } = classes;

  const createConnectAccount = async () => {
    if (walletId) {
      setLoading(true);
      dispatch({
        type: 'AddWallet',
        payload: {
          connectWalletId: walletId,
        },
      });
      if (wallet.stripeConnectAccountId) {
        const res = await Api.post('stripe/connect/account/link', {
          walletId: wallet?._id,
        });
        setLoading(false);

        const accountLink = res.data;
        const url = accountLink?.url;
        if (url) {
          window.location.replace(url);
        }
      }
      else {
        const dataRes = await Api.post('stripe/connect/account/create', {
          walletId: wallet?._id,
        });

        setLoading(false);
        const data = dataRes.data;
        const walletRes = data?.wallet;
        const accountLink = data?.accountLink;
        if (data && walletRes && accountLink) {
          const newWallet = {
            ...wallet,
            stripeConnectAccountId: walletRes.stripeConnectAccountId,
          };


          setWallet(newWallet);
          const url = accountLink?.url;
          if (url) {
            window.location.replace(url);
          }
        }
      }
    }
  };

  return (
    <div className={dwollaMainConst} >
      <Paper className={paperStyle}>
        <div className={dwollaHeader} >
          <Typography>
            {/* Stripe Connect 🌍 */}
            <img
              src={stripeLogo}
              className={imgStyle}
            />
            <img
              src={stripeText}
              className={img2Style}
            />
          </Typography>
          <div></div>
          {/* <ButtonBase onClick={() => {
            if (loading) { }
            else {
              dispatch({
                type: 'AddWallet',
                payload: {
                  stripeWalletId: walletId,
                },
              });
              createConnectAccount();
            }
          }} className={btnStyle}>
            <AccountBalanceIcon style={{ fontSize: "30px", marginRight: "5px" }} /> Add Bank Account
          </ButtonBase> */}
        </div>
        <Typography className={titleText}>
          Stripe Connect 🌍
        </Typography>
        <Typography className={paraText}>
          Click here to go to your Stripe profile to manage bank accounts, cashflows and more
        </Typography>
      </Paper>
    </div>
  );
}
