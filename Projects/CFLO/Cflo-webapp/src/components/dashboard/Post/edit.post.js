// import React, { useState, useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { makeStyles } from "@material-ui/core/styles";
// import { useHistory, useLocation } from "react-router-dom";
// import { useDebounce } from "react-use";

// import Paper from "@material-ui/core/Paper";
// import Button from "@material-ui/core/Button";
// import Avatar from "@material-ui/core/Avatar";

// import Typography from "@material-ui/core/Typography";
// import Api from "../../../helpers/Api";

// import TitleInput from "../../styled/title.input";
// import DescriptionInput from "../../styled/description.input";
// import FileUploadButton from "../../file/Uploader/FileUploadButton";
// import FilesViewer from "../../file/Viewer/FilesViewer";
// import CreateBtn from "../../styled/actionBtns/create.btn";
// import ProfileAppbar from "../../profile/profile.appbar";

// import { setPosts } from "./post.utils";
// import { setPosts as setPostFeed } from "../../explore/feed.utils";

// const useStyles = makeStyles((theme) => ({
//   root: {
//     flex: 1,
//     display: "flex",
//     flexDirection: "column",
//     marginBottom: "6rem",
//     marginTop: "6rem",
//     marginLeft: "4rem",
//     marginRight: "4rem",
//     [theme.breakpoints.down("sm")]: {
//       marginLeft: "1rem",
//       marginRight: "1rem",
//     },
//   },

//   row: {
//     flex: 1,
//     display: "flex",
//     flexDirection: "row",
//     alignItems: "center",
//   },

//   col: {
//     flex: 1,
//     display: "flex",
//     flexDirection: "column",
//   },

//   submitBtn: {
//     marginTop: "2rem",
//     marginLeft: "10rem",
//     maxWidth: "8rem",
//     padding: "0.4rem",
//     [theme.breakpoints.down("sm")]: {
//       marginLeft: "4rem",
//       marginRight: "1rem",
//     },
//   },

//   submitText: {
//     color: "white",
//   },
// }));

// export default function S({ match }) {
//   const classes = useStyles();
//   const history = useHistory();
//   const dispatch = useDispatch();
//   const location = useLocation();
//   console.log(location);

//   const { auth, file, dashboard, explore } = useSelector((state) => state);

//   const { user, userProfile } = auth;
//   const { createdFileIds } = file;

//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [oldFiles, setOldFiles] = useState([]);
//   const [oldPublished, setOldPublished] = useState(false);
//   const [oldDescription, setOldDescription] = useState("");
//   const [oldTitle, setOldTitle] = useState("");
//   const [stateUpdate, setStateUpdated] = useState(false);

//   const { root, row, col } = classes;
//   const profileId = user?.profile;
//   const postId = match?.params?.postId;
//   // console.log({ postId });

//   // useEffect(() => {

//   //     dispatch({
//   //         type:'AddDashboard',
//   //         payload:{
//   //             postDictionary:{},
//   //             postIds:[]
//   //         }
//   //     })

//   //     dispatch({
//   //         type:'AddFeed',
//   //         payload:{
//   //             postDictionary:{},
//   //             postIds:[]
//   //         }
//   //     })

//   // }, [])
//   useEffect(() => {
//     async function getPost() {
//       const res = await Api.post("post/get", {
//         _id: postId,
//       });
//       console.log(res);
//       setTitle(res?.title || "");
//       setDescription(res?.description || "");
//       setOldFiles(res?.files || []);
//       setOldPublished(res?.published || false);
//       setOldDescription(res?.description || "");
//       setOldTitle(res?.title || "");
//       setStateUpdated(true);
//     }

//     getPost();
//   }, []);

//   async function createPost(published = false) {
//     try {
//       const reqObj = {
//         title,
//         description,
//         files: [...oldFiles, ...createdFileIds],
//         _id: postId,
//         published: published || oldPublished,
//         edited:
//           oldPublished &&
//           (title !== oldTitle ||
//             description !== oldDescription ||
//             oldFiles !== [...oldFiles, ...(createdFileIds || [])]),
//       };
//       const res = await Api.post("post/update", reqObj);
//       console.log("edit post", { reqObj, res });
//     } catch (error) {
//       if (error.response) {
//         console.log(error);
//       } else if (error.request) {
//         console.log(error);
//       } else {
//         console.log(error);
//       }
//     }
//   }

//   useEffect(() => {
//     if (stateUpdate) createPost();
//   }, [createdFileIds]);

//   useDebounce(
//     () => {
//       if (stateUpdate) createPost();
//     },
//     500,
//     [title, description]
//   );

//   function publish() {
//     createPost(true);
//   }

//   const disabled = title.length < 3 || loading;

//   return (
//     <div className={root}>
//       <ProfileAppbar
//         name={"Post"}
//         btns={
//           <>
//             <Button
//               variant="contained"
//               color="primary"
//               component="span"
//               onClick={() => publish()}
//             >
//               Publish
//             </Button>
//           </>
//         }
//       />
//       <TitleInput
//         title={title}
//         placeholder={"Post Title"}
//         setTitle={setTitle}
//       />

//       <DescriptionInput
//         description={description}
//         placeholder={"Post Description(Optional)"}
//         setDescription={setDescription}
//       />

//       <div className={row}>
//         <FileUploadButton parentType="Message" used={false} parentId={null} />
//         <Typography variant="button">Add Files</Typography>
//       </div>

//       <FilesViewer fileIds={[...oldFiles, ...createdFileIds]} />
//     </div>
//   );
// }

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { InputBase, Paper, Button } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";

import CreateButton from "../styled/actionBtns/create.btn";

const useStyles = makeStyles((theme) => ({
  root: {
    border: "1px solid rgba(175, 175, 175, 0.8)",
    width: "75%",
    margin: "0 auto",
    marginBottom: "60px",
    backgroundColor: "white",
    padding: "20px 15px",
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
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
    display: "flex",
    alignItems: "center",
    width: "100%",
  },

  createInput: {
    flexGrow: "1",
    // marginLeft: "10px",
    backgroundColor: "#f1f3f4",
    borderRadius: "4px",
    padding: "15px 5px",
    border: "1px solid lightgrey",
  },

  midBox: {
    color: theme.palette.primary.main,
    fontWeight: "500",
    marginTop: "15px",
    display: "flex",
    alignItems: "center",
  },

  bottomBox: {
    marginTop: "10px",
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
    marginRight: "10px",
  },
  button: {
    height: "35px",
  },
}));

function UploadPostBox() {
  const classes = useStyles();
  const history = useHistory();
  const { auth } = useSelector((state) => state);
  const { user } = auth;
  const profile = user?.profile;
  console.log("post user", { user });
  const [text, setText] = useState("");

  function handleChange(event) {
    setText(event.target.value);
  }
  return (
    <Paper
      onClick={() => {
        history.push("/dashboard/create/post");
      }}
      className={classes.root}
    >
      <div className={classes.flexRow}>
        <Avatar src={user?.displayPicture?.thumbUrl} />
        <div
          className={classes.flexColumn}
          style={{ flexGrow: 1, marginLeft: "10px" }}
        >
          <div className={classes.topBox}>
            {/* <InputBase
              multiline={true}
              rowsMax={6}
              value=""
              placeholder={"Create Post"}
              className={classes.createInput}
            /> */}
            <MentionInput
              value={text}
              setValue={setText}
              onChange={handleChange}
              placeholder={"Description"}
              buttonBox={false}
            />
          </div>
          <div className={classes.midBox}>
            <PublicIcon /> Everyone can view
          </div>
          <div className={classes.bottomBox}>
            <div className={classes.iconBox}>
              <PollIcon className={classes.icon} />
              <EmojiEmotionsIcon className={classes.icon} />
              <ImageIcon className={classes.icon} />
              <AttachFileIcon className={classes.icon} />
            </div>
            <CreateButton
              className={classes.button}
              variant="contained"
              color="primary"
            >
              Post
            </CreateButton>
          </div>
        </div>
      </div>
    </Paper>
  );
}

export default UploadPostBox;
