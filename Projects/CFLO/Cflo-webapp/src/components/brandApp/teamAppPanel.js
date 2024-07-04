import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {useHistory} from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import cx from 'clsx';

import CreateBtn from '../styled/actionBtns/create.btn';
import Api from '../../helpers/Api';
import {useGetWallet, useFindWallet} from '../finance/hooks';
import useGetAppAndNetworks from './useGetAppAndNetworks';
import BrandAppCard from './brand.app.card';
import AppNetworkCard from './app.network.card';
import useGetRentalReqs from './useGetRentalRequests';
import RentalRequestList from './rental.request.list';

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
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const walletId = useFindWallet();

  const {
    wallet,
  } = useGetWallet(walletId);
  const projectTeam = wallet?.parent;

  const [open, setOpen] = useState(false);
  const [createBtnLoading, setCreateBtnLoading] = useState(false);
  const {
    auth,
  } = useSelector((state) => state);

  const {
    root, row, col,
  } = classes;

  const {
    user, brandAppDictionary, brandAppNetworkDictionary,
  } = auth;

  const teamId = projectTeam?._id;
  const teamIds = teamId?[teamId]:[];
  const {
    apps,
    appNetworks,
  } = useGetAppAndNetworks(teamIds);


  const createBrandApp = async ()=>{
    setCreateBtnLoading(true);
    const parent = wallet?.parent;
    const parentModelName = wallet?.parentModelName;

    if (parentModelName=='Team') {
      const res = await Api.post('brand/app/create', {
        user: user._id,
        addedByTeam: parent?._id,
        ownerShip: parent?._id,
      });
      setCreateBtnLoading(false);

      const path = '/brandApp/' + res?.data?.brandApp?._id + '/view';
      history.push(path);
    }
  };


  return (
    <div className={root}>
      <CreateBtn disabled={createBtnLoading}
        onClick={()=>{
          createBrandApp();
        }}>
                Create App
      </CreateBtn>
      {apps.map((appId)=>{
        const app = brandAppDictionary[appId];

        return (
          <BrandAppCard
            brandApp={app}
          />
        );
      })}

      <RentalRequestList
        appNetworks={appNetworks}
        limit={3}
      />

      {appNetworks.map((appId)=>{
        const app = brandAppNetworkDictionary[appId];

        return (
          <AppNetworkCard
            network={app}
          />
        );
      })}

    </div>
  );
}
