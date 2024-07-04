import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import UserForm from '../userForm';
import UserPalAutocomplete from '../UserPalAutocomplete';
import DescriptionInput from '../styled/description.input';
import InputBase from '@material-ui/core/InputBase';
import CreateBtn from '../styled/actionBtns/create.btn';
import Button from '@material-ui/core/Button';
import Api from '../../helpers/Api';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import { setPaymentM } from './schedule.utils';
import NumberFormat from 'react-number-format';
import TextField from '@material-ui/core/TextField';
import clsx from 'clsx';
import PaperBtn from '../styled/actionBtns/paper.btn';
import { Toolbar } from '@material-ui/core';
import StatusDialog from '../styled/status.dialog';

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
  },

  col: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
}));

export default function MilestoneEdit(props) {
  const { milestoneId, setMode, isMobile } = props;
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const scheduleReducer = useSelector((state) => state.schedule);
  const { paymentMilestoneDictionary } = scheduleReducer;
  const paymentMilestone = paymentMilestoneDictionary[milestoneId];

  const oldName = paymentMilestone?.name ? paymentMilestone?.name : '';
  const oldStatus = paymentMilestone?.status ? paymentMilestone?.status : 'Planned';
  const oldAmount = paymentMilestone?.amount ? paymentMilestone?.amount : '';
  const oldExpectedStart = paymentMilestone?.expectedStart ? paymentMilestone?.expectedStart : null;
  const oldExpectedFinish = paymentMilestone?.expectedFinish ? paymentMilestone?.expectedFinish : null;

  const [status, setStatus] = useState(oldStatus);
  const [name, setName] = useState(oldName);
  const [amount, setAmount] = useState(oldAmount);
  const [expectedStart, setExpectedStart] = useState(new Date(oldExpectedStart));
  const [expectedFinish, setExpectedFinish] = useState(new Date(oldExpectedFinish));
  // console.log(expectedStart,expectedFinish)
  const { root, row, col } = classes;

  const [isFilled, setIsFilled] = useState(false);

  const _update = () => {
    Api.post('schedule/payment/milestone/update', {
      _id: milestoneId,
      name,
      status,
      amount,
      expectedStart,
      expectedFinish,
    }).then((res) => {
      const milestone = res;

      setPaymentM([milestone], scheduleReducer, dispatch);
      setMode('List');
    });
  };

  useEffect(() => {
    if (name.length > 3 && amount > 0 && expectedStart && expectedFinish) {
      setIsFilled(true);
    }
    else {
      setIsFilled(false);
    }
  }, [name, amount, expectedStart, expectedFinish]);

  return (
    <Paper>
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
            defaultValue={expectedStart}
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
            defaultValue={expectedFinish}
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
                _update();
              }}
            >
              Update
            </CreateBtn>
          ) : (
            <Button disabled={true} onClick={() => { }}>
              Update
            </Button>
          )}
        </div>
      </Toolbar>
    </Paper>
  );
}
