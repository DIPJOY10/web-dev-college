import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import Typography from '@material-ui/core/Typography';
import Api from '../../../helpers/Api';
import BasicForm from './basic.form';
import { } from '../../styled/actionBtns/create.btn';

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,

  },
}));


const BasicSetting = (props)=>{
  const classes = useStyles();
  const {setActiveStep, jobId} = props;
  const dashboard = useSelector((state)=>state.dashboard);

  return (
    <div>
      <BasicForm />
    </div>
  );
};

export default BasicSetting;
