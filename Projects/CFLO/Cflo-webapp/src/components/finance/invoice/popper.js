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
import {Button, Divider, Checkbox} from '@material-ui/core';
import baseStyle from '../../styled/base/index';
import EditBtn from '../../styled/actionBtns/edit.btn';
import NumberInput from '../../styled/number.input';
import InputBase from '@material-ui/core/InputBase';
import {withStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
  ...baseStyle,
  root: {
    padding: '1rem',
  },
  btnStyle: {
    marginTop: '1rem',
  },

  checkbox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
}));


const InvoicePopOver = ( props ) => {
  const classes = useStyles();
  const {
    root,
    btnStyle,
    row,
    col,
    checkbox,
  } = classes;

  const {
    update,
  } = props;

  const invNoProps = props?.invNo;

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [invNo, setInvNo] = useState(invNoProps);
  const [updateCounter, setUpdateCounter] = useState(false);
  const handleClick = (event) => {
    setAnchorEl(event?.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'invoicepopover' : undefined;

  useEffect(() => {
    setInvNo(invNoProps);
  }, [invNoProps]);


  return (
    <>

      <EditBtn
        onClick={handleClick}
        aria-describedby={id}
      />

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

        <div className={cx(root, col)}>
          <Typography>
            <b>Invoice Number </b>
          </Typography>

          <NumberFormat value={invNo} customInput={TextField}
            placeholder={invNo}
            decimalSeparator = {false}
            onValueChange={(values)=>{
              const newNo = values?.value;
              setInvNo(newNo);
            }}
          />

          {/* <div className={cx(row,checkbox)}>
                            <Checkbox
                                checked={updateCounter}
                                color="primary"
                                inputProps={{ 'aria-label': 'secondary checkbox' }}
                                onChange={(event)=>{
                                    setUpdateCounter(event.target.checked);
                                }}
                            />
                            <div className={row}>
                                <Typography>
                                    Set as latest invoice.
                                </Typography>
                            </div>
                        </div> */}


          <Button variant="contained" color="primary" disableElevation
            className={btnStyle}

            onClick={()=>{
              update(invNo, updateCounter);
            }}
          >
                            Update Invoice Number
          </Button>

        </div>

      </Popover>
    </>

  );
};

export default InvoicePopOver;
