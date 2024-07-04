import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import BusinessIcon from '@material-ui/icons/Business';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import PersonIcon from '@material-ui/icons/Person';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';
import { blue } from '@material-ui/core/colors';
import ShareOutlinedIcon from '@material-ui/icons/ShareOutlined';
import { Backdrop, Chip, CircularProgress, Divider, Drawer, IconButton, Snackbar } from '@material-ui/core';
import Api from "../../helpers/Api";
import { useSelector, useDispatch } from 'react-redux';

// import OrganizationList from '../../organization/OrganizationList'
// import ProjectList from '../../projects/ProjectList';
// import { UserList } from '../../user/userList';


import MuiAlert from '@material-ui/lab/Alert';
import MenuBar from '../styled/menubar';
import UserList from './user.list';

import TeamList from './team.list';
import CreateBtn from '../styled/actionBtns/create.btn';

const useStyles = makeStyles({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
  drawer: {
    maxWidth: '19.5rem'
  }
});

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}


function ChooseDialog(props) {
  const {
    choosen, setChoosen, profileId,
  } = props
  const classes = useStyles();
  const { user } = useSelector((state) => state.auth);

  const [open, setOpen] = React.useState(false);
  const [showShared, setShowShared] = React.useState(false);

  const [adminProfileIds, setAdminProfileIds] = React.useState([]);
  const [projectTeams, setProjectTeams] = useState([])
  const [orgTeams, setOrgTeams] = useState([])


  const [nav, setNav] = useState('Project');

  const getBasicData = async () => {
    const res = await Api.post('shared/getBasicData', {
      userProfileId: user?.profile
    })

    if (res?.data) {
      const data = res?.data
      const adminProfileIdsRes = res.data.adminProfileIds
      const orgTeamRes = data.orgTeams
      const projectTeamRes = data.projectTeams

      setAdminProfileIds(adminProfileIdsRes)
      setOrgTeams(orgTeamRes)
      setProjectTeams(projectTeamRes)
    }
  }




  useEffect(() => {
    getBasicData()
  }, [])



  let View = null



  switch (nav) {
    case 'User':
      View = <UserList
        choosen={choosen}
        setChoosen={setChoosen}
      />
      break;

    case 'Organization':

      View = <TeamList
        choosen={choosen}
        setChoosen={setChoosen}
        teams={orgTeams}
        model={'Organization'}
      />
      break;

    case 'Project':

      View = <TeamList
        choosen={choosen}
        setChoosen={setChoosen}
        teams={projectTeams}
        model={'Project'}
      />
      break;

    default:
      View = null
  }

  return (
    <>
      <CreateBtn color="primary" onClick={() => { setOpen(true) }}>
        Choose
      </CreateBtn>
      <Dialog open={open} onClose={() => { setOpen(false) }}>
        <div style={{ padding: "10px", }}>


          {showShared ? null : <MenuBar
            navState={nav}
            setNav={setNav}
            items={[
              {
                Icon: null,
                text: 'Projects',
                navText: 'Project',
              },
              {
                Icon: null,
                text: 'Organizations',
                navText: 'Organization',
              },
              {
                Icon: null,
                text: 'Personal',
                navText: 'User',
              },
            ]}
          />}

        </div>

        {showShared ? null : View}

      </Dialog>

    </>
  );
}



export default ChooseDialog