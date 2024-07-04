import React, {useState, useEffect, useCallback} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import CloseBtn from '../actionBtns/close.btn';

const useStyles = makeStyles((theme) => ({
  root: {

  },
  dialogTitle: {
    fontWeight: '600',
  },

  row: {
    flex: 1,
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
  },
}));

export default function AddDialog(props) {
  const classes = useStyles();

  const {
    open, setOpen, loading,
  } = props;

  const handleClose = () => {
    // do not close
    setOpen(false);
  };

  return (
    <>

      <Dialog
        onClose={handleClose}
        aria-labelledby="simple-dialog-title" open={open}
      >

        <DialogContent  style={{ paddingLeft : "0px", paddingRight : "0px" }} >
          <div className={classes.row} style={{ paddingLeft : "20px", paddingRight : "20px", marginBottom : "10px"}}>
            <div className={classes.row}>
              <Typography className={classes.dialogTitle}>
                                Add New
              </Typography>
            </div>

            <CloseBtn
              onClick={()=>setOpen(false)}
            />
          </div>


          {props.form}

          {loading?<LinearProgress />:null}
        </DialogContent>

      </Dialog>

    </>
  );
}
