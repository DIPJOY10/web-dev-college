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
  }
}));
export default function Contractor(props) {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const { } = useSelector((state) => state);
  const { root, row, col, relationCard } = classes;
  const { walletId } = useParams();
  const [contractors, setContractors] = useState([]);


  useEffect(() => {
    getRelationWithType({
      walletId: walletId,
      type: "Contractor"
    })
      .then((data) => {
        setContractors(data)
      })
      .catch((error) => {
        console.log(error);
      })
  }, [])


  const updateNetwork = () => {

    getRelationWithType({
      walletId: walletId,
      type: "Contractor"
    })
      .then((data) => {
        setContractors(data)
      })
      .catch((error) => {
        console.log(error);
      })

  }




  return (
    <div className={root}>
      <AddFinRelConfirm
        relationType={"Contractor"}
        updateNetwork={updateNetwork}
      />
      {contractors &&
        <CommonView
          networks={contractors}
          option={"contractor"}
        />
      }
    </div>
  );
}
