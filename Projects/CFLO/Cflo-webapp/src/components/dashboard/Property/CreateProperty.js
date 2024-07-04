import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({

}));

const CreateProperty = (props)=>{
  const classes = useStyles();

  return (
    <div className={classes.root}>
            Property
    </div>
  );
};

export default CreateProperty;
