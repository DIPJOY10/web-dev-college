import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import NavBar from '../Navbar/NavBar';

const useStyles = makeStyles((theme) => ({
  appBar: {
    top: 'auto',
    bottom: 0,
    height: "60px",
    backgroundColor: "white",
    [theme.breakpoints.down("xs")]: {
      position: "relative",
      zIndex: "1301"
    },
  },
  grow: {
    flexGrow: 1,
  },
  fabButton: {
    position: 'absolute',
    zIndex: 1,
    top: -30,
    left: 0,
    right: 0,
    margin: '0 auto',
  },
}));

export default function BottomAppBar() {
  const classes = useStyles();

  return (
    <div color="primary" className={classes.appBar + ' navbar-bottom'}>
      <Toolbar>
        <NavBar />
      </Toolbar>
    </div>
  );
}
