import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import ButtonBase from "@material-ui/core/ButtonBase";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Api from "../../helpers/Api";
import { useDebounce } from "react-use";

import FileUploadButton from "../file/Uploader/FileUploadButton";
import FilesViewer from "../file/Viewer/FilesViewer";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      marginBottom: "10px",
    },
  },
  description: {
    display: "block",
  },
  button: {
    backgroundColor: theme.palette.primary.main,
    width: "100%",
  },
}));

function EditPost({ match }) {
  const { auth } = useSelector((state) => state);
  const { user } = auth;
  const profile = user?.profile;
  const classes = useStyles();

  const { createdFileIds } = useSelector((state) => state.file);
  const postId = match.params.postId;

  // console.log(profile);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [oldFiles, setOldFiles] = useState([]);
  const [stateUpdate, setStateUpdated] = useState(false);

  async function createPost() {
    try {
      const res = await Api.post("post/update", {
        title,
        description,
        files: [...oldFiles, ...createdFileIds],
        _id: postId,
        published: true,
      });
      console.log(res);
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

  function handleOnChange(event, setState) {
    setState(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    createPost();
  }

  useEffect(() => {
    async function getPost() {
      const res = await Api.post("post/get", {
        _id: postId,
      });
      setTitle(res.title || "");
      setDescription(res.description || "");
      setOldFiles(res.files || []);
      setStateUpdated(true);
    }

    getPost();
  }, []);

  useEffect(() => {
    if (stateUpdate) createPost();
  }, [createdFileIds]);

  useDebounce(
    () => {
      if (stateUpdate) createPost();
    },
    500,
    [title, description]
  );

  const type = "Community";
  return (
    <div>
      <form className={classes.root} onSubmit={handleSubmit}>
        <TextField
          id="filled-basic"
          label="Title"
          variant="filled"
          display="block"
          fullWidth={true}
          value={title}
          onChange={(e) => {
            handleOnChange(e, setTitle);
          }}
        />
        <TextField
          className={classes.description}
          id="filled-multiline-flexible"
          label="Description"
          multiline
          rows={4}
          fullWidth={true}
          value={description}
          onChange={(e) => {
            handleOnChange(e, setDescription);
          }}
          variant="filled"
        />
        <Typography variant="subtitle1" display="inline">
          Upload Files
        </Typography>
        <FileUploadButton parentType={type} used={false} parentId={null} />
        <FilesViewer fileIds={[...oldFiles, ...createdFileIds]} />
        <Button type="submit" className={classes.button}>
          Submit
        </Button>
      </form>
    </div>
  );
}

export default EditPost;
