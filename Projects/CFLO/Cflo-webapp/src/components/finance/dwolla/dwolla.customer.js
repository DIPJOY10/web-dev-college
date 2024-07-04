import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import cx from 'clsx';
import DwollaSvg from './dwolla.svg';
import Api from '../../../helpers/Api';
import CustomerTypeDialog from './customer.type.dialog';
import CircularProgress from '@material-ui/core/CircularProgress';
import AddDwollaBank from './add.dwolla.bank';
import DwollaBankCardItem from './dwolla.bank.item';
import ButtonBase from '@material-ui/core/ButtonBase';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { updateWallet, removeDwollaBankAccount } from './api';


const useStyles = makeStyles((theme) => ({

  dwollaMainConst: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: "20px",
    paddingTop: "20px",
  },

  paperStyle: {
    width: '95%',
    paddingBottom: '20px',
    border: "1px solid #989898"

  },

  dwollaHeader: {
    width: "100%",
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  btnStyle: {
    padding: "5px 10px",
    backgroundColor: theme.palette.primary.main,
    color: "white",
    fontSize: "18px",
    borderRadius: "5px",
    marginTop: "20px",
    marginRight: "20px",
    [theme.breakpoints.down('sm')]: {
      fontSize: "14px",
      width : "45%",
      marginTop: "5px",
      marginRight: "5px"
    },
  },

  allBankAccCont: {
    display: "flex",
    flexWrap: "wrap",
    marginTop: "10px",
    margin : "10px 15px",
    [theme.breakpoints.down('md')]: {
      justifyContent : "space-around",
    },
  },

  imgStyle: {
    height: "60px",
    width: "auto",
  },

  dwollaVlogo: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "10px",
    marginLeft: "10px",
    [theme.breakpoints.down('sm')]: {
      marginTop: "5px",
      marginLeft: "5px"
    },
  },

}));

export default function DwollaCustomer(props) {
  const { wallet, dwollaConfig, plaidBankAccounts, isShort, onBankItemSelect } = props;

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [acct, setAcct] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [newWallet, setNewWallet] = useState(null);
  const [fundSrcs, setFundSrcs] = useState(null);

  const classes = useStyles();
  const history = useHistory();

  const {
    dwollaMainConst, dwollaHeader, dwollaVlogo,
    allBankAccCont, imgStyle, btnStyle, paperStyle,
  } = classes;

  useEffect(() => {
    const newAcct = dwollaConfig?.acct;
    const newCustomer = dwollaConfig?.customer;
    const newFundSrcs = dwollaConfig?.fundSrcs;

    setNewWallet(wallet);
    setAcct(newAcct);
    setCustomer(newCustomer);
    setFundSrcs(newFundSrcs);
  }, [dwollaConfig]);



  const setDefaultSrc = async (item) => {

    setNewWallet({
      ...newWallet,
      defaultDwollaBankAccount: item._id
    })

    await updateWallet({
      walletId: wallet._id,
      defaultDwollaBankAccount: item._id
    }).then((data) => {
      console.log(data)
    })
      .catch(err => {
        console.log(err);
      })
  };

  const removeBankAcc = async (item, selected) => {

    await removeDwollaBankAccount({
      bankId: item?._id,
      bankUrl: item?.url,
    }).then(async (data) => {
      const filteredFundSrcs = fundSrcs.filter(fundSrc => fundSrc._id != item?._id);

      if (selected) {

        if (fundSrcs.length == 1) {

          console.log('here1')

          await updateWallet({
            walletId: wallet._id,
            defaultDwollaBankAccount: null
          }).then((dataW) => {
            setNewWallet({
              ...newWallet,
              defaultDwollaBankAccount: null
            })
          })
            .catch(err => {
              console.log(err);
            })


        } else {

          console.log("here2")

          await updateWallet({
            walletId: wallet._id,
            defaultDwollaBankAccount: filteredFundSrcs[0]._id
          }).then((dataW) => {
            setNewWallet({
              ...newWallet,
              defaultDwollaBankAccount: filteredFundSrcs[0]._id
            })
          })
            .catch(err => {
              console.log(err);
            })

        }

      }
      setFundSrcs(filteredFundSrcs)
      console.log(data);
    })
      .catch(err => {
        console.log(err);
      })
  }

  return (

    <div className={dwollaMainConst} >
      {acct?.email ? (
        <Paper className={paperStyle}>
          <div className={dwollaHeader} >
            
            <div className={dwollaVlogo} >
              <img
                src={DwollaSvg}
                className={imgStyle}
              />
              <CheckCircleIcon style={{ color: "green" }} />
            </div>

            <ButtonBase onClick={() => {
            }} className={btnStyle}>
              <AddDwollaBank
                wallet={wallet}
                plaidBankAccounts={plaidBankAccounts}
                dwollaCustomer={customer}
                paymentPage={false}
              />
            </ButtonBase>


          </div>
          {isShort ? null : (
            <div style={{ margin : "15px" }}>
              <Typography style={{ textAlign: 'left' }}>{`${acct?.firstName} ${acct?.lastName} `}</Typography>
              <Typography>{acct?.email}</Typography>
            </div>
          )}
          <div className={allBankAccCont} >
            {fundSrcs.length > 0 && fundSrcs.map((item, index) => {
              return <DwollaBankCardItem key={index} item={item} onSelect={setDefaultSrc} removeBankAcc={removeBankAcc} selected={item?._id === newWallet?.defaultDwollaBankAccount} />;
            })}
          </div>
        </Paper>
      ) : (
        <CircularProgress />
      )}
    </div>

  );
}
