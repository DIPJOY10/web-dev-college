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
import configObject from '../../../config/index';


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

  col: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },

  paper: {
    margin: '1rem',
    padding: '0.5rem',
    maxWidth: '17rem',
  },

  title: {
    textAlign: 'center',
    fontSize: '1.3rem',
    margin: '1rem 0',
    fontWeight: '600',
  },

  paperTitle: {
    fontSize: '1.1rem',
    margin: '0 1rem',
    fontWeight: '500',
  },

  subText: {
    fontSize: '0.9rem',
    margin: '0 1rem',
    fontWeight: '400',
    color: '#424242',
  },

}));

export default function SimpleDialog(props) {
  const {
    open, setOpen, walletId,
  } = props;
 
  const auth = useSelector((state) => state.auth);
  const {
    user,
  } = auth;

  const classes = useStyles();
  const {
    col, paper, title, paperTitle, subText,
  } = classes;

  const handleClose = () => {
    setOpen(false);
  };

  const attachDwollaAccount = async (type)=>{
    if (walletId) {
      const token = localStorage.getItem('token');
      const data = {
        walletId,
        type,
        client: 'web',
        user: user._id,
        token,
        action: 'customer.create',
      };
      const dwollaWebapp = configObject.dwollaWebapp;
      const searchParams = new URLSearchParams(data);
      const url = dwollaWebapp +'customer/?'+ searchParams;
      if (url) {
        window.location.replace(url);
      }
    }
  };


  return (

    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
      <div className={col}>

        <Typography className={title}>
                    Select Dwolla Acct Type
        </Typography>

        <ButtonBase onClick={()=>{
          attachDwollaAccount('personal');
        }}>
          <Paper className={clsx(paper)}>
            <Typography className={paperTitle}>
                            Personal Verified Account
            </Typography>
            <Typography className={subText}>
                            This can also be used on behalf of a business ( not standard but it's quick and easy and functionally same  😉 ).
            </Typography>
          </Paper>
        </ButtonBase>

        <ButtonBase onClick={()=>{
          attachDwollaAccount('business');
        }}>
          <Paper className={clsx(paper, col)}>
            <Typography className={paperTitle}>
                            Business Verified Account
            </Typography>
            <Typography className={subText}>
                            Creating a business verified account will require you to provide information about the business entity as well as a controller.
            </Typography>
          </Paper>
        </ButtonBase>

      </div>


    </Dialog>

  );
}
