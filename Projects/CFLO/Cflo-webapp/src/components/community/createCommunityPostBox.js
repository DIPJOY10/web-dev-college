import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import {
  InputBase,
  Paper,
  Button,
  Typography,
  TextField,
  Menu,
  MenuItem,
  ListItemIcon,
  Tooltip,
} from "@material-ui/core";

import moment from "moment";

import Avatar from "@material-ui/core/Avatar";
import PublicIcon from "@material-ui/icons/Public";
import PollIcon from "@material-ui/icons/Poll";
import EmojiEmotionsIcon from "@material-ui/icons/EmojiEmotions";
import ImageIcon from "@material-ui/icons/Image";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import IconButton from "@material-ui/core/IconButton";
import FilesViewer from "../file/Viewer/FilesViewer";
import CreateButton from "../styled/actionBtns/create.btn";
import LoadingButton from "../styled/actionBtns/loading.btn";
import MentionInput from "../styled/mention.input";
import ProfileAppbar from "../profile/profile.appbar";
import Api from "../../helpers/Api";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import useGetAdminProfiles from "../profile/useGetAdminProfiles";
import FileUploadButton from "../file/Uploader/FileUploadButton";
import EmojiPicker from "../dashboard/Post/EmojiPicker";
import PollInput from "../dashboard/Post/poll.input";

const lightgrey = "#f1f3f4";

const useStyles = makeStyles((theme) => ({
  root: {
    border: "1px solid rgba(175, 175, 175, 0.8)",
    // width: "75%",
    // margin: "0 auto",
    // marginBottom: "60px",
    backgroundColor: "white",
    padding: "10px 13px",
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
    // marginTop: "6rem",
  },

  avatar: {
    width: "40px",
    height: "40px",
    alignSelf: "center",
  },

  flexRow: {
    display: "flex",
    flexDirection: "row",
  },

  flexColumn: {
    display: "flex",
    flexDirection: "column",
  },

  topBox: {
    // display: "flex",
    // alignItems: "center",
    width: "100%",
  },

  createInput: {
    width: "100%",
    marginBottom: "1rem",
  },

  midBox: {
    color: theme.palette.primary.main,
    fontWeight: "500",
    marginTop: "15px",
    display: "flex",
    alignItems: "center",
  },

  bottomBox: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderTop: "1px solid rgb(209,209,209)",
    // paddingTop: "10px",
  },
  iconBox: {
    //
  },
  icon: {
    color: theme.palette.primary.main,
    width: "26px",
    height: "26px",
  },
  button: {
    height: "35px",
    borderRadius: "20px",
  },

  pollBox: {
    borderRight: `3px solid ${theme.palette.primary.main}`,
    borderLeft: `3px solid ${theme.palette.primary.main}`,
    // backgroundColor: "#f1f3f4",
    marginTop: "20px",
    padding: "0 10px",
    borderRadius: "3px",
  },

  pollHeader: {
    color: theme.palette.primary.main,
    margin: "10px 0",
    display: "flex",
    justifyContent: "space-between",
  },

  textField: {
    color: theme.palette.primary.main,
    margin: "10px 0 20px 0",
  },

  textFieldInput: {
    color: theme.palette.primary.main,
  },
}));

function getTomorrowDateTime() {
  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const date = moment(tomorrow).format("YYYY-MM-DDTkk:mm");
  // console.log("date", date);
  return date;
}

function UploadCommunityBoxMemo({ post: postReceived, community }) {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const location = useLocation();
  const params = useParams();
  const { auth, file, forum } = useSelector((state) => state);
  const { createdFileIds } = file;
  const { adminProfiles } = useGetAdminProfiles();
  const [post, setPost] = useState(postReceived);
  const [loading, setLoading] = useState(true);
  const [publishLoading, setPublishLoading] = useState(false);
  const [edited, setEdited] = useState(post?.edited || false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [oldFiles, setOldFiles] = useState(post?.files || []);
  const [focus, setFocus] = useState("");
  const [isEmoji, setIsEmoji] = useState(false);
  const [isPoll, setIsPoll] = useState(post?.poll ? true : false);
  const [pollOptions, setPollOptions] = useState(post?.poll?.options || [""]);
  const [pollExireAt, setPollExireAt] = useState(
    post?.poll?.expireAt || getTomorrowDateTime()
  );
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState("");
  // const titleRef = useRef(null);
  // const descriptionRef = useRef(null);
  useEffect(() => {
    // change admin profiles to number of users in the community. filter it out
    setSelectedProfile(adminProfiles[0]);
  }, [adminProfiles]);

  useEffect(() => {
    async function createPost() {
      const newPost = await Api.post("post/create", {
        profile: selectedProfile?.profile,
        user: selectedProfile?._id,
        channels: [community?.profile?._id],
      });

      dispatch({
        type: "AddDashboard",
        payload: {
          selectedPost: newPost,
        },
      });

      setPost(newPost);
      setLoading(false);
    }

    if (!post || !post?._id) createPost();
    else {
      dispatch({
        type: "AddDashboard",
        payload: {
          selectedPost: post,
        },
      });
      setEdited(true);
      setLoading(false);
    }
  }, []);

  async function publish() {
    // console.log("published called");
    // console.log(post);
    // return;
    if (!community?.profile?._id) throw new Error("Community Not Selected");
    if (post && post._id && title.length > 3) {
      setPublishLoading(true);
      let postBody = {
        _id: post?._id,
        title,
        description,
        published: true,
        edited,
        profile: selectedProfile?.profile,
        files: [
          ...oldFiles,
          ...(Array.isArray(createdFileIds) ? createdFileIds : []),
        ],
        channels: [community?.profile?._id],
      };

      if (isPoll) {
        if (post?.poll) {
          postBody.poll = post.poll;
        } else {
          postBody.poll = {};
        }

        postBody.poll.options = pollOptions;
        postBody.poll.expireAt = pollExireAt;
        postBody.poll.user = selectedProfile;
        postBody.poll.profile = selectedProfile?.profile;
        postBody.poll.parent = post?._id;
        postBody.poll.parentModelName = "Post";
      }
      const updatedPost = await Api.post("post/update", postBody);
      //   console.log("upadatedPost", updatedPost);
      console.log("forumPost", updatedPost, postBody);
      setPost(updatedPost);
      setPublishLoading(false);

      history.goBack();
    }
  }

  function handleChange(event) {
    setDescription(event.target.value);
  }

  const styleBody = {
    root: {
      width: "100%",
      // width: "calc(100% - 100px)",
      borderRadius: "4px",
      padding: "10px 5px",
      // backgroundColor: "#f1f3f4",
      border: "1px solid lightgrey",
    },
    mentionBox: {
      // width: "calc(100% - 100px)",
      margin: "0 auto",
    },
    control: {
      width: "100%",
      height: "80px",
    },
    input: {
      width: "100%",
      padding: "0px",
      border: "1px solid black",
      // minHeight: "50px",
    },
  };
  const handleMenuOpen = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };
  const handleMenuClick = (obj) => {
    setSelectedProfile({ ...obj });
    handleMenuClose();
  };

  return (
    <>
      <Paper
        // onClick={() => {
        //   history.push("/dashboard/create/post");
        // }}
        className={classes.root}
      >
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleMenuClose}
        >
          {adminProfiles
            ? adminProfiles.map((obj, idx) => (
                <MenuItem key={idx} onClick={() => handleMenuClick(obj)}>
                  <ListItemIcon>
                    <Avatar
                      imgProps={{
                        referrerPolicy: "no-referrer",
                      }}
                      className={classes.avatar}
                      src={obj?.displayPicture?.thumbUrl}
                    />
                  </ListItemIcon>
                  <Typography variant="body1">{obj?.displayName}</Typography>
                </MenuItem>
              ))
            : null}
        </Menu>
        <div>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              marginBottom: "1rem",
              alignItems: "center",
            }}
          >
            <Avatar
              imgProps={{
                referrerPolicy: "no-referrer",
              }}
              className={classes.avatar}
              src={selectedProfile?.displayPicture?.thumbUrl}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.3rem",
              }}
            >
              <Typography
                variant="body1"
                component="div"
                style={{
                  color: "#000",
                  fontSize: "1.2rem",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={handleMenuOpen}
              >
                {selectedProfile?.displayName} {<ExpandMoreIcon />}
              </Typography>
            </div>
          </div>
          <div>
            <div className={classes.topBox}>
              <TextField
                variant="outlined"
                value={title}
                onChange={(el) => {
                  setTitle(el.target.value);
                }}
                label="Title"
                placeholder={"Enter a Title"}
                onClick={() => {
                  setFocus("title");
                }}
                className={classes.createInput}
              />
              <MentionInput
                value={description}
                setValue={setDescription}
                onChange={handleChange}
                placeholder={"Give a Description"}
                buttonBox={false}
                styleBody={styleBody}
                onClick={() => {
                  setFocus("description");
                }}
                // inputRef={descriptionRef}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                margin: "1.3rem 0",
                border: "1px solid #d1d0d0",
                borderRadius: "11px",
                alignItems: "center",
                padding: "0 1rem",
              }}
            >
              <Typography variant="h6">Add to your Post</Typography>

              <div className={classes.iconBox}>
                <Tooltip title="Poll">
                  <IconButton
                    aria-label="poll"
                    onClick={() => setIsPoll((prev) => !prev)}
                  >
                    <PollIcon
                      className={classes.icon}
                      style={{ color: "#15a0f9" }}
                    />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Emoji">
                  <IconButton
                    aria-label="emoji"
                    onClick={() => setIsEmoji((prev) => !prev)}
                  >
                    <EmojiEmotionsIcon
                      className={classes.icon}
                      style={{ color: "#45bd62" }}
                    />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Upload File">
                  <FileUploadButton
                    parentType="Message"
                    used={false}
                    parentId={null}
                  />
                </Tooltip>
              </div>
            </div>
            <div>
              <div
                style={{
                  display: isEmoji ? "block" : "none",
                }}
              >
                <EmojiPicker
                  setTitle={setTitle}
                  setDescription={setDescription}
                  focus={focus}
                />
              </div>
              <FilesViewer fileIds={[...oldFiles, ...createdFileIds]} />
            </div>
            {/************** Poll Box *****************/}
            {/* below box opens when poll button is clicked */}
            <div
              className={classes.pollBox}
              style={{ display: isPoll ? "block" : "none" }}
            >
              <div className={classes.pollHeader}>
                <Typography variant="h5" className={classes.pollHeading}>
                  Poll
                </Typography>
              </div>
              {pollOptions.map((el, idx) => (
                <PollInput
                  pollOptions={pollOptions}
                  idx={idx}
                  last={idx == pollOptions.length - 1}
                  setPollOptions={setPollOptions}
                  setIsPoll={setIsPoll}
                />
              ))}
              <TextField
                id="poll-expiry"
                label="Expire On"
                type="datetime-local"
                color="primary"
                defaultValue={getTomorrowDateTime()}
                value={pollExireAt}
                onChange={(event) => setPollExireAt(event.target.value)}
                className={classes.textField}
                InputLabelProps={{
                  shrink: true,
                  className: classes.textFieldInput,
                }}
              />
            </div>

            <div>
              <div>
                <LoadingButton
                  loading={publishLoading}
                  color="primary"
                  onClick={() => publish()}
                  text="Post"
                  variant="contained"
                  style={{ width: "100%" }}
                ></LoadingButton>
              </div>
            </div>
          </div>
        </div>
      </Paper>
    </>
  );
}
const UploadCommunityBox = React.memo(UploadCommunityBoxMemo);
export default UploadCommunityBox;
