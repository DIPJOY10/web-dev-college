import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import {useHistory} from 'react-router-dom';
import CreateOrgDialog from './create.org.dialog';
import ProfileBasic from '../styled/Profile/basic';
import {updateOrg} from './organization.utils';
import {updateUser} from '../profile/profile.utils';
import {setOrgs} from './organization.utils';
import CreateButton from '../styled/actionBtns/create.btn';
import TeamList from '../team/team.list';
import {Button} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    top: 0,
    width: `calc(100%)`,
    [theme.breakpoints.down('sm')]: {
      marginLeft: 0,
    },
    overflow: 'auto',
  },
  createButtonText: {
    marginLeft: '0.5rem',
    color: theme.palette.primary.main,
  },

  gridStyle: {
    flex: 1,
    flexDirection: 'column',
  },

  topBarDivider: {
    width: '50%',
    marginTop: '0.5rem',
    marginBottom: '1rem',
  },

  createDivStyle: {
    marginLeft: '2rem',
    marginTop: '0.2rem',
  },

  rowReverse: {
    display: 'flex',
    flexDirection: 'row-reverse',
  },

  createButtonText: {
    marginRight: '0.5rem',
  },
}));

const OrganizationList = (props) => {
  const {list,setList,Data,id} = props
  const classes = useStyles();
  const [openOrgCreateDialog, setOpenOrgCreateDialog] = useState(false);

  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const {user, organizationIds, organizationDictionary} = auth;
  const history = useHistory();
  // console.log(organizationIds, organizationDictionary);
  const walletId = user.wallet;
  // const pathUrl = new URLSearchParams(document.location.search.substring(1)).get('path')
  const updateOrgApi = (updateObject) => {
    updateOrg(updateObject, auth, dispatch);
  };
  const updateUserApi = (updateObject) => {
    updateUser(updateObject, auth, dispatch);
  };
  return (
    <div className={classes.root}>
      <CreateOrgDialog open={openOrgCreateDialog} setOpen={setOpenOrgCreateDialog} />
      <div className={classes.gridStyle}>
        {organizationIds.map((organizationId,index) => {
          const org = organizationDictionary[organizationId];

          return (
            <TeamList
              key={org.team}
              teamId={org.team}
              list={list}
              setList={setList}
              Data={Data}
              index={index}
              id={id}
              onClick={() => {
                const path = '/organizations/' + org.team;
                history.push(path);
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default OrganizationList;
