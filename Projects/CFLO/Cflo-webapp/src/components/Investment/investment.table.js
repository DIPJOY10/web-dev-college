import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import AvatarLocal from '../profile/avatar';
import red_circle from '../../Assets/red_circle48x48.png'
import blue_circle from '../../Assets/blue_circle48x48.png'
import green_circle from '../../Assets/green_circle48x48.png'
import createLogo from '../../Assets/create1.png'
import manageIcon from '../../Assets/manageIcon_60x60.png'
import moment from 'moment';
// import CreateBtn from '../styled/actionBtns/create.btn';
const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    container: {
        maxHeight: 440,
    },
    btn_container: {
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        // border: "1px solid red",
        alignItems: "center",
        marginBottom: "2vh",
    },
    jobBtn: {
        borderRadius: "5vw",
        width: "15vw",
        height: "5vh",
        border: "2px solid",
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
}));
const columns = [
    { id: 'avatar_view', label: '', minWidth: 10, align: 'center' },
    { id: 'title', label: 'Title', minWidth: 60, align: 'center' },
    { id: 'displayName', label: 'Owner', minWidth: 150, align: 'center' },
    { id: 'irr', label: 'IRR', align: 'center' },
    { id: 'minTicket', label: 'Ticket', align: 'center' },
    // { id: 'requirement', label: 'Requirement', align: 'center' },
    // { id: 'subject', label: 'Subject', minWidth: 150, align: 'center' },
    { id: 'publishedAt', label: 'Created', align: 'center' },
    { id: 'status_logo', label: '', align: 'center' },
    { id: 'status', label: 'Status', align: 'center' },
    { id: 'edit_view', label: '', align: 'center' },

];
let avatar_view = null;
let status_logo = null;
// function emptyArray(rows) {
//     while (rows.length > 0)
//         rows.pop();
// }
function createData(avatar_view, displayName, title, irr, minTicket, requirement, publishedAt, status_logo, status, edit_view) {
    avatar_view = <AvatarLocal alt={displayName} src={avatar_view} sx={{ width: 15, height: 15 }} />
    if (status === "Active") {
        // edit_view = ;
        status_logo = <img src={red_circle} />
    }
    if (status === "Incomplete") {
        status_logo = <img src={blue_circle} />
    }
    if (status === "Review Pending") {
        edit_view = null;
        status_logo = <img src={green_circle} />
    }
    if (displayName?.length > 11)
        displayName = displayName.substring(0, 11) + "...";

    // console.log(typeof displayName, "TypeOf");
    return { avatar_view, displayName, title, irr, minTicket, requirement, publishedAt, status_logo, status, edit_view };
}
// function filterData(FilterStatus,rows){
//     rows?.
//     return rows?rows.status?.
// }
// let rows = [];
export default function InvestmentTable(props) {
    const classes = useStyles();
    const history = useHistory();
    const [page, setPage] = React.useState(0);
    const [rows, setRows] = useState([]);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const {
        investmentDictionary,
    } = useSelector((state) => state.dashboard);
    // const {
    //     FilterStatus
    // } = props;
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const getData = (() => {
        var tempRows = [];
        for (const values of Object.values(investmentDictionary)) {

            console.log(values, "Dictionary")
            avatar_view = values?.user;
            // for (let i = 0; i < FilterStatus.length; i++) {
            // if (values?.status === FilterStatus[i]) {
            tempRows.push(createData(avatar_view, values?.user?.displayName, values?.title, values?.header?.irr, values?.header?.minTicket, values?.header?.requirement, moment(values?.publishedAt).format('DD MMM YYYY'), status_logo, values?.status, (values?.status === "Active" ? <IconButton onClick={() => { history.push(`/dashboard/investment/manage/${values?._id}`) }}><img src={manageIcon} /></IconButton> : <IconButton onClick={() => { history.push(`/dashboard/edit/investment/${values?._id}`) }}><img src={createLogo} /></IconButton>)));
            // }
            // else if (FilterStatus[i] === 'All') {
            // rows.push(createData(avatar_view, values?.owner?.parent?.displayName, values?.title, values?.payType, values?.subject?.parent?.displayName, moment(values?.publishedAt).format('DD MMM YYYY'), status_logo, values?.status, (FilterStatus[i] === "Active" ? <IconButton onClick={() => { history.push(`/dashboard/edit/job/${values?._id}`) }}><img src={manageIcon} /></IconButton> : <IconButton onClick={() => { history.push(`/dashboard/edit/job/${values?._id}`) }}><img src={manageIcon} /></IconButton>)));
            // }
            // }
            setRows(tempRows)

        }
    })
    useEffect(() => {
        getData();
    }, [investmentDictionary])
    // for (let i = 0; i < FilterStatus.length; i++) {

    //     if (FilterStatus[i] != 'All') {
    //         rows = rows.filter((row) => {
    //             return row?.status === FilterStatus[i];
    //         })
    //     }

    // }
    // console.log(FilterStatus, "FilterStatus");
    // useEffect(() => {
    //     console.log(investmentDictionary, "JobDict");
    // }, [investmentDictionary])
    // }, [investmentDictionary, FilterStatus])
    return (
        <Paper className={classes.root}>
            <TableContainer className={classes.container}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns?.map((column) => (
                                <TableCell
                                    key={column?.id}
                                    align={column?.align}
                                    style={{ minWidth: column?.minWidth }}
                                >
                                    {column?.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)?.map((row) => {
                            return (
                                <TableRow hover role="checkbox" tabIndex={-1} key={row?.code}>
                                    {columns?.map((column) => {
                                        const value = row[column?.id];
                                        return (
                                            <TableCell key={column?.id} align={column?.align}>
                                                {column?.format && typeof value === 'number' ? column?.format(value) : value}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={Object.keys(investmentDictionary)?.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    )
}
