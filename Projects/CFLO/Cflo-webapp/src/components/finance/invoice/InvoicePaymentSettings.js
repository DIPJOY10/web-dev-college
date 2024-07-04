import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import TopBar from '../newactivity/topbar';
import { useDebounce } from 'react-use';
import { useGetTx } from '../hooks';
import { DescriptionInput, NewInputBase } from '../styles';
import TxSecondParty from '../transaction/secondParty';
import BillListEdit from '../BillList/bill.list.edit';
import TxBillListEdit from '../transaction/tx.bill.list.edit';
import EditIcon from '@material-ui/icons/Edit';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import IconButton from '@material-ui/core/IconButton';
import DialogBillNo from '../bill/DialogBillNo';
import {
    constrcutArrayOfBillNo, editSubmittedInvoice,
    getTxByWallet, invoiceInitialSubmit,
    markSubmittedInvoiceAsPaid, markInvoiceAsPaid
} from '../transaction/api';
import CommonAppBar from '../../styled/CommonComponents/Commont.AppBar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import DwollaAccountOptions from './DwollaAccountOptions';
import StripeAccountOptions from './StripeAccountOptions';
import dwollaLogo from "../../../Assets/dwolla.png";
import stripeText from "../../../Assets/stripeText.png";
import stripeLogo from "../../../Assets/stripeLogo.png";
import MyNavBar from '../../styled/CommonComponents/MyNavBar';
import { getIncomeChartAccounts } from '../offering/utils';
import { ContactsOutlined } from '@material-ui/icons';
import MyAutocomplete from '../../styled/CommonComponents/MyAutoComplete';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import ChartAccountCreateForBank from './ChartAccountCreateForBank';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import Paper from '@material-ui/core/Paper';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';

const paymentTypes = ["Cash", "Cheque"]





const useStyles = makeStyles((theme) => ({
    root: {


    },

    top: {
        marginTop: '2rem',
        marginBottom: '1rem',
    },

    row: {
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
    },

    col: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        paddingTop: "50px"
    },

    alignCenter: {
        alignItems: 'center',
    },

    justifyCenter: {
        justifyContent: 'center',
    },

    datePicker: {
        width: 150,
    },
    invoiceEditBody: {
        marginTop: "40px",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    nextIcon: {
        transform: 'rotate(180deg)',
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    platformAcceptCont: {
        // display: "flex",
        // justifyContent: "center",
        // alignItems: "center",
    },
    journalEntryCont: {
        widht: "100%",
        border: "1px solid #E1E2E5",
        padding: "30px 20px",
        marginTop: "50px",
        marginBottom: "50px"
    },
    chartAccountTitle: {
        fontSize: "18px",
        fontWeight: "550",
        marginBottom: "30px",
        display: "flex",
        alignItems: "center",
    },
    offlinePaymentCont: {
        width: "100%",
    },
    paidBtnCont: {
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "5px 15px",
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
        },
    },
    giveMargin: {
        marginTop: "70px",
        padding: "30px 30px"
    },
    offlinePaymentHeader: {
        display: "flex",
        alignItems: "center",
    },
    hederText: {
        fontSize: "19px",
        marginRight: "5px",
        [theme.breakpoints.down('md')]: {
            width: "85px",
            fontSize: "15px",
        },
    },
    KeyboardBackspaceIconSty: {
        fontSize: "35px",
        color: theme.palette.primary,
        [theme.breakpoints.down('md')]: {
            marginLeft: "-20px",
            fontSize: "1.7rem",
        },
    },
    saveBtn: {
        padding: '10px 20px',
        [theme.breakpoints.down('md')]: {
            padding: '5px 10px',
        },
    }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});



export default function InvoicePaymentSettings(props) {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const theme = useTheme();

    const { user } = useSelector((state) => state.auth);

    const {
        tx, setTx, updateApi, walletId, setPageLevel, setLoadingBool
    } = props;
    const {
        col, invoiceEditBody, nextIcon, platformAcceptCont,
        journalEntryCont, chartAccountTitle, offlinePaymentCont,
        paidBtnCont, giveMargin, offlinePaymentHeader, hederText,
        KeyboardBackspaceIconSty, saveBtn
    } = classes;

    const [open, setOpen] = useState(false);
    const [txInvoiceNos, setTxInvoiceNos] = useState([]);

    const [selectedDwollaAcc, setSelectedDwollaAcc] = useState(null);
    const [selectedStripeAcc, setSelectedStripeAcc] = useState(null);
    const [maxNo, setMaxNo] = useState()
    const [show, setShow] = useState("stripe")
    const oldChartAccount = tx?.BankChartAccount || null
    const [chartAccounts, setChartAccounts] = useState([]);
    const [selectedChartAccount, setSelectedChartAccount] = useState(oldChartAccount);
    const [chartAccountText, setChartAccountText] = useState("")
    const [openChartAcc, setOpenChartAcc] = useState(false)
    const [stateChange, setStateChange] = useState(false)
    const [paymentTypeValue, setPaymentTypeValue] = useState(null)
    const [paymentTypeText, setPaymentTypeText] = useState("")
    const [showPayment, setShowPayment] = useState("markAsPaid")
    const [openErr, setOpenErr] = useState(false)
    const [submitionFailMsg, setSubmitionFailMsg] = useState("")


    const paymentTypeSelect = async (value) => {
        setPaymentTypeValue(value)

        await update({
            _id: tx?._id,
            paymentBy: value
        })
    }

    const getOptionLabelSimple = (value) => {
        return value || " "
    }

    const handleCloseErrBox = () => {
        setOpenErr(false)
    }


    const handleClose = () => {
        setOpen(false);
    }
    const onNew = () => {
        setOpen(true);
    };
    useEffect(() => {
        getTxByWallet({ walletId: walletId, type: "Invoice" }) // keep bill in an array 
            .then((data) => {
                if (data.length > 0) {
                    constrcutArrayOfBillNo(data, "invNo")
                        .then((newArr) => {
                            setTxInvoiceNos(newArr);
                            console.log(txInvoiceNos);

                            let maxNoff = 1
                            newArr.map((number) => {
                                if (parseInt(number) > maxNoff) {
                                    maxNoff = parseInt(number)
                                }
                            })
                            setMaxNo(maxNoff)
                        })
                        .catch((err) => {
                            console.log(err);
                        })
                }
            })
            .catch((error) => {
                console.log(error);
            })


        const type = { classification: 'Bank', wallet: walletId }

        getIncomeChartAccounts({ type })
            .then((accounts) => {
                console.log(accounts);

                const addObject = {
                    _id: 'New',
                    name: "+ Add New",
                    numDays: "0"
                };
                const newFiltered = [addObject, ...accounts]

                setChartAccounts(newFiltered)
            })
            .catch((err) => {
                console.log(err);
            })

    }, []);


    const update = async (obj, isBankChartUpdate = false) => {
        setLoadingBool(true)

        if (isBankChartUpdate) {
            const newObj = {
                _id: obj?._id,
                BankChartAccount: obj?.BankChartAccount?._id
            }
            await updateApi(newObj)
            setTx({
                ...tx,
                BankChartAccount: obj?.BankChartAccount
            })
        } else {
            await updateApi(obj)
            setTx({
                ...tx,
                ...obj
            })
        }

        setLoadingBool(false)
    }

    const onBankAccountSelect = async (value) => {
        console.log(value)
        setSelectedDwollaAcc(value)

        await update({
            _id: tx?._id,
            dwollaConfig: {
                receiverDwollaBankAcc: value?.url
            },
        })
    }

    const onStripeBankAccountSelect = async (value) => {
        setSelectedStripeAcc(value)
        console.log(value)

        await update({
            _id: tx?._id,
            stripeConfig: {
                receiverStripeAcc: value?.stripeConnectAccountId
            },
        })
    }

    const txSubmit = async () => {
        setLoadingBool(true)


        let taxItemBool = false
        let isItemMissChart = false

        let items = tx?.billList?.items
        if (!tx?.secondParty || !tx?.secondPartyWallet) {
            console.log(tx)
            setSubmitionFailMsg("Customer is missing! Please select a customer")
            setOpenErr(true)
            return;
        }

        items.length > 0 && items.map((item) => {
            if (item?.tax) {
                taxItemBool = true
            }

            if (!item?.chartAccount?._id) {
                isItemMissChart = true
            }
        })

        if (isItemMissChart) {
            setSubmitionFailMsg("item Chart Account is missing! Please select category in item carefully")
            setOpenErr(true)
            return;
        }

        if (tx?.billList?.tax?.enabled && taxItemBool && !tx?.billList?.taxRelationModel?.chartAccount?._id) {
            setSubmitionFailMsg("Tax Chart Account is missing! Please select a tax")
            setOpenErr(true)
            return;
        }

        if (tx?.billList?.discount?.enabled && !tx?.billList?.discountRelationModel?.chartAccount?._id) {
            setSubmitionFailMsg("Discount Chart Account is missing! Please select a discount")
            setOpenErr(true)
            return;
        }

        if (tx?.processed) {
            console.log("calling edit submit")
            await editSubmittedInv()
        } else {
            console.log("calling initial Submit")
            await invInitialSubmit()
        }

        setLoadingBool(false)
    }

    const invInitialSubmit = async () => {
        await invoiceInitialSubmit({ tx, walletId })
            .then((data) => {
                console.log(data)
            })
    }

    const editSubmittedInv = async () => {

        await editSubmittedInvoice({ tx, walletId })
            .then((data) => {
                console.log(data)
            })
    }


    const markAsPaid = async () => {
        setLoadingBool(true)
        setStateChange(true)

        let taxItemBool = false
        let isItemMissChart = false

        let items = tx?.billList?.items
        if (!tx?.secondParty || !tx?.secondPartyWallet) {
            console.log(tx)
            setSubmitionFailMsg("Customer is missing! Please select a customer")
            setOpenErr(true)
            return;
        }

        items.length > 0 && items.map((item) => {
            if (item?.tax) {
                taxItemBool = true
            }

            if (!item?.chartAccount?._id) {
                isItemMissChart = true
            }
        })

        if (isItemMissChart) {
            setSubmitionFailMsg("item Chart Account is missing! Please select category in item carefully")
            setOpenErr(true)
            return;
        }

        if (tx?.billList?.tax?.enabled && taxItemBool && !tx?.billList?.taxRelationModel?.chartAccount?._id) {
            setSubmitionFailMsg("Tax Chart Account is missing! Please select a tax")
            setOpenErr(true)
            return;
        }

        if (tx?.billList?.discount?.enabled && !tx?.billList?.discountRelationModel?.chartAccount?._id) {
            setSubmitionFailMsg("Discount Chart Account is missing! Please select a discount")
            setOpenErr(true)
            return;
        }

        if (!tx?.BankChartAccount?._id) {
            setSubmitionFailMsg("Please Choose the bank account where the amount will added after the payment done")
            setOpenErr(true)
            return;
        }

        if (showPayment === "markAsPaid" && paymentTypeValue === null) {
            setSubmitionFailMsg("Please select a payment accept type!!")
            setOpenErr(true)
            return;
        }

        if (tx?.processed) {
            console.log("calling submitted")
            await markAsPaidSubmittedInv()

            setLoadingBool(false)
            let updatedTx = {
                ...tx,
                status: "Paid"
            }

            setTx(updatedTx)
            setPageLevel("otherSettings")
            setStateChange(false)

        } else {
            console.log("calling initial")
            await markAsPaidInv()

            setLoadingBool(false)
            let updatedTx = {
                ...tx,
                status: "Paid",
                processed: true
            }

            setTx(updatedTx)
            setPageLevel("otherSettings")
            setStateChange(false)
        }
    }

    const markAsPaidInv = async () => {
        await markInvoiceAsPaid({ tx, walletId })
            .then((data) => {
                console.log(data)
            })
    }

    const markAsPaidSubmittedInv = async () => {
        await markSubmittedInvoiceAsPaid({ tx, walletId })
            .then((data) => {
                console.log(data)
            })
    }

    const getOptionLabel = (option) => {
        return option.name || " "
    }

    const onNewChartAccount = () => {
        setOpenChartAcc(true);
    };

    const onSelectChartAccount = async (value) => {
        console.log("selected" + value)
        setSelectedChartAccount(value)

        await update({
            _id: tx?._id,
            BankChartAccount: value
        },
            true
        )
    }

    const chartAccountCreateDialog = async (value) => {
        console.log(value);
        setOpenChartAcc(value)

        const type = { classification: 'Bank', wallet: walletId }

        getIncomeChartAccounts({ type })
            .then(async (accounts) => {
                const addObject = {
                    _id: 'New',
                    name: "+ Add New",
                    numDays: "0"
                };

                const newFiltered = [addObject, ...accounts]
                const len = accounts?.length
                setChartAccounts(newFiltered)
                setSelectedChartAccount(accounts[len - 1])

                await update({
                    _id: tx?._id,
                    BankChartAccount: accounts[len - 1]
                },
                    true
                )
            })
            .catch((err) => {
                console.log(err);
            })
    }


    console.log(tx)

    return (
        <div className={col}>
            <CommonAppBar
                leftItems={[
                    (
                        <IconButton className={classes.iconButtonStyle} onClick={() => {
                            setPageLevel("otherSettings")
                        }}>
                            <KeyboardBackspaceIcon className={KeyboardBackspaceIconSty} />
                        </IconButton>
                    ),
                    (
                        <Typography className={hederText} >
                            {walletId === tx?.firstPartyWallet._id ? (<>Invoice</>) : (<>Bill</>)}
                            #{tx?.invNo}
                        </Typography>
                    ),
                    (
                        <IconButton color="primary" onClick={() => onNew()} ><EditIcon /></IconButton>
                    )
                ]}
                rightItems={[
                    (
                        selectedChartAccount ? (
                            <Button
                                variant="contained"
                                color="primary"
                                endIcon={<span className={nextIcon} ><KeyboardBackspaceIcon /></span>}
                                onClick={txSubmit}
                                className={saveBtn}
                            >
                                Save & Submit
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                color="primary"
                                endIcon={<span className={nextIcon} ><KeyboardBackspaceIcon /></span>}
                                className={saveBtn}
                                disabled
                            >
                                Save & Submit
                            </Button>
                        )
                    )
                ]}
            />
            <DialogBillNo
                open={open}
                handleClose={handleClose}
                txNos={txInvoiceNos}
                tx={tx}
                setTx={setTx}
                type={"Invoice"}
                maxNo={maxNo}
                setMaxNo={setMaxNo}
                walletId={walletId}
                setLoadingBool={setLoadingBool}
            />

            <div className={invoiceEditBody} >
                <div style={{ width: '95%' }} >

                    <div className={journalEntryCont} >
                        <div className={chartAccountTitle} >
                            <span style={{ marginRight: "10px" }} >
                                <AccountBalanceIcon style={{ color: '#4CACEF', fontSize: "25px" }} />
                            </span>
                            Choose the bank account where the amount will added after the payment done
                        </div>
                        <MyAutocomplete
                            isSmall={false}
                            value={selectedChartAccount}
                            text={chartAccountText}
                            setText={setChartAccountText}
                            placeholder={"Chart Account"}
                            results={chartAccounts}
                            getOptionLabel={getOptionLabel}
                            onSelect={onSelectChartAccount}
                            label={"Chart Account"}
                            onNew={onNewChartAccount}
                            setWidth={"300px"}
                        />
                        <ChartAccountCreateForBank
                            walletId={walletId}
                            openDialog={openChartAcc}
                            setOpenChart={chartAccountCreateDialog}
                        />
                    </div>


                    <MyNavBar
                        title={"Payment"}
                        show={showPayment}
                        setShow={setShowPayment}
                        walletId={walletId}
                        Component={null}
                        isMenu={false}
                        options={[
                            {
                                value: "markAsPaid",
                                label: "Mark As Paid",
                                Component: <Paper variant="outlined" className={giveMargin} >
                                    <div className={offlinePaymentCont} >
                                        <div className={offlinePaymentHeader} >
                                            <AssignmentTurnedInIcon style={{ color: "#4AABF0" }} />
                                            <Typography>Mark the transaction as paid (<span style={{ color: 'red' }}>*</span>After marking as paid you can't change the transaction)</Typography>
                                        </div>
                                        <div className={paidBtnCont} >
                                            <div>

                                                <MyAutocomplete
                                                    isSmall={false}
                                                    value={paymentTypeValue}
                                                    text={paymentTypeText}
                                                    setText={setPaymentTypeText}
                                                    placeholder={"Payment Accept Type"}
                                                    results={paymentTypes}
                                                    getOptionLabel={getOptionLabelSimple}
                                                    onSelect={paymentTypeSelect}
                                                    label={"Payment Accept Type"}
                                                    setWidth={"300px"}
                                                />

                                            </div>
                                            {selectedChartAccount ? (
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    style={{ marginTop: "20px" }}
                                                    startIcon={<AttachMoneyIcon />}
                                                    onClick={markAsPaid}
                                                >
                                                    Paid
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    style={{ marginTop: "20px" }}
                                                    startIcon={<AttachMoneyIcon />}
                                                    disabled
                                                >
                                                    Paid
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </Paper>
                            },
                            {
                                value: "acceptOnlinePayment",
                                label: "Accept Online Payment",
                                Component: <div>
                                    <MyNavBar
                                        title={""}
                                        show={show}
                                        setShow={setShow}
                                        walletId={walletId}
                                        Component={null}
                                        isMenu={false}
                                        options={[
                                            {
                                                value: "stripe",
                                                label: "Stripe",
                                                Component: <div className={platformAcceptCont} >
                                                    <StripeAccountOptions
                                                        setSelectedStripeAcc={setSelectedStripeAcc}
                                                        selectedStripeAcc={selectedStripeAcc}
                                                        onBankAccountSelect={onStripeBankAccountSelect}
                                                        userprofile={user?.profile}
                                                        walletId={user?.wallet}
                                                        user={user}
                                                        tx={tx}
                                                        stripeText={stripeText}
                                                        stripeLogo={stripeLogo}
                                                    />
                                                </div>
                                            },
                                            {
                                                value: "dwolla",
                                                label: "Dwolla",
                                                Component: <div className={platformAcceptCont} >
                                                    <DwollaAccountOptions
                                                        setSelectedDwollaAcc={setSelectedDwollaAcc}
                                                        selectedDwollaAcc={selectedDwollaAcc}
                                                        onBankAccountSelect={onBankAccountSelect}
                                                        userprofile={user?.profile}
                                                        walletId={user?.wallet}
                                                        user={user}
                                                        tx={tx}
                                                        dwollaLogo={dwollaLogo}
                                                    />
                                                </div>
                                            }
                                        ]}
                                    />
                                </div>
                            },
                        ]}
                    />
                </div>
            </div>



            <Dialog
                open={openErr}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleCloseErrBox}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title" style={{ color: 'red' }} >{submitionFailMsg}</DialogTitle>
                <DialogActions>
                    <Button onClick={handleCloseErrBox} color="primary">
                        ok
                    </Button>
                </DialogActions>
            </Dialog>



        </div >
    );
}

