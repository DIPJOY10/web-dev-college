import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import Api from "../../helpers/Api";
import arrayToReducer from "../../helpers/arrayToReducer";

export default function useGetActivities({
  parent,
  parentModelName,
  limit: limitRes,
}) {
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(limitRes || 20);
  const [hasMore, setHasMore] = useState(true);
  const [result, setResult] = useState([]);
  const [resultArr, setResultArr] = useState([]);
  const [loadMore, setLoadMore] = useState(true);
  const [loading, setLoading] = useState(false);

  async function getActivities() {
    if (!loadMore || !hasMore) return;
    setLoading(true);
    const res = await Api.post("activity/get-parent", {
      parent,
      parentModelName,
      page,
      limit,
    });

    console.log("profileActivities, ", res);
    setResult((prev) => {
      const final = [
        ...prev,
        ...(Array.isArray(res?.activities) ? res?.activities : []),
      ];

      const { newDict, idArr } = arrayToReducer([...final]);
      setResultArr(idArr);
      dispatch({
        type: "AddActivity",
        payload: {
          activityDictionary: { ...newDict },
        },
      });

      return [...final];
    });

    setHasMore(res.length === limit);
    setPage((prev) => prev + 1);
    setLoadMore(false);
    setLoading(false);
  }

  useEffect(() => {
    getActivities();
  }, [loadMore]);

  return {
    result,
    resultArr,
    hasMore,
    setLoadMore,
    loading,
  };
}
