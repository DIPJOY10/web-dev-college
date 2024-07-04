import React from 'react';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import {useMediaQuery} from '@material-ui/core';
import AppBar from '../appbar/Appbar';
import Drawer from '../drawer/Drawer';
import BottomAppbar from '../BottomAppbar/BottomAppbar';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  childrenStyle: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    marginTop: '1rem',
    marginLeft: '17rem',
    [theme.breakpoints.down('sm')]: {
      marginLeft: 0,
    },
    padding: '1rem',
  },
}));

export default function Dashboard(props) {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const noAppbar = props.noAppbar;

  return (
    <div className={classes.root}>
      {noAppbar ? null : <AppBar />}
      {isMobile ? <BottomAppbar /> : <Drawer />}
      <div className={classes.childrenStyle}>{props.children}</div>
    </div>
  );
}
