import React, { useEffect, useRef, useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import VersionDiff from "./styled/version.diff";
import {
    Avatar,
    Chip,
    CircularProgress,
    Divider,
    IconButton,
    Paper,
    Typography,
    useMediaQuery,
} from "@material-ui/core";

import * as h2p from "html2plaintext";
import moment from 'moment';

import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import Api from "../helpers/Api";
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
    root: {
        margin: "1rem",
        width: "24vw",
        [theme.breakpoints.down("xs")]: {
            width: "90vw",
            // marginLeft: "10rem",
        }
    },
    paper: {
        padding: "6px 16px",
        width: '20vw',
        margin: '1vh 0',
        [theme.breakpoints.down("xs")]: {
            width: "70vw"
        }
    },
    secondaryTail: {
        backgroundColor: theme.palette.secondary.main,
    },
    timelineroot: {
        padding: '6px 0'
    },
    timelinedotroot: {
        // '& .MuiTimelineDot-root':{
        padding: "0px",
        borderColor: '#ffffff',
        // }
    },
    timelineItemroot: {
        '&::before': {
            flex: 'none',
            content: 'none',

        }
    },
    primary: {
        backgroundColor: theme.palette.primary.main,
    },
    //   timelinedotoutline:{
    // 	// '& .MuiTimelineDot-root':{
    // 		borderColor:'#ffffff',
    // 	// }
    //   }
    rootDivider: {
        margin: "1vh",
        backgroundColor: 'rgba(0,0,0,0.87)',
        // height: '2px',

    },
}));

export default function Logs(props) {
    const classes = useStyles();
    const { dataModelId, dataModel, setOpen } = props;
    const [loading, setLoading] = useState(false);
    const [allLogs, setAllLogs] = useState([]);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

    const getAllLogs = async () => {
        setLoading(true);
        const res = await Api.post("/activity/get-dataModel", {
            data: dataModelId,
            dataModel
        });
        if (res?.data) {

            setAllLogs(res?.data);
        }
        setLoading(false);
    };
    useEffect(() => {
        // getAllVersions();
        getAllLogs();
    }, []);


    const len = allLogs.length;


    var lookArr = [];
    //   var logArr = []
    for (let i = 1; i < len; i++) {

        var newDoc = JSON.parse(allLogs[len - i]?.raw);
        var oldDoc = JSON.parse(allLogs[len - i - 1]?.raw);

        var titleDiff = !(newDoc?.title == oldDoc?.title);
        var descDiff = !(h2p(newDoc?.description) == h2p(oldDoc?.description));
        var templateDiff = !(newDoc?.template?.title === oldDoc.template?.title);
        var priorityDiff = !(newDoc?.priority === oldDoc?.priority);
        var startDate = !(newDoc?.startDate === oldDoc?.startDate);
        var finishDate = !(newDoc?.finishDate === oldDoc?.finishDate);


        if (oldDoc?._id) {
            lookArr.push(
                <>
                    <Timeline align="alternate" classes={{ root: classes.timelineroot }}>
                        <TimelineItem classes={{ missingOppositeContent: classes.timelineItemroot }}>
                            <TimelineSeparator>
                                <TimelineDot
                                    variant="outlined"
                                    classes={{
                                        root: classes.timelinedotroot,
                                    }}
                                >
                                    <Avatar
                                        alt={allLogs[len - i]?.profile?.parent?.displayName}
                                        src={
                                            allLogs[len - i]?.profile?.parent?.displayPicture?.thumbUrl
                                        }
                                    />
                                </TimelineDot>
                                <TimelineConnector />
                            </TimelineSeparator>
                            <TimelineContent>
                                {/* <Paper elevation={3} className={classes.paper}> */}
                                <Typography variant="h6" component="h1">
                                    {allLogs[len - i]?.profile?.parent?.displayName}
                                </Typography>
                                <Typography variant="subtitle2" color="textSecondary" style={{ margin: ".5vh 0" }}>
                                    {new Date(newDoc?.updatedAt)
                                        .toString()
                                        .split(" ")
                                        .slice(0, 5)
                                        .join(" ")}
                                </Typography>
                                {titleDiff ? <Paper elevation={3} className={classes.paper} square variant="outlined">
                                    <><VersionDiff
                                        oldValue={oldDoc?.title}
                                        newValue={newDoc?.title}
                                    />
                                    </>
                                </Paper> : null}
                                {descDiff ? <Paper elevation={3} className={classes.paper} square variant="outlined">
                                    <><VersionDiff
                                        oldValue={h2p(oldDoc?.description)}
                                        newValue={h2p(newDoc?.description)}
                                    />
                                    </>
                                </Paper> : null}
                                {templateDiff ? <Paper elevation={3} className={classes.paper} square variant="outlined">
                                    <><Typography variant="body2" display='inline' >
                                        Template changed from <Typography style={{ textDecoration: 'underline' }} variant="subtitle2" display='inline'>{oldDoc.template?.title}</Typography> to <Typography style={{ textDecoration: 'underline' }} variant="subtitle2" display='inline'>{newDoc.template?.title}</Typography>
                                    </Typography>
                                    </>
                                </Paper> : null}
                                {priorityDiff ? <Paper elevation={3} className={classes.paper} square variant="outlined">
                                    <><Typography variant="body2" display='inline' >
                                        Priority changed from <Typography variant="subtitle2" display='inline'>{oldDoc.priority}</Typography> to <Typography variant="subtitle2" display='inline'>{newDoc.priority}</Typography>
                                    </Typography>
                                    </>
                                </Paper> : null}
                                {startDate ? <Paper elevation={3} className={classes.paper} square variant="outlined">
                                    <> <Typography variant="body2" display='inline' >
                                        Start Date changed from <Typography variant="subtitle2" display='inline'>{moment(oldDoc?.startDate).format('MMM Do YYYY, hh:mm a')}</Typography> to <Typography variant="subtitle2" display='inline'>{moment(newDoc?.startDate).format('MMM Do YYYY, hh:mm a')}</Typography>
                                    </Typography>
                                    </>
                                </Paper> : null}
                                {finishDate ? <Paper elevation={3} className={classes.paper} square variant="outlined">
                                    <Typography variant="body2" display='inline' >
                                        Finish Date changed from <Typography variant="subtitle2" display='inline'>{moment(oldDoc?.finishDate).format('MMM Do YYYY, hh:mm a')}</Typography> to <Typography variant="subtitle2" display='inline'>{moment(newDoc?.finishDate).format('MMM Do YYYY, hh:mm a')}</Typography>
                                    </Typography>
                                </Paper> : null}
                                {/* <Timeline align="left">
                                        {templateDiff ? <TimelineItem classes={{ missingOppositeContent: classes.timelineItemroot }}>
                                            <TimelineSeparator>
                                                <TimelineDot color='primary' />
                                                <TimelineConnector className={classes.primary} />
                                            </TimelineSeparator>
                                            <TimelineContent>
                                                <Typography variant="body2" display='inline' >
                                                    Template changed from <Typography style={{ textDecoration: 'underline' }} variant="subtitle2" display='inline'>{oldDoc.template?.title}</Typography> to <Typography style={{ textDecoration: 'underline' }} variant="subtitle2" display='inline'>{newDoc.template?.title}</Typography>
                                                </Typography>
                                            </TimelineContent>
                                        </TimelineItem> : null}
                                        {priorityDiff ? <TimelineItem classes={{ missingOppositeContent: classes.timelineItemroot }}>
                                            <TimelineSeparator>
                                                <TimelineDot color='primary' />
                                                <TimelineConnector className={classes.primary} />
                                            </TimelineSeparator>
                                            <TimelineContent>
                                                <Typography variant="body2" display='inline' >
                                                    Priority changed from <Typography variant="subtitle2" display='inline'>{oldDoc.priority}</Typography> to <Typography variant="subtitle2" display='inline'>{newDoc.priority}</Typography>
                                                </Typography>
                                            </TimelineContent>
                                        </TimelineItem> : null}
                                        {startDate ? <TimelineItem classes={{ missingOppositeContent: classes.timelineItemroot }}>
                                            <TimelineSeparator>
                                                <TimelineDot color='primary' />
                                                <TimelineConnector className={classes.primary} />
                                            </TimelineSeparator>
                                            <TimelineContent>
                                                <Typography variant="body2" display='inline' >
                                                    Start Date changed from <Typography variant="subtitle2" display='inline'>{moment(oldDoc?.startDate).format('MMM Do YYYY, hh:mm a')}</Typography> to <Typography variant="subtitle2" display='inline'>{moment(newDoc?.startDate).format('MMM Do YYYY, hh:mm a')}</Typography>
                                                </Typography>
                                            </TimelineContent>
                                        </TimelineItem> : null}
                                        {finishDate ? <TimelineItem classes={{ missingOppositeContent: classes.timelineItemroot }}>
                                            <TimelineSeparator>
                                                <TimelineDot color='primary' />
                                                <TimelineConnector className={classes.primary} />
                                            </TimelineSeparator>
                                            <TimelineContent>
                                                <Typography variant="body2" display='inline' >
                                                    Finish Date changed from <Typography variant="subtitle2" display='inline'>{moment(oldDoc?.finishDate).format('MMM Do YYYY, hh:mm a')}</Typography> to <Typography variant="subtitle2" display='inline'>{moment(newDoc?.finishDate).format('MMM Do YYYY, hh:mm a')}</Typography>
                                                </Typography>
                                            </TimelineContent>
                                        </TimelineItem> : null}
                                    </Timeline> */}
                                {/* </Paper> */}
                            </TimelineContent>
                        </TimelineItem>
                    </Timeline>
                </>

            );
        }
    }

    return (
        <div className={classes.root}>
            {loading ? (
                <>

                    <CircularProgress />
                </>
            ) : lookArr.length > 0 ? (
                <>
                    <IconButton onClick={() => {
                        setOpen(false);
                    }}>
                        <CloseIcon />
                    </IconButton>
                    {lookArr}
                </>

            ) : (
                <Typography align="center" variant="h6">
                    Current version is the only version
                </Typography>
            )}
        </div>
    );
}
