import React, {useEffect, useRef, useState} from 'react';
import Paper from '@material-ui/core/Paper';
import {
  makeStyles,
  useTheme,
} from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  Btn: {
    paddingLeft: '1rem',
    padding: '0.5rem',
    paddingTop: '0.25rem',
    paddingBottom: '0.25rem',
    cursor: "pointer"
  },

  Text: {
    marginLeft: '0.5rem',
  },

  BtnPaper: {
    marginRight: '1rem',

  },
}));


export default function PaperBtn(props) {
  const classes = useStyles();
  const {icon, text, onClick: onClickFn} = props;
  return (
    <Paper className={classes.BtnPaper}>
      <ButtonBase className={classes.Btn}
        onClick={()=>{
          onClickFn();
        }}
      >
        {icon}
        <Typography className={classes.Text}>
          {text}
        </Typography>

      </ButtonBase>
    </Paper>
  );
}
