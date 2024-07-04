import React from "react";
import Timeline from "@material-ui/lab/Timeline";
import TimelineItem from "@material-ui/lab/TimelineItem";
import TimelineSeparator from "@material-ui/lab/TimelineSeparator";
import TimelineConnector from "@material-ui/lab/TimelineConnector";
import TimelineContent from "@material-ui/lab/TimelineContent";
import TimelineDot from "@material-ui/lab/TimelineDot";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useMediaQuery } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import ActivityCard from "./activity.card";
import ActivityCardUtil from "./activity.card.util";
import TaskSvg from "../../Assets/tasks.svg";
import IssueSvg from "../../Assets/issue.svg";
import moment from "moment";
import Typography from "@material-ui/core/Typography";
import _ from "lodash";
import useSelectNotificationComponent from "./useSelectNotificationComponent";

const useStyles = makeStyles((theme) => ({
  svgSize: {
    display: "flex",
    height: "30px",
    width: "30px",
  },
  root: {
    width: "80%",
    maxWidth: "100rem",
  },
}));

export default function ActivityTimeline(props) {
  const classes = useStyles();
  const { actIds, lastElementRef } = props;
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const activityReducer = useSelector((state) => state.activity);
  const { activityDictionary } = activityReducer;

  const dateSet = new Set();

  const activities = actIds.map((actId) => {
    const activity = activityDictionary[actId];
    const createdAt = moment(activity?.createdAt).format("Do MMM YYYY");
    dateSet.add(createdAt);

    return {
      ...activity,
      createdAt,
    };
  });

  const dateArr = Array.from(dateSet);
  const dateActDic = _.groupBy(activities, "createdAt");

  const getType = (type) => {
    switch (type) {
      case "Task":
        return (
          <img key={"timeline"} className={classes.svgSize} src={TaskSvg} />
        );
        break;

      case "Issue":
        return <img key={"issue"} className={classes.svgSize} src={IssueSvg} />;
        break;

      default:
        return null;
        break;
    }
  };

  const dateTimelineItem = (date) => {};

  return (
    <Timeline
      classes={{
        root: classes.root,
      }}
      // align={isSmall ? "left" : "alternate"}
      align="left"
    >
      {dateArr.map((date, dateIndex) => {
        const acts = dateActDic[date];

        return (
          <TimelineItem key={date}>
            <TimelineSeparator>
              <TimelineDot variant="outlined"></TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Typography variant="body2" color="textSecondary">
                {date}
              </Typography>
              {acts.map((act, actIndex) => {
                const actId = act._id;
                // const
                // const ActivityComponent = useSelectNotificationComponent({
                //   act,
                //   isActivity: true,
                // });
                if (
                  dateIndex === dateArr.length - 1 &&
                  actIndex === acts.length - 1 &&
                  lastElementRef
                )
                  return (
                    <div key={actId} ref={lastElementRef}>
                      <ActivityCardUtil actId={actId} />
                    </div>
                  );
                return <ActivityCardUtil key={actId} actId={actId} />;
              })}
            </TimelineContent>
          </TimelineItem>
        );
      })}
    </Timeline>
  );
}
