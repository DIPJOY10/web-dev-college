import React, { useState, useEffect } from 'react';
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
import { Button, Divider } from '@material-ui/core';
import { NewInputBase } from '../styles';
import MyAutocomplete from '../../styled/CommonComponents/MyAutoComplete';
import AutocompleteWithSeveralCreates from '../../styled/CommonComponents/AutocompleteWithSeveralCreates';
import CreateOffering from '../offering/create.offering';
import CreateDiscountOrTax from './Create.DiscountOrTax';



const useStyles = makeStyles((theme) => ({

  root: {
    width: '50vw',
    maxWidth: '17rem',
    margin: '0.5rem',
    [theme.breakpoints.down('sm')]: {
      width: '90vw',
      maxWidth: '15rem',
    },
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
    width : "65px",
    textAlign: 'left',
  },

  placeholderDisabledBtn: {

  },

  placeholderEnabledBtn: {
    width: '50vw',
    maxWidth: '17rem',
    display: 'flex',
    justifyContent: 'space-between',

    [theme.breakpoints.down('sm')]: {
      width: '90vw',
      maxWidth: '15rem',
    },

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
  autoCompleteCont: {
    marginLeft: "-10px",
    width : "55%"
  },
  discountOrTaxCont: {
    marginLeft: '30px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }
}));


const MoneyPopOver = (props) => {
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
    autoCompleteCont,
    discountOrTaxCont,

  } = classes;

  const {
    placeholder,
    valObjGiven,
    setValObj,
    taxesOrDiscounts,
    taxOrDiscountValue,
    onSelect,
    tx,
    callDefaultAdd
  } = props;


  console.log(valObjGiven)


  const [valObj, setValObjUseState] = useState(valObjGiven);



  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    if(taxOrDiscountValue){

      console.log(taxOrDiscountValue)

      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };


  useEffect(() => {
    setValObjUseState(valObjGiven)
    setType(valObjGiven?.type)
    setAmount(valObjGiven?.amount)
    setPercent(valObjGiven?.percent)
  },[valObjGiven])


  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;


  const oldType = valObj?.type ? valObj.type : '$';
  const oldAmount = valObj?.amount ? valObj.amount : 0;
  const oldPercent = valObj?.percent ? valObj.percent : 0;


  const [type, setType] = useState(oldType);
  const [amount, setAmount] = useState(oldAmount);
  const [percent, setPercent] = useState(oldPercent);

  const [taxOrDiscountText, setTaxOrDiscountText] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);



  const onApply = () => {
    const obj = {
      enabled: true,
      type,
      amount,
      percent,
    };

    if (setValObj) {
      setValObj(obj);
      setAnchorEl(null);
      if(!tx?.billList?.discountRelationModel && placeholder === "Discount"){
        console.log("call Default")
        callDefaultAdd();
      }
      if(!tx?.billList?.taxRelationModel && placeholder === "Tax"){
        console.log("call Default")
        callDefaultAdd();
      }
      
    }
  };

  const getOptionLabel = (option) => {
    return option?.name || " ";
  };

  console.log(taxesOrDiscounts)


  return (
    <div className={root}>

      {
        valObj?.enabled ?
          <>
            <div className={placeholderEnabledBtn} aria-describedby={id} variant="contained" color="primary">
              <ButtonBase onClick={handleClick} >
                <Typography className={placeholderTextEnabled}>
                  {placeholder}
                </Typography>
              </ButtonBase>
              <div className={autoCompleteCont}>
                <AutocompleteWithSeveralCreates
                  value={taxOrDiscountValue}
                  offerings={taxesOrDiscounts}
                  onSelect={onSelect}
                  placeholder={""}
                  text={taxOrDiscountText}
                  setText={setTaxOrDiscountText}
                  open={createOpen}
                  setOpen={setCreateOpen}
                  loading={createLoading}
                  setLoading={setCreateLoading}
                  getOptionLabel={getOptionLabel}
                  lable={""}
                  CreateDialogBox={
                    <CreateDiscountOrTax
                      text={taxOrDiscountText}
                      setOpen={setCreateOpen}
                      setLoading={setCreateLoading}
                      onSelect={onSelect}
                      createType={placeholder}
                      tx={tx}
                    />
                  }
                />
              </div>
              {type == '$' ?
                <Typography className={discountOrTaxCont} >${amount}</Typography>
                :
                <Typography className={discountOrTaxCont} >{percent}%</Typography>
              }
            </div>
          </>
          :
          <div className={row}>
            <div className={row}></div>
            <ButtonBase aria-describedby={id} variant="contained" color="primary" onClick={handleClick}>
              <Typography className={placeholderTextEnabled}>
                Add {placeholder}
              </Typography>
            </ButtonBase>
          </div>

      }

      <Divider />

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >

        <div className={cx(classes.col, popoverContent)}>
          <div className={row}>
            <Typography className={classes.typography}>
              {placeholder}
            </Typography>


          </div>

          <div className={classes.row}>
            <div className={classes.row}>
              <Paper className={type == '%' ? smBtnActive : smBtn}>
                <ButtonBase
                  className={typeBtn}
                  onClick={() => {
                    setType('%');
                  }}
                >

                  <Typography>%</Typography>


                </ButtonBase>
              </Paper>
              <Paper className={type == '$' ? smBtnActive : smBtn}>
                <ButtonBase
                  className={typeBtn}
                  onClick={() => {
                    setType('$');
                  }}
                >

                  <Typography>$</Typography>

                </ButtonBase>
              </Paper>

            </div>
            <div className={popoverTextInputDiv}>
              {type == '$' ? <NumberFormat
                allowNegative={false}
                isAllowed={(values) => {
                  const { value } = values;
                  return totalItemBal ? value < totalItemBal : true;
                }}
                value={amount} thousandSeparator={true} prefix={'$'}
                customInput={NewInputBase}
                onValueChange={(values) => {
                  const { value } = values;
                  setAmount(value);
                }}
              /> : <NumberFormat
                allowNegative={false}
                isAllowed={(values) => {
                  const { value } = values;
                  return value >= 0 && value < 100;
                }}
                value={percent} thousandSeparator={false} suffix={'%'}
                customInput={NewInputBase}
                onValueChange={(values) => {
                  const { value } = values;
                  setPercent(value);
                }}
              />}


            </div>

          </div>
          <div className={row}>
            <div className={row}>

            </div>
            <Button color={'primary'}
              onClick={() => {
                onApply();
              }}
            >Apply</Button>
          </div>
        </div>
      </Popover>


    </div>
  );
};

export default MoneyPopOver;
