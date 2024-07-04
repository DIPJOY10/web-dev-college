import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {Popover, Typography, Avatar, Divider, Button, useTheme} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  popover: {
    background: theme.palette.profilePopColor,
    width: theme.spacing(40),
  },
  container: {
    display: 'flex',
    padding: theme.spacing(2),
    flexDirection: 'column',
    alignItems: 'center',
  },

}));

export default function ProfilePopover({anchorEl, isOpen, onClose}) {
  const classes = useStyles();

  return (
    <div>
      <Popover
        id={'pop'}
        open={isOpen}
        anchorEl={anchorEl}
        onClose={onClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        classes={{
          paper: classes.popover,
        }}
      >
      </Popover>
    </div>
  );
}
