import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Avatar from '@material-ui/core/Avatar';
import CircularProgress from '@material-ui/core/CircularProgress';
import { getTxByWallet, deleteTx, deleteTxTemplate, getTxTemplateByWallet, updateTxTemplate, updateTx } from '../transaction/api';
import { Link } from "react-router-dom";
import DropdownMenu from './dropDownmenu';
import LessText from '../../styled/CommonComponents/LessText';


const columns = [
  {
    id: 'pic',
    label: '',
    width: "40px",
    align: 'centre',
  },
  {
    id: 'createdAt',
    label: 'DATE',
    width: "45px",
    align: 'centre',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'type',
    label: 'TYPE',
    width: "35px",
    align: 'centre',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'billNo',
    label: 'NO',
    width: 40,
    align: 'centre',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'secondParty.parent.displayName',
    label: 'CUSTOMER',
    width: "90px",
    align: 'centre',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'memo',
    label: 'MEMO',
    width: 100,
    align: 'centre',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'dueDate',
    label: 'DUE DATE',
    width: "46px",
    align: 'centre',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'amount',
    label: 'AMOUNT',
    width: 60,
    align: 'centre',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'amountPaid',
    label: 'AMOUNT PAID',
    width: 60,
    align: 'centre',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'status',
    label: 'STATUS',
    width: "45px",
    align: 'centre',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'currency',
    label: 'ACTION',
    width: "40px",
    align: 'centre',
  },
];



const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  container: {
    height: "calc(100vh - 186px)",
    [theme.breakpoints.down('md')]: {
      height: "calc(100vh - 200px)",
    },
    [theme.breakpoints.down('sm')]: {
      height: "calc(100vh - 198px)",
    },
  },
  tableStyle: {
    [theme.breakpoints.down('md')]: {
      width: "1185px",
      overflow: "auto"
    },
  },
  set: {
    height: '300px',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }
}));

export default function TxTable(props) {
  const { txs, walletId, txType, empty, pathType, showSideBar, setSelectedGenerator, txCount } = props
  const history = useHistory();
  const oldTxs = txs || [];
  const [allTxs, setAllTxs] = useState(oldTxs)
  const [emptyTx, setEmptyTx] = useState(false);
  useEffect(() => {
    const oldTxs = txs || [];
    setAllTxs(oldTxs)
    if (empty) {
      setEmptyTx(true)
    }
  }, [txs, empty]);


  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(txCount || 10);
  const [dropdown, setdropDown] = useState(null);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (tx, e) => {
    setAnchorEl(e.currentTarget);
    setdropDown(tx);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onClickRow = (tx) => {

    if (walletId == tx?.firstPartyWallet) {

      if (pathType === '/txtmplate/') {
        showSideBar(true);
        setSelectedGenerator(tx);
      } else if (pathType === '/tx/') {
        const path = '/admin/' + walletId + pathType + tx._id + '/edit';
        history.push(path);
      }

    } else if (walletId == tx?.secondPartyWallet && pathType === '/tx/') {
      const path = '/admin/' + tx?.secondPartyWallet + pathType + tx._id + '/view';
      history.push(path);
    }

  }

  const stopGetClicked = async (dropdownData) => {
    const generatorRunningValue = dropdownData?.generatorRunning;
    setAnchorEl(null)
    await updateTxTemplate({
      _id: dropdownData._id,
      generatorRunning: !generatorRunningValue
    })
    await getTxTemplateByWallet({ walletId: walletId, type: dropdownData?.type }) // keep bill in an array 
      .then((data) => {
        setAllTxs(data);
      })
      .catch((error) => {
        console.log(error);
      })
  }

  const deleteTxById = async (txData) => {
    if (pathType === '/tx/') {
      const deleteStatus = txData?.deleteStatus || false
      await updateTx({
        _id: txData._id,
        deleteStatus: !deleteStatus
      })
        .then((d) => {
          if (txData?.type === "billNo") {
            getTxByWallet({ walletId: walletId, type: "Bill" })
              .then((data) => {
                setAllTxs(data);
                if (data.length === 0) {
                  setEmptyTx(true)
                }
              })
              .catch((error) => { console.log(error); })
          } else if (txData?.type === "invNo") {
            getTxByWallet({ walletId: walletId, type: "Invoice" })
              .then((data) => {
                setAllTxs(data);
                if (data.length === 0) {
                  setEmptyTx(true)
                }
              })
              .catch((error) => { console.log(error); })
          }
        })
        .catch((error) => { console.log(error); })
    } else if (pathType === '/txtmplate/') {
      const deleteStatus = txData?.deleteStatus || false
      await updateTxTemplate({
        _id: txData._id,
        deleteStatus: !deleteStatus
      })
        .then((d) => {
          if (txData?.type === "billNo") {
            getTxTemplateByWallet({ walletId: walletId, type: "Bill" })
              .then((data) => {
                setAllTxs(data);
                if (data.length === 0) {
                  setEmptyTx(true)
                }
              })
              .catch((error) => { console.log(error); })
          } else if (txData?.type === "invNo") {
            getTxTemplateByWallet({ walletId: walletId, type: "Invoice" })
              .then((data) => {
                setAllTxs(data);
                if (data.length === 0) {
                  setEmptyTx(true)
                }
              })
              .catch((error) => { console.log(error); })
          }
        })
        .catch((error) => { console.log(error); })
    }

    setAnchorEl(null);
  }

  console.log(allTxs)



  if (emptyTx) {
    return (
      <div className={classes.set}>
        No Data Available!!!
      </div>
    )
  } else if (allTxs.length === 0)
    return (
      <div className={classes.set}>
        <CircularProgress />
      </div>
    )

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table" size="small" className={classes.tableStyle} >
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ width: column.width, fontSize: "10px" }}
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
                    <TableCell style={{ textDecoration: "none", cursor: "pointer", padding: "5px 10px 5px 10px" }} onClick={() => onClickRow(tx)} key={"pic"} >
                      <Avatar alt="Remy Sharp" src={walletId === tx?.firstPartyWallet ? tx?.secondParty?.parent?.displayPicture?.thumbUrl : tx?.firstParty?.parent?.displayPicture?.thumbUrl} />
                    </TableCell>
                    <TableCell style={{ textDecoration: "none", cursor: "pointer", padding: "5px 10px 5px 10px" }} onClick={() => onClickRow(tx)} key={"date"} >
                      {new Date(tx?.createdAt).getMonth() + 1 + "/" + new Date(tx?.createdAt).getDate() + "/" + new Date(tx?.createdAt).getFullYear()}
                    </TableCell>
                    <TableCell style={{ textDecoration: "none", cursor: "pointer", padding: "5px 10px 5px 10px" }} onClick={() => onClickRow(tx)} key={"type"} >
                      {tx?.type === "Bill" ? (walletId === tx?.firstPartyWallet ? (<>Expense</>) : (<>Receipt</>)) : (<></>)}
                      {tx?.type === "Invoice" ? (walletId === tx?.firstPartyWallet ? (<>Invoice</>) : (<>Bill</>)) : (<></>)}
                    </TableCell>
                    <TableCell style={{ textDecoration: "none", cursor: "pointer", padding: "5px 10px 5px 10px" }} onClick={() => onClickRow(tx)} key={"billNo"} >
                      {tx?.type === "Bill" && tx?.billNo}
                      {tx?.type === "Invoice" && tx?.invNo}
                    </TableCell>
                    <TableCell style={{ textDecoration: "none", cursor: "pointer", padding: "5px 10px 5px 10px" }} onClick={() => onClickRow(tx)} key={"customer"} >
                      <LessText
                        limit={9}
                        string={walletId === tx?.firstPartyWallet ? tx?.secondParty?.parent?.displayName : tx?.firstParty?.parent?.displayName}
                      />
                    </TableCell>
                    <TableCell style={{ textDecoration: "none", cursor: "pointer", padding: "5px 10px 5px 10px" }} onClick={() => onClickRow(tx)} key={"memo"} >
                      <LessText
                        limit={50}
                        string={tx?.memo}
                      />
                    </TableCell>
                    <TableCell style={{ textDecoration: "none", cursor: "pointer", padding: "5px 10px 5px 10px" }} onClick={() => onClickRow(tx)} key={"dueDate"} >
                      {new Date(tx?.dueDate).getMonth() + 1 + "/" + new Date(tx?.dueDate).getDate() + "/" + new Date(tx?.dueDate).getFullYear()}
                    </TableCell>
                    <TableCell style={{ textDecoration: "none", cursor: "pointer", padding: "5px 10px 5px 10px" }} onClick={() => onClickRow(tx)} key={"bl"} >
                      ${tx?.amount?.toFixed(2) || 0}
                    </TableCell>
                    <TableCell style={{ textDecoration: "none", cursor: "pointer", padding: "5px 10px 5px 10px" }} onClick={() => onClickRow(tx)} key={"total"} >
                      ${tx?.amountPaid?.toFixed(2) || 0}
                    </TableCell>
                    <TableCell style={{ textDecoration: "none", cursor: "pointer", padding: "5px 10px 5px 10px" }} onClick={() => onClickRow(tx)} key={"status"} >
                      {tx?.status}
                    </TableCell>
                    <TableCell key={"ac"}  >
                      {walletId == tx?.firstPartyWallet &&
                        <DropdownMenu
                          handleClick={handleClick}
                          open={open}
                          anchorEl={anchorEl}
                          setAnchorEl={setAnchorEl}
                          deleteTxById={deleteTxById}
                          walletId={walletId}
                          handleClose={handleClose}
                          tx={tx}
                          dropdown={dropdown}
                          pathType={pathType}
                          showSideBar={showSideBar}
                          stopGetClicked={stopGetClicked}
                        />
                      }
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