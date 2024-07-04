import React, {useState} from 'react';
import {withStyles, makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ButtonBase from '@material-ui/core/ButtonBase';
import InputBase from '@material-ui/core/InputBase';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    margin: '1rem',
  },
  input: {
    width: '3rem',
    justifyContent: 'center',
    paddingLeft: '0.9rem',
    textAlign: 'center',
    fontSize: '1.3rem',
    borderTopWidth: '1px',
    color: theme.palette.primary.main,
    borderColor: theme.palette.primary.main,
  },
  left: {
    backgroundColor: theme.palette.primary.main,
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
    color: 'white',
    paddingLeft: '0.5rem',
    paddingRight: '0.2rem',

  },
  right: {
    backgroundColor: theme.palette.primary.main,
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
    color: 'white',
    paddingRight: '0.5rem',
    paddingLeft: '0.2rem',
  },
}));


const NumberInput = (props)=>{
  const classes = useStyles();
  const {
    root, input, left, right,
  } = classes;

  const {value, setValue} = props;


  return (
    <div className={root}>


      <ButtonBase className={left} onClick={()=>{
        if (value>=1) {
          setValue(value-1);
        }
      }}>
        <RemoveIcon />
      </ButtonBase>
      <Paper square>
        <InputBase
          value={value}
          min="0" max="80"
          onChange={(event)=>{
            const target = Number(event.target.value);
            if (Number.isInteger(target)&&target>=0&&target<=60) {
              setValue(target);
            }
          }}
          className={input}
        />
      </Paper>

      <ButtonBase className={right} onClick={()=>setValue(value+1)}>
        <AddIcon />
      </ButtonBase>


    </div>
  );
};

export default NumberInput;
