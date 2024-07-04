import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import ProfileAppbar from '../profile/profile.appbar';
import { makeStyles } from '@material-ui/core/styles';
import InvestmentCard from './investment.card';
import { useEffect } from 'react';
import Api from '../../helpers/Api';
import { Paper, Typography } from '@material-ui/core';
import AvatarLocal from '../profile/avatar';
import { useInvestment } from './investment.hook';
import FileObjectViewer from '../file/Viewer/FilesObjectViewer';
import CircularProgress from '@material-ui/core/CircularProgress';
const useStyles = makeStyles((theme) => ({
    root: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        paddingBottom: '6rem',
        paddingTop: '4rem',
        overflow: 'auto',
        // border: '1px solid red',
        alignItems: 'center',
        width: '100%'
    },
    paper: {
        display: 'flex',
        flexDirection: 'column',
        width: '60%',
        marginTop: '5vh',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        [theme.breakpoints.down('xs')]: {
            minHeight: "50vh",
            width: '100%'
        }
    },
    parentContainer: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        alignItems: 'center',
        // border: '1px solid red',
        margin: '3vh 0'
    },
    payType: {
        display: 'flex',
        flexDirection: 'column',
        width: '70%',
        // border: '1px solid red',
        margin: '0 0 2vh 0'
    },
    comment: {
        display: 'flex',
        flexDirection: 'column',
        width: '70%',
        // border: '1px solid red',
        margin: '0 0 2vh 0'
    },
    files: {
        display: 'flex',
        flexDirection: 'column',
        width: '70%',
        // border: '1px solid red',
        // margin: '0 0 2vh 0'
    }
}))
export default function InvestmentApplicationView() {
    const { appId, investmentId } = useParams();
    const classes = useStyles();
    const { investment } = useInvestment(investmentId);
    const [appState, setAppState] = useState(null);
    // const [investmentPayType, setInvestmentPayType] = useState(null);
    // setInvestmentPayType(investment?.payType);
    const getApplicationDetail = (appId) => {
        Api.post('/apply/getApplicationDetail', {
            appId
        }).then((res) => {
            console.log(res?.apps, "AppDetails")
            setAppState(res?.apps);
        })
    }
    useEffect(() => {
        getApplicationDetail(appId);
    }, [appId])
    return (
        <div className={classes.root}>
            <ProfileAppbar name={"Application Details"} />
            <InvestmentCard investmentId={investmentId} />
            <Paper className={classes.paper}>
                {appState == null ? <CircularProgress /> : <><div className={classes.parentContainer}>
                    <AvatarLocal src={appState?.profile?.parent} style={{ marginBottom: '1vh' }} />
                    <Typography variant="h6">{appState?.profile?.parent?.displayName}</Typography>
                </div>
                    <div className={classes.payType}>
                        <Typography variant="h6">Ticket Size</Typography>
                        <Typography variant="subtitle1">{`$${appState?.ticket?.amount}`}</Typography>
                    </div>
                    <div className={classes.comment}>
                        <Typography variant="h6">Comment</Typography>
                        <Typography variant="subtitle1">{appState?.topComment?.text}</Typography>
                    </div>
                    <div className={classes.files}>
                        <Typography variant="h6" style={{ marginBottom: '1vh' }}>Files Uploaded</Typography>
                        {/* <FilesViewer fileIds={appState?.files} /> */}
                        {appState?.files?.length > 0 ? <FileObjectViewer files={appState?.files} styleBody={{
                            width: "25px",
                            height: "25px",
                            margin: "0",
                            borderRadius: "0",
                            padding: "0",
                        }} isGallery={true} /> : <Typography variant="subtitle1">None</Typography>}
                    </div></>}
            </Paper>
        </div>
    )
}
