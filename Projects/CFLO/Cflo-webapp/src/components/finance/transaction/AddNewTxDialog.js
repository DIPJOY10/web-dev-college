import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import CloseBtn from '../../styled/actionBtns/close.btn';
import _ from 'lodash';
import clsx from 'clsx';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Api from '../../../helpers/Api';
import { createJournalEntryandLine, createTx, createTxTemplate, getProfileByWallet } from '../transaction/api';
import { ButtonBase } from '@material-ui/core';
import MyAutocomplete from '../../styled/CommonComponents/MyAutoComplete';
import { getChartAccountTypes } from '../chartaccount/api';
import ChartAccountCreate from '../chartaccount/ChartAccount.Create';



const useStyles = makeStyles((theme) => ({
  header: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  list: {
    margin: "20px 40px",
    width: "175px",
  },
  addNewBtn: {
    height: '2rem',
    width: '8rem',
    marginRight: "30px",
    fontSize: '0.9rem',
    fontWeight: '700',
    backgroundColor: '#00c853',
    color: 'white',
    borderRadius: '1rem',
  },
  listCont: {
    display: 'flex',
    flexDirection: 'row',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
    }
  }
}));

export default function AddNewTxDialog(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  const {
    walletId
  } = props;

  const auth = useSelector((state) => state.auth);
  const {
    user, userProfile,
  } = auth;

  const {
    addNewBtn
  } = classes

  const [open, setOpen] = useState(false)
  const [openChartAcc, setOpenChartAcc] = useState(false)

  const handleClose = () => {
    // do not close
    setOpen(false);
  };

  const onCreate = async (type, status) => {
    await getProfileByWallet({ walletId })
      .then(async (profileId) => {

        const data = await createTx({
          type,
          status,
          firstPartyWallet: walletId,
          firstParty: profileId,
        });

        if (data?._id) {
          const path = '/admin/' + walletId + '/tx/' + data?._id + '/edit';
          history.push(path);
        }

      })
      .catch((err) => {
        console.log(err);
      })
  };

  const onTmCreate = async (type, status) => {
    await getProfileByWallet({ walletId })
      .then(async (profileId) => {

        const data = await createTxTemplate({
          type,
          status,
          firstPartyWallet: walletId,
          firstParty: profileId,
        });

        if (data?._id) {
          const path = '/admin/' + walletId + '/txtmplate/' + data?._id + '/edit';
          history.push(path);
        }

      })
      .catch((err) => {
        console.log(err);
      })
  };

  const createJournalEntry = async () => {
    createJournalEntryandLine({
      walletId: walletId,
      user: user._id
    })
      .then((data) => {
        const path = '/admin/' + walletId + '/journalentry/' + data.savedJournal._id + `/edit`;
        history.push(path);
      })
      .catch((err) => {
        console.log(err)
      })

  };

  console.log(user)


  return (
    <>

      <ButtonBase
        className={addNewBtn}
        onClick={() => {
          setOpen(!open);
        }}
      >
        Add New
      </ButtonBase>


      <Dialog onClose={handleClose} maxWidth={'md'} aria-labelledby="simple-dialog-title" open={open}>
        <div className={classes.header}>
          <div style={{ marginLeft: "10px", marginTop: "10px" }} >
            <Typography variant='button' >
              <b>Add New</b>
            </Typography>
          </div>
          <CloseBtn
            onClick={() => setOpen(false)}
          />
        </div>
        <div className={classes.listCont} >



          <List
            component="nav"
            className={classes.list}
          >
            <ListItem>
              <b style={{ fontSize: "18px" }} >Transaction</b>
            </ListItem>
            <ListItem button onClick={() => {
              onCreate('Invoice', 'Draft');
            }}>
              <ListItemText primary="Invoice" />
            </ListItem>
            <ListItem button onClick={() => {
              onCreate('Bill', 'Draft');
            }}>
              <ListItemText primary="Bill" />
            </ListItem>
            <ListItem button onClick={() => {
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
              <b style={{ fontSize: "18px" }} >Generator</b>
            </ListItem>
            <ListItem button onClick={() => {
              onTmCreate('Invoice', 'Draft');
            }}>
              <ListItemText primary="Invoice" />
            </ListItem>
            <ListItem button onClick={() => {
              onTmCreate('Bill', 'Draft');
            }}>
              <ListItemText primary="Bill" />
            </ListItem>
            <ListItem button onClick={() => {
              onTmCreate('Expense', 'Draft');
            }}>
              <ListItemText primary="Expense" />
            </ListItem>
          </List>


          <List
            component="nav"
            className={classes.list}
          >
            <ListItem>
              <b style={{ fontSize: "18px" }} >Other</b>
            </ListItem>
            <ListItem button
              onClick={() => {
                setOpenChartAcc(true)
                setOpen(false)
              }}>
              <ListItemText primary="Chart Of Accounts" />
            </ListItem>
            <ListItem button
              onClick={() => {
                createJournalEntry()
              }}>
              <ListItemText primary="Journal Entry" />
            </ListItem>
          </List>



        </div>
      </Dialog>
      <ChartAccountCreate
        walletId={walletId}
        openDialog={openChartAcc}
        setOpenChart={setOpenChartAcc}
      />
    </>
  );
}
