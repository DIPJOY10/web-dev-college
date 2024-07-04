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

export default function ConnectStripeBtn(props) {
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
    imgStyle, btnStyle, opacity, dwollaMainConst, dwollaHeader, img2Style,
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
          <ButtonBase onClick={() => {
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
          }} className={cx(btnStyle, [loading && opacity])}>
            <PersonAddIcon style={{ fontSize: "30px", marginRight: "5px" }} />  Create Account
          </ButtonBase>
        </div>
        <Typography className={paraText}>
          Stripe is available <Link onClick={() => {
            const url = 'https://stripe.com/global';
            window.open(url, '_blank');
          }}>internationally</Link>. Supports multiple
          payment methods. We currently support bank transfers (ACH fee 0.8% - $5 max) in US only, <Link onClick={() => {
            const url = 'mailto:team@contractflo.com';
            window.open(url, '_blank');
          }}>reach out</Link> to us for your country specific payments). Stripe account is <b>free</b>.
        </Typography>
        <Typography className={paraText}>
          Stripe lets you send money <b>only</b> to people on Stripe network.
        </Typography>
      </Paper>
    </div>
  );
}

