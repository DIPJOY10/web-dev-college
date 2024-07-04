import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useHistory} from 'react-router-dom';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import CloseBtn from '../../styled/actionBtns/close.btn';
import _ from 'lodash';
import clsx from 'clsx';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Api from '../../../helpers/Api';


const useStyles = makeStyles({

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

  width: {
    width: '15rem',
  },

  list: {
    marginBottom: '1rem',
  },

});

export default function SimpleDialog(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  const {
    walletId,
    open,
    setOpen,
  } = props;

  const auth = useSelector((state) => state.auth);
  const {
    user, userProfile,
  } = auth;

  const close = ()=>{

  };


  const handleClose = () => {
    // do not close
    setOpen(false);
  };

  const navigate = (name)=>{
    dispatch({
      type: 'AddWallet',
      payload: {
        newFinanceActivity: {
          walletId,
          activity: name,
        },
      },
    });

    const path = '/admin/'+ walletId + '/new/' + name;
    history.push(path);
  };

  const onInvoiceCreate = async ()=>{
    const res = await Api.post('wallet/invoice/create', {
      wallet: walletId,
      addedBy: user.profile,
      user: user.model=='User'?user._id:userProfile._id,
    });
    const invoice = res.data;
    if (invoice?._id) {
      const path = '/admin/' + walletId + '/' + invoice._id + '/invoice/';
      history.push(path);
    }
  };

  return (

    <Dialog className={classes.root} onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>


      <div className={clsx(classes.row, classes.center, classes.margin, classes.width)}>
        <div className={clsx(classes.row)}>

          <Typography variant='button' >
            <b>Add New</b>
          </Typography>
        </div>

        <CloseBtn
          onClick={()=>setOpen(false)}
        />
      </div>

      <List
        component="nav"
        className={classes.list}
      >
        <ListItem button onClick={()=>{

        }}>
          <ListItemText primary="Payment" />
        </ListItem>

        <ListItem button onClick={()=>{
          onInvoiceCreate();
        }}>
          <ListItemText primary="Invoice" />
        </ListItem>


        <ListItem button onClick={()=>{
          navigate('journal');
        }}>
          <ListItemText primary="Journal Entry" />
        </ListItem>

        <ListItem button onClick={()=>{
          navigate('chartaccount');
        }}>
          <ListItemText primary="Chart Account" />
        </ListItem>
      </List>


    </Dialog>

  );
}
