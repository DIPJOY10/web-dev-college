import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import ReactToPrint from 'react-to-print';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';

const useStyles = makeStyles((theme) => ({
  paper: {
    minWidth: "800px",
    [theme.breakpoints.down('md')]: {
      minWidth: '98vw'
    },
  },
  titleCont: {
    borderBottom: "1px solid #E1E2E5"
  },
  actionCont: {
    borderTop: "1px solid #E1E2E5"
  },
  reportCont: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  marginClass: {
    marginBottom: "15px",
    marginTop: "15px",
  }
}));

export default function PdfShowDialog(props) {
  const componentRef = useRef();
  const { PDFReport, walletId } = props;
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const { paper, marginClass, titleCont, actionCont, reportCont } = classes;

  const handleClose = () => {
    setOpen(false);
  };

  const getPageMargins = () => {
    return `@page { margin: 60px 10px 60px 10px !important; }`;
  };


  return (
    <>
      <Button
        variant="contained"
        color="primary"
        startIcon={<CloudDownloadIcon />}
        onClick={() => {
          setOpen(true);
        }}
      >
        Download
      </Button>



      <Dialog
        open={open}
        classes={{ paper: paper }}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle className={titleCont} >{`Final Print Page(s)`}</DialogTitle>
        <DialogContent>

          <div className={reportCont} ref={componentRef} >
            <style>{getPageMargins()}</style>
            {PDFReport}
          </div>

        </DialogContent>
        <DialogActions className={actionCont} >
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
          <ReactToPrint
            trigger={() => (
              <Button color="primary" autoFocus>
                Print
              </Button>
            )}
            content={() => componentRef.current}
          />
        </DialogActions>
      </Dialog>
    </>
  );
}
