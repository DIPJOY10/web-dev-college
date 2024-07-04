import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import {
  makeStyles,
  useTheme,
} from '@material-ui/core/styles';
import { ReactComponent as InvestIcon } from "../../Assets/invest_icon.svg";
import Typography from '@material-ui/core/Typography';
import CreateBtn from '../styled/actionBtns/create.btn';
import {
  useHistory, useLocation,
} from 'react-router-dom';
import { createSelector } from 'reselect';
import _ from 'lodash';
import AddIcon from '@material-ui/icons/Add';
import ButtonBase from '@material-ui/core/ButtonBase';
import { useInvestment } from './investment.hook';

const appIdsSelector = (state) => state.dashboard.applicationIds;
const appDictionarySelector = (state) => state.dashboard.appDictionary;

const investmentAppSelector = createSelector(
  appIdsSelector,
  appDictionarySelector,
  (appIds, appDictionary) => appIds.filter((appId) => appDictionary[appId]?.parentModelName == 'Investment'),
);

const investmentIdsSelector = (state) => state.dashboard.investmentIds;
const investmentDictionarySelector = (state) => state.dashboard.investmentDictionary;

const investmentSelector = createSelector(
  investmentIdsSelector,
  investmentDictionarySelector,
  (investmentIds, investmentDictionary) => investmentIds.filter((investmentId) => investmentDictionary[investmentId]?.published),
);

const draftSelector = createSelector(
  investmentIdsSelector,
  investmentSelector,
  (investmentIds, acceptedIds) => _.difference(investmentIds, acceptedIds),
);

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    maxWidth: '18rem',
    minWidth: '18rem',
    margin: '1rem',
    padding: '1rem',
    background: '#1DA1F2',
  },
  titleText: {
    titleTextAlign: 'center',
    fontSize: '1.2rem',
    margin: '0.4rem',
    fontWeight: '700',
    color: 'white'
  },

  text: {

    fontSize: '0.8rem',
    margin: '0.1rem',
    fontWeight: '500',
    color: 'white'
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
    flexWrap: 'wrap',
  },

  createBtn: {
    paddingLeft: '1rem',
    padding: '0.5rem',
    paddingTop: '0.25rem',
    paddingBottom: '0.25rem',

  },

  createBtnPaper: {
    alignSelf: 'flex-end',
    marginRight: '1rem',
  },

  divider: {
    height: '0.1px',
    width: '100%',
    margin: '0.5rem',
    marginTop: '1rem',
    backgroundColor: '#bdbdbd',
  },

  menuIcon: {
    height: "24px",
    width: "24px",
    color: "white",
    "& path": {
      fill: "rgba(255, 255, 255)",
    },
  },

  headerCont: {
    width: "100%",
    display: "flex",
    alignItems: "center",
  }
}));

function InvestmentsCard() {
  const history = useHistory();
  const classes = useStyles();

  const dashboard = useSelector((state) => state.dashboard);
  const publishedIds = useSelector(investmentSelector);
  const draftIds = useSelector(draftSelector);
  const appIds = useSelector(investmentAppSelector);

  const { investmentIds, appDictionary } = dashboard;
  const { investmentCreate, loading } = useInvestment();

  const pubAppIds = [];
  const draftAppIds = [];
  appIds.map((appId) => {
    const isPub = appDictionary[appId].published;
    if (isPub) {
      pubAppIds.push(appId);
    }
    else {
      draftAppIds.push(appId);
    }
  });

  const location = useLocation();
  const pathname = location['pathname'];

  const {
    row, col,
  } = classes;
  // console.log(pathname,' is the pathname')
  return (
    <Paper className={classes.root} onClick={() => {
      const path = '/dashboard/investments';
      history.push(path);
    }}>

      <div className={row}>
        <div className={classes.headerCont}>
          <InvestIcon className={classes.menuIcon} />
          <Typography className={classes.titleText}>
            Investments
          </Typography>
        </div>
        {/* <Paper className={classes.createBtnPaper}>
          <ButtonBase className={classes.createBtn} disabled={loading} onClick={() => {
            investmentCreate();
          }}>
            <Typography>
              Add
            </Typography>

            <AddIcon />

          </ButtonBase>
        </Paper> */}
      </div>

      {/* <span className={classes.divider}></span> */}

      {/* <Typography className={classes.text}>
        You have published <b>{publishedIds?.length} </b> investments. {publishedIds?.length > 0 ? 'Manage applications' : ''}
      </Typography>

      <Typography className={classes.text}>
        You have <b>{publishedIds?.length}</b> investments in draft. {draftAppIds?.length > 0 ? 'Complete and publish investments to hire candidates' : ''}
      </Typography>

      <span className={classes.divider}></span>

      <Typography className={classes.text}>
        You have applied for <b>{pubAppIds?.length} </b> investments.
      </Typography>

      <Typography className={classes.text}>
        You are <b>{draftAppIds?.length}</b> investment applications in draft. {draftAppIds?.length > 0 ? 'Complete the draft to apply' : ''}
      </Typography> */}
      <Typography className={classes.text}>
        <b>{publishedIds?.length}</b> Published
      </Typography>

      <Typography className={classes.text}>
        <b>{draftAppIds?.length}</b> In draft
        {/* {
          arr.map(console.log(arr),"These are the drafts")
        } */}
      </Typography>

      {/* {investmentIds.length>0?<>
                {investmentIds.slice(0,2).map(investmentId=><InvestmentCard investmentId={investmentId} min={true}/>)}
            </>:<>
                <Typography className={classes.titleText}>
                    You haven't posted a investment on Marketplace
                </Typography>
                <CreateBtn  color="primary" onClick={()=>{
                            var path = '/dashboard/create/investment/';
                            history.push(path);
                }}>
                    Post a Investment
                </CreateBtn>
            </>
            } */}
    </Paper>
  );
}

export default InvestmentsCard;
