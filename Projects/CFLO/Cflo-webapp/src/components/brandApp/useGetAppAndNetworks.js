import React, {useState, useEffect} from 'react';
import Api from '../../helpers/Api';
import {setBrandApps, setBrandAppNetworks} from './utils';
import {useSelector, useDispatch} from 'react-redux';


export default function useGetAppAndNetworks(teamIds) {
  const [apps, setApps] = useState([]);
  const [appNetworks, setAppNetworks] = useState([]);
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const getApps = async ()=>{
    if (teamIds?.length>0) {
      const res = await Api.post('brand/app/get', {
        teamIds: teamIds,
      });


      const data = res?.data;
      if (data) {
        const {
          app: appRes,
          appNetworks: appNetworkRes,
        } = data;

        if (data) {
          if (appRes?.length>0) {
            setBrandApps(appRes, auth, dispatch);
            const appIds = appRes.map((app)=>app._id);
            setApps(appIds);
          }

          if (appNetworkRes?.length>0) {
            setBrandAppNetworks(appNetworkRes, auth, dispatch);
            const appNetworkIds = appNetworkRes.map((appNetwork)=>appNetwork._id);
            setAppNetworks(appNetworkIds);
          }
        }
      }
    }
  };


  useEffect(() => {
    getApps();
  }, [teamIds?.length]);

  return {
    apps,
    setApps,
    appNetworks,
    setAppNetworks,
  };
}
