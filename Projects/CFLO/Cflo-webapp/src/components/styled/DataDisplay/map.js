import React, {useState, useEffect} from 'react';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import GoogleMap from '../../../Assets/google-maps.png';

const useStyles = makeStyles({
  root: {
    flex: 1,
    marginTop: '1rem',
    maxWidth: '17rem',
    padding: '1rem',
  },

  imgSize: {
    display: 'flex',
    height: '60px',
    width: '60px',
  },

  textStyle: {
    marginLeft: '1rem',

  },

  row: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '1rem',
    maxWidth: '17rem',
    padding: '1rem',
  },

});

export default function TextView(props) {
  const classes = useStyles();
  const {location} = props;


  return (

    <div className={classes.row}>
      <img key={'location'} className={classes.imgSize} src={GoogleMap} />
      <Typography variant="caption" display="block" className={classes.textStyle}>
        {location?.name}
      </Typography>
    </div>


  );
}
