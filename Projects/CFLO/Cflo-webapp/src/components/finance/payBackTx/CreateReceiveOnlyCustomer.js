import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useParams, useHistory } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { createRrceiveonlyCustomer } from './api';



const useStyles = makeStyles((theme) => ({
    pmTitle: {
        fontSize: '16px',
        margin: "5px",
        opacity: "0.8"
    },
    textFieldClass: {
        marginTop: "10px",
        width: "100%",
    },
    displayRow: {
        display: "flex",
        width: "100%",
        justifyContent: "space-between",
        marginRight: "10px",
        marginTop: "10px",
    }
}));

export default function CreateReceiveOnlyCustomer(props) {

    const DateNow = new Date()
    const classes = useStyles();
    const history = useHistory();
    const { txId } = useParams();
    const {
        tx,
        setTx
    } = props;

    const {
        pmTitle,
        textFieldClass,
        displayRow
    } = classes;

    const fullName = tx?.secondParty?.parent?.displayName
    const fNamev = fullName.substring(0, fullName.indexOf(' '));
    const lNamev = fullName.substring(fullName.indexOf(' ') + 1);

    const [fName, setFName] = useState(fNamev)
    const [lName, setLName] = useState(lNamev)
    const [email, setEmail] = useState(tx?.secondParty?.parent?.email)
    const [ipAddress, setIpAddress] = useState("");
    const [errMsg, setErrMsg] = useState(null);

    const onCustomerCreate = async () => {
        if (fName.length > 1 && lName.length > 1 && email.length > 0) {

            await createRrceiveonlyCustomer({
                walletId: tx?.secondPartyWallet?._id,
                fName,
                lName,
                email,
                ipAddress
            })
                .then((data) => {

                    console.log(data);

                    const dwollaCustomerId = data?.dwollaCustomer?._id

                    const newSeconPartyWallet = {
                        ...tx?.secondPartyWallet,
                        dwollaCustomer : dwollaCustomerId
                    }

                    const newTx = {
                        ...tx,
                        secondPartyWallet : newSeconPartyWallet
                    }

                    console.log(newTx)

                    setTx(newTx)

                })
                .catch((err) => {
                   console.log(err)
                })
        } else {
            setErrMsg("Insufficient Data")
        }
    }


    return (
        <div>
            <Typography className={pmTitle} >Create Receiver Account</Typography>
            {errMsg && (
                <div style={{color : 'red'}}>
                    {errMsg}
                </div>
            )}
            <TextField
                id="outlined-basic"
                type="text"
                label="First Name"
                variant="outlined"
                size="small"
                className={textFieldClass}
                value={fName}
                onChange={(e) => { setFName(e.target.value) }}
            />
            <TextField
                id="outlined-basic"
                type="text"
                label="Last Name"
                variant="outlined"
                size="small"
                className={textFieldClass}
                value={lName}
                onChange={(e) => { setLName(e.target.value) }}
            />
            <TextField
                id="outlined-basic"
                type="email"
                label="Email Id"
                variant="outlined"
                size="small"
                className={textFieldClass}
                value={email}
                onChange={(e) => { setEmail(e.target.value) }}
            />
            <TextField
                id="outlined-basic"
                type="text"
                label="ipAddress"
                variant="outlined"
                size="small"
                className={textFieldClass}
                value={ipAddress}
                onChange={(e) => { setIpAddress(e.target.value) }}
            />
            <div className={displayRow} >
                <div></div>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={onCustomerCreate}
                >Create</Button>
            </div>
        </div>
    );
}
