import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Generator from '../generator/Generator.Invoice';
import MyNavBar from '../../styled/CommonComponents/MyNavBar';
import Expenses from './bill';
import AllExpenses from './AllExpenses';
import GeneratorBill from '../generator/Generator.Bill';
import AddNewTxDialog from '../transaction/AddNewTxDialog';
import { useParams, useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({

}));

export default function SaleAndInvoices(props) {
  const classes = useStyles();
  const {
    root, navBar, navOption, bottomStyle, addNewBtn,
  } = classes;
  const { walletId } = useParams();
  const [show, setShow] = useState("allExpenses");

  return (
    <div className={root} >
      <MyNavBar
        title={"Expenses"}
        show={show}
        setShow={setShow}
        walletId={walletId}
        Component={AddNewTxDialog}
        isMenu={true}
        options={[
          {
            value: "allExpenses",
            label: "All Expenses",
            Component: <AllExpenses />
          },
          {
            value: "bill",
            label: "Bill",
            Component: <Expenses />
          },
          {
            value: "generator",
            label: "Generator",
            Component: <GeneratorBill />
          },
        ]}
      />
    </div>
  );
}
