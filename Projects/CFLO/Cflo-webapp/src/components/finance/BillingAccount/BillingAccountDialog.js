import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import Typography from '@material-ui/core/Typography';
import {useParams, useHistory} from 'react-router-dom';

import Dialog from '@material-ui/core/Dialog';
import PersonIcon from '@material-ui/icons/Person';
import AddIcon from '@material-ui/icons/Add';
import {blue} from '@material-ui/core/colors';

import _ from 'lodash';

import Paper from '@material-ui/core/Paper';

import Divider from '@material-ui/core/Divider';
import ButtonBase from '@material-ui/core/ButtonBase';
import clsx from 'clsx';
import EditIcon from '@material-ui/icons/Edit';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import PanToolIcon from '@material-ui/icons/PanTool';
import TocIcon from '@material-ui/icons/Toc';
import LinearProgress from '@material-ui/core/LinearProgress';

import BillingAddressForm from './BillingAddressForm';


const useStyles = makeStyles((theme) => ({
  listStyle: {
    padding: '1rem',
    paddingBottom: '2rem',
    paddingTop: 0,
    minWidth: '17rem',
    width: '90vw',
    maxWidth: '32rem',
  },

  row: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
  },

  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },


  margin: {
    margin: '1rem',
  },

  marginTop: {
    marginTop: '1rem',
  },

  col: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    margin: '1rem',
    textAlign: 'center',
    fontSize: '1.2rem',
    minWidth: '17rem',
  },

  selectText: {
    textAlign: 'center',
    fontWeight: '700',
    fontSize: '1.2rem',
    marginTop: '1rem',
  },

  createButtonText: {
    marginLeft: '0.5rem',
    color: theme.palette.primary.main,
  },

}));

export default function BillingAccountDialog(props) {
  const classes = useStyles();
  const {
    walletId,
    accounts,
    setAccounts,
    open,
    setOpen,
  } = props;


  const handleClose = () => {
    // do not close
    setOpen(false);
  };

  const onSelect = (account)=>{
    setAccounts([...accounts, account]);
    setOpen(false);
  };


  return (

    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
      <div className={clsx(classes.row, classes.center, classes.marginTop)}>

        <Typography variant='button' >
          <b>Add Billing Account</b>
        </Typography>
      </div>

      <BillingAddressForm
        walletId={walletId}
        onSelect={onSelect}
        accounts={[]}
        onCancel={()=>{
          setOpen(false);
        }}
      />

    </Dialog>

  );
}
