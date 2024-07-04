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
import DropdownMenu from './DotOptions';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import SmsFailedIcon from '@material-ui/icons/SmsFailed';
import CloseIcon from '@material-ui/icons/Close';
import { updateChartAccounts } from './api';

const columns = [
  {
    id: 'name',
    label: 'NAME',
    minWidth: 100,
    align: 'left',
  },
  {
    id: 'type',
    label: 'TYPE',
    minWidth: 100,
    align: 'left',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'detail_type',
    label: 'DETAIL TYPE',
    minWidth: 100,
    align: 'left',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'balance',
    label: 'BALANCE',
    minWidth: 100,
    align: 'right',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'action',
    label: 'ACTION',
    minWidth: 100,
    align: 'center',
    format: (value) => value.toLocaleString('en-US'),
  }
];



const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  container: {
    height: "calc(100vh - 190px)",
    [theme.breakpoints.down('md')]: {
      height: "calc(100vh - 210px)",
    },
  },
  set: {
    height: '300px',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  accEditCont: {
    width: '550px',
    display: 'flex',
    justifyContent: 'space-around',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      flexDirection: 'column',
  },
  },
  EditCont1: {
    width: '45%',
    [theme.breakpoints.down('sm')]: {
      width: '100%'
  },
  },
  textF: {
    marginTop: '20px'
  },
  errorMsg: {
    border: "1px solid red",
    margin: "15px",
    padding: "15px",
    position: "relative",
  },
  errHeader: {
    fontWeight: "550"
  },
  errHederCont: {
    display: "flex",
    alignItems: "center",
    color: "red",
  },
  errCloseBtn: {
    position: "absolute",
    top: "2px",
    right: "2px",
    cursor: "pointer"
  }
}));

export default function TxTable(props) {
  const { dataRow, txCount } = props
  const history = useHistory();
  const oldDataRow = dataRow || [];
  const [allData, setAllData] = useState(oldDataRow)
  useEffect(() => {
    const oldDataRow = dataRow || [];
    setAllData(oldDataRow)
  }, [dataRow]);


  const classes = useStyles();

  const { errorMsg, errHederCont, errHeader, errCloseBtn } = classes


  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(txCount || 10);
  const [selectedDropdown, setSelectedDropdown] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [accName, setAccName] = useState("");
  const [accDesc, setAccDesc] = useState("");
  const [err, setErr] = useState(null)

  const openEditDialog = (data) => {
    setAnchorEl(null)
    console.log(data);
    setOpenEdit(true);
  };

  const closeEditDialog = () => {
    setOpenEdit(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (data, e) => {
    setAnchorEl(e.currentTarget);
    setSelectedDropdown(data);
    setAccName(data?.name)
    setAccDesc(data?.description)
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onClickRow = () => {

  }


  const editChartAcc = async () => {
    await updateChartAccounts({
      name: accName,
      description: accDesc,
      _id: selectedDropdown._id,
      wallet: selectedDropdown.wallet
    })
      .then((data) => {
        const getStatus = data?.status
        const resData = data?.data

        if (getStatus === 200) {
          const newAccArr = allData.map((acc) => {
            if (acc._id === resData._id) {
              return resData
            } else {
              return acc;
            }
          })
          setAllData(newAccArr)
          setOpenEdit(false);
        } else {
          if (getStatus === 401) {
            setErr(resData)
          }
        }
      })
      .catch((err) => {
        console.log(err);
      })
  }





  return (
    <>
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
                allData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((data) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={data._id}
                    >
                      <TableCell style={{ cursor: "pointer", ppadding: 0 }} onClick={() => onClickRow()} key={"customer"} >
                        {data?.name}
                      </TableCell>
                      <TableCell style={{ cursor: "pointer", ppadding: 0 }} onClick={() => onClickRow()} key={"memo"} >
                        {data?.classification}
                      </TableCell>
                      <TableCell style={{ cursor: "pointer", ppadding: 0 }} onClick={() => onClickRow()} key={"dueDate"} >
                        {data?.qbName}
                      </TableCell>
                      <TableCell style={{ cursor: "pointer", ppadding: 0, textAlign: "right" }} onClick={() => onClickRow()} key={"total"} >
                        ${data?.balance?.toFixed(2) || 0}
                      </TableCell>
                      <TableCell style={{ textAlign: "center" }} key={"ac"}  >
                        <DropdownMenu
                          handleClick={handleClick}
                          open={open}
                          anchorEl={anchorEl}
                          handleClose={handleClose}
                          data={data}
                          selectedDropdown={selectedDropdown}
                          openEditDialog={openEditDialog}
                        />
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
          count={dataRow?.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <Dialog fullWidth={true} open={openEdit} onClose={closeEditDialog} aria-labelledby="max-width-dialog-title" >
        <DialogTitle id="form-dialog-title">Account</DialogTitle>
        {err &&
          <div className={errorMsg} >
            <div className={errHederCont} >
              <SmsFailedIcon />
              <Typography className={errHeader} >Something’s not quite right</Typography>
              <CloseIcon onClick={() => { setErr(null) }} className={errCloseBtn} />
            </div>
            <Typography style={{ fontSize: "14px", opacity: "0.6" }}>{err}</Typography>
          </div>
        }
        <DialogContent>
          <div className={classes.accEditCont} >
            <div className={classes.EditCont1} >
              <TextField
                id="outlined-password-input"
                label="Account Type"
                autoComplete="current-password"
                variant="outlined"
                value={selectedDropdown?.classification}
                disabled
                className={classes.textF}
              />
              <TextField
                id="outlined-password-input"
                label="Detail Type"
                autoComplete="current-password"
                variant="outlined"
                value={selectedDropdown?.qbName}
                disabled
                className={classes.textF}
              />
            </div>
            <div className={classes.EditCont1} >
              <TextField
                id="outlined-password-input"
                label="Name"
                autoComplete="current-password"
                variant="outlined"
                value={accName}
                className={classes.textF}
                onChange={(event) => { setAccName(event.target.value) }}
              />
              <TextField
                id="outlined-password-input"
                label="Description"
                autoComplete="current-password"
                variant="outlined"
                value={accDesc}
                className={classes.textF}
                onChange={(event) => { setAccDesc(event.target.value) }}
              />
              <Typography style={{ marginTop: "20px" }} >Balance</Typography>
              <Typography style={{ opacity: "0.6", marginBottom: "40px" }} >{selectedDropdown?.balance}</Typography>
            </div>
          </div>

        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={editChartAcc} color="primary">
            Save and Close
          </Button>
        </DialogActions>
      </Dialog>

    </>
  );
}