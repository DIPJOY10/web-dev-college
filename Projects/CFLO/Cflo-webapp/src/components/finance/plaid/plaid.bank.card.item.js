import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {useHistory} from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import cx from 'clsx';
import {Divider} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {

  },

  row: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
  },

  col: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },

  paperStyle: {
    maxWidth: '18rem',
    margin: '1rem 0.5rem',
    padding: '1rem 0.5rem',
  },

  titleText: {
    fontSize: '1.3rem',
    fontWeight: '600',
    color: '#424242',
  },

  accountName: {
    fontSize: '1rem',
    fontWeight: '500',
    color: '#424242',
  },

  accountSubtype: {
    fontSize: '0.9rem',
    fontWeight: '400',
    color: '#424242',
  },
  smPaperStyle: {
    padding: '0.5rem',
    margin: '0.5rem',
    width: '100%',
  },
}));

export default function  PlaidBankCardItem(props) {
  const {
    item, bankAccount, onSelect,
  } = props;
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  //console.log(item);

  const {
    row, col, root,
    paperStyle, smPaperStyle,
    titleText, accountSubtype, accountName,
  } = classes;


  return (
    <ButtonBase onClick={()=>{
      if (onSelect) {
        onSelect({
          item: item,
          bankAccount,
        });
      }
    }}>
      <Paper className={cx(smPaperStyle)} variant="outlined" square>
        <Typography className={accountName}>{item?.name}</Typography>
        <Typography className={accountSubtype}>{item?.subtype}</Typography>
      </Paper>
    </ButtonBase>

  );
}
