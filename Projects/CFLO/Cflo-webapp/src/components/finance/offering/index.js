import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory, useParams } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import cx from 'clsx';
import MyNavBar from '../../styled/CommonComponents/MyNavBar';
import AddNewTxDialog from '../transaction/AddNewTxDialog';
import OfferingsTable from './Offering.Table';



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

export default function Offering(props) {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const {
    walletId,
  } = useParams();

  const {

  } = useSelector((state) => state);

  const {
    root, row, col,
  } = classes;


  const [show, setShow] = useState("offerings")

  return (
    <div className={root}>
      <MyNavBar
        title={"Offerings"}
        show={show}
        setShow={setShow}
        walletId={walletId}
        Component={AddNewTxDialog}
        options={[]}
      />
      <OfferingsTable
        walletId={walletId}
      />
    </div>
  );
}
