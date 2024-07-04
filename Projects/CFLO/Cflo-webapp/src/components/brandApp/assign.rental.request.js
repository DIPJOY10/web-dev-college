import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {useParams, useHistory} from 'react-router-dom';

import Paper from '@material-ui/core/Paper';
import Avatar from '../profile/avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import cx from 'clsx';
import SelectProjectDialog from '../projects/select.project.dialog';
import RentalReqCard from './rental.req.card';
import AppNetworkCard from './app.network.card';
import Api from '../../helpers/Api';

import useGetRentalInfo from '../ProjectAnalysis/useGetRentalInfo';
import RentalUnitList from '../ProjectAnalysis/rental.unit.list';

import LaunchIcon from '@material-ui/icons/Launch';
import configObject from '../../config';
import {setNetworkProjects} from './utils';

const {
  mode,
} = configObject;

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '1rem',
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

  marginTopRow: {
    margin: '1rem 0',
  },

  avatarStyle: {
    height: '2.2rem',
    width: '2.2rem',
  },

  nameText: {
    fontSize: '1.1rem',
    fontWeight: '500',
    marginLeft: '1rem',
  },

  titleText: {
    fontSize: '1.2rem',
    fontWeight: '600',
    marginBottom: '1rem',
  },

  paperStyle: {
    padding: '1rem',
    margin: '1rem',
    maxWidth: '26rem',
  },

  btnStyle: {
    padding: '0.5rem',
    margin: '1rem',
  },

}));

export default function S(props) {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const {
    rentalReqId,
  } = useParams();

  const {
    auth,
  } = useSelector((state) => state);

  const {
    rentalReqDictionary, brandAppNetworkDictionary,
    networkProjectMap,
  } = auth;

  const [rentalReq, setRentalReq] = useState(null)
  const [network, setNetwork] = useState(null)

  const {
    root, row, col, avatarStyle, paperStyle,
    nameText, titleText, marginTopRow,
    btnStyle,
  } = classes;

  const tenant = rentalReq?.tenant;

  const projectTeamIds = [];
  const networkId = network?._id
  const [openSelectProject, setOpenSelectProject] = useState(false);


  const [projectTeamId, setProjectTeamId] = useState(null);
  const [projectEdit, setProjectEdit] = useState(true);

  // const [units, setUnits] = useGetRentalInfo(projectTeamId);
  const [unit, setUnit] = useState(null);
  const [unitEdit, setUnitEdit] = useState(true);


  const onSelectProject = async ()=>{

  };

  const setReqProps = (req)=>{
    // get network
  };


  const getProjects = async ()=>{
    const res = await Api.post('brand/app/network/getProjects', {
      networkId: network?._id,
    });

    const data = res?.data;
    setNetworkProjects(networkId, data, auth, dispatch);

    if (data?.length>0) {
      const networkProjectTeams = [];
      data.map((netP)=>{
        if (netP?.projectTeam) {
          networkProjectTeams.push(netP?.projectTeam);
        }
      });
    }
  };

  const assign = async (unit)=>{
    setUnit(unit);

    const res = await Api.post('brand/app/relation/assign', {
      reqId: rentalReqId,
      appNetwork: networkId,
      tenant: tenant?._id,
      projectTeamId,
      unitId: unit?._id,
    });


    const data = res?.data;

    history.goBack();
  };

  useEffect(() => {
    if (rentalReq?._id) {

    }
    else {

    }
  }, []);



  return (
    <div className={root}>

      {/* <RentalReqCard
                    rentalReq={rentalReq}

            /> */}
      {/* <AppNetworkCard
                network={network}
            /> */}

      {/* <div className={cx(row, marginTopRow)}>
        <Avatar src={tenant} className={avatarStyle} />
        <Typography className={nameText}>
          {tenant?.displayName}
        </Typography>
      </div> */}




    </div>
  );
}
