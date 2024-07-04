import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ButtonBase } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import InvestmentCard from '../Investment/investment.card';
import _ from 'lodash';

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

export default function InvestmentFeed() {
  const classes = useStyles();
  const explore = useSelector((state) => state.explore);
  const { investmentIds } = explore;

  const InvestmentCards = (investmentIds) => {
    if (investmentIds && investmentIds.length > 0) {
      return investmentIds.map((investmentId) => {
        if (investmentId) {
          return (
            <InvestmentCard investmentId={investmentId} />
          );
        }
        else {
          return null;
        }
      });
    }
    else {
      return null;
    }
  };

  return (
    <div className={classes.root}>
      {InvestmentCards(investmentIds)}
    </div>
  );
}

