import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: '2rem',
  },
  timeBar: {
    backgroundColor: 'white',
    margin: '2rem',
    marginBottom: '-0.7rem',
    borderRadius: '2%',
    height: '2.2rem',
    display: 'flex',
    alignItems: 'center',
    boxShadow: '0 2px 2px 2px #eeeeee',
  },
  textStyle: {
    fontSize: 14,
    paddingLeft: '1rem',
    paddingRight: '1rem',
    color: 'grey',
    fontWeight: '600',
  },
}));

const TimeBar = (props) => {
  const classes = useStyles();
  const {date} = props;
  return (
    <div className={classes.root}>
      <Grid container spacing={2} justify={'center'}>
        <Grid item>
          <Typography className={classes.textStyle}>{date}</Typography>
        </Grid>
      </Grid>
    </div>
  );
};

export default TimeBar;
