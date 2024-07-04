import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles, withStyles } from '@material-ui/core/styles';
// import Autocomplete from '@material-ui/lab/Autocomplete';
// import ListItemAvatar from '@material-ui/core/ListItemAvatar';
// import ListItem from '@material-ui/core/ListItem';
// import ListItemText from '@material-ui/core/ListItemText';
// import InputBase from '@material-ui/core/InputBase';
// import _ from 'lodash';
// import Avatar from '@material-ui/core/Avatar';
// // import Api from '../../helpers/Api';
// import Api from '../../../helpers/Api';
// import Fade from '@material-ui/core/Fade';
// import Paper from '@material-ui/core/Paper';
// import Popper from '@material-ui/core/Popper';
// import ProfileSelectList from './profile.select.list';
import { Typography } from '@material-ui/core';
import ProfileSelectButtonList from '../profile.select.btn.list';



const useStyles = makeStyles((theme) => ({
    root: {

        display: 'flex',
        flexDirection: 'column',
        // justifyContent: 'center',
        margin: '1rem',
        maxWidth: '20rem',
        alignItems: 'center',
    },
    inputPaper: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        maxWidth: '20rem',
        borderRadius: 10,
        height: '3rem',
        paddingLeft: '1rem',
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
    },
    ownerText: {
        color: "#586069",
        fontWeight: '600',
        fontSize: 15,
    }
}));

const ProfileSelectButton = (props) => {
    const {
        owner,
        adminProfiles,
        onChange,
        title,
        displayOwner,
        hideTitle,
        text,
        loading,
        setLoading
    } = props;

    const classes = useStyles();
    const [entity, setEntity] = useState(owner);



    // const {
    //   adminProfiles, loading
    // } = useGetAdminProfiles()


    useEffect(() => {
        if (entity?._id) {
            onChange(entity);
        }
    }, [entity?._id])

    useEffect(() => {
        setEntity(owner);
    }, owner?._id)


    return (
        <div className={classes.root}>


            <ProfileSelectButtonList
                entity={entity}
                setEntity={setEntity}
                entities={adminProfiles}
                displayOwner={displayOwner}
                text={text}
                loading={loading}
                setLoading={setLoading}
            />

        </div>
    );
};

export default ProfileSelectButton;
