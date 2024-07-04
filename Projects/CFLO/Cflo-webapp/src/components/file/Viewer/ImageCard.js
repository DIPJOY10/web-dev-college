import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Paper from "@material-ui/core/Paper";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Api from "../../../helpers/Api";
import { setFiles } from "../fileUtils";
import firebase from "firebase";
import CancelIcon from "@material-ui/icons/Cancel";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";

const useStyles = makeStyles({
  root: (props) => ({
    position: "relative",
    margin: "0.3rem",
    borderRadius: "5px",
    display: "flex",
    justifyContent: "center",
  }),
  picture__container: (props) => ({
    height: "7rem",
    width: "auto",
    maxWidth: "90%",
    // width: "7rem",
    // backgroundImage: `url(${props.imageUrl})`,
    // backgroundSize: "cover",
    // backgroundPosition: "center",
    ...props.styleBody,
  }),
  cancel__button: {
    position: "absolute",
    top: "6px",
    right: "6px",
    cursor: "pointer",
    fontSize: "40px",
    "&:hover": {
      color: "#F9F9F9",
    },
  },
});

const ImageCard = (props) => {
  const dispatch = useDispatch();

  const fileReducer = useSelector((state) => state.file);
  const { fileDictionary } = fileReducer;
  const {
    fileId: fileIdProp,
    fileObject = false,
    file: fileProp = {},
    styleBody,
    deletable,
    handler,
  } = props;
  const fileId = fileObject ? fileProp?._id : fileIdProp;

  const file = fileObject ? fileProp : fileDictionary[fileId];

  let imageUrl = file?.url;
  const classes = useStyles({
    imageUrl,
    styleBody,
  });
  if (file.processed) {
    imageUrl = file.smallUrl;
  }

  const openInNewTab = (url) => {
    const newWindow = window.open(url, "_blank", "noopener,noreferrer");
    if (newWindow) newWindow.opener = null;
  };

  useEffect(() => {
    // console.log(!file.processed,file.processed);
    if (!file.processed) {
      switch (file.storage) {
        case "firebase":
          /**
           * Not required just update in backend
           */

          // (async ()=>{
          //     var thumbRef = firebase.storage().ref().child(file.thumbFilename);
          //     var thumbUrl = await thumbRef.getDownloadURL();
          //     var smallRef = firebase.storage().ref().child(file.smallFilename);
          //     var smallUrl = await smallRef.getDownloadURL();
          //     var mediumRef = firebase.storage().ref().child(file.mediumFilename);
          //     var mediumUrl = await mediumRef.getDownloadURL();

          //     var fileObject = {
          //         ...file,
          //         thumbUrl,
          //         smallUrl,
          //         mediumUrl,
          //         processed:true
          //     }

          //     //console.log(fileObject,' is the fileObject')

          //     Api.post('file/update',fileObject)
          //         .then(file=>{
          //             //console.log('file is updated file ',file);
          //             setFiles([file],fileReducer,dispatch,)
          //         })

          // })();
          break;

        default:
          break;
      }

      (async () => { })();
    }
  }, []);

  return (
    <Paper
      className={classes.root}
    // onClick={() => {
    //   if (imageUrl) {
    //     openInNewTab(imageUrl);
    //   }
    // }}
    >
      {/* <div
        className={classes.picture__container}
        onClick={() => {
          if (imageUrl) {
            openInNewTab(imageUrl);
          }
        }}
      >
      </div> */}

      <img
        className={classes.picture__container}
        src={imageUrl}
        alt={"uploadImg"}
        onClick={() => {
          if (imageUrl) {
            openInNewTab(imageUrl);
          }
        }}
      />

      {deletable ? (
        <CancelIcon
          className={classes.cancel__button}
          style={{ color: "grey" }}
          onClick={() => {
            handler(fileId);
          }}
        />
      ) : null}
    </Paper>
  );
};

export default ImageCard;
