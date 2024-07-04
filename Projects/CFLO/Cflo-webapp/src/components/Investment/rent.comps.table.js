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
    { id: 'units', label: 'Units', minWidth: 60, align: 'center' },
    { id: 'unitrent', label: 'Unit Rent', minWidth: 150, align: 'center' },
    { id: 'rent', label: 'Rent/s.f', align: 'center' },
    { id: 'address', label: 'Address', minWidth: 150, align: 'center' },

];
function createData(name, units, unitrent, rent, address) {
    return { name, units, unitrent, rent, address };
}
let rows = [];
export default function RentCompsTable(props) {
    const classes = useStyles();
    const history = useHistory();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const {
        rentComps
    } = props;
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    for (const values of Object.values(rentComps)) {

        console.log(values, "rentComps")
        rows.push(createData(values?.name, values?.units, values?.unitRent, values?.rsf, values?.address,));

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
                count={rentComps?.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    )
}
