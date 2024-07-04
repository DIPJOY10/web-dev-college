import React, { useState, useEffect } from 'react';
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import { Typography } from "@material-ui/core";
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import ClearIcon from '@material-ui/icons/Clear';
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
import Avatar from '@material-ui/core/Avatar';
import moment from 'moment';
import TextField from '@material-ui/core/TextField';
import LessText from '../styled/CommonComponents/LessText';
import CircularProgress from '@material-ui/core/CircularProgress';
import { getRelationUnitsByProject, updateRentalRelationUnit } from "./apiCall";
import OneTimeBillEdit from './OneTimeBillEdit';
import MonthlyBillEdit from './MonthlyBillEdit';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Checkbox from '@material-ui/core/Checkbox';
import { faHeartPulse } from '@fortawesome/free-solid-svg-icons';
import CheckIcon from '@material-ui/icons/Check';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        backgroundColor: "#ffffff",
        padding: "20px"
    },
    subAddressCont: {
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "15px"
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
        width: "27%"
    },
    datePickerTriple: {
        width: "27%",
        margin: "0px",
        marginTop: "-10px"
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
    refundableCont: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    }
}));

export default function PaymentSetting(props) {
    const history = useHistory();
    const classes = useStyles();
    const { teamId } = useParams();
    const DateNow = new Date();

    const {
        currentRentalUnit, setCurrentRentalUnit, team,
        setRentalUnitSettingPage, setLoadingBool
    } = props;

    const [createDialog, setCreateDialog] = useState(false);
    const [newBillName, setNewBillName] = useState("");
    const [openNewBill, setOpenNewBill] = useState(false);
    const [createBillType, setCreateBillType] = useState("");
    const [monthlyBills, setMonthlyBills] = useState(currentRentalUnit?.monthlyBills || []);
    const [oneTimeBills, setOneTimeBills] = useState(currentRentalUnit?.oneTimeBills || []);
    const [multiInputBool, setmultiInputBool] = useState(false);

    const [selectableOneTimeBillItems, setSelectableOneTimeBillItems] = useState([])
    const [selectableMonthlyBillItems, setSelectableMonthlyBillItems] = useState([])


    useEffect(() => {
        setSelectableOneTimeBillItems(currentRentalUnit?.oneTimeBills || [])
        setSelectableMonthlyBillItems(currentRentalUnit?.monthlyBills || [])
    }, [currentRentalUnit])

    const handleCloseNewBill = () => {
        setOpenNewBill(false);
    };

    const editMonthlyInput = (index, key, value) => {
        setmultiInputBool(!multiInputBool)
        let inputDataArr = monthlyBills;
        let editObj = {
            ...monthlyBills[index],
            [key]: value,
        }
        inputDataArr[index] = editObj;
        setMonthlyBills(inputDataArr)
        setmultiInputBool(!multiInputBool)
    }

    const editOneTimeInput = (index, key, value) => {
        setmultiInputBool(!multiInputBool)
        let inputDataArr = oneTimeBills;
        let editObj = {
            ...oneTimeBills[index],
            [key]: value,
        }
        inputDataArr[index] = editObj;
        setOneTimeBills(inputDataArr)
        setmultiInputBool(!multiInputBool)
    }

    const removeInputLinesMonthlyBills = (index) => {
        let editedMonthlyBills = []
        monthlyBills.map((bill, i) => {
            if (i !== index) {
                editedMonthlyBills.push(bill)
            }
        })
        setMonthlyBills(editedMonthlyBills)
    }

    const removeInputLinesOneTimeBills = (index) => {
        let editedOneTimeBills = []
        oneTimeBills.map((bill, i) => {
            if (i !== index) {
                editedOneTimeBills.push(bill)
            }
        })
        setOneTimeBills(editedOneTimeBills)
    }

    const createNewMonthlyBill = async () => {
        if (createBillType === "OneTime" && newBillName?.length > 2) {
            let newOneTimeBills = oneTimeBills
            let newOneTimeBillObj = {
                type: newBillName,
                amount: 0,
                dueDate: DateNow,
                Latefees: 0,
                refundable: false,
                used: false,
            }
            newOneTimeBills.push(newOneTimeBillObj)
            setOneTimeBills(newOneTimeBills)

        } else if (createBillType === "Monthly" && newBillName?.length > 2) {
            let newMonthlyBills = monthlyBills
            let newMonthlyBillObj = {
                type: newBillName,
                amount: 0,
                period: 0,
                Latefees: 0,
                refundable: false,
                used: false,
            }
            newMonthlyBills.push(newMonthlyBillObj)
            setMonthlyBills(newMonthlyBills)

        }
        setNewBillName("")
        handleCloseNewBill()
    }

    const saveMonthlyBills = async () => {
        setLoadingBool(true)
        await updateRentalRelationUnit({
            rentalRelation: {
                _id: currentRentalUnit?._id,
                monthlyBills: monthlyBills
            }
        })
            .then((data) => {
                setCurrentRentalUnit(data)
                let newMonthlyBills = data?.monthlyBills

                setMonthlyBills(newMonthlyBills)
            })
            .catch((err) => {
                console.log(err)
            })
        setLoadingBool(false)
    }

    const saveOneTimeBills = async () => {
        setLoadingBool(true)
        await updateRentalRelationUnit({
            rentalRelation: {
                _id: currentRentalUnit?._id,
                oneTimeBills: oneTimeBills
            }
        })
            .then((data) => {
                setCurrentRentalUnit(data)
                let newOneTimeBills = data?.oneTimeBills

                setOneTimeBills(newOneTimeBills)
            })
            .catch((err) => {
                console.log(err)
            })
        setLoadingBool(false)
    }


    console.log(oneTimeBills)

    return (
        <div className={classes.root}>
            <div style={{ width: '100%', opacity: '0.5' }} >
                <Typography>One Time Bill Item(s)</Typography>
            </div>
            <div className={classes.multiInput} >
                {oneTimeBills.length > 0 && oneTimeBills.map((bill, i) => (
                    <div key={i} className={classes.inputCont} >

                        {bill?.used ? (
                            <TextField
                                id="outlined-basic"
                                size="small"
                                label={bill?.type}
                                variant="outlined"
                                className={classes.tripleInput}
                                value={bill?.amount}
                                onChange={(e) => { editOneTimeInput(i, "amount", e.target.value) }}
                                disabled
                            />
                        ) : (
                            <TextField
                                id="outlined-basic"
                                size="small"
                                label={bill?.type}
                                variant="outlined"
                                className={classes.tripleInput}
                                value={bill?.amount}
                                onChange={(e) => { editOneTimeInput(i, "amount", e.target.value) }}
                            />
                        )}

                        {bill?.used ? (
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
                                        editOneTimeInput(i, "dueDate", date)
                                    }}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                />
                            </MuiPickersUtilsProvider>
                        ) : (
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
                                        editOneTimeInput(i, "dueDate", date)
                                    }}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                />
                            </MuiPickersUtilsProvider>
                        )}

                        {bill?.used ? (
                            <TextField
                                id="outlined-basic"
                                size="small"
                                label="lateFees"
                                variant="outlined"
                                className={classes.tripleInput}
                                value={bill?.Latefees}
                                onChange={(e) => { editOneTimeInput(i, "Latefees", e.target.value) }}
                                disabled
                            />
                        ) : (
                            <TextField
                                id="outlined-basic"
                                size="small"
                                label="lateFees"
                                variant="outlined"
                                className={classes.tripleInput}
                                value={bill?.Latefees}
                                onChange={(e) => { editOneTimeInput(i, "Latefees", e.target.value) }}
                            />
                        )}


                        <div className={classes.refundableCont} >
                            <Typography style={{ fontSize: "12px", opacity: "0.7" }} >Refundable</Typography>

                            {bill?.used ? (
                                <Checkbox
                                    checked={bill?.refundable}
                                    onChange={() => { editOneTimeInput(i, "refundable", !bill?.refundable) }}
                                    color="primary"
                                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                                    style={{ padding: "0px" }}
                                    disabled
                                />
                            ) : (
                                <Checkbox
                                    checked={bill?.refundable}
                                    onChange={() => { editOneTimeInput(i, "refundable", !bill?.refundable) }}
                                    color="primary"
                                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                                    style={{ padding: "0px" }}
                                />
                            )}
                        </div>

                        {bill?.used ? (
                            <IconButton>
                                <CheckIcon style={{ color: "green" }} />
                            </IconButton>
                        ) : (
                            <IconButton
                                onClick={() => { removeInputLinesOneTimeBills(i) }}
                            >
                                <ClearIcon />
                            </IconButton>
                        )}

                    </div>
                ))}
            </div>
            <div className={classes.addBtnCont} >
                <div></div>
                <div>
                    <Button
                        variant="contained"
                        size="large"
                        color="primary"
                        onClick={() => {
                            setOpenNewBill(true)
                            setCreateBillType("OneTime")
                        }}
                        className={classes.addBtn}
                    >
                        <AddIcon />
                        Add New Bill Item
                    </Button>

                    <Button
                        variant="contained"
                        size="large"
                        color="primary"
                        onClick={() => {
                            saveOneTimeBills()
                        }}
                        className={classes.addBtn}
                        style={{ marginLeft: "20px" }}
                    >
                        <SaveIcon />
                        Save Changes
                    </Button>
                </div>
            </div>

            <OneTimeBillEdit
                oneTimeBills={oneTimeBills}
                setOneTimeBills={setOneTimeBills}
                team={team}
                currentRentalUnit={currentRentalUnit}
                setCurrentRentalUnit={setCurrentRentalUnit}
                setLoadingBool={setLoadingBool}
                editOneTimeInput={editOneTimeInput}
            />


            <div style={{ width: '100%', opacity: '0.5' }} >
                <Typography>Monthly Bill Item(s)</Typography>
            </div>
            <div className={classes.multiInput} >
                {monthlyBills.length > 0 && monthlyBills.map((inputLine, i) => (
                    <div className={classes.inputCont} >
                        {inputLine?.used ? (
                            <TextField
                                id="outlined-basic"
                                size="small"
                                label={inputLine?.type}
                                variant="outlined"
                                className={classes.tripleInput}
                                value={inputLine?.amount}
                                onChange={(e) => { editMonthlyInput(i, "amount", e.target.value) }}
                                disabled
                            />
                        ) : (
                            <TextField
                                id="outlined-basic"
                                size="small"
                                label={inputLine?.type}
                                variant="outlined"
                                className={classes.tripleInput}
                                value={inputLine?.amount}
                                onChange={(e) => { editMonthlyInput(i, "amount", e.target.value) }}
                            />
                        )}

                        {inputLine?.used ? (
                            <TextField
                                id="outlined-basic"
                                size="small"
                                label="Due Period (days)"
                                variant="outlined"
                                className={classes.tripleInput}
                                value={inputLine?.period}
                                onChange={(e) => { editMonthlyInput(i, "period", e.target.value) }}
                                disabled
                            />
                        ) : (
                            <TextField
                                id="outlined-basic"
                                size="small"
                                label="Due Period (days)"
                                variant="outlined"
                                className={classes.tripleInput}
                                value={inputLine?.period}
                                onChange={(e) => { editMonthlyInput(i, "period", e.target.value) }}
                            />
                        )}

                        {inputLine?.used ? (
                            <TextField
                                id="outlined-basic"
                                size="small"
                                label="Latefees"
                                variant="outlined"
                                className={classes.tripleInput}
                                value={inputLine?.Latefees}
                                onChange={(e) => { editMonthlyInput(i, "Latefees", e.target.value) }}
                                disabled
                            />
                        ) : (
                            <TextField
                                id="outlined-basic"
                                size="small"
                                label="Latefees"
                                variant="outlined"
                                className={classes.tripleInput}
                                value={inputLine?.Latefees}
                                onChange={(e) => { editMonthlyInput(i, "Latefees", e.target.value) }}
                            />
                        )}

                        {inputLine?.used ? (
                            <IconButton>
                                <CheckIcon style={{ color: "green" }} />
                            </IconButton>
                        ) : (
                            <IconButton
                                onClick={() => { removeInputLinesMonthlyBills(i) }}
                            >
                                <ClearIcon />
                            </IconButton>
                        )}
                    </div>
                ))}
            </div>
            <div className={classes.addBtnCont} >
                <div></div>
                <div>
                    <Button
                        variant="contained"
                        size="large"
                        color="primary"
                        onClick={() => {
                            setOpenNewBill(true)
                            setCreateBillType("Monthly")
                        }}
                        className={classes.addBtn}
                    >
                        <AddIcon />
                        Add New Bill Item
                    </Button>

                    <Button
                        variant="contained"
                        size="large"
                        color="primary"
                        onClick={() => {
                            saveMonthlyBills()
                        }}
                        className={classes.addBtn}
                        style={{ marginLeft: "20px" }}
                    >
                        <SaveIcon />
                        Save Changes
                    </Button>
                </div>
            </div>

            <MonthlyBillEdit
                monthlyBills={monthlyBills}
                setMonthlyBills={setMonthlyBills}
                team={team}
                currentRentalUnit={currentRentalUnit}
                setCurrentRentalUnit={setCurrentRentalUnit}
                setLoadingBool={setLoadingBool}
                editOneTimeInput={editOneTimeInput}
            />

            <Dialog open={openNewBill} onClose={handleCloseNewBill} aria-labelledby="form-dialog-title">
                <DialogContent>
                    <TextField
                        id="outlined-basic"
                        size="small"
                        label="Bill Type"
                        variant="outlined"
                        style={{ width: "100%" }}
                        value={newBillName}
                        onChange={(e) => { setNewBillName(e.target.value) }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseNewBill} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={createNewMonthlyBill} color="primary">
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>

            <div className={classes.subAddressCont} style={{ marginTop: "40px" }} >
                <div></div>

                <div>
                    <Button
                        variant="contained"
                        color="primary"
                        style={{ marginLeft: "30px" }}
                        startIcon={<ChevronLeftIcon />}
                        onClick={() => {
                            setRentalUnitSettingPage("documents")
                        }}
                    >
                        previous
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        style={{ marginLeft: "30px" }}
                        startIcon={<ChevronRightIcon />}
                        onClick={() => { setRentalUnitSettingPage("keys") }}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}
