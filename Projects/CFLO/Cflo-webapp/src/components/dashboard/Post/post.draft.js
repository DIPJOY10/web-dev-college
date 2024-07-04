import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { makeStyle, makeStyles } from "@material-ui/core/styles";
import Pagination from "@material-ui/lab/Pagination";
import { useSelector, useDispatch } from "react-redux";

import PostFile from "../../post/PostFile";

const useStyle = makeStyles((theme) => ({
  link: {
    textDecoration: "none",
  },
  paginationBox: {
    display: "flex",
    justifyContent: "center",
  },
}));

function PostDraft({ postDataDictionary = {} }) {
  const classes = useStyle();
  const {
    postDictionary,
    postPublishedIds = [],
    postDraftIds = [],
  } = useSelector((state) => state.dashboard);

  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [currentDraftIds, setCurrentDraftIds] = useState([]);
  const limit = 20;
  useEffect(() => {
    setLastPage(
      Math.floor(
        postDraftIds?.length % limit == 0
          ? postDraftIds?.length / limit
          : postDraftIds?.length / limit + 1
      )
    );
  }, [postDraftIds?.length]);

  useEffect(() => {
    setCurrentDraftIds(
      postDraftIds?.slice(
        (currentPage - 1) * limit,
        (currentPage - 1) * limit + limit
      ) || []
    );
  }, [currentPage]);

  return (
    <div>
      {currentDraftIds?.map((postId) => {
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
            to={{
              pathname: `/explore/forum/post/${postId}`,
              state: { post: propPost },
            }}
          >
            <PostFile commentLimit={5} key={postId} post={propPost} />
          </Link>
        ) : (
          <></>
        );
      })}
      <div className={classes.paginationBox}>
        <Pagination
          count={lastPage}
          variant="outlined"
          color="primary"
          onChange={(event, page) => setCurrentPage(page * 1)}
        />
      </div>
    </div>
  );
}

export default PostDraft;
