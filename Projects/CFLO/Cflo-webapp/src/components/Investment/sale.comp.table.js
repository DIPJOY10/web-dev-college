import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
  table: {
    minWidth: 900,
  },

  tableCell: {
    maxWidth: '17rem',
  },
});


export default function SaleTable(props) {
  const classes = useStyles();
  const {
    comps,
    setComps,
  } = props;

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Last Sold</TableCell>
            <TableCell align="right">Sale Price</TableCell>
            <TableCell align="right">Total Area</TableCell>
            <TableCell align="right">Units</TableCell>
            <TableCell align="right">Unit Sale Price</TableCell>
            <TableCell align="right">Unit Sale Price p.s.f</TableCell>
            <TableCell align="right">Address</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {comps.map((comp) => (
            <TableRow key={comp.name}>
              <TableCell component="th" scope="row" className={classes.tableCell}>
                {comp.name}
              </TableCell>
              <TableCell align="right">{comp.dateSold}</TableCell>
              <TableCell align="right">{comp.salePrice}</TableCell>
              <TableCell align="right">{comp.totalArea}</TableCell>
              <TableCell align="right">{comp.units}</TableCell>
              <TableCell align="right">{comp.unitSalePrice}</TableCell>
              <TableCell align="right">{comp.salePricePSF}</TableCell>
              <TableCell align="right" className={classes.tableCell}>{comp.address}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
