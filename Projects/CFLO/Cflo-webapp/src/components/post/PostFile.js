import React, { useState, useEffect, useRef, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Link, useHistory, useLocation } from "react-router-dom";
import { format } from "timeago.js";
import ReactHtmlParser from "react-html-parser";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import ButtonBase from "@material-ui/core/ButtonBase";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import ThumbUpAltOutlinedIcon from "@material-ui/icons/ThumbUpAltOutlined";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import MessageIcon from "@material-ui/icons/Message";
import TelegramIcon from "@material-ui/icons/Telegram";
import BookmarkBorderIcon from "@material-ui/icons/BookmarkBorder";
import BookmarkIcon from "@material-ui/icons/Bookmark";
import Api from "../../helpers/Api";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import CardHeader from "@material-ui/core/CardHeader";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Linkify from 'react-linkify';
import FilesViewer from "../file/Viewer/FilesViewer";
import FilesObjectViewer from "../file/Viewer/FilesObjectViewer";
import SmartCommentList from "../comment/smart.comment.list";
import LikeDialogBox from "./LikeDialogBox/LikeDialogBox";
import socket from "../../helpers/socket/socketio";
import useGetAdminProfiles from "../profile/useGetAdminProfiles";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import cx from "clsx";
import { CircularProgress, Divider, useMediaQuery } from "@material-ui/core";
import PostShareDialog from "../ProjectAnalysis/PostShareDialog";
import configObject from "../../config";
import AllFileViewerFeed from "../styled/CommonComponents/AllFiles.Viewer.Feed";
// import baseStyle from "./styled/base/index";

const useStyles = makeStyles((theme) => ({
  media: {
    minHeight: 250,
    backgroundSize: "contain",
  },
  progressBox: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "10rem"
  },
  root: {
    border: "1.5px solid rgba(0, 0, 0, 0.12)",
    marginBottom: "0.8rem",
    borderRadius: "7px",
    boxShadow: "none",
    overflow: "hidden",
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  avatar: {
    width: "45px",
    height: "45px",
    marginTop: "6px",
    cursor: "pointer",
    border: "3px solid",
    borderColor: theme.palette.background.highlight
  },
  displayName: {
    fontSize: "14px",
    fontWeight: "500",
    lineHeight: 1,
    cursor: "pointer",
    "&:hover": {
      color: theme.palette.primary.main,
      textDecoration: "underline"
    }
  },
  time: {
    fontSize: "12px",
    color: "#00000099",
    display: "flex",
    alignItems: "center"
  },
  title: {
    fontSize: "16px",
    fontWeight: "500"
  },
  // desciption: { fontSize: "14px" },
  description: {
    color: "#7f7f7f",
    "& a": {
      textDecoration: "none"
    }
  },
  headerDetails: {
    marginLeft: "10px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  headerBox: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: "0.5rem"
  },
  headerLeftBox: {
    display: "flex",
    padding: "10px 16px",
    paddingBottom: "8px",
    alignItems: "center",
  },
  headerRightBox: {
    padding: "10px 15px",
  },
  infoBox: {
    paddingTop: "0",
    paddingBottom: "10px",
    // borderBottom: "1px solid lightgray",
  },
  imageBox: {
    borderTop: (props) => (props?.isImage ? "1px solid lightgray" : ""),
    borderBottom: (props) => (props?.isImage ? "1px solid lightgray" : ""),
  },
  likeOuterBox: {
    display: "flex",
    flexDirection: "column",
  },
  likeBox: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 15px",
    width: "100%",
  },
  commentCount: {
    cursor: "pointer"
  },
  likeCountBox: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 16px",
    width: "100%",
    borderTop: (props) =>
      props?.isPoll || (!props?.isPoll && !props?.isImage)
        ? "1px solid lightgray"
        : "",
  },
  likeCountELements: {
    display: "flex",
    alignItems: "center",
  },
  likeCount: {
    cursor: "pointer",
  },
  icons: {
    fontSize: "30px",
    marginRight: "5px",
  },
  iconButton: {
    // padding: "0",
    textTransform: "capitalize",
  },
  iconBox: {
    width: "30%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
  },
  likeAvatarBox: {
    width: "10%",
  },
  likeAvatar: {
    width: "23px",
    height: "23px",
  },
  coloredIcon: {
    color: theme.palette.primary.main,
  },
  smallIcon: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    fontSize: "15px",
    borderRadius: "50%",
  },

  border: {
    height: "1px",
    backgroundColor: "lightgray",
    width: "95%",
    margin: "0 auto",
  },

  pollContainer: {
    margin: "20px 0",
    padding: "0 16px",
  },

  pollBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    // borderRight: `3px solid ${theme.palette.primary.main}`,
    // borderLeft: `3px solid ${theme.palette.primary.main}`,
    padding: "0 10px",
    paddingBottom: "10px",
    // borderRadius: "4px",
    border: "1px solid rgba(0, 0, 0, 0.08)",
    borderRadius: "7px",
  },

  pollHeader: {
    width: "100%",
    margin: "10px 0",
  },

  pollHeading: {
    color: "#111",
    textAlign: "left",
    fontWeight: "500",
    fontSize: "16px"
    // paddingLeft: "10px",
  },

  pollOption: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    padding: "10px 15px",
    border: "2px solid",
    borderColor: theme.palette.primary.main,
    borderRadius: "5px",
    margin: "5px",
    cursor: "pointer",
  },
  pollInfo: {
    display: "flex",
    // justifyContent: "space-between",
    width: "100%",
  },
  pollText: {
    color: theme.palette.primary.main,
    fontWeight: "500"
  },
  link: {
    textDecoration: "none",
    color: "inherit",
  },
}));

function PostFileMemo({
  post: postReceived,
  setPostDict = () => { },
  match,
  commentLimit = -1,
  isLiked: isLikedReceived,
  isSaved: isSavedReceived,
  likeCount: likeCountReceived,
  commentCount: commentCountReceived,
  addLink,
  sentProfile,
  topText,
  guestView
}) {
  const theme = useTheme();
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const { postDictionary } = useSelector((state) => state.dashboard);
  const { auth, forum } = useSelector((state) => state);
  const { user: userAuth } = auth;
  const user = sentProfile || userAuth;
  const profile = user?.profile;
  const { joinedCommunitiesPostsDict } = auth;
  const { adminProfileIds } = useGetAdminProfiles();
  // console.log("postAdmins", adminProfileIds);

  const [post, setPost] = useState(postReceived || location?.state?.post);
  const [isLiked, setIsLiked] = useState(
    isLikedReceived || post?.isLiked || false
  );
  const [isSaved, setIsSaved] = useState(
    isSavedReceived || post?.isSaved || false
  );
  const [likeCount, setLikeCount] = useState(
    likeCountReceived || post?.likeCount || 0
  );
  const [commentCount, setCommentCount] = useState(
    commentCountReceived || post?.commentCount || 0
  );
  const [likeLoading, setLikeLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [openComment, setOpenComment] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [likeList, setLikeList] = useState([]);
  const [postLink, setPostLink] = useState(false);
  const [poll, setPoll] = useState(post?.poll);
  const [isPoll, setIsPoll] = useState(poll ? true : false);
  const [pollOptions, setPollOptions] = useState(poll?.options || []);
  const [pollOptionsVotePercentage, setPollOptionsVotePercentage] = useState(
    []
  );
  const buttonMatches = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const [pollVotesCount, setPollVotesCount] = useState(0);
  const [pollVotes, setPollVotes] = useState(poll?.votes || {});
  const [canDelete, setCanDelete] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const files = post?.files;
  const postUserId = post?.user?._id || post?.user;
  const classes = useStyles({
    isPoll,
    isImage: files && Array.isArray(files) && files.length > 0,
  });

  const anchorRef = useRef(null);
  const handleCloseDialog = () => {
    setIsOpen(false)
  }
  const handleToggle = () => {
    setOpenDropdown((prevOpen) => !prevOpen);
  };
  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpenDropdown(false);
  };

  function handleDelete(event) {
    handleClose(event);
    const postId = post?._id;
    if (!postId) return;
    Api.post("post/delete", {
      postId,
    }).then(() => {
      setPostDict((prev) => {
        const newDict = { ...prev };
        newDict[postId] = undefined;
        return newDict;
      });
      const newPostDict = { ...postDictionary };
      newPostDict[postId] = undefined;
      dispatch({
        type: "AddDashboard",
        payload: {
          postDictionary: newPostDict,
        },
      });

      const newJoinedCommunityPostDict = {
        ...joinedCommunitiesPostsDict,
      };
      newJoinedCommunityPostDict[postId] = undefined;
      dispatch({
        type: "AddForum",
        payload: {
          joinedCommunitiesPostsDict: newJoinedCommunityPostDict,
        },
      });
      console.log("delete succeed");
      history.push("/");
    });
  }

  async function createLike() {
    setLikeLoading(true);

    let isLikedLocal;
    setIsLiked((prev) => {
      if (prev) {
        isLikedLocal = false;
        setLikeCount((prev) => prev - 1);
      } else {
        isLikedLocal = true;
        setLikeCount((prev) => prev + 1);
      }
      return !prev;
    });
    const like = await Api.post("like/like", {
      parent: post?._id,
      parentModelName: "Post",
      user,
      profile: profile,
    });
    console.log("like: ", like);
    if (like.data) {
      setIsLiked(true);
      // if (!isLikedLocal) setLikeCount((prev) => prev + 2); //if we does dislike, but it was a like
    } else {
      setIsLiked(false);
      // if (isLikedLocal) setLikeCount((prev) => prev - 2); //if we does like, but it was an dislikes
    }
    setLikeLoading(false);
  }

  async function createSave() {
    setIsSaved((prev) => !prev);
    const save = await Api.post("save/create", {
      parent: post?._id,
      parentModelName: "Post",
      user,
      profile: profile,
    });
    if (save.save) {
      setIsSaved(true);
    } else {
      setIsSaved(false);
    }
  }
  // console.log({ post, match });'

  async function voteForPoll(idx) {
    if (!isPoll) return;
    if (poll?.expireAt && new Date(poll?.expireAt) < Date.now()) return;
    const pollId = poll?._id;
    const pollRes = await Api.post("/poll/vote", {
      pollId,
      option: `${idx}`,
      profile,
    });
    setPoll(pollRes.poll);
  }

  useEffect(() => {
    async function getPost() {
      // console.log({ match });
      const id = match?.params?.id;
      setPostLink(id ? true : false);
      if (!post && id) {
        const res = await Api.post("post/get", {
          _id: id,
          userProfile: profile,
        });
        setPost(res);
        setPoll(res?.poll);
        setIsLiked(res?.isLiked || false);
        setLikeCount(res?.likeCount || 0);
      }
    }

    getPost();
  }, []);

  useEffect(() => {
    setPost(postReceived || location?.state?.post);
  }, [postReceived || location?.state?.post]);

  useEffect(() => {
    function calcPollPercentage() {
      if (!isPoll) return;
      const pollPercent = [...pollOptions];
      const votes = [...pollOptions];
      votes.fill(0);
      pollPercent.fill(0);

      for (let [key, value] of Object.entries(pollVotes)) {
        votes[value * 1]++;
      }

      const totalVotes = votes.reduce(
        (previousValue, currentValue) => previousValue + currentValue,
        0
      );

      //parseFloat(Number.parseFloat(x).toFixed(2));
      if (totalVotes > 0)
        votes.forEach((el, idx) => {
          pollPercent[idx] = parseFloat(
            Number.parseFloat((el / totalVotes) * 100).toFixed(2)
          );
        });

      setPollVotesCount(totalVotes);
      setPollOptionsVotePercentage(pollPercent);
    }

    calcPollPercentage();
  }, [pollOptions, pollVotes]);

  useEffect(() => {
    setIsPoll(poll ? true : false);
    setPollOptions(poll?.options || []);
    setPollVotes(poll?.votes || {});
  }, [poll]);

  useEffect(() => {
    setIsPoll(post?.poll ? true : false);
    setPoll(post?.poll);
    setIsSaved(post?.isSaved || false);
    setIsLiked(post?.isLiked || false);
    setLikeCount(post?.likeCount || 0);
    setCommentCount(post?.commentCount || 0);
  }, [post]);

  useEffect(() => {
    const canDeleteTemp =
      adminProfileIds.some((el) => el === post?.profile?._id) ||
      post?.profile?._id === profile ||
      postUserId === user?._id;

    setCanDelete(canDeleteTemp);
    // console.log(
    // 	"canDelete",
    // 	profile,
    // 	post?.profile?._id,
    // 	postUserId,
    // 	post?.user?._id,
    // 	user?._id,
    // 	post
    // );
  }, [
    adminProfileIds?.length,
    post?.profile?._id,
    postUserId,
    profile,
    user?._id,
  ]);
  // console.log("files = ", files);
  // console.log("post = ", post);
  return (
    <>
      <Paper className={classes.root}>
        {post ? (
          <>
            {/********** Likes List Box ***************/}
            <LikeDialogBox postId={post._id} open={open} setOpen={setOpen} />
            <div
              onClick={() => {
                if (addLink) {
                  history.push(`/explore/forum/post/${post._id}`);
                }
              }}
              style={addLink ? { cursor: "pointer" } : {}}
            >
              {topText ? topText : null}
              {/******************* Header Box ********************/}
              <div className={classes.headerBox}>
                <div className={classes.headerLeftBox}>
                  <Avatar
                    imgProps={{
                      referrerPolicy: "no-referrer",
                    }}
                    aria-label="recipe"
                    className={classes.avatar}
                    src={post?.profile?.parent?.displayPicture?.url}
                    onClick={() => {
                      history.push(`/profile/view/${post?.profile?._id}`);
                    }}
                  ></Avatar>
                  <div className={classes.headerDetails}>
                    <Typography variant="h6"
                      className={classes.displayName}
                      onClick={() => {
                        history.push(`/profile/view/${post?.profile?._id}`);
                      }}
                    >
                      {post?.profile?.parent?.displayName}
                    </Typography>
                    <Typography variant="subtitle1" className={classes.time}>
                      {format(post?.createdAt)}{" • "}<AccountCircleIcon
                        onClick={() => {
                          history.push(`/profile/view/${post?.profile?._id}`);
                        }} style={{ fontSize: 18, cursor: "pointer", marginLeft: "2px" }} />
                    </Typography>
                  </div>
                </div>
                <div className={classes.headerRightBox}>
                  {canDelete ? (
                    <>
                      <IconButton
                        ref={anchorRef}
                        aria-controls={
                          openDropdown ? "menu-list-grow" : undefined
                        }
                        aria-haspopup="true"
                        onClick={handleToggle}
                        className={classes.menuButton}
                      >
                        <MoreVertIcon />
                      </IconButton>
                      <Popper
                        open={openDropdown}
                        anchorEl={anchorRef.current}
                        role={undefined}
                        transition
                        disablePortal
                      >
                        {({ TransitionProps, placement }) => (
                          <Grow
                            {...TransitionProps}
                            style={{
                              transformOrigin:
                                placement === "bottom"
                                  ? "center top"
                                  : "center bottom",
                            }}
                          >
                            <Paper>
                              <ClickAwayListener onClickAway={handleClose}>
                                <MenuList
                                  autoFocusItem={openDropdown}
                                  id="menu-list-grow"
                                  // onKeyDown={handleListKeyDown}
                                  className={classes.menuList}
                                >
                                  {/* <MenuItem
                                className={classes.menuItem}
                                onClick={handleEdit}
                              >
                                Edit
                              </MenuItem> */}
                                  <MenuItem
                                    className={classes.menuItem}
                                    onClick={handleDelete}
                                  >
                                    Delete
                                  </MenuItem>
                                </MenuList>
                              </ClickAwayListener>
                            </Paper>
                          </Grow>
                        )}
                      </Popper>
                    </>
                  ) : (
                    <div />
                  )}
                </div>
              </div>
              <CardContent className={classes.infoBox}>
                {/******************* Title Box ********************/}

                <Typography variant="h5" component="h2" className={classes.title}>
                  {post?.title}
                </Typography>
                {/******************* Description Box ********************/}
                <Typography
                  variant="body2"
                  component="p"
                  className={classes.description}
                >
                  <Linkify
                    componentDecorator={(decoratedHref, decoratedText, key) => (
                      <a target="blank" href={decoratedHref} key={key}>
                        {decoratedText}
                      </a>
                    )}
                  >
                    {ReactHtmlParser(post?.description)}
                  </Linkify>
                </Typography>
              </CardContent>

              {/************ Image Box **********/}
              <AllFileViewerFeed
                picVideoViewerHeight={"400px"}
                picVideoViewerHeightSmall={"300px"}
                picVideoViewerWidth={"100%"}
                files={files ? files : []}
              />
              {/* <div className={classes.imageBox}>
                <FilesObjectViewer
                  files={files ? files : []}
                  styleBody={{
                    width: "100%",
                    height: "400px",
                    margin: "0",
                    borderRadius: "0",
                    // border: "1px solid lightgrey",
                    padding: "0",
                  }}
                  isGallery={true}
                />
              </div> */}

              {/************** Poll Box *************/}
              {isPoll ? (
                <div className={classes.pollContainer}>
                  <div className={classes.pollBox}>
                    <div className={classes.pollHeader}>
                      <Typography variant="h5" className={classes.pollHeading}>
                        Poll
                      </Typography>
                    </div>
                    {pollOptions.map((el, idx) => (
                      <div
                        key={`${idx}-${el}`}
                        style={{
                          background: `linear-gradient(to right, ${pollVotes[profile] * 1 === idx
                            ? "rgb(113,201,248)"
                            : "#dadada"
                            } 0 ${pollOptionsVotePercentage[idx]}%, white ${pollOptionsVotePercentage[idx]
                            }% 100%)`,
                        }}
                        className={classes.pollOption}
                        onClick={() => voteForPoll(idx)}
                      >
                        <Typography
                          style={{
                            cursor: "pointer",
                            fontWeight:
                              pollVotes[profile] * 1 === idx ? "600" : "auto",
                          }}
                        >
                          {el}
                        </Typography>
                        <Typography
                          style={{
                            cursor: "pointer",
                            fontWeight:
                              pollVotes[profile] * 1 === idx ? "600" : "auto",
                          }}
                        >
                          {pollOptionsVotePercentage[idx]}%
                        </Typography>
                      </div>
                    ))}
                    <div className={classes.pollInfo}>
                      <Typography variant="caption" display="block">
                        {`${pollVotesCount.toLocaleString()} Votes`}
                      </Typography>
                      <Typography
                        variant="caption"
                        display="block"
                        style={{ margin: "0 3px" }}
                      >
                        |
                      </Typography>
                      <Typography variant="caption" display="block">
                        {poll?.expireAt && new Date(poll?.expireAt) > Date.now()
                          ? `${format(poll?.expireAt)} Left`
                          : "Poll Ended"}
                      </Typography>
                    </div>
                  </div>
                </div>
              ) : (
                <div />
              )}
            </div>

            {/************** Like Count Box ****************/}
            <div className={classes.likeOuterBox}>
              {buttonMatches ? null : (
                <>
                  <div className={classes.likeCountBox}>
                    <div
                      className={cx(classes.likeCount, classes.likeCountELements)}
                      onClick={() => setOpen(true)}
                    >
                      <ThumbUpAltIcon
                        className={cx(classes.icons, classes.smallIcon)}
                      />
                      <Typography variant="caption">
                        {likeCount || "0"} Likes
                      </Typography>
                    </div>
                    <div
                      className={cx(
                        classes.commentCount,
                        classes.likeCountELements
                      )}
                    >
                      <Typography variant="caption">
                        {commentCount || "0"} Comments
                      </Typography>
                    </div>
                  </div>
                </>
              )}
              <Divider
                style={{
                  width: "100%",
                }}
              />
              {/*********** Like function Box ************/}
              <div className={classes.likeBox}>
                <div
                  className={classes.iconBox}
                  onClick={!likeLoading ? createLike : () => { }}
                >
                  <Button
                    className={classes.iconButton}
                    aria-label="like"
                    startIcon={
                      !isLiked ? (
                        <ThumbUpAltOutlinedIcon className={classes.icons} />
                      ) : (
                        <ThumbUpAltIcon
                          className={cx(classes.icons, classes.coloredIcon)}
                        />
                      )
                    }
                  >
                    <Typography variant="caption">
                      {buttonMatches
                        ? likeCount || "0"
                        : isLiked
                          ? "Liked"
                          : "Like"}
                    </Typography>
                  </Button>
                </div>
                <div className={classes.iconBox}>
                  <IconButton className={classes.iconButton} aria-label="delete">
                    <MessageIcon className={classes.icons} />
                    <Typography variant="caption">
                      {buttonMatches ? commentCount || "0" : "Comment"}
                    </Typography>
                  </IconButton>
                </div>
                <div className={classes.iconBox}>
                  <Button
                    className={cx(classes.iconButton, classes.description)}
                    aria-label="share"
                    startIcon={<TelegramIcon />}
                    onClick={() => setIsOpen(true)}
                  >
                    {buttonMatches
                      ? "0" // add share count here
                      : "Share"}
                  </Button>

                </div>
                <div className={cx(classes.iconBox, classes.likeAvatarBox)}>
                  <IconButton
                    onClick={createSave}
                    className={classes.iconButton}
                    aria-label="like"
                    style={buttonMatches ? { display: "none" } : {}}
                  // add save button in menu in smaller screens
                  >
                    {!isSaved ? (
                      <BookmarkBorderIcon className={classes.icons} />
                    ) : (
                      <BookmarkIcon
                        className={cx(classes.icons, classes.coloredIcon)}
                      />
                    )}
                  </IconButton>
                </div>
                <div className={cx(classes.iconBox, classes.likeAvatarBox)}>
                  <Avatar
                    imgProps={{
                      referrerPolicy: "no-referrer",
                    }}
                    src={user?.displayPicture?.thumbUrl}
                    className={classes.likeAvatar}
                  />
                </div>
              </div>
            </div>

            {/**************** Comments ******************/}
            {/* <Divider
            style={{
              margin: "-3px 0 10px",
              width: "100%",
            }}
          /> */}
            {openComment && (<SmartCommentList
              limit={commentLimit}
              parent={post?._id}
              sentProfile={user}
              guestView={guestView}
              parentModelName="Post"
              styleBody={{
                marginTop: "0",
              }}
            />)}
          </>
        ) : (
          <div className={classes.progressBox}>
            <CircularProgress />
          </div>
        )
        }
      </Paper>
      <PostShareDialog isOpen={isOpen} handleClose={handleCloseDialog} shareLink={`${configObject.BASE_URL}explore/forum/post/${post?._id}`} />
    </>
  );
}

const PostFile = React.memo(PostFileMemo);
export default PostFile;
