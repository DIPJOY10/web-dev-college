import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import ButtonBase from "@material-ui/core/ButtonBase";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import cx from "clsx";
import Community from "./Community";
import Api from "../../helpers/Api";

// import baseStyle from "./styled/base/index";

import axios from "axios";

const useStyles = makeStyles((theme) => ({
  root: {
    color: "rgba(0, 0, 0, 0.54)",
  },
}));

function ExploreCommunity(props) {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const [communities, setCommunities] = useState([]);

  useEffect(() => {
    async function getAllComminites() {
      try {
        const allCommunities = await Api.post("community/getAll");
        // console.log(allCommunities);
        setCommunities(allCommunities.data);
        console.log({ communities });
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

    getAllComminites();
    console.log("hello");
  }, []);

  const { auth } = useSelector((state) => state);
  const { user } = auth;
  const profile = user?.profile;

  //   const { root, row, col } = classes;

  return (
    <Grid container spacing={2}>
      {communities.map((el) => {
        // console.log(el);
        return <Community key={el._id} community={el} />;
      })}
    </Grid>
  );
}

export default ExploreCommunity;
