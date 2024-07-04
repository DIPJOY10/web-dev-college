import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import NumberFormat from 'react-number-format';
import TextField from '@material-ui/core/TextField';
import clsx from 'clsx';
import RoleView from '../roleMap/roles.view';
import _ from 'lodash';
import Api from '../../helpers/Api';
import { setInvestments } from './investment.utils';

const useStyles = makeStyles((theme) => ({


  row: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
  },

  numInputRow: {
    width: '17rem',
    maxWidth: '17rem',
  },

  col: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },

  numInputBox: {
    width: '10rem',
    maxWidth: '10rem',
    margin: '0.5rem',
  },

}));
export default function EditInvestment(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { investmentId, header, setHeader, isMobile } = props;


  return (
    <div className={classes.col}>
      <div className={isMobile ? classes.col : classes.row}>
        <div className={clsx(classes.row, classes.numInputRow)}>
          <div className={clsx(classes.col, classes.numInputBox)}>
            <Typography>Project Size</Typography>
            <NumberFormat placeholder={header.size} value={header.size} thousandSeparator={true} prefix={'$'} customInput={TextField} onValueChange={(values) => {
              const { value } = values;
              setHeader({
                ...header,
                size: value,
              });
            }} />
          </div>
          <div className={clsx(classes.col, classes.numInputBox)}>
            <Typography>Target IRR</Typography>
            <TextField id="standard-basic" type="number" value={header.irr}
              helperText={'10.2 (%)'}
              placeholder={header.irr}
              onChange={(event) => {
                setHeader({
                  ...header,
                  irr: event.target.value,
                });
              }} />

          </div>
        </div>
        <div className={clsx(classes.row, classes.numInputRow)}>
          <div className={clsx(classes.col, classes.numInputBox)}>
            <Typography>Requirement</Typography>
            <NumberFormat value={header.requirement} thousandSeparator={true} prefix={'$'} customInput={TextField} onValueChange={(values) => {
              const { value } = values;
              setHeader({
                ...header,
                requirement: value,
              });
            }} />
          </div>
          <div className={clsx(classes.col, classes.numInputBox)}>
            <Typography>Target Hold</Typography>
            <TextField id="standard-basic" value={header.hold}
              placeholder={header.hold}
              helperText={'10 months'}
              onChange={(event) => {
                setHeader({
                  ...header,
                  hold: event.target.value,
                });
              }} />

          </div>
        </div>
        <div className={clsx(classes.row, classes.numInputRow)}>
          <div className={clsx(classes.col, classes.numInputBox)}>
            <Typography>Min Investment Size</Typography>
            <NumberFormat value={header.minTicket} thousandSeparator={true} prefix={'$'} customInput={TextField} onValueChange={(values) => {
              const { value } = values;
              setHeader({
                ...header,
                minTicket: value,
              });
            }} />
          </div>
        </div>

      </div>


    </div>

  );
}
