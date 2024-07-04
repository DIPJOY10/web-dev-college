import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory, useLocation } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import moment from 'moment';
import { Chip, Typography } from '@material-ui/core';
import AssignmentIcon from '@material-ui/icons/Assignment';
import IconButton from '@material-ui/core/IconButton';
import CreateBtn from '../../styled/actionBtns/create.btn';
import AddIcon from '@material-ui/icons/Add';
import clsx from 'clsx';
import PropertyManagementImg2 from '../../../Assets/rental.svg';
import { handleGoogleLogin } from '../../auth/auth.utils';
import PropertyManagementDialog from '../../propertyManagement/PropertyManagement.Dialog';


const useStyles = makeStyles((theme) => ({
    root: {
        flex: 1,
        marginLeft: '1rem',
        width: '16rem',
        maxWidth: '16rem',
        minWidth: '16rem',
        display: 'flex',
        padding: '1rem',
        flexDirection: 'column',
        minHeight: '8rem',
        marginTop: '1rem',
        textAlign: 'center',
        cursor: "pointer"
    },
    svgSize: {
        display: 'flex',
        height: '35px',
        width: '35px',
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
    },
    topRow: {
        marginBottom: '1rem',
    },
    title: {
        marginLeft: '1rem',
        fontWeight: '700'
    },
    createBtn: {
        paddingLeft: '1rem',
        padding: '0.5rem',
        paddingTop: '0.25rem',
        paddingBottom: '0.25rem',
    },
    createBtnPaper: {
        marginLeft: '5px',
        alignSelf: 'flex-end',
        marginBottom: '16px',
    },
}));

export default function PropertyManagementCard(props) {
    const history = useHistory();
    const dispatch = useDispatch();
    const classes = useStyles();

    const { teamId } = props;
    const teamReducer = useSelector((state) => state.team);
    const { teamDictionary } = teamReducer;
    const team = teamDictionary[teamId];
    const walletId = team?.wallet;

    return (
        <Paper onClick={() => {
            if (team && team._id) {
                history.push('/propertymanagement/' + teamId);
            }
         }} className={classes.root} square >
            <div className={clsx(classes.row, classes.topRow)}>
                <img className={classes.svgSize} src={PropertyManagementImg2} />
                <Typography className={classes.title}>
                    Property Management <Chip
                        size="small"
                        label="Pending"
                        clickable
                        color="primary"
                        />
                </Typography>

                {/* <Paper className={classes.createBtnPaper}>
                    <PropertyManagementDialog
                        createBtn={classes?.createBtn}
                    />
                </Paper> */}
            </div>
            <div className={classes.row}>
                <ButtonBase onClick={() => {

                }}>
                    <Typography variant="body2" component="p">
                        Setup your property to manage tenant payments, issues, documents etc. Get your branded tenant portal or use ours for free
                    </Typography>
                </ButtonBase>
            </div>
        </Paper>
    );
}
