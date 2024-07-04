import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useParams, useHistory } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import DeleteIcon from '@material-ui/icons/Delete';
import MyAutocomplete from '../../styled/CommonComponents/MyAutoComplete';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import { createTwoJournalLines, deleteJournalLines, updateJournalLines } from './api';
import { FormatListNumberedRtlTwoTone } from '@material-ui/icons';
import CircularProgress from "@material-ui/core/CircularProgress";

const columns = [
    {
        id: 'no',
        label: 'No',
        minWidth: 20,
        align: 'center',
    },
    {
        id: 'account',
        label: 'ACCOUNT',
        minWidth: 285,
        align: 'center',
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'debits',
        label: 'DEBITS',
        minWidth: 155,
        align: 'center',
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'credits',
        label: 'CREDITS',
        minWidth: 155,
        align: 'center',
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'Description',
        label: 'DESCRIPTION',
        minWidth: 262,
        align: 'center',
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'name',
        label: 'NAME',
        minWidth: 262,
        align: 'center',
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'delete',
        label: '',
        minWidth: 20,
        align: 'left',
        format: (value) => value.toLocaleString('en-US'),
    }
];


const useStyles = makeStyles((theme) => ({
    container: {
        width: '100%',
        display: 'flex',
        justifyContent: "space-around",
        alignItems: "center",
        flexDirection: 'column',
    },
    rowShadow: {
        width: "100%",
        boxShadow: '0px 2px 3px #888, 0px -2px 3px #888',
        marginTop: "5px",
        marginBottom: "5px",
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
            justifyContent: "space-between",
            marginTop: "10px",
        },
    },
    indexAndAccountCont: {
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        [theme.breakpoints.down('md')]: {
            justifyContent: "space-between",
            marginTop: "10px",
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
        width: "260px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        [theme.breakpoints.down('md')]: {
            width: "40px"
        }
    },
    divWidth262: {
        width: "220px",
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
export default function JournalLine(props) {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();

    const { } = useSelector((state) => state);
    const {
        container, rowShadow, onlyrowSty,
        debitAndCreditCont, indexAndAccountCont,
        descOrNameCont, totalDebitSty, divWidth52,
        divWidth285, divWidth262, divWidth60
    } = classes;
    const { walletId, journalId } = useParams();

    const {
        newJournalEntry,
        newJournalLineskp,
        setJournalLinespk,
        allChartAccounts,
        setTotalCredit,
        setTotalDebit,
        totalDebit,
        totalCredit
    } = props


    const [lineEditActive, setLineEditActive] = useState(`0edit`);



    const [journalEntry, setJournalEntry] = useState({})
    const [journalLines, setJournalLines] = useState([])
    const [chartAccounts, setChartAccounts] = useState([])

    const [currentId, setCurrentId] = useState()
    const [currentIndex, setCurrentIndex] = useState()

    const [selectedChartAccount, setSelectedChartAccount] = useState({})
    const [chartAccountText, setChartAccountText] = useState("")
    const [journalLineName, setJournalLineName] = useState("")
    const [journalLineDesc, setJournalLineDesc] = useState("")
    const [journalLineDebitAmount, setJournalLineDebitAmount] = useState(0)
    const [journalLineCreditAmount, setJournalLineCreditAmount] = useState(0)

    const [addLoading, setAddLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)

    useEffect(() => {
        setJournalEntry(newJournalEntry)
        setJournalLines(newJournalLineskp)
        setChartAccounts(allChartAccounts)

        let totalDebit = 0;
        let totalCredit = 0;

        newJournalLineskp.map((line) => {
            if (line?.debit) {
                totalDebit += parseInt(line?.amount || 0);
            } else {
                totalCredit += parseInt(line?.amount || 0);
            }
        })
        setTotalDebit(totalDebit)
        setTotalCredit(totalCredit)

        if (newJournalLineskp?.length > 0) {
            setSelectedChartAccount(newJournalLineskp[0]?.account)
            if (newJournalLineskp[0]?.debit) {
                setJournalLineDebitAmount(newJournalLineskp[0]?.amount)
                setJournalLineCreditAmount(0)
            } else {
                setJournalLineCreditAmount(newJournalLineskp[0]?.amount)
                setJournalLineDebitAmount(0)
            }
            setJournalLineName(newJournalLineskp[0]?.name)
            setJournalLineDesc(newJournalLineskp[0]?.description)
        }

    }, [newJournalEntry, newJournalLineskp, allChartAccounts])

    const addJournalLines = async () => {
        setAddLoading(true)
        await createTwoJournalLines({
            walletId,
            journalId
        })
            .then((lines) => {
                let newJournalLines = journalLines;
                newJournalLines.push(lines[0])
                newJournalLines.push(lines[1])
                setJournalLines(newJournalLines);
                setJournalLinespk(newJournalLines);
                setAddLoading(false)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const deleteJLine = async (jLineId) => {
        console.log(jLineId)
        setDeleteLoading(true)
        deleteJournalLines({
            journalId: journalId,
            journalLineId: jLineId
        })
            .then((data) => {
                if (data?.status === 200) {
                    let newArr = [];
                    journalLines.map((line) => {
                        if (line?._id !== jLineId) {
                            newArr.push(line)
                        }
                    })
                    setJournalLines(newArr)
                    setJournalLinespk(newArr)
                    setDeleteLoading(false)
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }



    const getOptionLabel = (option) => {
        return option?.name || " ";
    };

    const clickOnTableRow = (id, index) => {
        setCurrentId(id)
        setCurrentIndex(index)
        setLineEditActive(`${index}edit`)

        setSelectedChartAccount(journalLines[index]?.account)
        if (journalLines[index]?.debit) {
            setJournalLineDebitAmount(journalLines[index]?.amount)
            setJournalLineCreditAmount(0)
        } else {
            setJournalLineCreditAmount(journalLines[index]?.amount)
            setJournalLineDebitAmount(0)
        }
        setJournalLineName(journalLines[index]?.name)
        setJournalLineDesc(journalLines[index]?.description)
    }

    const selectChartAccountItem = async (option) => {
        setSelectedChartAccount(option)
        await updateJournalLines({
            _id: currentId,
            account: option._id
        })
            .then((data) => {
                let newJournalLines = journalLines;
                newJournalLines[currentIndex].account = option;
                setJournalLines(newJournalLines);
                setJournalLinespk(newJournalLines)
            })
    }



    const changeAmount = async (debit, value, index) => {
        let newJournalLines = journalLines;
        if (debit) {
            setJournalLineCreditAmount(0)
            setJournalLineDebitAmount(value)
            newJournalLines[index].debit = true;

        } else {
            setJournalLineDebitAmount(0)
            setJournalLineCreditAmount(value)
            newJournalLines[index].debit = false;
        }

        await updateJournalLines({
            _id: currentId,
            debit: debit,
            amount: value
        })
            .then((data) => {
                newJournalLines[index].amount = value;
                setJournalLines(newJournalLines);
                setJournalLinespk(newJournalLines);
            })

        let totalDebit = 0;
        let totalCredit = 0;

        newJournalLines.map((line) => {
            if (line?.debit) {
                totalDebit += parseInt(line?.amount || 0);
            } else {
                totalCredit += parseInt(line?.amount || 0);
            }
        })
        setTotalDebit(totalDebit)
        setTotalCredit(totalCredit)
    }


    const changeName = async (value) => {
        setJournalLineName(value)
        await updateJournalLines({
            _id: currentId,
            name: value
        })
            .then((data) => {
                let newJournalLines = journalLines;
                newJournalLines[currentIndex].name = value;
                setJournalLines(newJournalLines);
                setJournalLinespk(newJournalLines);
            })
    }


    const changeDesc = async (value) => {
        setJournalLineDesc(value)
        await updateJournalLines({
            _id: currentId,
            description: value
        })
            .then((data) => {
                let newJournalLines = journalLines;
                newJournalLines[currentIndex].description = value;
                setJournalLines(newJournalLines);
                setJournalLinespk(newJournalLines);
            })
    }

    return (
        <div>
            <div className={container}>
                {
                    journalLines.length > 0 && journalLines.map((journalLine, index) => {
                        return (
                            <div
                                key={journalLine._id}
                                className={lineEditActive === `${index}edit` ? rowShadow : onlyrowSty}
                                onClick={() => { clickOnTableRow(journalLine?._id, index) }}
                            >


                                <div className={indexAndAccountCont} >

                                    <div onClick={() => { clickOnTableRow(journalLine?._id, index) }} key={"no"} style={{ textAlign: "center" }} >
                                        {index + 1}
                                    </div>
                                    <div
                                        key={"account"}
                                        onClick={() => { clickOnTableRow(journalLine?._id, index) }}
                                        style={{
                                            textAlign: "center",
                                            paddingLeft: "0px",
                                            paddingRight: "0px",
                                            width: "285px",
                                            marginLeft: "5px",
                                            marginRight: "5px"
                                        }}
                                    >
                                        {lineEditActive === `${index}edit` ? (
                                            <MyAutocomplete
                                                isSmall={false}
                                                value={selectedChartAccount}
                                                results={chartAccounts}
                                                getOptionLabel={getOptionLabel}
                                                setWidth={"250px"}
                                                text={chartAccountText}
                                                setText={setChartAccountText}
                                                onSelect={selectChartAccountItem}
                                                label={"ACCOUNT"}
                                            />
                                        ) :
                                            journalLine?.account?.name
                                        }
                                    </div>

                                </div>

                                <div className={debitAndCreditCont} >

                                    <div
                                        key={"debits"}
                                        onClick={() => { clickOnTableRow(journalLine?._id, index) }}
                                        style={{
                                            textAlign: "center",
                                            width: "155px",
                                            marginLeft: "5px",
                                            marginRight: "5px"
                                        }}
                                    >
                                        {lineEditActive === `${index}edit` ? (
                                            <TextField
                                                id="outlined-password-input"
                                                variant="outlined"
                                                value={journalLineDebitAmount}
                                                type="number"
                                                onChange={(event) => { changeAmount(true, event.target.value, index) }}
                                                size="small"
                                                label="DEBITS"
                                                style={{ width: "130px" }}
                                            />
                                        ) :
                                            (journalLine?.debit && journalLine?.amount)
                                        }
                                    </div>
                                    <div
                                        key={"credits"}
                                        onClick={() => { clickOnTableRow(journalLine?._id, index) }}
                                        style={{
                                            textAlign: "center",
                                            width: "155px",
                                            marginLeft: "5px",
                                            marginRight: "5px"
                                        }}
                                    >
                                        {lineEditActive === `${index}edit` ? (
                                            <TextField
                                                id="outlined-password-input"
                                                variant="outlined"
                                                value={journalLineCreditAmount}
                                                onChange={(event) => { changeAmount(false, event.target.value, index) }}
                                                size="small"
                                                label="CREDITS"
                                                style={{ width: "130px" }}
                                            />
                                        ) :
                                            (!journalLine?.debit && journalLine?.amount)
                                        }
                                    </div>


                                </div>




                                <div
                                    key={"desc"}
                                    onClick={() => { clickOnTableRow(journalLine?._id, index) }}
                                    className={descOrNameCont}
                                    style={{ marginLeft: "5px", marginRight: "5px" }}
                                >
                                    {lineEditActive === `${index}edit` ? (
                                        <TextField
                                            id="outlined-password-input"
                                            variant="outlined"
                                            value={journalLineDesc}
                                            onChange={(event) => { changeDesc(event.target.value) }}
                                            size="small"
                                            label="DESCRIPTION"
                                            style={{ width: "100%" }}
                                        />
                                    ) :
                                        journalLine?.description
                                    }
                                </div>

                                <div
                                    key={"name"}
                                    className={descOrNameCont}
                                    style={{ marginLeft: "5px", marginRight: "5px" }}
                                >
                                    {lineEditActive === `${index}edit` ? (
                                        <TextField
                                            id="outlined-password-input"
                                            variant="outlined"
                                            value={journalLineName}
                                            onChange={(event) => { changeName(event.target.value) }}
                                            size="small"
                                            label="NAME"
                                            style={{ width: "100%" }}
                                        />
                                    ) :
                                        journalLine?.name
                                    }
                                </div>


                                <div key={"delete"} style={{ textAlign: "left", paddingLeft: "0px", marginTop: "5px", marginBottom: "5px" }} >
                                    <DeleteIcon style={{ cursor: "pointer" }} onClick={() => { deleteJLine(journalLine?._id) }} />
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
                <div className={divWidth60} >

                </div>
            </div>



            <div style={{ marginTop: "20px", padding: "20px", display: "flex", justifyContent: "space-between" }} >
                <div></div>
                {addLoading ?
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        style={{ fontSize: "15px", padding: "10px 15px" }}
                    >
                        <CircularProgress size={"20px"} color={'secondary'} /> <span style={{ marginLeft: "5px" }} >Add Lines</span>
                    </Button>
                    :
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon style={{ fontSize: "20px" }} />}
                        onClick={() => { addJournalLines() }}
                        style={{ fontSize: "15px", padding: "10px 15px" }}
                    >
                        Add Lines
                    </Button>
                }
            </div>

        </div>
    );
}
