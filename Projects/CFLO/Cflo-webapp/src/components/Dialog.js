import React from 'react';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import PersonIcon from '@material-ui/icons/Person';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';
import {blue} from '@material-ui/core/colors';

const useStyles = makeStyles({
  listStyle: {
    padding: '1rem',
    paddingBottom: '2rem',
    paddingTop: 0,
  },
});

export default function SimpleDialog(props) {
  const classes = useStyles();
  const {setOpen, ListItems, open, title} = props;

  const handleClose = () => {
    setOpen(false);
  };


  return (
    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle id="simple-dialog-title">{title}</DialogTitle>
      <List className={classes.listStyle}>
        {ListItems}
      </List>
    </Dialog>
  );
}
