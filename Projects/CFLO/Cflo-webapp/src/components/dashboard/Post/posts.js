import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import ButtonBase from "@material-ui/core/ButtonBase";
import Typography from "@material-ui/core/Typography";

import PostAppbar from "./post.appbar";
import PostUser from "./post.user";
import PostDraft from "./post.draft";
import PostSave from "./post.save";
import Api from "../../../helpers/Api";
import arrayToReducer from "../../../helpers/arrayToReducer";

const useStyles = makeStyles((theme) => ({
  root: {},

  body: {
    marginTop: "6rem",
  },

  row: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
  },

  col: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
}));
export default function DashboardPosts(props) {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const { dashboard } = useSelector((state) => state);
  const { auth } = useSelector((state) => state);
  const { adminProfileIds, user } = auth;
  const profile = user?.profile;

  const [nav, setNav] = useState("Posts");
  const [postData, setPostData] = useState([]);
  const [postDataIds, setPostDataIds] = useState([]);
  const [postDataDictionary, setPostDataDictionary] = useState({});
  const [currentComponent, setCurrentComponent] = useState(<div />);
  const [savePosts, setSavePosts] = useState([]);
  const [savePostsDict, setSavePostsDict] = useState({});
  const [savePostsIds, setSavePostsIds] = useState([]);

  const { root, row, col } = classes;

  useEffect(() => {
    switch (nav) {
      case "Posts":
        setCurrentComponent(
          <PostUser postDataDictionary={postDataDictionary} />
        );
        break;
      case "Draft":
        setCurrentComponent(
          <PostDraft postDataDictionary={postDataDictionary} />
        );
        break;
      case "Saved":
        setCurrentComponent(
          <PostSave
            savePosts={savePosts}
            savePostsDict={savePostsDict}
            savePostsIds={savePostsIds}
            setSavePostsDict={setSavePostsDict}
          />
        );
        break;
      default:
        setCurrentComponent(<></>);
    }
  }, [postDataDictionary, nav]);

  useEffect(() => {
    async function getSavePosts() {
      const profileIds =
        adminProfileIds &&
        Array.isArray(adminProfileIds) &&
        adminProfileIds.length > 0
          ? adminProfileIds
          : [profile];
      const res = await Api.post("save/get-post", { profileIds });
      setSavePosts(res?.data || []);
      const { newDict, idArr } = arrayToReducer(res?.data || []);
      setSavePostsDict({ ...newDict });
      setSavePostsIds([...idArr]);
    }

    getSavePosts();
  }, []);

  useEffect(() => {
    async function getPostData() {
      const postData = await Api.post("post/getpostdata", {
        profileIds:
          Array.isArray(adminProfileIds) && adminProfileIds.length > 1
            ? adminProfileIds
            : [profile],
      });
      const { idArr, newDict } = arrayToReducer(postData?.data || []);
      setPostData(postData?.data || []);
      setPostDataIds(idArr);
      setPostDataDictionary(newDict);
    }

    getPostData();
  }, []);

  return (
    <div className={root}>
      <PostAppbar nav={nav} setNav={setNav} profile={profile} />
      <div className={classes.body}>{currentComponent}</div>
    </div>
  );
}
