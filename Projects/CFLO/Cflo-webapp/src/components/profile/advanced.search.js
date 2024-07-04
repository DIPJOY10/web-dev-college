import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';

import Card from './basic.card';

const useStyles = makeStyles((theme) => ({
  root: {
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


export default function S(props) {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const {
    searchTerm, entities,
  } = useSelector((state) => state.profile);

  const {
    root, row, col,
  } = classes;


  useEffect(() => {
    console.log(entities)
  }, [entities]);
  useEffect(() => {
    console.log(entities, "joke he kya")
  }, []);
  return (
    <div className={root}>
      {entities && entities.map((entity) => {
        if (entity && entity?._id && entity?.parent?._id) {
          return <Card entity={entity} />;
        }
        else {
          return null;
        }
      })}
    </div>
  );
}
