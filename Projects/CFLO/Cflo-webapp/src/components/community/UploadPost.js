import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory, Redirect } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import ButtonBase from "@material-ui/core/ButtonBase";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Api from "../../helpers/Api";

function UploadPost() {
  console.log("-----------------------");
  const { auth } = useSelector((state) => state);
  const { user } = auth;
  const profile = user?.profile;

  const [redirect, setRedirect] = useState(false);
  const [postId, setPostId] = useState("");

  useEffect(() => {
    async function getPost() {
      try {
        const post = await Api.post("post/create", {
          profile,
          user,
        });
        setRedirect(true);
        setPostId(post._id);
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

    getPost();
  }, []);

  return (
    <div>
      {redirect ? <Redirect to={"/explore/forum/draft/" + postId} /> : " "}
    </div>
  );
}

export default UploadPost;
