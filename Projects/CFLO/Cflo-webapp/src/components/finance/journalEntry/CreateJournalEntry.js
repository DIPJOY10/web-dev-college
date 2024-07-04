import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useParams, useHistory } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import RestoreIcon from '@material-ui/icons/Restore';
import { getChartAccounts, getJournalEntry, getJournalEntryAllNumbers, submitJournalEntryToProcess, updateJournalEntry } from './api';
import JournalLine from './Journal.Line';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import DialogBillNo from '../bill/DialogBillNo';
import Button from '@material-ui/core/Button';
import JournalEntryView from './JournalEntryView'
import CircularProgress from "@material-ui/core/CircularProgress";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CommonAppBar from '../../styled/CommonComponents/Commont.AppBar';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import useMediaQuery from "@material-ui/core/useMediaQuery";


const useStyles = makeStyles((theme) => ({
    headerAlign: {
        display: 'flex',
        alignItems: 'center',
        fontSize: '20px',
        fontWeight: '550'
    },
    journalNameDateCont: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '50px',
        padding: '20px',
        [theme.breakpoints.down('md')]: {
            flexDirection: 'column',
        },
    },
    loadingStyle: {
        width: '100%',
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: 'center'
    },
    appbarMainCont: {
        width: '100%',
        display: "flex",
        justifyContent: "space-between",
        alignItems: 'center',
    },
    KeyboardBackspaceIconSty: {
        fontSize: "35px",
        color: theme.palette.primary,
        [theme.breakpoints.down('md')]: {
            marginLeft: "-20px",
            fontSize: "1.7rem",
        },
    },
    hederText: {
        fontSize: "19px",
        [theme.breakpoints.down('md')]: {
            width: "85px",
            fontSize: "14px",
        },
    },
    saveBtn: {
        padding: '10px 20px',
        [theme.breakpoints.down('md')]: {
            padding: '5px 10px',
        },
    },
    jNameAndMemoCont: {
        [theme.breakpoints.down('md')]: {
            display: 'flex',
            flexDirection: 'column',
        },
    },
    memoSty: {
        width: "300px",
        marginLeft: "30px",
        marginBottom : "10px",
        [theme.breakpoints.down('md')]: {
            marginLeft: "0px",
        },
    }
}));

export default function CreateJournalEntry(props) {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const theme = useTheme();

    const DateNow = new Date();
    const { } = useSelector((state) => state);
    const {
        journalNameDateCont, loadingStyle, KeyboardBackspaceIconSty,
        hederText, saveBtn, jNameAndMemoCont, memoSty
    } = classes;
    const { walletId, journalId } = useParams();

    const [journalName, setJournalName] = useState("")
    const [journalMemo, setJournalMemo] = useState("")
    const [journalDate, setJournalDate] = useState(DateNow);
    const [open, setOpen] = useState(false);
    const [journalEntry, setJournalEntry] = useState({})
    const [journalLines, setJournalLines] = useState([])
    const [chartAccounts, setChartAccounts] = useState([])
    const [allJENumbers, setAllJENumbers] = useState([])
    const [maxJENumber, setMaxJENumber] = useState()

    const [totalDebit, setTotalDebit] = useState(0)
    const [totalCredit, setTotalCredit] = useState(0)

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getJournalEntry({
            journalId: journalId,
        })
            .then((data) => {
                setJournalEntry(data)
                setJournalLines(data?.entries)
                setJournalName(data?.title)
                setJournalDate(data?.date)
                setJournalMemo(data?.memo)

                let totalDebit = 0;
                let totalCredit = 0;
                const jLines = data?.entries

                jLines?.length > 0 && jLines.map((line) => {
                    if (line?.debit) {
                        totalDebit += parseInt(line?.amount || 0);
                    } else {
                        totalCredit += parseInt(line?.amount || 0);
                    }
                })
                setTotalDebit(totalDebit)
                setTotalCredit(totalCredit)
                setLoading(false)
            })
            .catch((err) => {
                console.log(err);
            })

        getChartAccounts({ walletId: walletId })
            .then((accounts) => {
                setChartAccounts(accounts)
            })
            .catch((err) => {
                console.log(err)
            })

        getJournalEntryAllNumbers({ walletId: walletId })
            .then((numbers) => {
                let jeNumbers = [];
                let maxNo = 1
                numbers.map((number) => {
                    jeNumbers.push(number?.journalEntryNo)
                    if (number?.journalEntryNo > maxNo) {
                        maxNo = number?.journalEntryNo
                    }
                })
                setAllJENumbers(jeNumbers)
                setMaxJENumber(maxNo)
            })
            .catch((err) => {
                console.log(err)
            })

    }, [journalId, walletId])

    const handleClose = () => {
        setOpen(false);
    }
    const onNew = () => {
        setOpen(true);
    };

    const submitJournalEntry = async () => {
        await submitJournalEntryToProcess({
            lines: journalLines,
            journalEntryId: journalId
        })
            .then((data) => {
                console.log(data);
                const goUrl = `/admin/${walletId}/statements`
                history.push(goUrl);
            })
            .catch((err) => {
                console.log(err);
            })
    }

    if (loading) {
        return (
            <div className={loadingStyle} >
                <CircularProgress />
            </div>
        )
    }



    return (
        <>{!journalEntry?.processed ?
            <div style={{ paddingTop: "50px" }} >
                <div>
                    <CommonAppBar
                        leftItems={[
                            (
                                <IconButton className={classes.iconButtonStyle} onClick={() => {
                                    history.goBack()

                                }}>
                                    <KeyboardBackspaceIcon className={KeyboardBackspaceIconSty} />
                                </IconButton>
                            ),
                            (
                                <Typography className={hederText} >
                                    Journal Entry #{journalEntry?.journalEntryNo}
                                </Typography>
                            ),
                            (
                                <IconButton color="primary" onClick={() => onNew()} ><EditIcon /></IconButton>
                            ),

                        ]}
                        rightItems={totalDebit === totalCredit && totalDebit !== 0 && totalCredit !== 0 ?
                            [(
                                <Button onClick={submitJournalEntry} className={saveBtn} variant="contained" color="primary" >
                                    Save & Close
                                </Button>
                            )]
                            :
                            [(
                                <Button variant="contained" className={saveBtn} color="primary" disabled >
                                    Save & Close
                                </Button>
                            )]
                        }
                    />
                    <DialogBillNo
                        open={open}
                        handleClose={handleClose}
                        txNos={allJENumbers}
                        tx={journalEntry}
                        setTx={setJournalEntry}
                        type={"Jornal Entry"}
                        maxNo={maxJENumber}
                        setMaxNo={setMaxJENumber}
                        walletId={walletId}
                    />
                </div>
                <div className={journalNameDateCont} >
                    <div className={jNameAndMemoCont} >
                        <TextField
                            id="outlined-password-input"
                            label="Name"
                            variant="outlined"
                            value={journalName}
                            onChange={async (event) => {
                                setJournalName(event.target.value)
                                await updateJournalEntry({
                                    _id: journalId,
                                    title: event.target.value
                                })
                            }}
                            size="small"
                            style={{ width: "200px", marginBottom : "10px" }}
                        />
                        <TextField
                            id="outlined-password-input"
                            label="Memo"
                            variant="outlined"
                            value={journalMemo}
                            onChange={async (event) => {
                                setJournalMemo(event.target.value)
                                await updateJournalEntry({
                                    _id: journalId,
                                    memo: event.target.value
                                })
                            }}
                            className={memoSty}
                            size="small"
                        />
                    </div>
                    <div>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                                value={journalDate}
                                margin="normal"
                                id="due-date-picker"
                                label="Journal Date"
                                format="MM/dd/yyyy"
                                onChange={async (date) => {
                                    setJournalDate(date)
                                    console.log(date)
                                    await updateJournalEntry({
                                        _id: journalId,
                                        date: date
                                    })
                                }}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                            />
                        </MuiPickersUtilsProvider>
                    </div>
                </div>
                <div>
                    <JournalLine
                        newJournalEntry={journalEntry}
                        newJournalLineskp={journalLines}
                        allChartAccounts={chartAccounts}
                        setJournalLinespk={setJournalLines}
                        setTotalDebit={setTotalDebit}
                        setTotalCredit={setTotalCredit}
                        totalDebit={totalDebit}
                        totalCredit={totalCredit}
                    />
                </div>
            </div>
            :
            <>
                <JournalEntryView />
            </>
        }</>
    );
}
