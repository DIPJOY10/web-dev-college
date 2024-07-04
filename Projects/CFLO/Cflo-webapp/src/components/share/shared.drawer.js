import React, { useState,useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import { Backdrop, Chip, CircularProgress, Divider, Drawer, IconButton, Snackbar } from '@material-ui/core';
import {useSelector, useDispatch} from 'react-redux';

import MenuBar from '../styled/menubar';
import UserList from './user.list';
import SharedList from './sharedList';
import TeamList from './team.list';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import EntityListItem from './user.list.item';
import GroupAddIcon from '@material-ui/icons/GroupAdd';

const useStyles = makeStyles({

  drawer:{
    maxWidth:'19.5rem'
  }
});

function ShareDrawer(props) {
    const { 
        shared, setShared, orgTeams, projectTeams, open, setOpen, sharedDict
    } = props
    const classes = useStyles();
    const {user} = useSelector((state) => state.auth);
    

    const [ showShared, setShowShared ] = React.useState(false);

    
    const [nav, setNav] = useState('Organization');
    

    let View = null



    switch (nav) {
        case 'User':
          View = <UserList 
              shared={shared} 
              setShared={setShared} 
          />
           break;
        
        case 'Organization':

           View = <TeamList 
                shared={shared} 
                setShared={setShared} 
                teams={orgTeams}
            />
        break;

        case 'Project':

           View = <TeamList 
                shared={shared} 
                setShared={setShared} 
                teams={projectTeams}
            />
        break;

        default:
          View = null
    }

  return (
 
      <Drawer anchor='right' classes={{
            paper: classes.drawer
        }} open={open} onClose={()=>{setOpen(false)}}>
        <div style={{ padding: "10px",  }}>
            

        {/* <ListItem className={classes.itemStyle} button onClick={()=>{
                setShowShared(!showShared)
            }}>
            <ListItemIcon>
            <GroupAddIcon />
            </ListItemIcon>
            <ListItemText primary={showShared?'Hide Sharing':'Show Shared'} />
        </ListItem> */}
 
        {/* {showShared?
            <>
                    {shared.map(profileId=>{
                    const profile = sharedDict[profileId]
                    const entity = profile?.parent;

                    if(profile?._id){
                    return <EntityListItem 
                        key={profileId}
                        shared={shared}
                        setShared={setShared}
                        entity={entity}
                    />
                    }else{
                    return null
                    }


                })}
            </>:null } */}

            {showShared?null:<MenuBar
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
                text: 'Users',
                navText: 'User',
              },


            ]}
          />}
 
        </div>

        {showShared?null:View}

      </Drawer>

  );
}



export default ShareDrawer