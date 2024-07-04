import React, { useState, useEffect } from 'react';
import {
    useParams,
    useHistory,
} from 'react-router-dom';
import { useGetApps } from '../apply/apply.hooks';
import ProfileAppbar from '../profile/profile.appbar';
import { useJob, useGetJob } from './job.hook';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
// import AvatarLocal from '../../profile/avatar';
import AvatarLocal from '../profile/avatar';
import Api from '../../helpers/Api';
import LoadingButton from '../styled/actionBtns/loading.btn';
import red_circle from '../../Assets/red_circle48x48.png'
import blue_circle from '../../Assets/blue_circle48x48.png'
import green_circle from '../../Assets/green_circle48x48.png'
import createLogo from '../../Assets/create1.png'
import moment from 'moment';
import JobCard from './job.card';
import CircularProgress from '@material-ui/core/CircularProgress';
// import CreateBtn from '../styled/actionBtns/create.btn';
const useStyles = makeStyles((theme) => ({
    root: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        paddingBottom: '6rem',
        paddingTop: '4rem',
        overflow: 'auto',
        // border: '1px solid red',
        alignItems: 'center',
        width: '100%'
    },
    paper: {
        width: '100%',
        marginTop: '5vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: "center"
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
let columns = [
    // { id: 'title', label: 'Title', minWidth: 60 },
    { id: 'avatar_view', label: '' },//0
    { id: 'displayName', label: 'Owner' },//1
    { id: 'message', label: 'Message' },//2
    { id: 'payType', label: 'PayType' },//3
    { id: 'negoMin', label: 'Minimum' },//4
    { id: 'negoMax', label: 'Maximum' },//5
    { id: 'hourly', label: 'Hourly' },//6
    { id: 'fixed', label: 'Fixed' },//7
    { id: 'createdAt', label: 'Applied On' },//8
    // { id: 'subject', label: 'Subject', minWidth: 150 },
    // { id: 'status_logo', label: '' },
    // { id: 'status', label: 'Status' },
    // { id: 'edit_view', label: '' },

];
let avatar_view = null;
let status_logo = null;
// function emptyArray(rows) {
//     while (rows.length > 0)
//         rows.pop();
// }
function createData(id, avatar_view, displayName, message, payType, negoMin, negoMax, hourly, fixed, createdAt) {
    avatar_view = <AvatarLocal alt={displayName} src={avatar_view} sx={{ width: 15, height: 15 }} />

    if (displayName?.length > 11)
        displayName = displayName.substring(0, 11) + "...";
    if (payType === "Negotiable") {
        // columns.splice(6, 2);
        columns = columns.filter((col) => {
            return col.id != "hourly" && col.id != "fixed";
        });
        console.log(columns, "Col");
        return { id, avatar_view, displayName, message, payType, negoMin, negoMax, createdAt };

    }
    if (payType === "Hourly") {
        // columns.splice(4, 2);
        // columns.splice(4, 1);
        columns = columns.filter((col) => {
            return col.id != "negoMin" && col.id != "fixed" && col.id != "negoMax";
        });
        return { id, avatar_view, displayName, message, payType, hourly, createdAt };

    }
    if (payType === "Fixed") {
        // columns.splice(4, 1);
        columns = columns.filter((col) => {
            return col.id != "hourly" && col.id != "negoMin" && col.id != "negoMax";
        });
        return { id, avatar_view, displayName, message, payType, fixed, createdAt };

    }
    else {
        return {
            id, avatar_view, displayName, message, payType, negoMin, negoMax,
            hourly, fixed, createdAt
        };
    }
    // console.log(typeof displayName, "TypeOf");

}
// function filterData(FilterStatus,rows){
//     rows?.
//     return rows?rows.status?.
// }
// let rows = [];
let appDictionary = {};
export default function JobApplications() {
    const classes = useStyles();
    const history = useHistory();
    const { jobId } = useParams();
    const { job, isFeed } = useJob(jobId);
    const [dict, setDict] = useState(null);
    const getApplications = (parent, model) => {
        Api.post('apply/getApps', {
            parent, model,
        }).then((res) => {
            // const {
            //     apps,
            // } = res;
            appDictionary = { ...res?.apps };
            setDict(appDictionary);
            console.log(appDictionary, 'Response');
        });
    }
    useEffect(() => {
        getApplications(jobId, 'Job');
        console.log(Object.keys(appDictionary)?.length, "Length")
    }, [jobId])
    const [page, setPage] = React.useState(0);
    const [rows, setRows] = useState([]);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // const {
    //     appDictionary,
    // } = useSelector((state) => state.dashboard);

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const getData = (() => {
        var tempRows = [];
        for (const values of (Object.values(appDictionary))) {
            console.log(values, "Applications")
            avatar_view = values?.topComment?.user;
            console.log(avatar_view, "Avatar")
            tempRows.push(createData(values?._id, avatar_view, values?.topComment?.user?.displayName, values?.message, job?.payType, values?.payType?.negoMin, values?.payType?.negoMax, values?.payType?.hourly, values?.payType?.fixed, moment(values?.createdAt).format('DD MMM YYYY')));
        }

        setRows(tempRows);
    })
    // console.log(rows, "RowsBeforeSet")
    // rows = Array.from(new Set([...rows]));
    // console.log(rows, "Rows")


    // console.log(FilterStatus, "FilterStatus");
    useEffect(() => {
        // console.log(appDictionary, "AppDict");
        getData();
    }, [appDictionary])
    return (
        <>  <div className={classes.root}>
            <ProfileAppbar name={"Job Applications"} />
            <JobCard jobId={jobId} />
            <Paper className={classes.paper}>
                {dict == null ? <CircularProgress /> : <><TableContainer className={classes.container}>
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
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row?.code}
                                        onClick={() => {
                                            history.push(`/dashboard/job/manage/${jobId}/${row?.id}`)
                                        }}
                                        style={{ cursor: 'pointer' }}
                                    >
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
                        count={Object.keys(appDictionary)?.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    /></>}
            </Paper>
        </div>
        </>
    )
}
