import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ButtonBase } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import InvestmentCard from './investment.card';
import Divider from '@material-ui/core/Divider';
import { createSelector } from 'reselect';
import _ from 'lodash';
import InvestmentList from './investment.list';
import InvestmentAppbar from './investment.appbar';
import SavedInvestments from './investment.saved';
import ApplicationsApplied from './applications.applied';

const investmentIdsSelector = (state) => state.dashboard.investmentIds;
const investmentDictionarySelector = (state) => state.dashboard.investmentDictionary;

const investmentSelector = createSelector(investmentIdsSelector, investmentDictionarySelector, (investmentIds, investmentDictionary) =>
  investmentIds.filter((investmentId) => investmentDictionary[investmentId]?.published),
);

const draftSelector = createSelector(investmentIdsSelector, investmentSelector, (investmentIds, acceptedIds) =>
  _.difference(investmentIds, acceptedIds),
);

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    marginTop: '6rem',
  },

  topBarDivider: {
    width: '60%',
    marginTop: '0.5rem',
  },

  createDivStyle: {
    marginLeft: '2rem',
    marginTop: '0.2rem',
  },

  createButtonText: {
    marginLeft: '0.5rem',
    color: theme.palette.primary.main,
  },
}));

export default function Investments(props) {
  const classes = useStyles();
  const publishedIds = useSelector(investmentSelector);
  const dashboard = useSelector((state) => state.dashboard);
  const {
    investmentDraftIds, investmentPublishedIds, investmentIds, investmentDictionary
  } = dashboard;
  const draftIds = useSelector(draftSelector);
  const [draft, setDraft] = useState(false);
  const [nav, setNav] = useState('Investments');
  var View = null
  // const InvestmentCards = (investmentIds) => {
  //   return investmentIds.map((investmentId) => {
  //     return <InvestmentCard investmentId={investmentId} />;
  //   });
  // };
  switch (nav) {
    case 'Investments':
      View = <InvestmentList />
      break;

    case 'Applications':
      View = <ApplicationsApplied />
      break;
    case 'Saved':
      View = <SavedInvestments />
      break;
    default:
      break;
  }
  return (
    <div className={classes.root}>
      <InvestmentAppbar
        nav={nav}
        setNav={setNav}
        jobDictionary={investmentDictionary}
        jobPublishedIds={investmentPublishedIds}
        jobDraftIds={investmentDraftIds}
      />
      {/* <Grid container xs={8}>
        <div className={classes.createDivStyle}>
          {draft ? (
            <ButtonBase className={classes.tabButton} onClick={() => setDraft(false)}>
              <Typography className={classes.createButtonText}>Investments</Typography>
            </ButtonBase>
          ) : (
            <Typography className={classes.taskTextStyle}>Investments</Typography>
          )}
        </div>
        <div className={classes.createDivStyle}>
          {draft ? (
            <Typography className={classes.taskTextStyle}>Drafts</Typography>
          ) : (
            <ButtonBase className={classes.tabButton} onClick={() => setDraft(true)}>
              <Typography className={classes.createButtonText}>Drafts</Typography>
            </ButtonBase>
          )}
        </div>
      </Grid>
      <Divider className={classes.topBarDivider} />
      {draft ? InvestmentCards(draftIds) : InvestmentCards(publishedIds)} */}
      {View}
    </div>
  );
}
