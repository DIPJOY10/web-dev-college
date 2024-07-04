import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {useHistory} from 'react-router-dom';
import Paper from '@material-ui/core/Paper';

import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import cx from 'clsx';
import useGetRentalReqs from './useGetRentalRequests';
import SelectProjectDialog from '../projects/select.project.dialog';
import ClearIcon from '@material-ui/icons/Clear';
import AssignmentTurnedInOutlinedIcon from '@material-ui/icons/AssignmentTurnedInOutlined';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import Avatar from '../profile/avatar';

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: '18rem',
    maxWidth: '24rem',
    padding: '0.5rem',
    margin: '0.5rem',
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

  nameText: {
    fontSize: '1.1rem',
    fontWeight: '500',
    marginLeft: '1rem',
  },

  avatarStyle: {
    height: '2.2rem',
    width: '2.2rem',
  },

  btnStyle: {
    padding: '0.2rem 1rem',
    margin: '0.5rem',
    display: 'flex',
    flexDirection: 'row',
  },

  btnTextStyle: {
    fontWeight: '600',
  },

  dismissBtn: {
    backgroundColor: theme.palette.primary.main,
    color: 'white',
  },
}));

export default function RentalReqCard(props) {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const {
    rentalReq: req,
    onDelete,
  } = props;

  const {
    auth,
  } = useSelector((state) => state);

  const {
    brandAppNetworkDictionary,
  } = auth;

  const {
    root, row, col, nameText,
    btnStyle, dismissBtn, btnTextStyle,
    avatarStyle,
  } = classes;


  const networkId = req?.brandAppNetwork;
  const appNetwork = brandAppNetworkDictionary[networkId];
  const tenant = req?.tenant?.parent;
  const dP = tenant?.displayPicture;

  return (
    <Paper className={root} square>
      <div className={row}>
        <Avatar src={tenant} className={avatarStyle} />
        <Typography className={nameText}>
          {tenant?.displayName}
        </Typography>
      </div>

      <div className={row}>

        <div className={row}></div>

        <ButtonBase onClick={()=>{
          onDelete();
        }}>
          <Paper className={cx(btnStyle, dismissBtn)}>
            <ClearIcon />
            <Typography className={btnTextStyle}>
                            Delete
            </Typography>
          </Paper>
        </ButtonBase>
        <ButtonBase onClick={()=>{
          const path = '/rental/request/' + req?._id;
          history.push(path);
        }}>
          <Paper className={cx(btnStyle)}>
            <AssignmentTurnedInOutlinedIcon />
            <Typography className={btnTextStyle}>
                            Assign
            </Typography>
          </Paper>
        </ButtonBase>
      </div>
    </Paper>
  );
}
