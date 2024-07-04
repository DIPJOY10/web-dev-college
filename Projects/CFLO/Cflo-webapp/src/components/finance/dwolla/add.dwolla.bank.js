import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles, withStyles} from '@material-ui/core/styles';
import {useHistory} from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import cx from 'clsx';
import {InputBase} from '@material-ui/core';
import SelectBankAccountDialog from './select.bank.account.dialog';
import Link from '@material-ui/core/Link';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';

const useStyles = makeStyles((theme) => ({
  root: {

  },

  title: {

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

  addBtnTextStyle: {
    fontSize: '18px',
    color: "white",
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: "pointer"
  },

  addBtnTextStyleSmaller: {
    fontSize: '15px',
    color: "#33aff7",
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: "pointer"
  },



}));

export default function AddDwollaBank(props) {
  const {
    wallet,
    plaidBankAccounts,
    dwollaCustomer,
    paymentPage,
    txId
  } = props;
  const classes = useStyles(); 
  const history = useHistory();
  const dispatch = useDispatch();

  console.log(dwollaCustomer)
  console.log(wallet)

  const [open, setOpen] = useState(false);

  const {
    root, row, col, title,
    addBtnTextStyle, addBtnTextStyleSmaller
  } = classes;


  return (
    <div className={cx(root, col)}>


      <Typography >
        <Link onClick={()=>{
          setOpen(true);
        }}
        className={paymentPage ? addBtnTextStyleSmaller :addBtnTextStyle}
        >
             <AccountBalanceIcon style={{ fontSize: "30px", marginRight: "5px" }} /> 
             Add Bank Account
        </Link>
      </Typography>

      <SelectBankAccountDialog
        open={open}
        setOpen={setOpen}
        wallet={wallet}
        dwollaCustomer={dwollaCustomer}
        plaidBankAccounts={plaidBankAccounts}
        txId={txId}
        paymentPage={paymentPage}
      />
    </div>
  );
}
