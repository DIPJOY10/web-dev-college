import React, {useState, useEffect} from 'react';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import {useSelector, useDispatch} from 'react-redux';
import Chip from '@material-ui/core/Chip';

const useStyles = makeStyles({
  root: {
    flex: 1,
    marginTop: '1rem',
  },

  row: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  col: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },

  textStyle: {
    wordWrap: 'break-word',
  },

  chip: {
    margin: '0.3rem',
    height: '1.5rem',
  },
});

export default function TextView(props) {
  const classes = useStyles();
  const {propCatDictionary, jobCatDictionary} = useSelector((state) => state.dashboard);
  const {tagIds = [], type} = props;

  let dictionary = propCatDictionary;

  switch (type) {
    case 'Property':
      dictionary = propCatDictionary;
      break;

    case 'Jobs':
      dictionary = jobCatDictionary;
      break;

    default:
      break;
  }

  return (
    <div className={classes.row}>
      {tagIds.map((tagId) => {
        const tag = dictionary[tagId];

        return <Chip className={classes.chip} label={tag?.name} />;
      })}
    </div>
  );
}
