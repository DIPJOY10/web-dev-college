import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import ProfileAppbar from "../../profile/profile.appbar";

import CreatePostBox from "./create.postBox";

// const lightgrey = "#f1f3f4";

const useStyles = makeStyles((theme) => ({
  root: {
    // border: "1px solid rgba(175, 175, 175, 0.8)",
    width: "75%",
    margin: "0 auto",
    // marginBottom: "60px",
    // backgroundColor: "white",
    // padding: "20px 15px",
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
    marginTop: "6rem",
  },
}));

function UploadPostBox({ post: postReceived }) {
  const classes = useStyles();

  return (
    <>
      <ProfileAppbar
        name={"Post"}
        // btns={
        //   <>
        //     <Button
        //       variant="contained"
        //       color="primary"
        //       component="span"
        //       onClick={() => publish()}
        //     >
        //       Publish
        //     </Button>
        //   </>
        // }
      />
      <div className={classes.root}>
        <CreatePostBox post={postReceived} />
      </div>
    </>
  );
}
export default UploadPostBox;
