import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {useHistory} from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import cx from 'clsx';
import {useFindWallet, useGetWallet} from '../finance/hooks';
import Api from '../../helpers/Api';

import NameAutocomplete from './name.autocomplete';
import RentalUnitList from './rental.unit.list';
import useGetRentalInfo from './useGetRentalInfo';
import TenantCard from '../brandApp/tenant.card';
import Menubar from '../styled/menubar';
import arrayToReducer from '../../helpers/arrayToReducer';

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

export default function ProjectRentalManage(props) {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const walletId = useFindWallet();
  const {
    wallet: walletHook,
  } = useGetWallet(walletId);
  const projectTeam = walletHook?.parent;
  const projectTeamId = projectTeam?._id;


  const {
    root, row, col, nameInput, unitBlock, unitText,
  } = classes;

  const [units, setUnits] = useGetRentalInfo(projectTeamId);
  const [tenants, setTenants] = useState([]);
  const [nav, setNav] = useState('RentalUnits');

  const getTenants = async ()=>{
    const res = await Api.post('brand/app/relation/getByProject', {
      projectTeamId,
    });

    const data = res?.data||[];
    console.log(data, ' is the data');
    setTenants(data);
    if (data?.length>0) {
      const {
        newDict: tenantRelationDictionary,
      } = arrayToReducer(data);

      dispatch({
        type: 'AddProject',
        payload: tenantRelationDictionary,
      });
    }
  };

  useEffect(() => {
    if (projectTeamId) {
      getTenants();
    }
  }, [projectTeamId]);

  const Tenants = (
    <>
      {tenants?.length ? tenants.map((tenant)=>{
        return <TenantCard
          tenant={tenant}
          onClick={()=>{
            const path = '/admin/tenant/' + tenant._id;
            history.push(path);
          }}
        />;
      }): 'No Tenants'}
    </>
  );

  const RentalUnits = (
    <>
      <NameAutocomplete
        units={units}
        setUnits={setUnits}
        projectTeamId={projectTeamId}
      />

      <RentalUnitList
        units={units}

      />
    </>
  );

  // var View = null

  // switch(nav) {

  //     case 'Tenants':
  //         View = Tenants
  //         break;

  //     case 'RentalUnits':
  //         View = RentalUnits
  //         break;

  //     default:
  //         break
  // }

  return (
    <div className={col}>
      <div>{RentalUnits}</div>
      <div>{Tenants}</div>
    </div>
  );

  // return (
  //     <div className={root}>

  //         <Menubar
  //             navState={nav}
  //             setNav={setNav}
  //             items={[
  //                 {
  //                     Icon:null,
  //                     text:'Tenants',
  //                     navText:'Tenants'
  //                 },

  //                 {
  //                     Icon:null,
  //                     text:'Rental Units',
  //                     navText: 'RentalUnits'
  //                 }
  //             ]}
  //         />

  //         {View}

  //     </div>
  // );
}
