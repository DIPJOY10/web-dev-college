import React, {useState, useEffect} from 'react';
import Api from '../../helpers/Api';
import {setBrandApps, setBrandAppNetworks, setRentalReqs} from './utils';
import {useSelector, useDispatch} from 'react-redux';

const setDict = setRentalReqs;

export default function useGetRentalReqs(networkIds) {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [rentalReqs, setRentalReqs] = useState([]);

  const getRentalReqs = async ()=>{
    if (networkIds?.length>0) {
      const res = await Api.post('brand/app/network/getRequests', {
        networkIds: networkIds,
      });

      const data = res?.data;
      if (data) {
        setRentalReqs(data);
        setDict( data, auth, dispatch );
      }
    }
  };


  useEffect(() => {
    getRentalReqs();
  }, [networkIds?.length]);

  return {
    rentalReqs,
    setRentalReqs,
  };
}
