import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import {ButtonBase} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

const useStyles = makeStyles((theme) => ({
  buttonStyle: {
    width: 250,
    height: '2.4rem',
    textAlign: 'center',
    borderRadius: '3%',
    boxShadow: 'none',
    marginBottom: '0.8rem',
    borderWidth: '1px',
  },
  gridStyle: {
    borderWidth: 0,
    borderColor: 'grey',
  },
  textStyle: {
    fontSize: '0.9rem',
    marginLeft: '-1rem',
    color: '#404040',
  },
  imgStyle: {
    marginLeft: '2rem',
  },
}));

export default function Authbotton(props) {
  const classes = useStyles();
  return (

    <ButtonBase outlined border={1} className={classes.buttonStyle} onClick={props.onClick}>


      <Grid container wrap="nowrap" justify="center" alignItems="center" spacing={1} className={classes.gridStyle}>

        <Grid item justify="end">

          <img
            src={props.imagePath}
            alt="logo"
            height="20px"
            className={classes.imgStyle}
          />

        </Grid>
        <Grid item xs>
          <Typography className={classes.textStyle}>{props.text}</Typography>

        </Grid>
        <Grid item justify="end">
          <ArrowForwardIosIcon fontSize="inherit" />
        </Grid>
      </Grid>
    </ButtonBase>

  );
}
