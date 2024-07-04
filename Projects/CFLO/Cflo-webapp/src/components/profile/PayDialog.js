import React, { useState, useEffect } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Avatar from "./avatar";
import ButtonBase from "@material-ui/core/ButtonBase";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import PersonAddOutlinedIcon from "@material-ui/icons/PersonAddOutlined";
import PersonAddDisabledOutlinedIcon from "@material-ui/icons/PersonAddDisabledOutlined";
import HowToRegOutlinedIcon from "@material-ui/icons/HowToRegOutlined";
import ActionBtnCircle from "../action.btn.circle";
import Api from "../../helpers/Api";
import { setConvAndMessages } from "../chat/chatUtils";
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import Dialog from '@material-ui/core/Dialog';
import ClearIcon from '@material-ui/icons/Clear';
import SendInvoiceDialog from "./sendInvoice.Dialog";
import PaymentDialog from "./payment.Dialog";
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';

const useStyles = makeStyles((theme) => ({
    root: {

    },
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
    },
    msgIconStyle: {
        fontSize: "1.8rem",
    },

}));
export default function PayDialog(props) {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();

    const {

    } = useSelector((state) => state);

    const {
        root,
        mainDilog,
        row,
        actBtn,
        msgIconStyle
    } = classes;

    const {
        profile, onSearch, ownProfile, atNetwork, walletId
    } = props;

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const [open, setOpen] = useState(false);

    const [openPayment, setOpenPayment] = useState(false);
    const [openInvoice, setOpenInvoice] = useState(false);




    return (
        <div className={root}>

            <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
                <div className={mainDilog} >
                    <div className={row} >
                        <div></div>
                        <div><ClearIcon style={{ fontSize: "35px", cursor: "pointer" }} onClick={() => handleClose()} /></div>
                    </div>
                    <Button
                        variant="outlined"
                        color="primary"
                        className={actBtn}
                        onClick={() => {
                            setOpen(false)
                            setOpenPayment(true)
                        }}
                    >Send Money</Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        className={actBtn}
                        onClick={() => {
                            setOpen(false)
                            setOpenInvoice(true)
                        }}
                    >Send Invoice</Button>
                </div>
            </Dialog>

            <PaymentDialog profile={profile} open={openPayment} setOpen={setOpenPayment} walletId={walletId} />
            <SendInvoiceDialog open={openInvoice} setOpen={setOpenInvoice} />

            {onSearch && 
            ( atNetwork ?
            
                <MonetizationOnIcon onClick={handleClickOpen} style={{ fontSize: "35px", color: "#50AFEF", position: "relative", bottom : '-2px' }} />
             :
                <ActionBtnCircle
                    disabled={ownProfile}
                    actionFn={handleClickOpen}
                >
                    <AttachMoneyIcon className={msgIconStyle} />
                </ActionBtnCircle>
            )}
        </div>
    );
}
