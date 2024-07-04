import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    width: '42rem',
    margin: '1rem',
    [theme.breakpoints.down('sm')]: {
      width: '42rem'
    },
  },
  paperCont: {
    marginBottom: "100px",
    [theme.breakpoints.down('sm')]: {
      width: '100vw',
      overflowX: 'auto',
      overflowY: 'hidden',
    },
  },
  row: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
  },
  col: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    margin: '1rem',
  },

  titleTextStyle: {
    fontWeight: '600',
    fontSize: '1.1rem',
  },
  subTitleTextStyle: {
    fontWeight: '500',
    fontSize: '1rem',
  },
  dateTextStyle: {
    fontWeight: '400',
    fontSize: '0.85rem',
  },
  totalTextStyle: {
    fontWeight: '700',
    fontSize: '0.8rem',
  },
  dividerStyle: {
    margin: '0.4rem 0',
  },
}));

function TopBlock(props) {
  const {
    title,
    subTitle,
  } = props;
  const classes = useStyles();


  const {
    root, row, col
  } = classes;

  const dateNow = new Date();
  const dateText = moment(dateNow).format('MMM Do YYYY');

  return (
    <div className={col}>
      <div className={row}>
        <Typography className={classes.titleTextStyle}>{title}</Typography>
      </div>
      <div className={row}>
        <Typography className={classes.subTitleTextStyle}>{subTitle}</Typography>
      </div>
      <div className={row}>
        <Typography className={classes.dateTextStyle}>As of {dateText}</Typography>
      </div>
      <Divider className={classes.dividerStyle} />
      <div className={row}>
        <div className={row}></div>
        <Typography className={classes.totalTextStyle}>TOTAL</Typography>
      </div>
      <Divider className={classes.dividerStyle} />
    </div>
  );
}


export default function S(props) {
  const {
    title,
    subTitle,
  } = props;
  const classes = useStyles();


  const {
    root, paperCont
  } = classes;


  return (
    <div className={paperCont} >
      <Paper square className={root}>
        <TopBlock
          title={title}
          subTitle={subTitle}
        />
        {props.children}
      </Paper>
    </div>
  );
}
