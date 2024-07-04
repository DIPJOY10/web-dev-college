import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Paper from "@material-ui/core/Paper";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { ReactComponent as ForumIcon } from "../../../Assets/forum_icon.svg";
import Typography from "@material-ui/core/Typography";
import CreateBtn from "../../styled/actionBtns/create.btn";
import { useHistory, useLocation } from "react-router-dom";
import { createSelector } from "reselect";
import _ from "lodash";
import AddIcon from "@material-ui/icons/Add";
import ButtonBase from "@material-ui/core/ButtonBase";

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    flexWrap: "wrap",
    maxWidth: "18rem",
    minWidth: "18rem",
    margin: "1rem",
    padding: "1rem",
    background: '#1DA1F2',
    // minHe
  },
  titleText: {
    titleTextAlign: "center",
    fontSize: "1.2rem",
    margin: "0.4rem",
    fontWeight: "700",
    color: "white"
  },

  text: {
    fontSize: "0.8rem",
    margin: "0.1rem",
    fontWeight: "500",
    color: "white"
  },

  row: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },

  col: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    flexWrap: "wrap",
  },

  createBtn: {
    paddingLeft: "1rem",
    padding: "0.5rem",
    paddingTop: "0.25rem",
    paddingBottom: "0.25rem",
  },

  createBtnPaper: {
    alignSelf: "flex-end",
    marginRight: "1rem",
  },

  divider: {
    height: "0.1px",
    width: "100%",
    margin: "0.5rem",
    marginTop: "1rem",
    backgroundColor: "#bdbdbd",
  },

  menuIcon: {
    height: "24px",
    width: "24px",
    color: "white",
    "& path": {
      fill: "rgba(255, 255, 255)",
    },
  },

  headerCont: {
    width: "100%",
    display: "flex",
    alignItems: "center",
  }
}));

function PostsCard() {
  const history = useHistory();
  const classes = useStyles();

  const dashboard = useSelector((state) => state.dashboard);

  const { postIds } = dashboard;

  const location = useLocation();
  const pathname = location["pathname"];
  const path = pathname + "/forum";
  // console.log("forum path", path);

  const { row, col } = classes;
  // console.log(pathname,' is the pathname')

  return (
    <Paper
      className={classes.root}
      onClick={() => {
        // var path = '/dashboard/posts';
        history.push(path);
      }}
    >
      <div className={row}>
        <div className={classes.headerCont}>
          <ForumIcon className={classes.menuIcon} />
          <Typography className={classes.titleText}>Forum</Typography>
        </div>
        {/* <Paper className={classes.createBtnPaper}>
          <ButtonBase
            className={classes.createBtn}
            onClick={() => {
              const path = "/dashboard/create/post/";
              history.push(path);
            }}
          >
            <Typography>Add</Typography>

            <AddIcon />
          </ButtonBase>
        </Paper> */}
      </div>

      {/* <span className={classes.divider}></span> */}

      <Typography className={classes.text}>
        Manage your forum activity. See all your posts and comments here.
      </Typography>

      {/* {postIds.length>0?<>
                {postIds.slice(0,2).map(postId=><PostCard postId={postId} min={true}/>)}
            </>:<>
                <Typography className={classes.titleText}>
                    You haven't posted a post on Marketplace
                </Typography>
                <CreateBtn  color="primary" onClick={()=>{
                            var path = '/dashboard/create/post/';
                            history.push(path);
                }}>
                    Post a Post
                </CreateBtn>
            </>
            } */}
    </Paper>
  );
}

export default PostsCard;
