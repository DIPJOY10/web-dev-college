import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Avatar,
  CircularProgress,
  Divider,
  Grid,
  makeStyles,
  Paper,
  Typography,
  Box
} from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";

import ForumNav from "./ForumNav";
import SuggestedCommunitiesSidebar from "./SuggestedCommunitiesSidebar";
import PostFile from "../post/PostFile";

import Api from "../../helpers/Api";
import arrayToReducer from "../../helpers/arrayToReducer";
import useGetAdminProfiles from "../profile/useGetAdminProfiles";
import CommunitySearches from "./CommunitySearches";
import YourCommunitySidebar from "./YourCommunitiesSidebar";

var suggestedArr = [];

const useStyles = makeStyles((theme) => ({
  nav: {
    width: "75%",
    margin: "0 auto",
    marginBottom: "20px",
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
  },
}));
var suggestedArr = [];

function YourForum() {
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();
  const { forum } = useSelector((state) => state);

  const { suggestedCommunitiesIds, suggestedCommunitiesDict } = forum;
  const yourCommunitiesIds = suggestedCommunitiesIds.slice(0, 10);

  const location = useLocation();
  const searchParam = location.search;


  if (true) {
    return (
      <div>
        <Grid container>
          <Grid item xs={12} sm={9} md={9}>
            {forum.joinedCommunities.map((community) => (
              <Box key={community._id} onClick={() => {
                history.push("/explore/forum/communities/" + community.sulg);
              }} sx={{ cursor: "pointer", padding: "0.5rem 1rem", display: "flex", alignItems: 'center', marginBottom: '0.5rem' }} component={Paper}>
                <Avatar
                  src={
                    community.displayPicture
                  }
                  alt={community.displayName || "/c"}
                />
                <Box sx={{ marginLeft: "8px" }}>
                  <Box sx={{ display: "flex", alignItems: 'center' }}>
                    <Typography variant="subtitle2" component="p">c/{community?.displayName}</Typography>
                    <span style={{ margin: "0 4px" }}>•</span>
                    <Typography variant="subtitle2" component="p">{community?.joinCount} Members</Typography>
                    <span style={{ margin: "0 4px" }}>•</span>
                    <Typography variant="subtitle2" component="p">{community?.communityType}</Typography>
                  </Box>
                  <Typography variant="caption" component="p">{community?.description ? community?.description : "Welcome to /r/Game. --- Welcome to level 1. This is a puzzle game on Reddit..."}</Typography>
                </Box>
              </Box>
            ))}
          </Grid>
          {/* <Grid item xs={false} sm={3} md={3}></Grid> */}
        </Grid>
      </div>
    );
  } else {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "1rem",
        }}
      >
        <CircularProgress />
      </div>
    );
  }
}

export default YourForum;
