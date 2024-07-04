import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { withStyles, makeStyles } from "@material-ui/core/styles";
import ButtonBase from "@material-ui/core/ButtonBase";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import PostCard from "../dashboard/Post/post.card";
import AddIcon from "@material-ui/icons/Add";
import CreateButton from "../styled/actionBtns/create.btn";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },

  rowDiv: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    overflow: "auto",
    width: "100%",
    maxWidth: "40rem",
    marginBottom: "10rem",
  },
}));

const PostFeed = (props) => {
  const classes = useStyles();
  const explore = useSelector((state) => state.explore);
  const { postIds } = explore;
  console.log(classes);

  console.log(explore);
  const PostCards = (postIds) => {
    if (postIds && postIds.length > 0) {
      return postIds.map((postId) => {
        if (postId) {
          return <PostCard postId={postId} />;
        } else {
          return null;
        }
      });
    } else {
      return null;
    }
  };

  return <div className={classes.root}>{PostCards(postIds)}</div>;
};

export default PostFeed;
