import React, {useEffect, useRef, useState} from 'react';
import Paper from '@material-ui/core/Paper';
import {
  makeStyles,
  useTheme,
} from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
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
}));


export default function DateView(props) {
  const classes = useStyles();
  const {
    col, row,
  } = classes;

  const {isRow} = props;

  return (
    <div className={isRow?col:row}>

    </div>
  );
}
