import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import moment from 'moment';
import {ButtonBase, Typography} from '@material-ui/core';
import InvoiceTotalCalc from '../invoice/invoice.total.calc';
import {useHistory} from 'react-router-dom';

const useStyles = makeStyles({
  tableContainer: {
    maxWidth: '63rem',
    padding: '1rem',
    margin: '1rem',
  },
  clientBlock: {
    height: '3.4rem',
  },
  amountText: {
    fontWeight: '500',
    fontSize: '0.85rem',
  },
});

export default function SaleTable(props) {
  const classes = useStyles();
  const history = useHistory();

  const {invs} = props;
  const {clientBlock, amountText} = classes;

  return (
    <TableContainer component={Paper} className={classes.tableContainer}>
      <Table aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>No.</TableCell>
            <TableCell align="right">Type</TableCell>
            <TableCell align="right">Due Date</TableCell>
            <TableCell align="right">Client</TableCell>
            <TableCell align="right">Amount</TableCell>
            <TableCell align="right">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {invs.map((inv) => (
            <TableRow
              key={inv?._id}
              hover={true}
              onClick={() => {
                const type = inv?.type;
                switch (type) {
                  case 'Invoice':
                    const path = '/admin/' + inv?.wallet + '/' + inv?._id + '/invoice';
                    history.push(path);

                    break;

                  case 'Receipt':
                    break;

                  default:
                    break;
                }
              }}
              style={{marginTop: '1rem'}}
            >
              <TableCell invonent="th" scope="row">
                <b>#{inv?.invNo}</b>
              </TableCell>

              <TableCell align="right">{inv?.type}</TableCell>

              <TableCell align="right">{moment(inv?.dueDate).format('DD MMM YYYY')}</TableCell>
              <TableCell align="right">{inv?.customer?.parent?.displayName}</TableCell>
              <TableCell align="right">
                <Typography className={amountText}>
                  $
                  {InvoiceTotalCalc({
                    billList: inv?.billList,
                  })}
                </Typography>
              </TableCell>
              <TableCell align="right">{inv?.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
