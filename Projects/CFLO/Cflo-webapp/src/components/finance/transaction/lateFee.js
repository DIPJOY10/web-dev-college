import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import Api from '../../../helpers/Api';
import Typography from '@material-ui/core/Typography';
import cx from 'clsx';
import baseStyle from '../../styled/base/index';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import Dialog from './Dialog';
import Paper from "@material-ui/core/Paper";
import MyAutocomplete from '../../styled/CommonComponents/MyAutoComplete';
import { updateTx } from './api';
import { useGetTx } from './hooks'

const useStyles = makeStyles((theme) => ({
  ...baseStyle,

  mainPaperCont: {
    padding: "10px 15px",
    marginTop: "20px",
    width: "98%",
  },

  alignCenter: {
    alignItems: 'center',
  },

  justifyCenter: {
    justifyContent: 'center',
  },

  datePicker: {
    width: 150,
  },
  dueDate: {
    width: 150,
    marginLeft: "15px",
    [theme.breakpoints.down('sm')]: {
      marginLeft: "0px"
    },
  },
  alignItems: {
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      alignItems: 'flex-start'
    },
  },
  autocompleteCont: {
    [theme.breakpoints.down('sm')]: {
      marginLeft: "-18px"
    },
  },
  styleDialogText: {
    width: "35px",
    height: "35px",
    marginLeft: "30px"
  },

  styleInputRadio: {
    width: "15px",
    height: "15px",
    marginBottom: "-4px"
  },

}));

export default function TxLateFee(props) {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const {
    tx, setTx, updateApi, setShowGL, walletId
  } = props;

  const {
    justifyCenter, alignCenter, datePicker, alignItems,
    styleInputRadio, styleDialogText, autocompleteCont,
    mainPaperCont
  } = classes;





  const DateNow = new Date();
  const oldDueDate = tx?.dueDate || DateNow;
  const [dueDate, setDueDate] = useState('' + oldDueDate);

  const oldInvoiceDate = tx.invoiceDate || DateNow;
  const [invoiceDate, setInvoiceDate] = useState('' + oldInvoiceDate);

  const oldlateFeeApplicable = tx?.lateFeeApplicable || false;
  const [lateFeeApplicable, setLateFeeApplicable] = useState(oldlateFeeApplicable);


  const oldlateFeeDate = tx?.lateFeeDate || DateNow;
  const [lateFeeDate, setLateFeeDate] = useState('' + oldlateFeeDate);

  const oldlateFeeAmount = tx?.lateFeeAmount || 0;
  const [lateFeeAmount, setLateFeeAmount] = useState(oldlateFeeAmount);

  const [terms, setTerms] = useState([]);

  const [text, setText] = useState('');

  const [open, setOpen] = useState(false);

  const term = tx?.term;

  const [termValue, setTermValue] = useState(term);

  const [onlyDays, setOnlyDays] = useState(false);
  const [onlyDayMonth, setOnlyDayMonth] = useState(false);

  const [termName, setTermName] = useState("");
  const [termDays, setTermDays] = useState(0);
  const [termDMDay, setTermDMDay] = useState(0);
  const [termDMMonth, setTermDMMonth] = useState(0);



  const {
    root, row, col,
  } = classes;

  const update = async (obj) => {
    await updateApi(obj)
    setTx({
      ...tx,
      ...obj
    })
  }

  const changeTermValue = async (newTerm) => {
    const currentDate = new Date();
    let newTx;
    console.log(newTerm);
    if (newTerm.isNumDays) {
      const result = currentDate.setDate(currentDate.getDate() + newTerm?.numDays);
      const changedDate = new Date(result)
      setDueDate(changedDate)
      newTx = {
        _id: tx?._id,
        dueDate: changedDate,
      }

    } else if (newTerm.isDayOfMonth) {
      currentDate.setDate(newTerm?.day)
      currentDate.setMonth(newTerm?.month);
      setDueDate(currentDate);
      newTx = {
        _id: tx?._id,
        dueDate: currentDate,
      }
    }
    await update(newTx);
    setTermValue(newTerm);
  }



  useEffect(() => {
    Api.post('wallet/term/get', { walletId: walletId }).then((res) => {
      if (res.status === 200) {
        const addObject = {
          _id: 'New',
          name: "+ Add New",
          numDays: "0"
        };
        const newFiltered = [addObject, ...res.data]
        console.log(newFiltered);
        setTerms(newFiltered);
      }
    });
  }, [termValue]);

  const getListItem = (option) => {
    return <div className={row}>
      {option?.name}
    </div>;
  };

  const onNew = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTermValue(termValue)
  }

  const getOptionLabel = (option) => {
    return option?.name || " ";
  };

  const checkboxClicked = async (lateFee) => {
    console.log(lateFee)
    lateFee ? setLateFeeApplicable(false) : setLateFeeApplicable(true)
    lateFee ? setShowGL(false) : setShowGL(true)
    if (lateFee) {
      await update({
        _id: tx?._id,
        lateFeeApplicable: !lateFee
      });
    } else {
      await update({
        _id: tx?._id,
        lateFeeApplicable: true
      });
    }

  }

  const onSelect = async (selected) => {
    if (selected && selected._id) {
      console.log(selected);
      const newTerm = {
        _id: tx?._id,
        term: selected._id
      }
      await update(newTerm);
      const updatedTx = tx
      updatedTx.term = selected

      setTx(updatedTx)
      changeTermValue(selected)
    }
  };

  const saveNewTerm = async () => {
    const newTerm = {
      name: termName,
      isNumDays: onlyDays,
      numDays: termDays,
      isDayOfMonth: onlyDayMonth,
      day: termDMDay,
      month: termDMMonth,
      wallet: walletId,
      public: false
    };
    const data = {
      term: newTerm,
      _id: tx._id
    }
    if (termName.length > 3 && (onlyDays || onlyDayMonth)) {
      Api.post("wallet/term/create", data).then((res) => {
        if (res.status === 200) {
          console.log(res);
          const newTerms = terms;
          newTerms.push(res.data);
          setTerms(newTerms);
          onSelect(res.data)
        }
      })
        .catch(err => console.log(err));
    }

    setTermName("");
    setTermDays(0);
    setTermDMDay(0);
    setTermDMMonth(0)
    setOpen(false);
  }

  return (
    <>
      <Paper className={mainPaperCont} >
        <div className={cx(alignItems)} >
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              value={invoiceDate}
              className={classes.datePicker}
              margin="normal"
              id="due-date-picker"
              label="Invoice Date"
              format="MM/dd/yyyy"
              onChange={async (date) => {
                await update({
                  _id: tx?._id,
                  invoiceDate: date,
                });
                setInvoiceDate(date);
              }}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          </MuiPickersUtilsProvider>

          {/* terms  */}
          <div className={autocompleteCont} >
            <MyAutocomplete
              isSmall={false}
              value={termValue}
              text={text}
              setText={setText}
              placeholder={'Terms'}
              results={terms}
              getOptionLabel={getOptionLabel}
              onSelect={onSelect}
              onNew={onNew}
              label={"Term"}
              setWidth={"200px"}
            />
          </div>

          <Dialog
            open={open}
            handleClose={handleClose}
            setOnlyDays={setOnlyDays}
            setOnlyDayMonth={setOnlyDayMonth}
            onlyDayMonth={onlyDayMonth}
            onlyDays={onlyDays}
            styleDialogText={styleDialogText}
            styleInputRadio={styleInputRadio}
            termName={termName}
            setTermName={setTermName}
            termDays={termDays}
            setTermDays={setTermDays}
            termDMDay={termDMDay}
            setTermDMDay={setTermDMDay}
            termDMMonth={termDMMonth}
            setTermDMMonth={setTermDMMonth}
            saveNewTerm={saveNewTerm}
          />

          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              value={dueDate}
              className={classes.dueDate}
              margin="normal"
              id="due-date-picker"
              label="Due Date"
              format="MM/dd/yyyy"
              onChange={async (date) => {
                await update({
                  _id: tx?._id,
                  dueDate: date,
                });
                setDueDate(date);
              }}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          </MuiPickersUtilsProvider>
        </div>

        <div className={cx(row, justifyCenter, alignCenter)}>
          <Checkbox
            color="primary"
            checked={lateFeeApplicable}
            onClick={() => checkboxClicked(lateFeeApplicable)}
          />
          <Typography className={row}>
            Late Fees Applicable
          </Typography>
        </div>
        {lateFeeApplicable ? <div className={cx(row, alignCenter)}>

          <div>
            <FormControl className={classes.margin}>
              <InputLabel htmlFor="outlined-adornment-amount">Late Fee Amount</InputLabel>
              <Input
                id="outlined-adornment-amount"
                value={lateFeeAmount}
                onChange={(event) => {
                  const amount = event.target.value;
                  update({
                    _id: tx?._id,
                    lateFeeAmount: amount,
                  });
                  setLateFeeAmount(amount);
                }}
                startAdornment={<InputAdornment position="start">$</InputAdornment>}
                labelWidth={60}
              />
            </FormControl>
          </div>
        </div> : null}

      </Paper>

    </>
  );
}
