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


const useStyles = makeStyles((theme) => ({
  root: {

  },

  row: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
  },

  block: {
    height: '2rem',
    margin: '0.5rem 0',
  },

  smBlock: {
    height: '1.5rem',
    margin: '0.5rem 0',
  },

  col: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },

  paperStyle: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '16rem',
    maxWidth: '16rem',
    minWidth: '16rem',
    padding: '0.6rem',
    margin: '1rem 1rem',
  },

  titleTextStyle: {
    fontSize: '1.4rem',
    textAlign: 'center',
  },

  costTextStyle: {
    fontSize: '1.5rem',
    textAlign: 'center',
    marginRight: '0.5rem',
    fontWeight: '600',
  },

  costSubTextStyle: {
    fontSize: '1rem',
    textAlign: 'center',
    marginTop: '0.5rem',
  },

  subText1Style: {
    fontSize: '0.9rem',
    textAlign: 'center',
  },

  subText2Style: {
    fontSize: '0.9rem',
    textAlign: 'center',
    marginTop: '-0.6rem',
  },


}));

export default function ProductCard(props) {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const {
    onSelect, product,
  } = props;

  const {
    row, block, smBlock,
  } = classes;


  return (

    <ButtonBase onClick={()=>{
      if (onSelect) {
        onSelect(product);
      }
    }}>

      <Paper key={product.title} className={classes.paperStyle}>

        <div className={cx(row, block)}>
          <Typography className={classes.titleTextStyle}>
            {product.title}
          </Typography>
        </div>

        <div className={cx(row, block)}>
          <Typography className={classes.costTextStyle}>
            {product.cost}
          </Typography>
          <Typography className={classes.costSubTextStyle}>
            {product.costText}
          </Typography>
        </div>


        <div className={cx(row, smBlock)}>
          <Typography className={classes.subText1Style}>
            {product.subText1}
          </Typography>
        </div>

        <div className={cx(row, smBlock)}>
          <Typography className={classes.subText2Style}>
            {product.subText2}
          </Typography>
        </div>

      </Paper>

    </ButtonBase>

  );
}
