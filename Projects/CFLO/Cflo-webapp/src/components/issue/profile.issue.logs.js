import React, { useEffect, useRef, useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import VersionDiff from "../styled/version.diff";
import {
  Avatar,
  Chip,
  CircularProgress,
  Divider,
  Paper,
  Typography,
} from "@material-ui/core";
import { result } from "lodash";
import Api from "../../helpers/Api";
import * as h2p from "html2plaintext";
import moment from 'moment';

import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';
import TimelineDot from '@material-ui/lab/TimelineDot';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "1rem",
    width: "24vw",
  },
  paper: {
    padding: "6px 16px",
    width: '20vw'
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
  }
  //   timelinedotoutline:{
  // 	// '& .MuiTimelineDot-root':{
  // 		borderColor:'#ffffff',
  // 	// }
  //   }
}));

export default function IssueLogs(props) {
  const classes = useStyles();
  const { issueId } = props;
  const [loading, setLoading] = useState(false);
  // const [allVersions, setAllVersions] = useState([]);
  const [allLogs, setAllLogs] = useState([]);
  // const getAllVersions = async () => {
  // 	setLoading(true);
  // 	const res = await Api.post("/doc/getDocVersions", {
  // 		versions,
  // 	});
  // 	if (res?.data) {
  // 		setAllVersions(res?.data);
  // 	}
  // 	setLoading(false);
  // };
  console.log('issueId =', issueId);
  const getAllLogs = async () => {
    setLoading(true);
    const res = await Api.post("/activity/get-dataModel", {
      data: issueId,
      dataModel: 'Issue',
    });
    if (res?.data) {
      console.log("All logs saved", res?.data);
      setAllLogs(res?.data);
    }
    setLoading(false);
  };
  useEffect(() => {
    // getAllVersions();
    getAllLogs();
  }, []);
  console.log("logs ", allLogs);

  const len = allLogs.length;
  // console.log(versions,' is versions')

  var lookArr = [];
  var logArr = []
  for (let i = 1; i < len; i++) {
    // console.log(JSON.parse(allLogs[i]?.raw),"RAW");
    var newDoc = JSON.parse(allLogs[len - i]?.raw);
    var oldDoc = JSON.parse(allLogs[len - i - 1]?.raw);
    console.log(oldDoc, "OldDoc");
    console.log(newDoc, "NewDoc");
    var titleDiff = !(newDoc.title == oldDoc.title);
    var descDiff = !(h2p(newDoc.description) == h2p(oldDoc.description));
    // var isClosed=!(newDoc.closed==oldDoc.closed);
    var templateDiff = !(newDoc.template?.title === oldDoc.template?.title);
    var priorityDiff = !(newDoc.priority === oldDoc.priority);
    var startDate = !(newDoc?.startDate === oldDoc.startDate);
    var finishDate = !(newDoc?.finishDate === oldDoc.finishDate);


    if (oldDoc?._id) {
      logArr.push({
        updatedBy: {
          name: allLogs[len - i]?.profile?.parent?.displayName,
          pic: allLogs[len - i]?.profile?.parent?.displayPicture?.thumbUrl
        },
        updatedAt: new Date(newDoc?.updatedAt).toString().split(" ").slice(0, 5).join(" "),
        changes: {
          title: titleDiff ? `Title changed from ${oldDoc?.title} to ${newDoc?.title}` : null,
          description: descDiff ? `Description changed from ${oldDoc?.description} to ${newDoc?.description}` : null,
          template: templateDiff ? `Template changed from ${oldDoc?.template?.title} to ${newDoc?.template?.title}` : null,
          priority: priorityDiff ? `Priority changed from ${oldDoc?.priority} to ${newDoc?.priority}` : null,
          startDate: startDate ? `Start date changed from ${moment(oldDoc?.startDate).format('MMM Do YYYY, hh:mm a')} to ${moment(newDoc?.startDate).format('MMM Do YYYY, hh:mm a')}` : null,
          finishDate: finishDate ? `Finish date changed from ${moment(oldDoc?.finishDate).format('MMM Do YYYY, hh:mm a')} to ${moment(newDoc?.finishDate).format('MMM Do YYYY, hh:mm a')}` : null,
        }
      })
      lookArr.push(
        <Timeline align="alternate" classes={{ root: classes.timelineroot }}>
          <TimelineItem classes={{ missingOppositeContent: classes.timelineItemroot }}>
            {/* <TimelineOppositeContent>
              
            </TimelineOppositeContent> */}
            <TimelineSeparator>
              <TimelineDot
                variant="outlined"
                classes={{
                  root: classes.timelinedotroot,
                }}
              >
                {/* <FastfoodIcon /> */}
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
              <Typography variant="subtitle2" color="textSecondary">
                {new Date(newDoc?.updatedAt)
                  .toString()
                  .split(" ")
                  .slice(0, 5)
                  .join(" ")}
              </Typography>
              <Paper elevation={3} className={classes.paper}>
                <Typography variant="h6" component="h1">
                  {allLogs[len - i]?.profile?.parent?.displayName}
                </Typography>


                <VersionDiff
                  oldValue={oldDoc?.title}
                  newValue={newDoc?.title}
                />
                <VersionDiff
                  oldValue={h2p(oldDoc?.description)}
                  newValue={h2p(newDoc?.description)}
                />
                <Timeline align="left">
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
                </Timeline>
              </Paper>
            </TimelineContent>
          </TimelineItem>
        </Timeline>

        // <Paper className={classes.root} key={i} elevation={4}>
        // 	<div>
        // 		{/* <Typography align="center" variant="h5">
        // 			Version {len - i + 1}
        // 		</Typography> */}
        // 		<Typography
        // 			align="left"
        // 			variant="body1"
        // 			style={{ marginRight: "10px" }}
        // 		>
        // 			Updated By {<Chip
        // 			avatar={<Avatar alt={allLogs[len-i]?.profile?.parent?.displayName} src={allLogs[len-i]?.profile?.parent?.displayPicture?.thumbUrl} />}
        // 			label={allLogs[len-i]?.profile?.parent?.displayName}

        //             />}
        // 		</Typography>
        // 		<Typography
        // 			align="right"
        // 			variant="body1"
        // 			style={{ marginRight: "10px" }}
        // 		>
        // 			{new Date(newDoc?.updatedAt)
        // 				.toString()
        // 				.split(" ")
        // 				.slice(0, 5)
        // 				.join(" ")}
        // 		</Typography>
        // 	</div>
        // 	{titleDiff ? (
        // 		<>
        // 			<Typography align="center" variant="body1">
        // 				Title changed
        // 			</Typography>
        // 			<VersionDiff
        // 				oldValue={oldDoc?.title}
        // 				newValue={newDoc?.title}
        // 			/>
        // 		</>
        // 	) : null}

        // 	{descDiff ? (
        // 		<>
        // 			<Typography align="center" variant="body1">
        // 				Description changed
        // 			</Typography>
        // 			<VersionDiff
        // 				oldValue={h2p(oldDoc?.description)}
        // 				newValue={h2p(newDoc?.description)}
        // 			/>
        // 		</>
        // 	) : null}
        // 	{templateDiff ? (
        // 		<>
        // 			<Typography align="center" variant="body1">
        // 				Template changed
        // 			</Typography>
        // <Typography variant="body2" display='inline' >
        // 	Template changed from <Typography style={{textDecoration:'underline'}} variant="subtitle2" display='inline'>{oldDoc.template?.title}</Typography> to <Typography style={{textDecoration:'underline'}} variant="subtitle2" display='inline'>{newDoc.template?.title}</Typography>
        // </Typography>
        // 		</>
        // 	) : null}
        // 	{priorityDiff ? (
        // 		<>
        // 			<Typography align="center" variant="body1">
        // 				Priority changed
        // 			</Typography>
        // <Typography variant="body2" display='inline' >
        // 	Priority changed from <Typography variant="subtitle2" display='inline'>{oldDoc.priority}</Typography> to <Typography variant="subtitle2" display='inline'>{newDoc.priority}</Typography>
        // </Typography>
        // 		</>
        // 	) : null}
        // 	{startDate ? (
        // 		<>
        // 			<Typography align="center" variant="body1">
        // 				Start Date changed
        // 			</Typography>
        // <Typography variant="body2" display='inline' >
        // 	Start Date changed from <Typography variant="subtitle2" display='inline'>{moment(oldDoc?.startDate).format('MMM Do YYYY, hh:mm a')}</Typography> to <Typography variant="subtitle2" display='inline'>{moment(newDoc?.startDate).format('MMM Do YYYY, hh:mm a')}</Typography>
        // </Typography>
        // 		</>
        // 	) : null}
        // 	{finishDate ? (
        // 		<>
        // 			<Typography align="center" variant="body1">
        // 				Finish Date changed
        // 			</Typography>
        // <Typography variant="body2" display='inline' >
        // 	Finish Date changed from <Typography variant="subtitle2" display='inline'>{moment(oldDoc?.finishDate).format('MMM Do YYYY, hh:mm a')}</Typography> to <Typography variant="subtitle2" display='inline'>{moment(newDoc?.finishDate).format('MMM Do YYYY, hh:mm a')}</Typography>
        // </Typography>
        // 		</>
        // 	) : null}
        // 	{/* {isClosed ? (
        // 		<>
        // 			<Typography align="center" variant="body1">
        // 				Issue Status Changed
        // 			</Typography>
        // 			{newDoc?.closed?(
        // 				<Typography align="center" variant="body1">
        // 				Issue is Closed
        // 			</Typography>
        // 			):<Typography align="center" variant="body1">
        // 			Issue is Reopened
        // 			</Typography>}
        // 		</>
        // 	) : null} */}
        // 	{/* {!titleDiff && !descDiff ? (
        // 		<Typography variant="h6" align="center">
        // 			No changes were made in Text Content.
        // 		</Typography>
        // 	) : null
        // 	} */}

        // 	<Divider />
        // </Paper>
      );
    }
  }

  return (
    <div className={classes.root}>
      {loading ? (
        <>
          {console.log(logArr[0]?.updatedBy?.pic, "Log Array")}
          <CircularProgress />
        </>
      ) : logArr.length > 0 ? (
        lookArr

      ) : (
        <Typography align="center" variant="h6">
          Current version is the only version
        </Typography>
      )}
    </div>
  );
}
