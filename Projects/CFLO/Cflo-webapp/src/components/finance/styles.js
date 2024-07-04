import React, {useState, useEffect} from 'react';
import {
  makeStyles,
  useTheme,
} from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import {withStyles} from '@material-ui/core/styles';


const styles = {
  root: {
    maxWidth: '20rem',
    height: '2rem',
    paddingLeft: '1rem',
    paddingRight: '1rem',
    fontSize: '1rem',
    backgroundColor: '#fafafa',

  },
};

export const NewInputBase = withStyles(styles)(InputBase);


const useStyles = makeStyles((theme) => ({
  textInput: {
    maxWidth: '20rem',
    height: '2rem',
    paddingLeft: '1rem',
    paddingRight: '1rem',
    fontSize: '1rem',
    color: theme.palette.primary.main,
    margin: '1 0rem'
  },

  descInput: {
    width: '90%',
    maxWidth: '50rem',
    height: '3rem',
    padding: '0.5rem',
    fontSize: '1rem',
    backgroundColor: '#fafafa',
    color: '#424242',
    marginTop: '-1rem',
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


}));

export const NumInput = (props)=>{
  const classes = useStyles();
  const {text, setText, placeholder} = props;

  return (
    <InputBase
      multiline
      type={'number'}
      rowsMax={1}
      value={text}
      placeholder={placeholder}
      onChange={(event)=>{
        const isNotANumber = isNaN(event.target.value);
        if (isNotANumber) {

        }
        else {
          const num = Number(event.target.value);
          setText(num);
        }
      }}
      className={classes.textInput}
      autoFocus
    />
  );
};

export const DescriptionInput = (props)=>{
  const classes = useStyles();
  const {text, setText, placeholder} = props;

  return (
    <InputBase
      multiline
      rowsMax={2}
      value={text}
      placeholder={placeholder}
      onChange={(event)=>setText(event.target.value)}
      className={classes.descInput}
      autoFocus
    />
  );
};
