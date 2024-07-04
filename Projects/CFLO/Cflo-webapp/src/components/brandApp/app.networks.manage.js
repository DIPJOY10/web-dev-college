import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {useHistory} from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import cx from 'clsx';
import TitleInput from '../styled/title.input';
import DescriptionInput from '../styled/description.input';

import Api from '../../helpers/Api';

import _ from "lodash";
import CreateNetwork from './create.network';
import CreateBtn from '../styled/actionBtns/create.btn';
import AppNetworkCard from './app.network.card';
import BrandAppBar from './appbar';
import BrandAppCard from './brand.app.card';
import {updateBrandNetworkApp, setBrandAppNetworks} from './utils';


const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    paddingTop: '1rem',
    position: 'absolute',
  },


  appBar: {
    backgroundColor: 'white',
    height: '4rem',
    padding: '0.5rem',
  },

  row: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
  },

  marginLeft: {
    marginLeft: '1rem',
  },

  center: {
    alignItems: 'center',
    textAlign: 'center',
  },


}));

export default function AppNetworksManage(props) {
  const {
    brandApp,
    open, setOpen
  } = props;

  const state = useSelector((state) => state);

  const {
    auth,
    team,
    file,
  } = state;

  const {
    user,
  } = auth;

  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const [name, setName] = useState(brandApp?.name);
  const [description, setDescription] = useState(brandApp?.description);
  const [createMode, setCreateMode] = useState(true);
  const [loading, setLoading] = useState(true);
  const [networks, setNetworks] = useState([]);
  const [rentalReqs, setRentalReqs] = useState([])

  const {
    root, row, col, center, marginLeft,
    appNameText,
  } = classes;


  const findNetworks = async ()=>{
    
    const res = await Api.post('brand/app/network/findOrCreate', {
      brandAppId: brandApp?._id,
      profileId: user.profile
    });


    setLoading(false);
    const networksRes = res?.data?.netApps||[];
    const rentalReqsRes = res?.data?.rentalReqs||[];
    const reqMap = _.groupBy(rentalReqsRes,'brandAppNetwork')
    const nets = networksRes.map(netRes=>{
      const netId = netRes?._id;
      return {
        ...netRes,
        reqs:reqMap[netId]
      }
    })
    setNetworks(nets);


  };


  useEffect(() => {
    if(user?.profile){
      findNetworks()
    }
  }, [user?.profile]);

  useEffect(() => {
    if (networks.length==0) {
      setCreateMode(true);
    }
    else {
      setCreateMode(false);
    }
  }, [networks]);

  const onCreate = (network)=>{
    setCreateMode(false);
    setNetworks([network, ...networks]);
  };



  return (
    <div className={cx(root, center)}>
      <BrandAppBar />
      <BrandAppCard
        brandApp={brandApp}
      />

      {loading?null:<>
        {createMode?<CreateNetwork
          brandApp={brandApp}
          onCreate={onCreate}
        />:<div className={col}>
          <div>

            <CreateBtn onClick={()=>{
              setCreateMode(true);
            }}>
                        Create Network
            </CreateBtn>
          </div>

          {networks?.length>0?<>
            {networks.map((network)=>{
              return <AppNetworkCard
                network={network}
              />;
            })}
          </>:null}
        </div>}
      </>}

    </div>
  );
}
