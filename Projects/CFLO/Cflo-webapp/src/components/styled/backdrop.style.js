import React, {useState} from 'react';
import {withStyles, makeStyles} from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

const StyledBackdrop = withStyles((theme) => ({
  root: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: theme.palette.primary.light,
    color: 'white',
    opacity: 0.1,
  },
}))(Backdrop);

const CustomBackdrop = (props)=>{
  return (
    <StyledBackdrop {...props}>
      <CircularProgress color="inherit" />
    </StyledBackdrop>
  );
};

export default CustomBackdrop;
