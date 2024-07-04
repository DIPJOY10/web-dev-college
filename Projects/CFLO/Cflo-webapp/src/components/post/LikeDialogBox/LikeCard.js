import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    padding: "10px",
    width: "400px",
    cursor: "pointer",
    // borderBottom: "1px solid lightgray",
  },
  avatar: {
    marginRight: "10px",
  },
  name: {
    fontWeight: "400",
  },
}));

function LikeCard({ likeUser }) {
  const classes = useStyles();
  const history = useHistory();
  return (
    <div
      className={classes.root}
      onClick={() => {
        history.push(`/profile/view/${likeUser?._id}` || "/");
      }}
    >
      <Avatar
        className={classes.avatar}
        src={likeUser?.parent?.displayPicture?.thumbUrl}
      />{" "}
      <Typography className={classes.name}>
        {likeUser?.parent?.displayName}
      </Typography>
    </div>
  );
}

export default LikeCard;
