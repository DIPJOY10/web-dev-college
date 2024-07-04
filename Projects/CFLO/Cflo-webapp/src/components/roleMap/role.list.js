import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import RoleCard from './role.card';
import PaperBtn from '../styled/actionBtns/paper.btn';
import AddIcon from '@material-ui/icons/Add';
import { Toolbar } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    // [theme.breakpoints.down('xs')]: {
    //   width: '50%',
    //   // border: '1px solid red'
    // },
  },

  tabRoot: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: '1rem',
    padding: '1rem',
    height: '4rem',
    maxHeight: '4rem',
  },

  row: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
  },

  col: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
}));
export default function RoleList(props) {
  const {
    roles, setMode, setEditRole, onRoleDelete,
  } = props;
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const {

  } = useSelector((state) => state);

  const {
    root, row, col,
  } = classes;

  return (
    <div className={root}>
      <Toolbar variant="dense" className={classes.tabRoot}>
        <PaperBtn
          text={'Create'}
          icon={<AddIcon />}
          onClick={() => {
            setMode('Create');
          }}
        />
      </Toolbar>

      {roles.map((roleId) => {
        return <RoleCard
          key={roleId}
          roleId={roleId}
          onEditClick={() => {
            setEditRole(roleId);
            setMode('Edit');
          }}
          onDeleteClick={() => {
            onRoleDelete(roleId);
            setMode('List');
          }}
        />;
      })}
    </div>
  );
}
