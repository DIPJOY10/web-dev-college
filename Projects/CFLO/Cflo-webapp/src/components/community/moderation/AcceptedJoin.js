import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import Api from "../../../helpers/Api";
import arrayToReducer from "../../../helpers/arrayToReducer";

function AcceptedJoin({ match }) {
  const dispatch = useDispatch();
  const { moderation } = useSelector((state) => state);
  const moderationCommunity = moderation?.selectedCommunity;
  const { acceptedJoinIds, acceptedJoinDict } = moderation;
  const [community, setCommunity] = useState(undefined);
  const [loading, setLoading] = useState(true);

  // console.log("moderationReducer", moderation);

  async function getCommunity() {
    try {
      setLoading(true);
      const res = await Api.post("community/get", {
        _id: match.params.communityId,
      });
      console.log("res = ", res);
      setCommunity(res.data);
      dispatch({
        type: "AddModeration",
        payload: {
          selectedCommunity: res?.data || {},
        },
      });
      setLoading(false);
    } catch (error) {
      if (error.response) {
        console.log(error);
      } else if (error.request) {
        console.log(error);
      } else {
        console.log(error);
      }
    }
  }

  async function getJoins() {
    if (!community?.profile?._id) return;
    const joins = await Api.post("join/communityJoins", {
      communityProfile: community?.profile?._id,
      status: "accepted",
    });
    const acceptedJoins = joins?.joins;
    if (acceptedJoins) {
      const {
        idArr: acceptedJoinIdsTemp,
        acceptedDict: acceptedJoinDictTemp,
      } = arrayToReducer(acceptedJoins);

      dispatch({
        type: "AddModeration",
        payload: {
          acceptedJoins,
          acceptedJoinIds: acceptedJoinIdsTemp,
          acceptedJoinDict: acceptedJoinDictTemp,
        },
      });
    }
    console.log("moderationJoins", joins);
  }

  // useEffect(() => {
  //   getCommunity();
  // }, []);

  useEffect(() => {
    if (moderationCommunity?._id) setCommunity(moderationCommunity);
    else getCommunity();
  }, [moderationCommunity?._id]);

  useEffect(() => {
    getJoins();
  }, [community?._id]);

  return <div></div>;
}

export default AcceptedJoin;
