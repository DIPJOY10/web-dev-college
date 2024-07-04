import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import NumberFormat from 'react-number-format';
import TextField from '@material-ui/core/TextField';
import clsx from 'clsx';
import RoleView from '../roleMap/roles.view';
import _ from 'lodash';
import Api from '../../helpers/Api';
import { setInvestments } from './investment.utils';
import CreateBtn from '../styled/actionBtns/create.btn';

const useStyles = makeStyles((theme) => ({
  row: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    width: '34rem',
    maxWidth: '34rem',
  },
  col: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    width: '34rem',
    maxWidth: '34rem',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      // border: '1px solid red'
    },
  },
}));

export default function InvestmentRole(props) {
  const DateNow = new Date();
  const [lastUpdated, setLastUpdated] = useState(DateNow);
  const classes = useStyles();
  const dispatch = useDispatch();
  const { investmentId, setActiveStep } = props;

  const dashboard = useSelector((state) => state.dashboard);

  const { investmentDictionary } = dashboard;

  const investment = investmentDictionary[investmentId];

  const roles = investment?.roles ? investment?.roles : [];

  const onRoleCreate = (role) => {
    const roleId = role._id;
    const newRoles = _.union(roles, [roleId]);
    // console.log(newRoles,' on Role Create Called ',role)
    Api.post('investment/update', {
      _id: investmentId,
      roles: newRoles,
    }).then((investmentNew) => {
      // console.log(' on investment updated ', investmentNew)
      setInvestments([{
        ...investment,
        roles: newRoles,
      }], dashboard, dispatch);
    });
  };

  const onRoleDelete = (role) => {
    const roleId = role._id;

    const newRoles = _.difference(roles, [roleId]);
    Api.post('investment/update', {
      _id: investmentId,
      roles: newRoles,
    }).then((investmentNew) => {
      console.log(' on investment updated ', investmentNew)
      setInvestments([{
        ...investment,
        roles: newRoles,
      }], dashboard, dispatch);
    });
  };

  return (
    <div className={classes.col}>
      <RoleView
        roles={roles}
        onRoleCreate={onRoleCreate}
        onRoleDelete={onRoleDelete}
      />
      <div>
        <CreateBtn onClick={() => {
          setActiveStep(1);
        }}>Save</CreateBtn>
      </div>
    </div>
  );
}
