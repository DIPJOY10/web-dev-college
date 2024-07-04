import React, {useState} from 'react';
import {withStyles, makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const SuccessButton = withStyles((theme) => ({
  root: {
    'backgroundColor': theme.palette.success.light,
    'borderRadius': 4,
    'margin': '1rem',
    'color': 'white',
    '&:hover': {
      backgroundColor: theme.palette.success.main,
    },
  },
}))(Button);

export default SuccessButton;
