import React, { useState, useEffect } from 'react';
import {useHistory} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import CircularProgress from '@material-ui/core/CircularProgress';



const columns = [
  {
    id: 'createdAt',
    label: 'DATE',
    minWidth: 70,
    align: 'centre',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'type',
    label: 'TYPE',
    minWidth: 70,
    align: 'centre',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'currency',
    label: 'CURRENCY',
    minWidth: 70,
    align: 'centre',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'secondParty.parent.displayName',
    label: 'MERCHANT NAME',
    minWidth: 170,
    align: 'centre',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'payment_channel',
    label: 'PAYMENT CHANNEL',
    minWidth: 70,
    align: 'centre',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'amount',
    label: 'BALANCE',
    minWidth: 70,
    align: 'centre',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'category',
    label: 'CATEGORY',
    minWidth: 70,
    align: 'centre',
    format: (value) => value.toLocaleString('en-US'),
  },

];



const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: "calc(100vh - 352px)",
  },
  set: {
    height: '300px',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }
}));

export default function TxsTable(props) {

  const { txs, empty, } = props

  const history = useHistory();
  const oldTxs = txs || [];
  const [allTxs, setAllTxs] = useState(oldTxs)
  const [emptyTx, setEmptyTx] = useState(false);
 
  useEffect(() => {
    const oldTxs = txs || [];
    setAllTxs(oldTxs)
  }, [txs]); 


  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
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
              allTxs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((tx) => {
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={tx._id}
                  >
                    <TableCell style={{ textDecoration: "none", cursor: "pointer", ppadding: 0 }}  key={"date"} >
                      {tx?.date}
                    </TableCell>
                    <TableCell style={{ textDecoration: "none", cursor: "pointer", ppadding: 0 }}  key={"type"} >
                      {tx?.transaction_type}
                    </TableCell>
                    <TableCell style={{ textDecoration: "none", cursor: "pointer", ppadding: 0 }}  key={"customer"} >
                      {tx?.iso_currency_code}
                    </TableCell>
                    <TableCell style={{ textDecoration: "none", cursor: "pointer", ppadding: 0 }} key={"memo"} >
                      {tx?.merchant_name}
                    </TableCell>
                    <TableCell style={{ textDecoration: "none", cursor: "pointer", ppadding: 0 }}  key={"dueDate"} >
                      {tx.payment_channel}
                    </TableCell>
                    <TableCell style={{ textDecoration: "none", cursor: "pointer", ppadding: 0 }}  key={"bl"} >
                      {tx?.amount?.toFixed(2)}
                    </TableCell>
                    <TableCell style={{ textDecoration: "none", cursor: "pointer", ppadding: 0 }}  key={"status"} >
                      category
                    </TableCell>
                  </TableRow>
                )
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 15, 20, 25, 50, 100]}
        component="div"
        count={allTxs.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}