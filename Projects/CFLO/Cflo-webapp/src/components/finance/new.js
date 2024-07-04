import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {useHistory} from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import CloseBtn from '../styled/actionBtns/close.btn';
import clsx from 'clsx';
import Api from '../../helpers/Api';
import ChartActivity from './chartaccount/chartActivity';
import Journal from './entries/journal';

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
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

  top: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    height: '5rem',
    maxHeight: '7rem',
  },

  margin: {
    margin: '1rem',
  },

  activityName: {
    fontSize: '1.5rem',
    fontWeight: '600',
  },

}));
export default function S(props) {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const {
    wallet,
  } = useSelector((state) => state);

  const {
    root, row, col, top, margin, activityName,
  } = classes;

  const {
    newFinanceActivity,
    categories,
    group,
    subTypes,
  } = wallet;

  const activity = newFinanceActivity?.activity || '';
  const walletId = newFinanceActivity?.walletId || null;

  useEffect(() => {
    if (categories&&categories.length>0) {}
    else {
      Api.post('wallet/chart/types', {})
          .then((res)=>{
            const {
              classifications,
              subTypes,
            } = res;

            const {
              categories, group,
            } = classifications;

            dispatch({
              type: 'AddWallet',
              payload: {
                categories, group, subTypes,
              },
            });
          });
    }
  }, []);

  let NewView = <></>;

  switch (activity) {
    case 'Chart Account':
      NewView = <ChartActivity
        walletId={walletId}
      />;
      break;

    case 'Journal Entry':
      NewView = <Journal
        walletId={walletId}
      />;
      break;


    default:
      break;
  }

  return (
    <div className={root}>

      {NewView}
    </div>
  );
}
