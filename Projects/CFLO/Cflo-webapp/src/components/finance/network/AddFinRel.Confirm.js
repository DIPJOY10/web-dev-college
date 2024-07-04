import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import cx from 'clsx';
import { useParams, useHistory } from 'react-router-dom';
import { findAndAddRelation } from './api';
import AddFinRel from '../../AddMember/addFinRel';
import Button from '@material-ui/core/Button';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import Api from '../../../helpers/Api';


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        justifyContent: "center",
        alignItems: "center",
    },
    button: {
        margin: theme.spacing(1),
        [theme.breakpoints.down('sm')]: {
            padding : "5px 10px",
            fontSize : "13px"
        }
    }
}));
export default function AddFinRelConfirm(props) {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.auth);
    const { relationType, updateNetwork } = props
    const { root, button } = classes;
    const { walletId } = useParams();


    const [secParty, setSecParty] = useState()


    const onSelect = async (profile) => {
        setSecParty(profile)
    }

    const findOrAddRel = async (profile) => {
        if (profile) {
            const relObj = {
                profile: profile?._id,
                wallet: walletId,
                addedBy: user?.profile,
                user: user?._id,
                type: relationType
            };

            console.log(relObj);

            await findAndAddRelation(relObj)
                .then((data) => {
                    console.log(data)
                    updateNetwork()
                    setSecParty()
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    };




    return (
        <div className={root}>
            <AddFinRel
                walletId={walletId}
                value={secParty}
                onSelect={onSelect}
                placeholder={`Search/Add ${relationType}`}
                type={relationType}
            />
            <Button
                variant="contained"
                color="primary"
                className={button}
                onClick={() => { findOrAddRel(secParty) }}
            >
                <PersonAddIcon style={{ marginRight: "2px" }} />  Confirm
            </Button>
        </div>
    );
}
