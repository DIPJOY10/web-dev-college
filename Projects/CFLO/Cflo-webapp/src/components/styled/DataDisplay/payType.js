import React, {useState, useEffect} from 'react';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import Block from './data.block';

const useStyles = makeStyles({
  root: {
    flex: 1,
    marginTop: '1rem',
  },

  textStyle: {
    wordWrap: 'break-word',
  },

  row: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    margin: '1rem',
  },

  col: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },


});

export default function TextView(props) {
  const classes = useStyles();
  const {
    parent,
  } = props;

  const {
    payType, fixed, negoMin,
    negoMax, minAssured, incentive, hourly,
  } = parent;

  const getPayForm = (payType)=>{
    switch (payType) {
      case 'Fixed':
        return (

          <Block
            name={'Fixed'}
            value={fixed}
            type={'money'}
          />

        );
        break;

      case 'Negotiable':
        return (
          <div className={classes.row}>

            <Block
              name={'Minimum'}
              value={negoMin}
              type={'money'}
            />
            <Block
              name={'Maximum'}
              value={negoMax}
              type={'money'}
            />

          </div>
        );
        break;

      case 'Performance based':
        return (
          <div className={classes.row}>

            <Block
              name={'Assured'}
              value={minAssured}
              type={'money'}
            />

            <Block
              name={'Incentive'}
              value={incentive}
              type={'money'}
            />
          </div>
        );
        break;

      case 'Hourly':
        return (
          <div className={classes.row}>

            <Block
              name={'Hourly'}
              value={hourly}
              type={'money'}
            />
          </div>
        );
        break;
      default:
        break;
    }
  };


  return (
    <div className={classes.row}>

      <Block
        name={'Payment'}
        value={payType}

      />

      {getPayForm(payType)}
    </div>

  );
}
