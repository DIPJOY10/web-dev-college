import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {useParams, useHistory} from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import cx from 'clsx';
import Api from '../../helpers/Api';
import Payment from './feePayment/index';
import {setBrandApps} from './utils';
import BasicInfoSetup from './basic.info.setup';
import AppNetworksManage from './app.networks.manage';
import {useUserOrgs} from '../organization/hooks';
import _ from 'lodash';

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
  const {
    auth,
    team,
  } = useSelector((state) => state);
  const {
    brandAppDictionary,
    user,
  } = auth;

  const {
    appId,
  } = useParams();

  const {
    adminTeams,
    fetchingTeams,
  } = useUserOrgs();


  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const brandApp = brandAppDictionary?brandAppDictionary[appId]:null;

  const [loading, setLoading] = useState(true);
  const {
    root, row, col,
  } = classes;


  const getApp = async ()=>{
    try {
      const res = await Api.post('brand/app/getById', {
        appId,
      });

      const data = res?.data;

      setLoading(false);
      setBrandApps([data], auth, dispatch);
    }
    catch (error) {

    }
  };

  useEffect(() => {
    getApp();
  }, []);

  useEffect(() => {

  }, []);

  useEffect(() => {
    if (!fetchingTeams&&!loading&&!brandApp?.public) {
      const isCommon = _.intersection(adminTeams, [brandApp?.ownerShip]);
    }
  }, [fetchingTeams, loading]);

  return (
    <div className={root}>
      {brandApp?.paid?
                (brandApp?.complete?<AppNetworksManage
                  brandApp={brandApp}
                  adminTeams={adminTeams}
                />:<BasicInfoSetup brandApp={brandApp} />):
                <Payment brandApp={brandApp} />}

    </div>
  );
}
