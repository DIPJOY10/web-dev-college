import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import CircularProgress from "@material-ui/core/CircularProgress";
import DialogContent from "@material-ui/core/DialogContent";
import IconButton from "@material-ui/core/IconButton";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import CloseIcon from "@material-ui/icons/Close";
import Api from "../../../helpers/Api";
import LikeCard from "./LikeCard";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  headerBox: {
    minWidth: "400px",
    borderBottom: "1px solid lightgray",
    display: "flex",
    alignItems: "center",
    padding: "20px",
    justifyContent: "space-between",
  },
  titleBox: {
    display: "flex",
    alignItems: "center",
  },
  likeIcon: {
    padding: "3px",
    backgroundColor: theme.palette.primary.main,
    fontSize: "2rem",
    borderRadius: "50%",
    color: "white",
    marginRight: "10px",
  },
  iconButton: {
    padding: "3px",
  },
  closeIcon: {
    fontSize: "1.8rem",
  },
  progressBox: {
    padding: "20px 0",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}));

function LikeDialogBox({ postId, open, setOpen }) {
  const classes = useStyles();
  const [likeUsers, setLikeUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  async function getLikes() {
    const res = await Api.post("/like/getPostLikes", { parent: postId });
    setLikeUsers(res?.data || []);
    setLoading(false);
  }
  useEffect(() => {
    getLikes();
  }, []);

  function handleClose() {
    setOpen(false);
  }
  return (
    <Dialog className={classes.root} open={open} onClose={handleClose}>
      <div className={classes.headerBox}>
        <Typography variant="h6" className={classes.titleBox}>
          <ThumbUpAltIcon className={classes.likeIcon} /> <p>Likes</p>
        </Typography>
        <IconButton
          className={classes.iconButton}
          onClick={() => setOpen(false)}
        >
          <CloseIcon className={classes.closeIcon} />
        </IconButton>
      </div>
      <DialogContent>
        {!loading ? (
          likeUsers.map((el) => (
            <LikeCard key={el?.profile?.parent?._id} likeUser={el?.profile} />
          ))
        ) : (
          <div className={classes.progressBox}>
            <CircularProgress />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default LikeDialogBox;
