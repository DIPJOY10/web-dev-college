import React, { useState } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const CreateButton = withStyles((theme) => ({
  root: {
    'backgroundColor': 'white',
    'borderRadius': 6,
    border:`1px solid ${theme.palette.primary.light}`,
    'margin': '1rem',
    'borderRadius': '5px',
    'color': theme.palette.primary.light,
    '&:hover': {
      backgroundColor: '#BFEAF5',
      color:theme.palette.primary.dark,
    },
  },
}))(Button);

export default CreateButton;
