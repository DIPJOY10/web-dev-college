import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import NumberFormat from 'react-number-format';
import { useSelector, useDispatch } from 'react-redux';
import Chip from '@material-ui/core/Chip';
import moment from 'moment';
import { useMediaQuery } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    flex: 1,
    marginTop: '1rem',
  },

  textStyle: {
    wordWrap: 'break-word',
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
    maxWidth: '6rem',
    minWidth: '6rem',
    justifyContent: 'center',
    margin: '0.5rem',
    textAlign: 'center',

  },
  isMobilecol: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    // maxWidth: '3rem',
    minWidth: '3rem',
    justifyContent: 'center',
    margin: '0.5rem',
    textAlign: 'center',

  },

  textBtnStyle: {
    fontSize: '0.8rem',
  },

  currencySign: {
    fontSize: '0.8rem',
  },

});

export default function Data(props) {
  const classes = useStyles();
  const { name, value, type } = props;
  const theme = useTheme();
  const { propCatDictionary } = useSelector((state) => state.dashboard);
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  let DataView = <Typography>
    <span className={classes.currencySign}>
      {value}
    </span>
  </Typography>;

  switch (type) {
    case 'money':
      DataView = <Typography>
        <span className={classes.currencySign}>
          <NumberFormat value={value} displayType={'text'} thousandSeparator={true} prefix={'$ '} />
        </span>
      </Typography>;
      break;

    case 'date':
      DataView = <Typography>
        <span className={classes.currencySign}>
          {moment(value).format('DD MMM YYYY')}
        </span>
      </Typography>;
      break;

    default:
      break;
  }

  return (
    <div className={isMobile ? classes.isMobilecol : classes.col}>
      <Typography variant="button" className={classes.textBtnStyle}><b>{name}</b></Typography>
      {DataView}
    </div>
  );
}
