import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import GoogleLogin from '../auth/GoogleLogin';
import Avatar from '@material-ui/core/Avatar';

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    flexDirection: 'row',
    position: 'fixed',
    paddingTop: '1rem',
    left: 0,
    right: 0,
    backgroundColor: 'white',
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  appbar: {
    backgroundColor: 'white',
  },
  logoText: {
    height: '2.1rem',
    margin: '0.3rem',
  },
  textStyle: {
    marginLeft: '1rem',
    fontSize: '1.6rem',
    color: '#0097a7',
  },
}));

export default function ButtonAppBar() {
  const classes = useStyles();

  return (
    <Toolbar className={classes.root}>
      <img className={classes.logoText} src={require('../../Assets/LogoText.png')} />

    </Toolbar>
  );
}
