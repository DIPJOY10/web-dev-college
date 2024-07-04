import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {useHistory} from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import cx from 'clsx';
import Api from '../../../helpers/Api';
import TxsTable from './TxsTable';



const useStyles = makeStyles((theme) => ({
  root: { },
  row: { },
  wrapCenter: { },
  col: { },
  paperStyle: { },
  smPaperStyle: { },
  paraText: { }, 
}));

export default function AllTransitions(props) {
  const classes = useStyles();
  const {bankAccounts, data} = props;
  const {root, row, col, wrapCenter, paperStyle, smPaperStyle, paraText } = classes;

  


  return (
    <div className={root}>
        <TxsTable txs={data?.txs} />
    </div>
  );
}
