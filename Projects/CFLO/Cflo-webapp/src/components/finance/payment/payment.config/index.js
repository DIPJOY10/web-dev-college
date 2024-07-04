import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {useHistory} from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import cx from 'clsx';
import Api from '../../../../helpers/Api';
import PaymentConfigDialog from './dialog';
import {useGetWallet} from '../../hooks';

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

export default function PaymentConfig(props) {
  const {
    config,
  } = props;

  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [configObj, setConfigObj] = useState({});

  const walletId = config.wallet;


  const {
    root, row, col,
  } = classes;


  const update = (obj)=>{
    setConfigObj({
      ...configObj,
      ...obj,
    });

    Api.post('wallet/payment/config/update', {
      _id: config?._id,
      ...configObj,
    }).then((res)=>{
      const data = res.data;
    });
  };

  const reload = async ()=>{

  };


  return (
    <>
      <ButtonBase onClick={()=>{
        setOpen(true);
      }}>
        <Paper className={root}>
          <Typography>
                        Payment Setup
          </Typography>
        </Paper>
      </ButtonBase>

      <PaymentConfigDialog
        open={open}
        setOpen={setOpen}
        walletId={walletId}
      />
    </>
  );
}
