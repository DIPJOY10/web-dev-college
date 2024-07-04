import React, { useState, useEffect } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import NumberFormat from 'react-number-format';
import cx from 'clsx';
import Paper from '@material-ui/core/Paper';
import { Button, Divider } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
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

const PopOver = (props) => {
  const classes = useStyles();
  const { root } = classes;

  const { setOpen } = props;

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
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
    ></Popover>
  );
};

export default PopOver;
