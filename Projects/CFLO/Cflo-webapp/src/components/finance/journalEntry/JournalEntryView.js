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
import moment from 'moment'
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
            fontSize: "13px",
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
        marginBottom: "10px",
        [theme.breakpoints.down('md')]: {
            marginLeft: "0px",
        },
    },
    container: {
        width: '100%',
        display: 'flex',
        justifyContent: "space-around",
        alignItems: "center",
        flexDirection: 'column',
    },
    onlyrowSty: {
        width: "100%",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        height: "60px",
        border: "1px solid #E1E2E5",
        [theme.breakpoints.down('md')]: {
            width: "94%",
            height: "230px",
            marginTop: "10px",
            marginBottom: "5px",
            flexDirection: 'column',
        },
    },
    debitAndCreditCont: {
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        [theme.breakpoints.down('md')]: {
            width : "35%",
            justifyContent: "space-between",
            marginRight: "17px"
        },
    },
    accountNameCont : {
        textAlign: "center",
        paddingLeft: "0px",
        paddingRight: "0px",
        width: "285px",
        marginLeft: "5px",
        marginRight: "5px",
        [theme.breakpoints.down('md')]: {
            width: "55%",
            marginLeft: "15px",
        },
    },
    creditOrDebitCont : {
        textAlign: "center",
        width: "155px",
        marginLeft: "5px",
        marginRight: "5px",
        [theme.breakpoints.down('md')]: {
            width: "100%",
        },
    },

    creditOrDebitContZeroWidth : {
        textAlign: "center",
        width: "155px",
        marginLeft: "5px",
        marginRight: "5px",
        [theme.breakpoints.down('md')]: {
            display: "none"
        },
    },

    indexAndAccountCont: {
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        [theme.breakpoints.down('md')]: {
            justifyContent: "space-between",
            marginTop: "10px",
            width : "95%"
        },
    },
    descOrNameCont: {
        width: "230px",
        textAlign: "center",
        [theme.breakpoints.down('md')]: {
            width: "290px",
            marginTop: "10px",
        }
    },
    totalDebitSty: {
        textAlign: "center",
        width: "150px",
        [theme.breakpoints.down('md')]: {
            width: "120px",
        }
    },
    divWidth52: {
        width: "20px",
        [theme.breakpoints.down('md')]: {
            width: "0px",
        }
    },
    divWidth285: {
        width: "240px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        [theme.breakpoints.down('md')]: {
            width: "40px"
        }
    },
    divWidth262: {
        width: "250px",
        [theme.breakpoints.down('md')]: {
            width: "0px",
        }
    },
    divWidth60: {
        width: "30px",
        [theme.breakpoints.down('md')]: {
            width: "0px"
        }
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
        hederText, jNameAndMemoCont, memoSty, container, onlyrowSty, 
        debitAndCreditCont, indexAndAccountCont, descOrNameCont, 
        totalDebitSty, divWidth52, divWidth285, divWidth262,
        accountNameCont, creditOrDebitCont, creditOrDebitContZeroWidth
    } = classes;
    const { walletId, journalId } = useParams();

    const [journalEntry, setJournalEntry] = useState({})
    const [journalLines, setJournalLines] = useState([])

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
    }, [journalId, walletId])

    if (loading) {
        return (
            <div className={loadingStyle} >
                <CircularProgress />
            </div>
        )
    }



    return (
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
                        )

                    ]}
                />

            </div>
            <div className={journalNameDateCont} >
                <div className={jNameAndMemoCont} >
                    <div
                        style={{ width: "200px", marginBottom: "10px" }}
                    >
                        <div style={{ fontSize: "17px", opacity: "0.6" }} >Title</div>
                        <div style={{ fontSize: "16px", marginLeft: "10px" }} >{journalEntry?.title}</div>
                    </div>

                    <div
                        className={memoSty}
                    >
                        <div style={{ fontSize: "17px", opacity: "0.6" }} >Memo</div>
                        <div style={{ fontSize: "16px", marginLeft: "10px" }} >{journalEntry?.memo}</div>
                    </div>

                </div>
                <div>
                    <div>
                        <div style={{ fontSize: "17px", opacity: "0.6" }} >Date</div>
                        <div style={{ fontSize: "16px", marginLeft: "10px" }} >{moment(journalEntry?.date).format("MMM Do YY")}</div>
                    </div>
                </div>
            </div>
            <div>
                <div className={container}>
                    {
                        journalLines.length > 0 && journalLines.map((journalLine, index) => {
                            return (
                                <div
                                    key={journalLine._id}
                                    className={onlyrowSty}
                                >
                                    <div className={indexAndAccountCont} >
                                        <div
                                            className={accountNameCont}
                                        >
                                            <TextField
                                                id="outlined-password-input"
                                                variant="outlined"
                                                value={journalLine?.account?.name}
                                                size="small"
                                                label="ACCOUNT"
                                                style={{ width: "95%" }}
                                                disabled
                                            />
                                        </div>
                                        <div className={debitAndCreditCont} >
                                            <div
                                                className={journalLine?.debit ? creditOrDebitCont : creditOrDebitContZeroWidth}
                                            >
                                                {journalLine?.debit && (
                                                    <TextField
                                                        id="outlined-password-input"
                                                        variant="outlined"
                                                        value={journalLine?.amount}
                                                        size="small"
                                                        label="DEBIT"
                                                        style={{ width: "95%" }}
                                                        disabled
                                                    />
                                                )}
                                            </div>
                                            <div
                                                className={!journalLine?.debit ? creditOrDebitCont : creditOrDebitContZeroWidth}
                                            >
                                                {!journalLine?.debit && (
                                                    <TextField
                                                        id="outlined-password-input"
                                                        variant="outlined"
                                                        value={journalLine?.amount}
                                                        size="small"
                                                        label="CREDITS"
                                                        style={{ width: "95%" }}
                                                        disabled
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>


                                    <div
                                        className={descOrNameCont}
                                        style={{ marginLeft: "5px", marginRight: "5px" }}
                                    >
                                        <TextField
                                            id="outlined-password-input"
                                            variant="outlined"
                                            value={journalLine?.description}
                                            size="small"
                                            label="DESCRIPTION"
                                            style={{ width: "100%" }}
                                            disabled
                                        />
                                    </div>

                                    <div
                                        className={descOrNameCont}
                                        style={{ marginLeft: "5px", marginRight: "5px" }}
                                    >
                                        <TextField
                                            id="outlined-password-input"
                                            variant="outlined"
                                            value={journalLine?.name}
                                            size="small"
                                            label="NAME"
                                            style={{ width: "100%" }}
                                            disabled
                                        />
                                    </div>
                                </div>
                            )
                        })}
                </div>
                <div style={{ backgroundColor: "#F5F5F5", display: "flex", justifyContent: "space-around", paddingTop: "10px", paddingBottom: "10px" }} >
                    <div className={divWidth52} >

                    </div>
                    <div className={divWidth285} >
                        Total
                    </div>
                    <div className={totalDebitSty}  >
                        <TextField
                            id="outlined-password-input"
                            variant="outlined"
                            value={totalDebit}
                            size="small"
                            label="Total Credit"
                            style={{ width: "100%" }}
                            disabled
                        />
                    </div>
                    <div className={totalDebitSty} >
                        <TextField
                            id="outlined-password-input"
                            variant="outlined"
                            value={totalCredit}
                            size="small"
                            label="Total Credit"
                            style={{ width: "100%" }}
                            disabled
                        />
                    </div>
                    <div className={divWidth262} >

                    </div>
                    <div className={divWidth262} >

                    </div>
                </div>
            </div>
        </div>
    );
}
