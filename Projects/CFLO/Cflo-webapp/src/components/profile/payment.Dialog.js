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
import TextField from '@material-ui/core/TextField';

import { createStripePaymentIntentExpense } from '../finance/payBackTx/api'

const useStyles = makeStyles((theme) => ({
    row: {
        display: "flex",
        justifyContent: "space-between",
        width: "100%"
    },
    mainDilog: {
        width: "300px",
        margin: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        [theme.breakpoints.down('sm')]: {
            width : "250px",
        }
    },
    InputField: {
        width: '80%',
        marginTop : "30px"
    },
    nextBtn : {
        fontSize : "18px",
        padding : "2px 15px",
        marginTop : "15px"
    }
}));

export default function PaymentDialog(props) {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { open, setOpen, profile, walletId } = props;

    const {
        row, mainDilog, InputField, nextBtn
    } = classes;

    const { profileId } = useParams();

    const handleClose = () => {
        setOpen(false);
    }


    const [amount, setAmount] = useState(0);
    const [desc, setDesc] = useState("");

    const paymentNextStep = async () => {
        const resData = await Api.post("transaction/create/payment", {
            amount,
            desc,
            dwollaBankAcc : profile?.parent?.wallet?.defaultDwollaBankAccount?.url,
            stripeAcc : profile?.parent?.wallet?.stripeConnectAccountId,
            firstPartyProfile : user?.profile,
            firstPartyWallet : walletId ? walletId : user?.wallet,
            secondPartyProfile : profile?._id ,
            secondPartyWallet : profile?.parent?.wallet?._id,
        });

        const tx = resData.data

        const path = `/payment/${tx._id}`;
        history.push(path);
    }

    return (
        <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open} >
            <div className={mainDilog} >
                <div className={row} >
                    <div style={{ fontSize: '20px', color : "#46A8F0" }} >Send Money</div>
                    <div><ClearIcon style={{ fontSize: "35px", cursor: "pointer" }} onClick={() => handleClose()} /></div>
                </div>
                <TextField
                    id="outlined-password-input"
                    label="Enter Amount"
                    type="number"
                    autoComplete="current-password"
                    variant="outlined"
                    value={amount}
                    onChange={(e)=>{setAmount(e.target.value)}}
                    className={InputField}
                />
                <TextField
                    id="outlined-multiline-static"
                    label="Description"
                    multiline
                    rows={4}
                    defaultValue=""
                    variant="outlined"
                    value={desc}
                    onChange={(e)=>{setDesc(e.target.value)}}
                    className={InputField}
                />
                <Button  onClick={paymentNextStep} variant="outlined" color="primary" className={nextBtn} >Next</Button>
            </div>
        </Dialog>
    );
}
