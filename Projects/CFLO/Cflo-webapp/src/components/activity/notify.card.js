import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import ButtonBase from "@material-ui/core/ButtonBase";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import moment from "moment";

import MentionOutput from "../styled/mention.output";

/**
 * Type - Me,
 *
 */

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    width: (props) => {
      if (props.size == "xs") {
        return "14rem";
      } else if (props.size == "sm") {
        return "15.5rem";
      } else {
        return "18rem";
      }
    },
    display: "flex",
    flexDirection: "row",
    padding: "0.5rem",
  },
  row: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "row",
    alignItems: "row",
  },

  dP: {
    height: "1.5rem",
    width: "1.5rem",
  },
}));

export default function ActivityCard(props) {
  const { actId, type, size } = props;

  const activityReducer = useSelector((state) => state.activity);
  const { activityDictionary } = activityReducer;

  const activity = activityDictionary[actId];

  const history = useHistory();
  const classes = useStyles({ size });
  const user = activity?.profile?.parent;

  const { displayName = "Test", displayPicture } = user || {};
  //   console.log("[][][][][][][", activity);

  return (
    <Paper className={classes.root} variant="outlined" square>
      <div className={classes.textBox}>
        <div className={classes.row}>
          <Avatar
            alt={displayName}
            src={displayPicture?.thumbUrl}
            className={classes.dP}
          />
          <div className={classes.row}>
            <Typography>{activity?.title}</Typography>
          </div>
        </div>

        <Typography>
          <MentionOutput text={activity?.body} />
        </Typography>
      </div>
    </Paper>
  );
}
