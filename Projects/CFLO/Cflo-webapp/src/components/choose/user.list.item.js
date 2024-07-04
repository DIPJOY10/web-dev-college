import React, { useState,useEffect } from 'react';
import ListItem from '@material-ui/core/ListItem';
import {makeStyles} from '@material-ui/core/styles';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Checkbox from '@material-ui/core/Checkbox';

import AvatarLocal from '../profile/avatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import { Typography } from '@material-ui/core';


const useStyles = makeStyles((theme) => ({
    row:{
        flex:1,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },

    itemStyle:{
        minWidth:'18rem',

    }
}));


const EntityListItem = (props)=> {
    const classes = useStyles();
    const entity = props?.entity
    const model = props?.model;
    const setChoosen = props?.setChoosen
    const profileId = entity?.profile


    const handleSelect = () => {
        if(setChoosen) {
            var profile = {
                _id : profileId,
                parent:entity,
                parentModelName:model 
            }
            setChoosen(profile)
        }

    };

    return (<ListItem className={classes.row} onClick={()=>handleSelect()}>

            <ListItemAvatar>
                <AvatarLocal src={entity} style={{height: '1.6rem', width: '1.6rem', borderRadius:'0.8rem'}} />
            </ListItemAvatar>

        
            <ListItemText id={entity?._id} primary={entity?.displayName||[]} />
        </ListItem>
    );
}

export default EntityListItem