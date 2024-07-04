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
    { id: 'name', label: 'Name', align: 'center' },
    { id: 'dateSold', label: 'Last Sold', align: 'center' },
    { id: 'salePrice', label: 'Sale Price', align: 'center' },
    { id: 'totalArea', label: 'Total Area', align: 'center' },
    { id: 'units', label: 'Units', align: 'center' },
    { id: 'unitSalePrice', label: 'Unit Sale Price', align: 'center' },
    { id: 'unitSalePricePSF', label: 'Unit Sale Price p.s.f', align: 'center' },
    { id: 'address', label: 'Address', align: 'center' },
];
let avatar_view = null;
let status_logo = null;
// function emptyArray(rows) {
//     while (rows.length > 0)
//         rows.pop();
// }
function createData(name, dateSold, salePrice, totalArea, units, unitSalePrice, unitSalePricePSF, address) {
    return { name, dateSold, salePrice, totalArea, units, unitSalePrice, unitSalePricePSF, address };
}
// function filterData(FilterStatus,rows){
//     rows?.
//     return rows?rows.status?.
// }
// let rows = [];
export default function ScheduleApplyTable(props) {
    const classes = useStyles();
    const history = useHistory();
    const [page, setPage] = React.useState(0);
    const [rows, setRows] = useState([]);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const {
        comps
    } = props;
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const getData = (() => {
        var tempRows = [];
        for (const values of comps) {
            tempRows.push(createData(values?.name, values?.dateSold, values?.salePrice, values?.totalArea, values?.units, values?.unitSalePrice, "", values?.address));
            setRows(tempRows);

        }
    })
    useEffect(() => {
        getData();
    }, [comps]);
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
                count={comps?.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    )
}
