import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {useHistory} from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import cx from 'clsx';
import configObject from '../../../../config';
import ProductCard from './product.card.view';
import {getSubscriptionProducts} from './utils';


const useStyles = makeStyles((theme) => ({

  row: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },

  col: {
    flex: 1,
    display: 'flex',
    height: '100vh',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  mainText: {
    fontSize: '3rem',
    fontWeight: '600',
    textAlign: 'center',
  },

  mainTextBlock: {
    marginTop: '20vh',
    marginBottom: '8vh',
    [theme.breakpoints.down('sm')]: {
      marginTop: '10vh',
    },
  },

}));


export default function ProductCards(props) {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const {
    onSelect,
  } = props;

  const products = getSubscriptionProducts();

  const {
    row, col, mainText, mainTextBlock,
  } = classes;

  return (
    <div className={col}>
      <div className={cx(row, mainTextBlock)}>
        <Typography className={mainText}>
                    Select Your  Subscription
        </Typography>
      </div>
      <div className={row}>
        <ProductCard
          product={products[0]}
          onSelect={onSelect}
        />
        <ProductCard
          product={products[1]}
          onSelect={onSelect}
        />
      </div>
    </div>

  );
}
