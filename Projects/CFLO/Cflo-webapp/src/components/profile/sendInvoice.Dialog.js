import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory, useParams } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import Api from '../../helpers/Api';
import Dialog from '@material-ui/core/Dialog';
import ClearIcon from '@material-ui/icons/Clear';
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
    row: {
        display: "flex",
        justifyContent: "space-between",
        width: "100%"
      },
      mainDilog: {
        width: "250px",
        height: "250px",
        margin: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      },
      actBtn: {
        fontSize: "20px",
        width: "80%",
        marginTop: "30px"
      }
}));

export default function SendInvoiceDialog(props) {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();

    const { open, setOpen } = props;

    const {
       row, mainDilog, actBtn, 
    } = classes;

    const { } = useParams()

    const handleClose = ()=>{
        setOpen(false);
    }


    // useEffect(() => {

    // },[])


    return (
        <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open} >
            <div className={mainDilog} >
              <div className={row} >
                <div>Send Invoice</div>
                <div><ClearIcon style={{ fontSize: "35px", cursor: "pointer" }} onClick={() => handleClose()} /></div>
              </div>
              {/* <Button 
                  variant="outlined" 
                  color="primary" 
                  className={actBtn} 
                 
              >Send Money</Button>
              <Button 
                  variant="outlined"
                  color="primary" 
                  className={actBtn} 
                
              >Send Invoice</Button> */}
            </div>
        </Dialog>
    );
}
