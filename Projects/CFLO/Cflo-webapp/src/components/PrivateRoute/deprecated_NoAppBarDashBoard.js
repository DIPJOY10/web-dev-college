import React from 'react';
import {
  makeStyles,
  useTheme,
} from '@material-ui/core/styles';
import {useMediaQuery} from '@material-ui/core';
import {useDispatch} from 'react-redux';
import Drawer from '../drawer/Drawer';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
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
    paddingBottom: '6rem',
    paddingTop: '6rem',
    flexGrow: 1,
  },

}));

export default function Dashboard(props) {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

  return (

    <div className={classes.root}>

      {isMobile?<BottomAppbar />:<Drawer />}
      <div className={classes.childrenStyle}>
        {props.children}
      </div>


    </div>

  );
}
