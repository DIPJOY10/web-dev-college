import React, { useState, useEffect } from 'react';
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import { Typography } from "@material-ui/core";
import Button from '@material-ui/core/Button';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import Avatar from '@material-ui/core/Avatar';
import moment from 'moment';
import AddIcon from '@material-ui/icons/Add';
import LessText from '../styled/CommonComponents/LessText';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
    getRelationUnitsByProject, createTxForRentalRelation,
    updateRentalRelationUnit, getTxsByRentalRelation
} from "./apiCall";
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DateFnsUtils from '@date-io/date-fns';
import DialogActions from '@material-ui/core/DialogActions';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import EditIcon from '@material-ui/icons/Edit';


const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        backgroundColor: "#ffffff",
    },
    oneTimeBillCont: {
        width: "100%",
        border: "1px solid #E1E2E5",
        padding: "10px",
        paddingTop: "15px",
        marginBottom: "15px"
    },
    addBtnCont: {
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        marginBottom: '30px'
    },
    addBtn: {
        padding: "4px 10px",
    },
    multiInput: {
        width: "100%",
        border: "1px solid #E1E2E5",
        padding: "10px",
        paddingTop: "15px",
        marginBottom: "15px"
    },
    inputCont: {
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "10px",
    },
    tripleInput: {
        width: "28%"
    },
    datePickerTriple: {
        width: "28%",
        margin: "0px",
        marginTop: "-10px"
    }
}));

export default function OneTimeBillEdit(props) {
    const history = useHistory();
    const classes = useStyles();
    const { teamId } = useParams();
    const {
        oneTimeBills, setOneTimeBills, team,
        currentRentalUnit, setCurrentRentalUnit,
        setLoadingBool
    } = props;

    const { auth } = useSelector((state) => state);
    const [currentPageBills, setCurrentPageBills] = useState([]);
    const [availableBillItems, setAvailableBillItems] = useState([]);
    const [multiInputBool, setmultiInputBool] = useState(false);
    const [selectedBillItems, setSelectedBillItems] = useState([]);
    const [txs, setTxs] = useState([]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        let unUsedBills = []
        oneTimeBills?.length > 0 && oneTimeBills.map((bill) => {
            if (!bill?.used) {
                unUsedBills.push(bill)
            }
        })
        setCurrentPageBills(oneTimeBills)
        setAvailableBillItems(unUsedBills)
        getTxs()
    }, [oneTimeBills])

    const getTxs = async () => {
        await getTxsByRentalRelation({ rentalRelationId: currentRentalUnit?._id, isOneTimeBill : true })
            .then((data) => {
                setTxs(data)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const handleClose = () => {
        setOpen(false)
    }

    const editOneTimeInput = (index, value) => {
        setmultiInputBool(!multiInputBool)
        let inputDataArr = availableBillItems;
        let editObj = {
            ...availableBillItems[index],
            used: !value,
        }
        inputDataArr[index] = editObj;
        setAvailableBillItems(inputDataArr)

        let updatedOneTimeBills = []
        currentPageBills.map((oldBill) => {
            if (oldBill?._id === availableBillItems[index]?._id) {
                let newBillObj = {
                    ...availableBillItems[index],
                    used: !value,
                }
                updatedOneTimeBills.push(newBillObj)
            } else {
                updatedOneTimeBills.push(oldBill)
            }
        })
        setCurrentPageBills(updatedOneTimeBills)

        if (value) {
            const result = selectedBillItems.filter((bill) => bill?._id !== availableBillItems[index]?._id);
            setSelectedBillItems(result)
        } else {
            let newSelectedArr = [...selectedBillItems, availableBillItems[index]]
            setSelectedBillItems(newSelectedArr)
        }
        setmultiInputBool(!multiInputBool)
    }

    const createBill = async () => {
        if (selectedBillItems.length > 0) {

            setOpen(false)
            setLoadingBool(true)
            const txObj = {
                walletId: team?.wallet,
                bankChartAccountName: "Cash and Cash Equivalent",
                bankChartAccountQbType: "CashOnHand",
                billItems: selectedBillItems,
                firstPartyWallet: team?.wallet,
                secondPartyWallet: currentRentalUnit?.tenant?.parent?.wallet,
                firstParty: team?.parent?.profile?._id,
                secondParty: currentRentalUnit?.tenant?._id,
                user: auth?.user?._id,
                rentalRelationId: currentRentalUnit?._id,
                isOneTimeBill: true
            }

            await createTxForRentalRelation(txObj)
                .then(async (data) => {
                    await updateRentalRelationUnit({
                        rentalRelation: {
                            _id: currentRentalUnit?._id,
                            oneTimeBills: currentPageBills
                        }
                    })
                        .then(async (data) => {
                            setCurrentRentalUnit(data)
                            let newOneTimeBills = data?.oneTimeBills
                            setOneTimeBills(newOneTimeBills)

                            let unUsedBills = []
                            newOneTimeBills?.length > 0 && newOneTimeBills.map((bill) => {
                                if (!bill?.used) {
                                    unUsedBills.push(bill)
                                }
                            })

                            setAvailableBillItems(unUsedBills)
                            await getTxs()
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                })
                .catch((err) => {
                    console.log(err)
                })
            setLoadingBool(false)
        }
    }


    return (
        <div className={classes.root}>
            <div style={{ width: '100%', opacity: '0.7' }} >
                <Typography>One Time Bill(s)</Typography>
            </div>
            <div className={classes.oneTimeBillCont} >
            {txs.length > 0 ? (
                <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center" style={{ padding: "5px 10px 5px 10px" }} ></TableCell>
                                <TableCell align="center" style={{ padding: "5px 10px 5px 10px" }} >Date</TableCell>
                                <TableCell align="center" style={{ padding: "5px 10px 5px 10px" }} >Invoice No</TableCell>
                                <TableCell align="center" style={{ padding: "5px 10px 5px 10px" }} >Amount</TableCell>
                                <TableCell align="center" style={{ padding: "5px 10px 5px 10px" }} >Status</TableCell>
                                <TableCell align="center" style={{ padding: "5px 10px 5px 10px" }} >Edit</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {txs.map((tx, i) => (
                                <TableRow key={i}>
                                    <TableCell align="center" style={{ padding: "5px 10px 5px 10px" }} >{i + 1}</TableCell>
                                    <TableCell align="center" style={{ padding: "5px 10px 5px 10px" }} >
                                        {new Date(tx?.createdAt).getMonth() + 1 + "/" + new Date(tx?.createdAt).getDate() + "/" + new Date(tx?.createdAt).getFullYear()}
                                    </TableCell>
                                    <TableCell align="center" style={{ padding: "5px 10px 5px 10px" }} >{tx?.invNo}</TableCell>
                                    <TableCell align="center" style={{ padding: "5px 10px 5px 10px" }} >{tx?.finalAmount}</TableCell>
                                    <TableCell align="center" style={{ padding: "5px 10px 5px 10px" }} >{tx?.status}</TableCell>
                                    <TableCell align="center" style={{ padding: "5px 10px 5px 10px" }} >
                                        <IconButton
                                            onClick={() => {
                                                const path = '/admin/' + team?.wallet + "/tx/" + tx._id + '/edit';
                                                history.push(path);
                                            }}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                ) : (
                    <Typography>No invoice/transaction created</Typography>
                )}
            </div>
            <div className={classes.addBtnCont} >
                <div></div>
                <Button
                    variant="contained"
                    size="large"
                    color="primary"
                    onClick={() => { setOpen(true) }}
                    className={classes.addBtn}
                >
                    <AddIcon />
                    Invoice
                </Button>
            </div>
            <Dialog scroll={'paper'} onClose={handleClose} aria-labelledby="scroll-dialog-title" aria-describedby="scroll-dialog-description" open={open}>
                <DialogTitle
                    id="customized-dialog-title"
                    onClose={handleClose}
                    style={{ padding: "8px 24px" }}
                >
                    Select Bill Item(s)
                </DialogTitle>
                <DialogContent dividers={true} >
                    <div className={classes.multiInput} >
                        {availableBillItems.length > 0 && availableBillItems.map((bill, i) => (
                            <div key={i} className={classes.inputCont} >
                                <TextField
                                    id="outlined-basic"
                                    size="small"
                                    label={bill?.type}
                                    variant="outlined"
                                    className={classes.tripleInput}
                                    value={bill?.amount}
                                    disabled
                                />
                                <MuiPickersUtilsProvider
                                    utils={DateFnsUtils}
                                >
                                    <KeyboardDatePicker
                                        value={bill?.dueDate}
                                        className={classes.datePickerTriple}
                                        margin="normal"
                                        id="due-date-picker"
                                        label="Due Date"
                                        format="MM/dd/yyyy"
                                        onChange={(date) => {

                                        }}
                                        disabled
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                        }}
                                    />
                                </MuiPickersUtilsProvider>
                                <TextField
                                    id="outlined-basic"
                                    size="small"
                                    label="lateFees"
                                    variant="outlined"
                                    className={classes.tripleInput}
                                    value={bill?.Latefees}
                                    disabled
                                />
                                <Checkbox
                                    checked={bill?.used}
                                    onChange={() => { editOneTimeInput(i, bill?.used) }}
                                    color="primary"
                                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                                />
                            </div>
                        ))}
                    </div>
                </DialogContent>
                <DialogActions style={{ display: 'flex', justifyContent: 'space-between' }} >
                    <Button autoFocus onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button autoFocus onClick={() => { createBill() }} color="primary">
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
