import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";

import PostFile from "../../post/PostFile";

const useStyle = makeStyles((theme) => ({
  link: {
    textDecoration: "none",
  },
}));

function PostSave({
  postDataDictionary = {},
  savePosts = [],
  savePostsDict = {},
  savePostsIds = [],
  setSavePostDict = () => {},
}) {
  const classes = useStyle();
  const dispatch = useDispatch();
  const { dashboard } = useSelector((state) => state);
  const { auth } = useSelector((state) => state);
  const { adminProfileIds, user } = auth;
  const profile = user?.profile;

  return (
    <div>
      {savePostsIds?.map((postId) => {
        return savePostsDict[postId] ? (
          <Link
            key={postId}
            className={classes.link}
            to={{
              pathname: `/explore/forum/post/${postId}`,
              state: { post: savePostsDict[postId] },
            }}
          >
            <PostFile
              commentLimit={5}
              key={postId}
              post={savePostsDict[postId]}
              setPostDict={setSavePostDict}
            />
          </Link>
        ) : (
          <></>
        );
      })}
    </div>
  );
}

export default PostSave;
