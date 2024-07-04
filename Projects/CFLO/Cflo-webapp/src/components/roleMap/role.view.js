import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import AvatarBlock from '../styled/DataDisplay/avatarNameAndPostedAt';
import DescriptionText from '../styled/DataDisplay/description';
import ClearIcon from '@material-ui/icons/Clear';
const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    display: 'flex',
    maxWidth: '34rem',

  },

  dp: {
    height: '1.2rem',
    width: '1.2rem',
  },

  row: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    paddingLeft: '0.5rem',
  },

  col: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: '0.2rem',
  },

  editButton: {
    height: '2.5rem',
    width: '2.5rem',
    marginBottom: '1rem',
  },
  paper: {
    marginTop: '0.4rem',
    flex: 1,
    display: 'flex',
    maxWidth: '42rem',
  },
}));

export default function S(props) {
  const { role, onEditClick, onDeleteClick } = props;
  const profile = role?.profile;
  const about = role?.about ? role?.about : '';
  const designation = role?.designation ? role?.designation : '';
  const classes = useStyles();

  const {
    root, row, col, paper,
  } = classes;

  return (

    <Paper className={paper} square>
      <div className={col}>
        <div className={row}>
          <AvatarBlock
            user={profile?.parent}
            subText={designation}

          />
          <div className={row}>

          </div>

          {onDeleteClick ? <IconButton onClick={() => {
            onDeleteClick();
          }}
            className={classes.editButton}
          >
            <ClearIcon />
          </IconButton> : null}
          {onEditClick ? <IconButton onClick={() => {
            onEditClick();
          }}
            className={classes.editButton}
          >
            <EditIcon />
          </IconButton> : null}


        </div>
        <div className={row}>
          <DescriptionText
            text={about}
            minChar={200}
          />
        </div>


      </div>

    </Paper>

  );
}
