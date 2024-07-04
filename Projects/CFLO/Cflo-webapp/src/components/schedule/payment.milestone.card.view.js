import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {useHistory} from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import moment from 'moment';
import Divider from '@material-ui/core/Divider';
import Block from '../styled/DataDisplay/data.block';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: '0.5rem',
    paddingLeft: '0.6rem',
    maxWidth: '42rem',
  },

  dp: {
    height: '1.2rem',
    width: '1.2rem',
  },

  row: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',

  },

  topRow: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    minHeight: '2rem',
    alignItems: 'center',
  },

  currencySign: {
    fontSize: '1rem',
  },


  col: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },

  editButton: {
    height: '2.5rem',
    width: '2.5rem',
    marginBottom: '1rem',
  },
  cardCol: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '8rem',
    width: '8rem',
    minWidth: '8rem',
  },
}));

export default function S(props) {
  const {milestone: pM, onEditClick} = props;
  const classes = useStyles();
  const name = pM?.name?pM?.name:'';
  const status = pM?.status?pM?.status:'';
  const amount = pM?.amount?pM?.amount:0;
  const expectedStart = pM?.expectedStart?pM?.expectedStart:null;
  const expectedFinish = pM?.expectedStart?pM?.expectedFinish:null;

  const {
    root, row, topRow, col, cardCol,
  } = classes;

  return (

    <Paper className={root}>
      <div className={col}>

        <div className={row}>

          <div className={topRow}>
            <Typography variant="button"><b>{name}</b></Typography>
          </div>
          {onEditClick?<IconButton onClick={()=>{
            onEditClick();
          }}
          className={classes.editButton}
          >
            <EditIcon />
          </IconButton>:null}

        </div>

        <Divider />

        <div className={row}>


          <Block
            name={'Amount'}
            type='money'
            value={amount}
          />

          <Divider orientation="vertical" flexItem />

          <Block
            name={'Start Date'}
            value={moment(expectedStart).format('DD MMM YYYY')}
          />


          <Block
            name={'Finish Date'}
            value={moment(expectedFinish).format('DD MMM YYYY')}
          />

        </div>

      </div>

    </Paper>

  );
}
