import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import cx from 'clsx';
import { Divider } from '@material-ui/core';
import TouchAppIcon from '@material-ui/icons/TouchApp';
import RedoIcon from '@material-ui/icons/Redo';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import FlashOnIcon from '@material-ui/icons/FlashOn';
import DeleteIcon from '@material-ui/icons/Delete';
import DoneAllIcon from '@material-ui/icons/DoneAll';

const useStyles = makeStyles((theme) => ({
  root: {

  },

  dwollaBankItem: {
    width: '270px',
    border: "1px solid #989898",
    marginTop: "5px",
    padding: "10px",
    marginLeft: "5px"
  },

  dwollaBottomOption: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  dwollaOptIconCont: {
    display: 'flex',
    justifyContent: 'space-between',
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

  paperStyle: {
    maxWidth: '18rem',
    margin: '1rem 0.5rem',
    padding: '1rem 0.5rem',
  },


  titleText: {
    fontSize: '1.3rem',
    fontWeight: '600',
    color: '#424242',
  },

  accountName: {
    fontSize: '1rem',
    fontWeight: '500',
    color: '#424242',
    display: "flex",
    justifyContent: 'center',
    alignItems: 'center',
  },

  accountSubtype: {
    fontSize: '0.9rem',
    fontWeight: '400',
    color: '#424242',
  },
  smPaperStyle: {
    padding: '0.5rem',
    margin: '0.5rem',
    width: '100%',
  },

  smPaperSelected: {
    padding: '0.5rem',
    margin: '0.5rem',
    width: '100%',
    borderWidth: '0.2rem',
    borderColor: theme.palette.primary.main,
  },
}));

export default function DwollaBankCardItem(props) {
  const {
    item, onSelect, selected, removeBankAcc,
  } = props;
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const {
    row, col, root, dwollaBottomOption, dwollaBankItem, dwollaOptIconCont,
    paperStyle, smPaperStyle, smPaperSelected,
    titleText, accountSubtype, accountName,
  } = classes;

  const bankName = item?.bankName;
  const bankAccountType = item?.bankAccountType;

  return (

    <Paper className={dwollaBankItem} square >
      <Typography className={accountName}>{bankName}
         {selected ? <FlashOnIcon style={{ color: '#FFD700' }} /> : null}
      </Typography>
      <Typography className={accountSubtype}>{item?.name}</Typography>
      <Typography className={accountSubtype}>{bankAccountType}</Typography>
      <div className={dwollaBottomOption} >
        <div></div>
        <div className={dwollaOptIconCont} >
         {selected ? null : 
         <>
          <Tooltip title="Set As Default" placement="top">
            <IconButton
              onClick={() => {
                if (onSelect) {
                  onSelect(item);
                }
              }}
            >
              <DoneAllIcon style={{ fontSize: '30px', cursor: 'pointer', color: '#2196F3' }} />
            </IconButton>
          </Tooltip>
          </>
         }
         <Tooltip title="Remove" placement="top">
            <IconButton
              onClick={()=>{
                removeBankAcc(item, selected)
              }}
            >
              <DeleteIcon style={{ fontSize: '30px', cursor: 'pointer', color: '#2196F3' }} />
            </IconButton>
          </Tooltip>
        </div>
      </div>
    </Paper>
  );
}
