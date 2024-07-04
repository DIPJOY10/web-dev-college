import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useHistory} from 'react-router-dom';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import _ from 'lodash';
import clsx from 'clsx';
import AddIcon from '@material-ui/icons/Add';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { ButtonBase } from '@material-ui/core';
import CloseBtn from '../../styled/actionBtns/close.btn';
import { createTx, createTxTemplate } from '../../finance/transaction/api';

const useStyles = makeStyles({
  header : {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  list: {
    margin: "20px 40px"
  },
  addNewBtn: {
    height: '2rem',
    width: '8rem',
    marginRight: '4rem',
    marginTop: '1.5rem',
    fontSize: '0.9rem',
    fontWeight: '700',
    backgroundColor: '#00c853',
    color: 'white',
    borderRadius: '1rem',
  },
  listCont : {
    display: 'flex',
    flexDirection: 'row',
  }

});

export default function PaymentDialog(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  const {
    walletId, createBtn
  } = props;

  const [open, setOpen] = useState(false)

  const auth = useSelector((state) => state.auth);
  const {
    user, userProfile,
  } = auth;

  const {
    addNewBtn
  } = classes

  const handleClose = () => {
    // do not close
    setOpen(false);
  };


  const onCreate = async (type, status)=>{
    const data = await createTx({ 
      type,
      status,
      firstPartyWallet: walletId,
      firstParty: user.profile,
    });

    if (data?._id) {
      const path = '/admin/' + walletId + '/tx/' + data?._id + '/edit';
      history.push(path);
    }
  };

  const onTmCreate = async (type, status)=>{
    const data = await createTxTemplate({ 
      type,
      status,
      firstPartyWallet: walletId,
      firstParty: user.profile,
    });

    if (data?._id) {
      const path = '/admin/' + walletId + '/txtmplate/' + data?._id + '/edit';
      history.push(path);
    }
  };

  return (
    <>
    
    <ButtonBase
        onClick={()=>{
            setOpen(!open);
        }}
       className={createBtn}
    >
            <Typography>
                            Add
            </Typography>
            <AddIcon />
    </ButtonBase>


    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
      <div className={classes.header}>
      <div style={{marginLeft: "10px", marginTop : "10px" }} >
          <Typography variant='button' >
            <b>Add New</b>
          </Typography>
        </div>
 
        <CloseBtn
          onClick={()=>setOpen(false)}
        />
      </div>

      <div className={classes.listCont} >
      <List
        component="nav"
        className={classes.list}
      >
        <ListItem>
          <b style={{fontSize:"18px"}} >Transaction</b>
        </ListItem>

        <ListItem button onClick={()=>{
          onCreate('Invoice', 'Draft');
        }}>
          <ListItemText primary="Invoice" />
        </ListItem>


        <ListItem button onClick={()=>{
          onCreate('JournalEntry', 'Draft');
        }}>
          <ListItemText primary="Journal Entry" />
        </ListItem>


        <ListItem button onClick={()=>{
          onCreate('Bill', 'Draft');
        }}>
          <ListItemText primary="Bill" />
        </ListItem>

        <ListItem button onClick={()=>{
          onCreate('Expense', 'Draft');
        }}>
          <ListItemText primary="Expense" />
        </ListItem>

      </List>
      <List
        component="nav"
        className={classes.list}
      >
        <ListItem>
          <b style={{fontSize:"18px"}} >Generator</b>
        </ListItem>

        <ListItem button onClick={()=>{
          onTmCreate('Invoice', 'Draft');
        }}>
          <ListItemText primary="Invoice" />
        </ListItem>


        <ListItem button onClick={()=>{
          onTmCreate('JournalEntry', 'Draft');
        }}>
          <ListItemText primary="Journal Entry" />
        </ListItem>


        <ListItem button onClick={()=>{
          onTmCreate('Bill', 'Draft');
        }}>
          <ListItemText primary="Bill" />
        </ListItem>

        <ListItem button onClick={()=>{
          onTmCreate('Expense', 'Draft');
        }}>
          <ListItemText primary="Expense" />
        </ListItem>

      </List>
      </div>
    </Dialog>
    </>
  );
}
