import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import cx from 'clsx';
import { useParams, useHistory } from 'react-router-dom';
import { getRelationWithType } from './api';
import CommonView from './CommonView';
import TxSecondParty from '../transaction/secondParty';
import AddFinRelConfirm from './AddFinRel.Confirm';


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    width: '100%',
    padding: '20px',
    display: 'flex',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  relationCard: {
    width: "30%",
    height: "100px",
    border: "1px solid #E1E2E5",
    marginBottom: "10px"
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
export default function Vendor(props) {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const {

  } = useSelector((state) => state);

  const {
    root, row, col, relationCard
  } = classes;

  const { walletId } = useParams();


  const [vendors, setVendors] = useState([]);


  useEffect(() => {

    getRelationWithType({
      walletId: walletId,
      type: "Vendor"
    })
      .then((data) => {
        setVendors(data)
      })
      .catch((error) => {
        console.log(error);
      })

  }, [])

  const updateNetwork = () => {
    getRelationWithType({
      walletId: walletId,
      type: "Vendor"
    })
      .then((data) => {
        setVendors(data)
      })
      .catch((error) => {
        console.log(error);
      })
  }

  return (
    <div className={root}>
      <AddFinRelConfirm
        relationType={"Vendor"}
        updateNetwork={updateNetwork}
      />
      {vendors &&
        <CommonView
          networks={vendors}
          option={"vendor"}
        />
      }
    </div>
  );
}
