import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import Api from '../../../helpers/Api';

const useStyles = makeStyles((theme) => ({

}));


const AttachFiles = (props)=>{
  const classes = useStyles();
  const {setActiveStep, jobId} = props;
  const dashboard = useSelector((state)=>state.dashboard);

  return (
    <div></div>
  );
};

export default AttachFiles;
