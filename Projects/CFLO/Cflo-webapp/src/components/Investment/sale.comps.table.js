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
import moment from 'moment';
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
    { id: 'name', label: 'Name', minWidth: 150, align: 'center' },
    { id: 'lastsold', label: 'Last Sold', align: 'center' },
    { id: 'saleprice', label: 'Sale Price', align: 'center' },
    { id: 'totalarea', label: 'Total Area', align: 'center' },
    { id: 'units', label: 'Units', align: 'center' },
    { id: 'unitsaleprice', label: 'Unit Sale Price', align: 'center' },
    { id: 'unitsalepricepsf', label: 'Unit Sale Price p.s.f', align: 'center' },
    { id: 'address', label: 'Address', minWidth: 150, align: 'center' },

];
function createData(name, lastsold, saleprice, totalarea, units, unitsaleprice, unitsalepricepsf, address) {
    return { name, lastsold, saleprice, totalarea, units, unitsaleprice, unitsalepricepsf, address };
}
let rows = [];
export default function SaleCompsTable(props) {
    const classes = useStyles();
    const history = useHistory();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const {
        saleComps
    } = props;
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    for (const values of Object.values(saleComps)) {

        console.log(values, "saleComps")
        rows.push(createData(values?.name, moment(values?.publishedAt).format('DD MMM YYYY'), values?.saleprice, values?.totalArea, values?.units, values?.unitSalePrice, "", values?.address));

    }

    return (
        <Paper className={classes.root} elevation={4}>
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
                count={saleComps?.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    )
}
