import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import cx from 'clsx';
import {useParams, useHistory} from 'react-router-dom';
import MyNavBar from '../../styled/CommonComponents/MyNavBar';
import AddNewTxDialog from '../transaction/AddNewTxDialog';
import Customer from './Customer'
import Lender from './Lender'
import Investor from './Investor'
import Vendor from './Vendor'
import Contractor from './Contractor'
import Employee from './Employee'



const useStyles = makeStyles((theme) => ({
  root: {

  }
}));
export default function Network(props) {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const {

  } = useSelector((state) => state);

  const {
    root
  } = classes;

  const {walletId, option} = useParams();
  const [show, setShow] = useState(option)



  return (
    <div className={root}>
     <MyNavBar 
       title={"Networks"}
       show={show}
       setShow={setShow}
       walletId={walletId}
       Component={AddNewTxDialog}
       isMenu={true}
       options={[
          {
            value: "customer",
            label : 'Customer',
            Component : <Customer />
          },
          {
            value: "employee",
            label : 'Employee',
            Component : <Employee />
          },
          {
            value: "contractor",
            label : 'Contractor',
            Component : <Contractor />
          },
          {
            value: "vendor",
            label : 'Vendor',
            Component : <Vendor />
          },
          {
            value: "investor",
            label : 'Investor',
            Component : <Investor />
          },
          {
            value: "lender",
            label : 'Lender',
            Component : <Lender />
          },
       ]}
     />
    </div>
  );
}
