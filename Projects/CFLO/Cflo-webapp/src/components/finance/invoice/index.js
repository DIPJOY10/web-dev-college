import React, {useState, useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Invoices from './Invoice';
import GeneratorInvoice from '../generator/Generator.Invoice';
import MyNavBar from '../../styled/CommonComponents/MyNavBar';
import AllSales from './AllSales';
import AddNewTxDialog from '../transaction/AddNewTxDialog';
import {useParams, useHistory} from 'react-router-dom';

const useStyles = makeStyles((theme) => ({

}));

export default function SaleAndInvoices(props) {
  const classes = useStyles();
  const {
    root
  } = classes;
  const {walletId} = useParams();
  const [show, setShow] = useState("allSales");

  return (
    <div className={root} >  
     <MyNavBar 
       title={"Sales"}
       show={show}
       setShow={setShow}
       walletId={walletId}
       Component={AddNewTxDialog}
       isMenu={true}
       options={[
          {
            value: "allSales",
            label : "All Sales",
            Component : <AllSales />
          },
          {
            value: "invoice",
            label : "Invoice",
            Component : <Invoices />
          },
          {
            value: "generator",
            label : "Generator",
            Component : <GeneratorInvoice />
          },
       ]}
     />
    </div>
  );
}
