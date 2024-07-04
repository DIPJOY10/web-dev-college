import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import _ from 'lodash';
import AddIcon from '@material-ui/icons/Add';
import { ButtonBase } from '@material-ui/core';
import CloseBtn from '../styled/actionBtns/close.btn';

const useStyles = makeStyles({
  header: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  listCont: {
    display: 'flex',
    flexDirection: 'row',
    padding: '30px'
  }
});

export default function PropertyManagementDialog(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  const { createBtn } = props;
  const [open, setOpen] = useState(false)
  const auth = useSelector((state) => state.auth);
  const { user, userProfile } = auth;

  const handleClose = () => {
    setOpen(false);
  };


  return (
    <>
      <ButtonBase onClick={() => { setOpen(!open) }} className={createBtn} >
        <Typography>
          Add
        </Typography>
        <AddIcon />
      </ButtonBase>
      <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
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
        <div className={classes.listCont} >Create Related contents</div>
      </Dialog>
    </>
  );
}
