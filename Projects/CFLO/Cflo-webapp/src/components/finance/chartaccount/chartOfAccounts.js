import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import AcctCard from './acctCard';
import _ from 'lodash';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import ChartAccountTable from './Chart.Account.Table';



const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },

  row: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  col: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },

  title: {
    flex: 1,
    display: 'flex',
    fontSize: '1.5rem',
    fontWeight: '700',
    margin: '1.5rem',
  },


}));

export default function ChartAccounts(props) {
  const {
    walletId, accts 
  } = props;


  const classes = useStyles();
  console.log(accts)

  const {
    root, row, col, title,
  } = classes;

  const [show, setShow] = useState("asset")
  const [group, setGroup] = useState()

  useEffect(() =>{
    const myGroup = _.groupBy(accts, 'topLevel');
    console.log(myGroup)
    setGroup(myGroup);
  },[])



  
console.log(group)
  


  return (
    <div className={root}>

     <ChartAccountTable 
       dataRow = {accts}
     /> 
  
    </div>
  );
}
