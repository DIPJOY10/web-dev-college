import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {useHistory} from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import cx from 'clsx';

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    minWidth: '18rem',
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

  paper: {

    width: '100%',
    maxWidth: '42rem',
  },

  paperSelected: {
    width: '100%',
    maxWidth: '42rem',
    backgroundColor: '#eeeeee',
  },

  titleText: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#424242',
    margin: '1rem',
  },

  checkbox: {
    margin: '1rem',
  },

  paraText: {
    fontSize: '1rem',
    fontWeight: '400',
    color: '#424242',
    margin: '1rem',
  },


}));


export default function LeftList(props) {
  const {
    selected, setSelected, setOpen,
  } = props;
  console.log(selected, ' is the selected');
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const {

  } = useSelector((state) => state);

  const {
    root, row, col, titleText,
    paraText, paper, checkbox,
    paperSelected,
  } = classes;

  return (
    <div className={root}>
      {/* <ButtonBase className={paper}>
                <Paper>
                    <div className={row}>

                        <Typography className={titleText}>
                            Add money in wallet
                        </Typography>
                    </div>

                    <Typography className={paraText}>
                        Services like banks accounts costs money to access and maintain. We suggest adding at least $10 in your wallet. Wallet can be used accoss your accounts (projects, orgs and user)
                    </Typography>

                </Paper>
            </ButtonBase>  */}
      <ButtonBase onClick={()=>{
        setSelected('BankAccount');
        if (setOpen) {
          setOpen(true);
        }
      }}>
        <Paper className={selected=='BankAccount'?paperSelected:paper}>
          <Typography className={titleText}>
                        Add Bank Account
          </Typography>
          <Typography className={paraText}>
                        You can choose to connect to both Dwolla and Stripe with same bank account/s. Dwolla costs $1, Stripe is free.
          </Typography>

        </Paper>
      </ButtonBase>

      <ButtonBase onClick={()=>{
        setSelected('PaymentNetwork');
        if (setOpen) {
          setOpen(true);
        }
      }}>
        <Paper className={selected=='PaymentNetwork'?paperSelected:paper} >
          <Typography className={titleText}>
                        Choose Payment Networks
          </Typography>
          <Typography className={paraText}>
                        You can choose to connect to both Dwolla and Stripe with same bank account/s. Dwolla costs $1, Stripe is free.
          </Typography>

        </Paper>
      </ButtonBase>

    </div>
  );
}
