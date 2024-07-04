import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import cx from 'clsx';
import DwollaSvg from './dwolla.svg';
import Api from '../../../helpers/Api';
import CustomerTypeDialog from './customer.type.dialog';
import PersonAddIcon from '@material-ui/icons/PersonAdd';


const useStyles = makeStyles((theme) => ({

  dwollaMainConst: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: "20px",
    paddingTop: "20px"
  },
  paperStyle: {
    width: '95%',
    padding: '0.5rem 1rem',
    paddingBottom: '20px',
    border: "1px solid #989898"
  },
  dwollaHeader: {
    width: "95%",
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  btnStyle: {
    padding: "5px 10px",
    backgroundColor: theme.palette.primary.main,
    color: "white",
    fontSize: "18px",
    borderRadius: "5px"
  },
  paraText: {
    fontSize: '0.9rem',
    fontWeight: '400',
    marginTop: '0.5rem',
  },

  titleText: {
    fontSize: '1.3rem',
    fontWeight: '600',
    color: '#424242',
  },

  imgStyle: {
    height: "60px",
    width: "auto",
  },


  opacity: {
    opacity: '0.5',
  },

  row: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
  },


}));

export default function ConnectDwollaBtn(props) {
  const {
    wallet, setWallet,
  } = props;
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const walletId = wallet?._id;
  const {
    wallet: walletReducer,
  } = useSelector((state) => state);
  const auth = useSelector((state) => state.auth);
  const {
    user,
  } = auth;

  const {
    dwollaMainConst, dwollaHeader,
    imgStyle, btnStyle, opacity,
    row, col, paperStyle, paraText, titleText,
  } = classes;


  return (
    <div className={dwollaMainConst} >
      <CustomerTypeDialog
        open={open}
        setOpen={setOpen}
        walletId={walletId}
      />
      <Paper className={cx(col, paperStyle)}>
        <div className={dwollaHeader} >
          <img
            src={DwollaSvg}
            className={imgStyle}
          />
          <ButtonBase onClick={() => {
            setOpen(true);
          }} className={btnStyle}>
            <PersonAddIcon style={{ fontSize: "30px", marginRight: "5px" }} /> Create Account
          </ButtonBase>
        </div>
        <Typography className={paraText}>
          Dwolla is preferred for US 🇺🇸 based businesses using ACH. It costs few cents in fees (0.5% - 50 cents max). We will negotiate <b>same day ACH</b> soon. It costs <b>$1 for an account</b>.
        </Typography>
        <Typography className={paraText}>
          Dwolla enables you to send money to <b>anyone</b> with bank account info
        </Typography>
      </Paper>
    </div>
  );
}
