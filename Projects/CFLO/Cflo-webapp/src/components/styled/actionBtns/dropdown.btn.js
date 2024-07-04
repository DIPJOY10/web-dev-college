import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import ButtonBase from '@material-ui/core/ButtonBase';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Paper from '@material-ui/core/Paper';
import {Typography} from '@material-ui/core';
import Popover from '@material-ui/core/Popover';

const btnBasic = {
  height: '2rem',
  marginTop: '1.5rem',
  fontSize: '0.9rem',
  fontWeight: '700',
  backgroundColor: '#00c853',
  color: 'white',
  borderRadius: '1rem',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
};

const useStyles = makeStyles({
  addNewBtn: btnBasic,

  disabledStyle: {
    ...btnBasic,
    opacity: '0.5',
  },

  btnBase: {
    width: '7.5rem',
  },

  iconDrop: {
    width: '2rem',
  },

  btnText: {
    fontSize: '0.95rem',
  },

  popoverStyle: {
    height: '8rem',
    width: '13rem',
    padding: '1rem',

  },

  popoverButton: {
    width: '11rem',
    height: '3.0rem',
    paddingRight: '2rem',
    display: 'flex',
    borderRadius: '5%',
  },

  popoverText: {
    fontSize: '1rem',
  },

});

export default function DropdownBtn(props) {
  const classes = useStyles();
  const {addNewBtn, disabledStyle, btnBase, btnText, iconDrop} = classes;
  const [index, setIndex] = useState(0);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const {
    disabled,
    textArr,
    funcArr,
  } = props;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <Paper className={disabled?disabledStyle:addNewBtn}>

      <ButtonBase
        disabled={disabled}
        className={btnBase}
        onClick={()=>{
          if (funcArr[index]) {
            const func = funcArr[index];
            if (func) {
              func();
            }
          }
        }}

      >
        <Typography className={btnText}>
          {textArr[index]}
        </Typography>

      </ButtonBase>

      {textArr?.length>1? <span className={iconDrop}>
        <ButtonBase onClick={handleClick} disabled={disabled}>
          <ArrowDropDownIcon/>
        </ButtonBase>

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
          <Paper elevation={3} className={classes.popoverStyle}>
            {textArr.map((text, index)=>{
              return <ButtonBase
                className={classes.popoverButton}
                onClick={()=>{
                  setIndex(index);
                  setAnchorEl(null);
                }}>
                <Typography className={classes.popoverText}>
                  {text}
                </Typography>

              </ButtonBase>;
            })}
          </Paper>

        </Popover>
      </span>:null}


    </Paper>

  );
}
