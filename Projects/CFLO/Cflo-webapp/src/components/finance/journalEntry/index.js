import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory, useParams } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import { deleteJournalEntry, getAllJournalEntries } from './api';
import moment from 'moment'
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import VisibilityIcon from '@material-ui/icons/Visibility';
import {
    getJournalEntryCreditAmount,
    getJournalEntryCreditLine,
    getJournalEntryDebitLine,
    getJournalEntryDebitAmount
} from './Calculate'
import CircularProgress from "@material-ui/core/CircularProgress";


const columns = [
    {
        id: 'Avatart',
        label: '',
        minWidth: 50,
        align: 'center',
    },
    {
        id: 'name',
        label: 'NAME',
        minWidth: 100,
        align: 'center',
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'no',
        label: 'NO',
        minWidth: 100,
        align: 'center',
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'title',
        label: 'TITLE',
        minWidth: 100,
        align: 'center',
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'credit_line',
        label: 'CREDIT LINE',
        minWidth: 100,
        align: 'center',
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'debit_line',
        label: 'DEBIT LINE',
        minWidth: 100,
        align: 'center',
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'credit_amount',
        label: 'CREDIT AMOUNT',
        minWidth: 100,
        align: 'center',
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'debit_amount',
        label: 'DEBIT AMOUNT',
        minWidth: 100,
        align: 'center',
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'date',
        label: 'DATE',
        minWidth: 100,
        align: 'center',
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'edit',
        label: '',
        minWidth: 50,
        align: 'center',
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'delete',
        label: '',
        minWidth: 50,
        align: 'center',
        format: (value) => value.toLocaleString('en-US'),
    }
];



const useStyles = makeStyles((theme) => ({
    loadingStyle: {
        width: '100%',
        height: "600px",
        display: "flex",
        justifyContent: "center",
        alignItems: 'center'
    },
    root: {
        width: '100%',
      },
    container: {
        height: "calc(100vh - 190px)",
        [theme.breakpoints.down('md')]: {
            height: "calc(100vh - 210px)",
        },
    }
}));

export default function JournalEntry(props) {
    const {
        walletId,
    } = useParams();
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const { } = useSelector((state) => state);
    const { loadingStyle, container, root } = classes;

    const [allJournalEntries, setAllJournalEntries] = useState([])
    const [loading, setLoading] = useState(true)
    const [loadingpk, setLoadingpk] = useState(true)

    useEffect(() => {
        getAllJournalEntries({
            walletId
        })
            .then((data) => {
                console.log(data);
                setAllJournalEntries(data)
                setLoading(false)
            })
            .catch((err) => {
                console.log(err);
            })
    }, [])

    const onClickRow = async (jeId) => {
        const path = `/admin/${walletId}/journalentry/${jeId}/edit`;
        history.push(path);
    }

    const onClickDelete = async (jEId) => {
        setLoadingpk(true)
        deleteJournalEntry({
            jEId
        }).then((je) => {
            let newArr = [];
            allJournalEntries.map((je) => {
                if (je?._id !== jEId) {
                    newArr.push(je)
                }
            })
            setAllJournalEntries(newArr)
            setLoadingpk(false)
        })
            .catch((err) => {

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
        <div>
            <Paper className={root}>
                <TableContainer className={container}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth, fontSize: "10px" }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                allJournalEntries.map((data) => {
                                    return (
                                        <TableRow
                                            hover
                                            role="checkbox"
                                            tabIndex={-1}
                                            key={data._id}
                                        >
                                            <TableCell style={{ cursor: "pointer", textAlign: "center" }} onClick={() => onClickRow(data._id)} key={"pic"} >
                                                <Avatar src={data?.user?.displayPicture?.thumbUrl} />
                                            </TableCell>
                                            <TableCell style={{ cursor: "pointer", textAlign: "center" }} onClick={() => onClickRow(data._id)} key={"name"} >
                                                {data?.user?.displayName}
                                            </TableCell>
                                            <TableCell style={{ cursor: "pointer", textAlign: "center" }} onClick={() => onClickRow(data._id)} key={"no"} >
                                                {data?.journalEntryNo}
                                            </TableCell>
                                            <TableCell style={{ cursor: "pointer", textAlign: "center" }} onClick={() => onClickRow(data._id)} key={"title"} >
                                                {data?.title}
                                            </TableCell>
                                            <TableCell style={{ cursor: "pointer", textAlign: "center" }} onClick={() => onClickRow(data._id)} key={"creditLine"} >
                                                {getJournalEntryCreditLine(data?.entries)}
                                            </TableCell>
                                            <TableCell style={{ cursor: "pointer", textAlign: "center" }} onClick={() => onClickRow(data._id)} key={"debitLine"} >
                                                {getJournalEntryDebitLine(data?.entries)}
                                            </TableCell>
                                            <TableCell style={{ cursor: "pointer", textAlign: "center" }} onClick={() => onClickRow(data._id)} key={"creditAmount"} >
                                                ${getJournalEntryCreditAmount(data?.entries)?.toFixed(2)}
                                            </TableCell>
                                            <TableCell style={{ cursor: "pointer", textAlign: "center" }} onClick={() => onClickRow(data._id)} key={"debitAmount"} >
                                                ${getJournalEntryDebitAmount(data?.entries)?.toFixed(2)}
                                            </TableCell>
                                            <TableCell style={{ cursor: "pointer", textAlign: "center" }} onClick={() => onClickRow(data._id)} key={"date"}  >
                                                {moment(data?.date).format("MMM Do YY")}
                                            </TableCell>
                                            <TableCell style={{ textAlign: "center" }} key={"edit"}  >
                                                {data?.manual ?
                                                    (
                                                        data?.processed ?
                                                            (
                                                                <VisibilityIcon style={{ color: "#50AFEF" }} />
                                                            )
                                                            :
                                                            (
                                                                <EditIcon style={{ color: "#50AFEF", fontSize: "25px" }} />
                                                            )
                                                    )
                                                    :
                                                    (
                                                        <VisibilityIcon style={{ color: "#50AFEF" }} />
                                                    )
                                                }
                                            </TableCell>
                                            <TableCell style={{ textAlign: "center" }} key={"delete"}  >
                                                {!data?.processed &&
                                                    <DeleteIcon
                                                        style={{
                                                            cursor: "pointer",
                                                            color: "#787878",
                                                            fontSize: "25px"
                                                        }}
                                                        onClick={() => { onClickDelete(data?._id) }}
                                                    />
                                                }
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </div>
    );
}
