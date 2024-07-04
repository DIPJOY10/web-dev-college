import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {useHistory} from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import cx from 'clsx';
import useGetRentalReqs from './useGetRentalRequests';
import SelectProjectDialog from '../projects/select.project.dialog';
import RentalReqCard from './rental.req.card';
import _ from 'lodash';
import Api from '../../helpers/Api';

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: '18rem',
    maxWidth: '24rem',
    padding: '0.5rem',
    margin: '0.5rem',
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

  nameText: {
    fontSize: '1.3rem',
    fontWeight: '500',
  },
}));

export default function RentalRequestList(props) {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const {
    appNetworks,
    limit,
  } = props;

  const {
    auth,
  } = useSelector((state) => state);

  const {
    brandAppNetworkDictionary,
  } = auth;

  const {
    root, row, col, nameText,
  } = classes;

  const {
    rentalReqs=[],
    setRentalReqs,
  } = useGetRentalReqs(appNetworks);

  const reqs = limit>0?rentalReqs.slice(0, limit):rentalReqs;

  const onDelete = async (req, i)=>{
    const newArray = [...reqs.splice(0, i), ...reqs.splice(i+1)];
    setRentalReqs(newArray);
    await Api.post('brand/app/network/updateReq', {
      _id: req?._id,
      status: 'rejected',
    });
  };

  return (
    <div className={col}>


      {reqs.map((req, i)=>{
        return (
          <RentalReqCard
            rentalReq={req}
            onDelete={()=>{
              onDelete(req, i);
            }}
          />
        );
      })}


    </div>
  );
}
