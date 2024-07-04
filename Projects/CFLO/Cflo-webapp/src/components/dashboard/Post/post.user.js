import React from "react";
import { Link } from "react-router-dom";
import { makeStyle, makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";

import PostFile from "../../post/PostFile";

const useStyle = makeStyles((theme) => ({
  link: {
    textDecoration: "none",
  },
}));

function PostUser({ postDataDictionary = {} }) {
  const classes = useStyle();
  const { postDictionary, postPublishedIds, postDraftIds } = useSelector(
    (state) => state.dashboard
  );

  return (
    <div>
      {(postPublishedIds || [])?.map((postId) => {
        const propPost = {
          ...(postDictionary && postDictionary && postDictionary[postId]
            ? postDictionary[postId]
            : {}),
          ...(postDataDictionary &&
          postDataDictionary &&
          postDataDictionary[postId]
            ? postDataDictionary[postId]
            : {}),
        };
        return postDictionary[postId] ? (
          <Link
            className={classes.link}
            key={propPost?._id}
            to={{
              pathname: `/explore/forum/post/${postId}`,
              state: {
                post: propPost,
              },
            }}
          >
            <PostFile
              key={propPost?._id}
              commentLimit={5}
              key={postId}
              post={propPost}
            />
          </Link>
        ) : (
          <></>
        );
      })}
    </div>
  );
}

export default PostUser;
