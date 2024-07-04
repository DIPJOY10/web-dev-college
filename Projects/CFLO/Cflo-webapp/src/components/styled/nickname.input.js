import React, {useState, useEffect} from 'react';
import {makeStyles, withStyles} from '@material-ui/core/styles';
import {InputBase} from '@material-ui/core';

const NickNameInput = withStyles((theme) => ({
  root: {
    backgroundColor: '#fafafa',
    color: '#424242',
    padding: '0.4rem',
    margin: '0.5rem',
  },
}))(({classes, ...props}) => {
  return (
    <InputBase
      classes={{
        root: classes.root,
      }}
      {...props}
    />
  );
});


export default NickNameInput;
