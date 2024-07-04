import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useParams, useHistory } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import TextField from '@material-ui/core/TextField';
import { addRrceiveonlyBankAccounts, getDwollaBankAccount } from './api';


const useStyles = makeStyles((theme) => ({

    onlyText: {
        fontSize: "11px",
        opacity: "0.6",
        marginTop: "10px"
    },
    DButtonCont: {
        marginTop: "20px",
        textAlign: "center",
        marginBottom: "20px"
    },
    SButtonCont: {
        marginTop: "20px",
        textAlign: "center",
    },



    pmTitle: {
        textAlign: 'center',
        fontSize: '17px',
        color: '#79C3F0',
        margin: "5px",
        marginLeft: "15px"
    },
    listItem: {
        borderBottom: "1px solid #E1E2E5",
        cursor: "pointer",
        backgroundColor: "rgb(242, 242, 242)",
        height: "60px"
    },
    accountListCont: {
        width: "100%",
        height: "180px",
        borderLeft: "1px solid #E1E2E5",
        borderRight: "1px solid #E1E2E5",
        overflow: "auto",
    },
    displayRow: {
        display: "flex",
        width: "100%",
        justifyContent: "space-between",
        marginRight: "10px",
        marginTop: "10px",
    },
    headerCard: {
        display: "flex",
        alignItems: "center",
    },
    textFieldClass: {
        marginTop: "10px",
        width: "100%",
    },
}));

export default function AddReceiveOnlyFundingSoutce(props) {

    const DateNow = new Date()
    const classes = useStyles();
    const history = useHistory();
    const { txId } = useParams();
    const {
        tx,
        setPalView,
        setDwollaAccUrl,
        OnStripeAccountSelect,
        dwollaAccUrl,
        stripeAccId,
        OnDwollaAccountSelect,
        OnStripeCardSelect
    } = props;

    const {
        pmTitle,
        listItem,
        accountListCont,
        displayRow,
        headerCard,
        textFieldClass,

        onlyText,
        SButtonCont,
        DButtonCont,
    } = classes;

    const [bankAccounts, setBankAccounts] = useState([])
    const [pageShow, setPageShow] = useState("fundingSource")
    const [routingNumber, setRoutingNumber] = useState("")
    const [accountNumber, setAccountNumber] = useState("")
    const [bankAccountType, setBankAccountType] = useState("")
    const [bankName, setBankName] = useState("");
    const [errMsg, setErrMsg] = useState(null);


    useEffect(() => {
        getDwollaBankAccount({
            walletId : tx?.secondPartyWallet?._id,
            dwollaCustomerId : tx?.secondPartyWallet?.dwollaCustomer
        })
        .then((data)=>{
            console.log(data);
            setBankAccounts(data)
        })
    },[tx])



    const addBankAccount = async () => {
        if (routingNumber.length > 2 && accountNumber.length > 2 && bankAccountType.length > 2 && bankName.length > 0) {
            await addRrceiveonlyBankAccounts({
                dwollaCustomerId: tx?.secondPartyWallet?.dwollaCustomer,
                routingNumber,
                accountNumber,
                bankAccountType,
                bankName,
                walletId: tx?.secondPartyWallet?._id
            })
                .then((data) => {
                    if (data.status === 200) {
                        const newBankArr = [...bankAccounts, data.data]
                        setBankAccounts(newBankArr)
                        setPageShow("fundingSource")
                    } else {
                        setErrMsg(data?.data.message)
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
        } else {
            setErrMsg("Insufficient Data")
        }
    }

    const onBankAccount = (dwollaBankAccount)=>{
        setPalView(null)
        setDwollaAccUrl(dwollaBankAccount?.url)
    }



    return (
        <div>
            {pageShow === "fundingSource" && (
                <>
                    <Typography className={pmTitle} >Receiver Bank Accounts</Typography>
                    <div className={accountListCont} >
                        <List style={{ padding: "0px" }} >
                            {bankAccounts.length > 0 && bankAccounts.map((dwollaBankAccount) => (
                                <ListItem onClick={()=>{ onBankAccount(dwollaBankAccount) }} className={listItem} >
                                    <ListItemText primary={dwollaBankAccount?.bankName} secondary={dwollaBankAccount?.name} />
                                </ListItem>
                            ))}
                        </List>
                    </div>
                    <div className={displayRow} >
                        <div></div>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => { setPageShow("AddFundingSource") }}
                        >Add Bank Account</Button>
                    </div>
                </>
            )}

            {pageShow === "AddFundingSource" && (
                <>
                    <div className={headerCard} >
                        <ArrowBackIcon onClick={() => { setPageShow("fundingSource") }} style={{ cursor: "pointer" }} />
                        <Typography className={pmTitle} >Add Bank Accounts</Typography>
                    </div>
                    <div>
                        {errMsg && (
                            <div style={{ color: 'red' }}>
                                {errMsg}
                            </div>
                        )}
                        <TextField
                            id="outlined-basic"
                            type="text"
                            label="Routing Number"
                            variant="outlined"
                            size="small"
                            className={textFieldClass}
                            value={routingNumber}
                            onChange={(e) => { setRoutingNumber(e.target.value) }}
                        />
                        <TextField
                            id="outlined-basic"
                            type="text"
                            label="Account Number"
                            variant="outlined"
                            size="small"
                            className={textFieldClass}
                            value={accountNumber}
                            onChange={(e) => { setAccountNumber(e.target.value) }}
                        />
                        <TextField
                            id="outlined-basic"
                            type="text"
                            label="Bank Account Type"
                            variant="outlined"
                            size="small"
                            className={textFieldClass}
                            value={bankAccountType}
                            onChange={(e) => { setBankAccountType(e.target.value) }}
                        />
                        <TextField
                            id="outlined-basic"
                            type="text"
                            label="Bank Name"
                            variant="outlined"
                            size="small"
                            className={textFieldClass}
                            value={bankName}
                            onChange={(e) => { setBankName(e.target.value) }}
                        />
                        <div className={displayRow} >
                            <div></div>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => { addBankAccount() }}
                            >ADD</Button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
