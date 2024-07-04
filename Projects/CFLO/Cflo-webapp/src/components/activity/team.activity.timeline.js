import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import Api from "../../helpers/Api";
import { setActivities } from "./activity.utils";
import Timeline from "./timeline";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import useGetActivities from "./useGetActivities";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme) => ({
  progressBox: {
    display: "flex",
    justifyContent: "center",
    marginTop: "5px",
  },
}));

const TeamActivities = (props) => {
  const { parent, parentModelName } = props;
  const {
    result = [],
    hasMore,
    setLoadMore,
    loading,
    resultArr = [],
  } = useGetActivities({
    parent,
    parentModelName,
  });
  const classes = useStyles();
  const observer = useRef();
  const lastElement = useCallback(
    (node) => {
      console.log("visibleCalled");
      if (loading || !hasMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        console.log("visible");
        if (entries[0].isIntersecting && hasMore) setLoadMore(true);
      });
      console.log(observer);
      if (node) observer.current.observe(node);
    },
    [hasMore, loading]
  );

  console.log("activities", result, hasMore, loading);

  return (
    <div className={classes.activitiesBox}>
      {/* {result.map((activity, index) => {
        if (index == result.length - 1)
          return (
            <div key={activity?._id} ref={lastElement}>
              <ActivityCard activity={activity} />
            </div>
          );
        return (
          <div key={activity?._id}>
            <ActivityCard activity={activity} />
          </div>
        );
      })} */}
      <Timeline actIds={resultArr} lastElementRef={lastElement} />
      <div className={classes.progressBox}>
        {loading && <CircularProgress />}
      </div>
    </div>
  );
};

export default TeamActivities;
