import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import CreateBtn from '../styled/actionBtns/create.btn';
import Button from '@material-ui/core/Button';
import Api from '../../helpers/Api';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import { setPaymentSAndM } from './schedule.utils';
import NumberFormat from 'react-number-format';
import TextField from '@material-ui/core/TextField';
import clsx from 'clsx';
import { Toolbar } from '@material-ui/core';
import StatusDialog from '../styled/status.dialog';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
  root: {},

  text: {
    textAlign: 'center',
  },

  desgText: {
    maxWidth: '30rem',
    height: '2rem',
    paddingLeft: '1rem',
    paddingRight: '1rem',
    borderWidth: '1px',

    color: '#424242',
    margin: '1rem',
  },

  nameInputRow: {
    maxWidth: '34rem',
    marginBottom: '1rem',
    paddingLeft: '0.3rem',
  },

  numInputBox: {
    width: '9rem',
    maxWidth: '9rem',
    margin: '0.5rem',
  },

  row: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    maxWidth: '34rem',
  },

  col: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '34rem',
  },
}));

export default function MilestoneCreate(props) {
  const { scheduleId, setMode, isMobile } = props;
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const [status, setStatus] = useState('Planned');

  const [name, setName] = useState('');
  const [amount, setAmount] = useState(0);
  const scheduleReducer = useSelector((state) => state.schedule);

  const { root, row, col } = classes;

  const [isFilled, setIsFilled] = useState(false);

  const today = new Date();
  const tomorrow = new Date(today);
  const [expectedStart, setExpectedStart] = useState(moment(tomorrow).format('YYYY-MM-DD'));
  const [expectedFinish, setExpectedFinish] = useState(moment(tomorrow).format('YYYY-MM-DD'));

  const _create = () => {
    Api.post('schedule/payment/milestone/create', {
      schedule: scheduleId,
      name,
      status,
      amount,
      expectedStart,
      expectedFinish,
    }).then((res) => {
      const { schedule, milestones } = res;
      setPaymentSAndM(schedule, milestones, scheduleReducer, dispatch);
      setMode('List');
    });
  };

  useEffect(() => {
    if (name.length > 3 && amount > 0 && expectedStart && expectedFinish) {
      console.table(name, amount, expectedStart, expectedFinish, "payment", "true")
      setIsFilled(true);
    }
    else {
      console.table(name, amount, expectedStart, expectedFinish, "payment", "false")
      setIsFilled(false);
    }
  }, [name, amount, expectedStart, expectedFinish]);

  return (
    <Paper className={col}>
      <div className={row}>
        <div className={row}>
          <InputBase
            rowsMax={1}
            value={name}
            placeholder={'Milestone Description'}
            onChange={(event) => setName(event.target.value)}
            className={classes.desgText}
          />
        </div>
        <IconButton
          onClick={() => {
            setMode('List');
          }}
          className={classes.editButton}
        >
          <ClearIcon />
        </IconButton>
      </div>

      <div className={clsx(isMobile ? classes.col : classes.row, classes.nameInputRow)}>
        <div className={clsx(classes.col, classes.numInputBox)}>
          <Typography>Payment Amount</Typography>
          <NumberFormat
            value={amount}
            thousandSeparator={true}
            prefix={'$'}
            customInput={TextField}
            onValueChange={(values) => {
              const { value } = values;
              // console.log(value,' is the new value, amount old ',amount)
              if (value >= 0) {
                setAmount(value);
              }
            }}
          />
        </div>
        <div className={clsx(classes.col, classes.numInputBox)}>
          <Typography>Expected Start</Typography>
          <TextField
            id="standard-basic"
            value={expectedStart}
            helperText={'Expected Start Date'}
            type="date"
            defaultValue={moment(tomorrow).format('YYYY-MM-DD')}
            placeholder={expectedStart}
            onChange={(event) => {
              setExpectedStart(event.target.value);
            }}
          />
        </div>
        <div className={clsx(classes.col, classes.numInputBox)}>
          <Typography>Expected Finish</Typography>
          <TextField
            id="standard-basic"
            value={expectedFinish}
            helperText={'Expected Finish Date'}
            type="date"
            defaultValue={moment(tomorrow).format('YYYY-MM-DD')}
            placeholder={expectedFinish}
            onChange={(event) => {
              setExpectedFinish(event.target.value);
            }}
          />
        </div>
      </div>
      <Toolbar variant="dense" className={classes.tabRoot}>
        <div className={classes.row}>
          <StatusDialog status={status} setStatus={setStatus} />
        </div>
        <div className={classes.row}></div>
        <div className={classes.row}>
          {isFilled ? (
            <CreateBtn
              onClick={() => {
                _create();
              }}
            >
              Create
            </CreateBtn>
          ) : (
            <Button disabled={true} onClick={() => { }}>
              Create
            </Button>
          )}
        </div>
      </Toolbar>
    </Paper>
  );
}
