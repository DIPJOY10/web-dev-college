import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import PostFile from "./PostFile";
import Api from "../../helpers/Api";
import arrayToReducer from "../../helpers/arrayToReducer";
import {Box, CircularProgress } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";


const useStyle = makeStyles((theme) => ({
  root: {
    marginTop: "50px",
    display: "flex",
    justifyContent: "left",
    width:'60rem'
  },
  postBox: {
    margin: "0 auto",
    width: "80%",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  guestViewPost:{
    marginLeft: "-5.5rem",
    width: "100%",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  }
}));

function ProfilePost({ profileId, isGuestView }) {
  const classes = useStyle();
  const [posts, setPosts] = useState([]);
  const [postIds, setPostIds] = useState([]);
  const [postDict, setPostDict] = useState({});
  const [loading, setLoading] = useState(true);

  async function getProfilePosts() {
    setLoading(true);
    const postsRes = await Api.post("post/getProfilePost", {
      userProfile: profileId,
    });

    const { newDict, idArr } = arrayToReducer(postsRes?.posts || []);
    setPostIds(idArr);
    setPostDict(newDict);
    console.log("userProfilePosts", postsRes, profileId);
    setLoading(false);
  }

  useEffect(() => {
    getProfilePosts();
  }, []);

  return (
    <div className={classes.root}>
      {!loading ? (
        <div className={isGuestView?`${classes.guestViewPost}`:`${classes.postBox}`}>
          {postIds.map((id) => {
            return id && postDict[id] ? (
              <PostFile
                post={postDict[id]}
                setPostDict={setPostDict}
                addLink
                commentLimit={5}
                guestView={isGuestView}
              />
            ) : (
              <></>
            );
          })}
        </div>
      ) : (
      <Box sx={{ width: '80%',height:'100px' }}>
      <Skeleton />
      <Skeleton animation="wave" />
      <Skeleton animation={false} />
      <Skeleton />
      <Skeleton animation="wave" />
      <Skeleton animation={false} />
    </Box>
      )}
    </div>
  );
}

export default ProfilePost;
