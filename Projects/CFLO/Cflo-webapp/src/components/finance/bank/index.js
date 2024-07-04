import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {useHistory} from 'react-router-dom';
import {useFindWallet, useGetWallet} from '../hooks';
import MyNavBar from '../../styled/CommonComponents/MyNavBar';
import BankAccounts from './BankAccounts';
import PaymentMethods from './PaymentMethods';
import AddNewTxDialog from './AddNewAccount';

const useStyles = makeStyles((theme) => ({

}));

export default function Bank(props) {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const walletId = useFindWallet();
  const {} = classes;

  const [show, setShow] = useState("BankAccounts")


  return (
    <div>
     <MyNavBar
       title={"Accounts"}
       show={show}
       setShow={setShow}
       walletId={walletId}
       Component={AddNewTxDialog} 
       isMenu={true}
       options={[
          {
            value: "BankAccounts",
            label : "Bank Accounts",
            Component : <BankAccounts />
          },
          {
            value: "PaymentMethods",
            label : "Payment Methods",
            Component : <PaymentMethods />
          }
       ]}
     />
    </div>
  );
}
