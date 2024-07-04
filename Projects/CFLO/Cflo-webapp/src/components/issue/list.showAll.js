import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import ListItemCard from './list.item.card';
import { IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
const useStyles = makeStyles((theme) => ({
    paper: {
        padding: '6px 16px',
    },
    secondaryTail: {
        backgroundColor: theme.palette.secondary.main,
    },
    timelineDotroot: {
        padding: "2px 8px"
    },
    timelineroot: {
        flexGrow: "initial"
    }
}));
export default function ListDataShowAll(props) {
    const classes = useStyles();
    const { data, setOpen } = props;
    console.log(data);
    return (
        <div>
            <div>
                <IconButton onClick={() => {
                    setOpen(false);
                }}>
                    <CloseIcon />
                </IconButton>
            </div>
            {data.map((item, index) => {
                return (
                    <Timeline align="left" classes={{ root: classes.timelineroot }}>
                        <TimelineItem>
                            <TimelineSeparator>
                                <TimelineDot color='primary' classes={{ root: classes.timelineDotroot }}>
                                    {index + 1}
                                </TimelineDot>
                                <TimelineConnector />
                            </TimelineSeparator>
                            <TimelineContent>
                                <ListItemCard data={item} />
                            </TimelineContent>
                        </TimelineItem>
                    </Timeline>
                );
            })}
        </div>
    )
}
