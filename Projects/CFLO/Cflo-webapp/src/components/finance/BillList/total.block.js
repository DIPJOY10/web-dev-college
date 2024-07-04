import React, {useState, useEffect} from 'react';
import {
  makeStyles,
  useTheme,
} from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import NumberFormat from 'react-number-format';
import cx from 'clsx';
import Paper from '@material-ui/core/Paper';
import {Button, Divider} from '@material-ui/core';
import {NewInputBase} from './styles';


const useStyles = makeStyles((theme) => ({

  root: {
    width: '40vw',
    maxWidth: '15rem',
    margin: '0.5rem',
  },

  col: {
    flex: 1,
    flexDirection: 'column',
    display: 'flex',
  },

  row: {
    flex: 1,
    flexDirection: 'row',
    display: 'flex',
  },

  placeholderText: {
    fontSize: '1.3rem',
  },

  placeholderTextEnabled: {
    fontSize: '1rem',
    color: theme.palette.primary.main,
    fontWeight: '600',
  },

  placeholderDisabledBtn: {

  },

  placeholderEnabledBtn: {
    width: '40vw',
    maxWidth: '15rem',
  },

  smBtn: {
    minWidth: '3rem',
    height: '2rem',
    marginTop: '0.5rem',
  },

  smBtnActive: {
    minWidth: '3rem',
    height: '2rem',
    borderColor: theme.palette.primary.main,
    borderWidth: '1px',
    backgroundColor: '#bbdefb',
    marginTop: '0.5rem',
  },

  popoverContent: {
    padding: '1rem',
  },

  popoverTextInputDiv: {
    maxWidth: '7rem',
    margin: '0.5rem',
  },

  typeBtn: {
    minWidth: '3rem',
    height: '2rem',
    textAlign: 'center',
  },

}));


const MoneyPopOver = ( props ) => {
  const classes = useStyles();
  const {
    root,
    row,
    placeholderEnabledBtn,
    placeholderDisabledBtn,
    placeholderText,
    placeholderTextEnabled,
    smBtn,
    smBtnActive,
    typeBtn,
    popoverTextInputDiv,
    popoverContent,
    totalItemBal,
  } = classes;

  const {
    placeholder,
    valObj,
    setValObj,
  } = props;

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;


  const oldType = valObj?.type?valObj.type:'$';
  const oldAmount = valObj?.amount?valObj.amount:0;
  const oldPercent = valObj?.percent?valObj.percent:0;


  const [type, setType] = useState(oldType);
  const [amount, setAmount] = useState(oldAmount);
  const [percent, setPercent] = useState(oldPercent);

  const onApply = ()=>{
    const obj = {
      enabled: true,
      type,
      amount,
      percent,
    };

    if (setValObj) {
      setValObj(obj);
      setAnchorEl(null);
    }
  };

  return (
    <div className={root}>

      {
              valObj?.enabled?

                    <ButtonBase className={placeholderEnabledBtn} aria-describedby={id} variant="contained" color="primary" onClick={handleClick}>
                      <div className={row}>
                        <Typography className={placeholderTextEnabled}>
                          {placeholder}
                        </Typography>
                      </div>
                      {type=='$'?<Typography>${amount}</Typography>:
                        <Typography>{percent}%</Typography>}
                    </ButtonBase> :
                <div className={row}>
                  <div className={row}></div>
                  <ButtonBase aria-describedby={id} variant="contained" color="primary" onClick={handleClick}>
                    <Typography className={placeholderTextEnabled}>
                            Add {placeholder}
                    </Typography>
                  </ButtonBase>
                </div>

      }


    </div>
  );
};

export default MoneyPopOver;
