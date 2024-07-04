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
    getRelationUnitsByProject, createTxTemplateForRentalRelation,
    updateRentalRelationUnit, getTxsTemplateByRentalRelation
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

export default function MonthlyBillEdit(props) {
    const history = useHistory();
    const classes = useStyles();
    const { teamId } = useParams();
    const { 
        monthlyBills, setMonthlyBills, team,
        currentRentalUnit, setCurrentRentalUnit,
        setLoadingBool
    } = props;

    const { auth } = useSelector((state) => state);
    const [currentPageBills, setCurrentPageBills] = useState([]);
    const [availableBillItems, setAvailableBillItems] = useState([]);
    const [multiInputBool, setmultiInputBool] = useState(false);
    const [selectedBillItems, setSelectedBillItems] = useState([]);
    const [txTemplates, setTxTemplates] = useState([]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        let unUsedBills = []
        monthlyBills?.length > 0 && monthlyBills.map((bill) => {
            if (!bill?.used) {
                unUsedBills.push(bill)
            }
        })
        setCurrentPageBills(monthlyBills)
        setAvailableBillItems(unUsedBills)
        getTxTemplates()
    }, [monthlyBills])

    const getTxTemplates = async () => {
        await getTxsTemplateByRentalRelation({ rentalRelationId: currentRentalUnit?._id })
            .then((data) => {
                setTxTemplates(data)
            })
            .catch((err) => {
                console.log(err)
            })
    }




    const handleClose = () => {
        setOpen(false)
    }

    const editMonthlyInput = (index, value) => {
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
            let nextDate = currentRentalUnit?.nextDate
            const dueDate = moment(nextDate).add(selectedBillItems[0]?.period, 'days')
            const LateFeesDueDate = dueDate.format() 

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
                isOneTimeBill: false,
                LateFeesDueDate: LateFeesDueDate
            }

            await createTxTemplateForRentalRelation(txObj)
                .then(async (data) => {
                    await updateRentalRelationUnit({
                        rentalRelation: {
                            _id: currentRentalUnit?._id,
                            monthlyBills: currentPageBills
                        }
                    })
                        .then(async (data) => {
                            setCurrentRentalUnit(data)
                            let newMonthlyBills = data?.monthlyBills
                            setMonthlyBills(newMonthlyBills)

                            let unUsedBills = []
                            newMonthlyBills?.length > 0 && newMonthlyBills.map((bill) => {
                                if (!bill?.used) {
                                    unUsedBills.push(bill)
                                }
                            })

                            setAvailableBillItems(unUsedBills)
                            await getTxTemplates()
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
                <Typography>Monthly Bill(s)</Typography>
            </div>
            <div className={classes.oneTimeBillCont} >
                {txTemplates.length > 0 ? (
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
                                {txTemplates.map((template, i) => (
                                    <TableRow key={i}>
                                        <TableCell align="center" style={{ padding: "5px 10px 5px 10px" }} >{i + 1}</TableCell>
                                        <TableCell align="center" style={{ padding: "5px 10px 5px 10px" }} >
                                            {new Date(template?.createdAt).getMonth() + 1 + "/" + new Date(template?.createdAt).getDate() + "/" + new Date(template?.createdAt).getFullYear()}
                                        </TableCell>
                                        <TableCell align="center" style={{ padding: "5px 10px 5px 10px" }} >{template?.invNo}</TableCell>
                                        <TableCell align="center" style={{ padding: "5px 10px 5px 10px" }} >{template?.finalAmount}</TableCell>
                                        <TableCell align="center" style={{ padding: "5px 10px 5px 10px" }} >{template?.status}</TableCell>
                                        <TableCell align="center" style={{ padding: "5px 10px 5px 10px" }} >
                                            <IconButton
                                                onClick={() => {
                                                    const path = '/admin/' + team?.wallet + "/txtmplate/" + template._id + '/edit';
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
                    Add New Bill
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
                                <TextField
                                    id="outlined-basic"
                                    size="small"
                                    label="Due Period (days)"
                                    variant="outlined"
                                    className={classes.tripleInput}
                                    value={bill?.period}
                                    disabled
                                />
                                <TextField
                                    id="outlined-basic"
                                    size="small"
                                    label="Latefees"
                                    variant="outlined"
                                    className={classes.tripleInput}
                                    value={bill?.Latefees}
                                    disabled
                                />
                                <Checkbox
                                    checked={bill?.used}
                                    onChange={() => { editMonthlyInput(i, bill?.used) }}
                                    color="primary"
                                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                                />
                            </div>
                        ))}
                    </div>
                </DialogContent>
                <DialogActions
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                >
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
