import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {useHistory, useParams} from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import cx from 'clsx';
import Api from '../../helpers/Api';
import BrandAppCard from './brand.app.card';
import BrandAppBar from './appbar';
import AppNetworkCard from './app.network.card';
import EditBasicNetwork from './edit.basic.network';
import {useUserOrgs} from '../organization/hooks';
import {updateBrandNetworkApp, setBrandAppNetworks} from './utils';
import NetworkProjectManage from './network.projects.manage';


const useStyles = makeStyles((theme) => ({
  root: {
    padding: '6rem',
    width: '100vw',
    minHeight: '100vh',
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

export default function AppNetworkManage(props) {
  const {
    networkId: networkIdProps,
  } = props;

  const {
    networkId: networkIdParams,
  } = useParams();

  const {
    adminTeams: adminTeamIds,
    fetchingTeams,
  } = useUserOrgs();


  const {
    auth,
  } = useSelector((state) => state);

  const user = auth?.user;

  const networkId = networkIdProps||networkIdParams;

  const [basicEdit, setBasicEdit] = useState(false);

  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();


  const {
    root, row, col,
  } = classes;

  const [network, setNetwork] = useState(null);
  const [tenants, setTenants] = useState([]);
  const [rentalRequests, setRentalRequests] = useState([]);


  const getNetwork = async ()=>{
    const res = await Api.post('brand/app/network/getDetail', {
      networkId,
    });

    const data = res?.data;

    const {
      network: networkRes,
      rentalRelations,
      rentalReqs
    } = data;


    setBrandAppNetworks([networkRes], auth, dispatch);
    setNetwork(networkRes);


    if (rentalRelations.length>0) {
      setTenants(rentalRelations);
    }

    if (rentalReqs.length>0) {
      setRentalRequests(rentalReqs);
    }
  };


  useEffect(() => {
    getNetwork();
  }, []);

  const onUpdate = (network)=>{
    setBasicEdit(false);
    updateBrandNetworkApp({network, auth, dispatch});
    setNetwork(network);
  };

  const onEdit = ()=>{

  };



  return (
    <div className={root}>

      {network?(basicEdit?<EditBasicNetwork
        network={network}
        adminTeamIds={adminTeamIds}
        onUpdate={onUpdate}
      />:<AppNetworkCard
        network={network}
        onClick={()=>{
          setBasicEdit(!basicEdit);
        }}
      />):null}
      <NetworkProjectManage
        network={network}
        tenants={tenants}
        rentalReqs={rentalRequests}
        setRentalReqs={setRentalRequests}
        adminTeamIds={adminTeamIds}
      />
    </div>
  );
}
