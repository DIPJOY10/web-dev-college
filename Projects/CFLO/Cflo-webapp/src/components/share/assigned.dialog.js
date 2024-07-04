import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
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
import SearchBar from './searchbar';
import EntityListItem from './user.list.item';


const useStyles = makeStyles({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
});

function AssignedDialog(props) {
    const classes = useStyles();
    const { setOpen, open, assignableIds, dict, setAssigned, assigned } = props;
    const [ text, setText] = useState('')

    const [ assignIds, setAssignIds] = useState(assignableIds)

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        setAssignIds(assignableIds)
    },[assignableIds?.length])
    
    const filterResult = ()=>{
        if(text == ''){
            setAssignIds(assignableIds)
        }else{
            
        }
    }

    useEffect(() => {},[ text ])

  return (
    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
        <DialogTitle id="simple-dialog-title">Assign Profiles</DialogTitle>
        <SearchBar 
            text={text}
            setText={setText}
            placeholder={'Search People'}
        />
            {assignableIds.map(profileId=>{
                const profile = dict[profileId]
                const entity = profile?.parent
                if(entity?._id) {

                  return <EntityListItem key={entity?._id} entity={entity} shared={assigned} setShared={setAssigned} />
                }else{
                  return null
                }

            })}
    </Dialog>
  );
}

export default AssignedDialog;