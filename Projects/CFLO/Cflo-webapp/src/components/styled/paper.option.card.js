import React, {useState, useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';


const useStyles = makeStyles((theme) => ({

  selectedOptionColor: {
    backgroundColor: '#e1f5fe',

  },

  optionPaper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '16rem',
    marginTop: '1rem',
    marginLeft: '1rem',
    marginRight: '1rem',

  },

  optionBtn: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: '0.5rem',
    maxWidth: '13rem',
    alignItems: 'flex-start',
  },

  optionTextHeader: {
    marginLeft: '0.5rem',
  },

  optionText: {
    fontSize: '0.9rem',
    textAlign: 'left',
    paddingLeft: '0.6rem',
    paddingRight: '1rem',
  },

}));
export default function PaperOptionCard(props) {
  const classes = useStyles();
  const {
    optionPaper, selectedOptionColor,
  } = classes;
  const {
    title,
    text,
    selected,
    onClick,
  } = props;

  return (
    <Paper className={selected?clsx(optionPaper, selectedOptionColor):optionPaper}>
      <ButtonBase className={classes.optionBtn} onClick={()=>{
        if (onClick) {
          onClick();
        }
      }}>
        <div className={classes.row}>

          <Typography className={classes.optionTextHeader}>
            <b>{title}</b>
          </Typography>
        </div>

        <Typography className={classes.optionText}>
          {text}
        </Typography>
      </ButtonBase>

    </Paper>
  );
}
