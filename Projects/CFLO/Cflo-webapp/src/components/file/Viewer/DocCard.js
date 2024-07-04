import React from "react";
import { useSelector } from "react-redux";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import CardActionArea from "@material-ui/core/CardActionArea";
import CancelIcon from "@material-ui/icons/Cancel";
import DocSvg from "../../../Assets/FileIcon/doc.svg";
import PdfIcon from "../../../Assets/FileIcon/pdf.png";
import XlsIcon from "../../../Assets/FileIcon/xls.png";
import PptIcon from "../../../Assets/FileIcon/ppt.png";
const useStyles = makeStyles({
  root: {
    display: "flex",
    flex: 1,
    flexDirection: "row",
    padding: "0.5rem",
    margin: "0.5rem",
    maxWidth: "17rem",
    maxHeight: "5rem",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
  },

  imgStyle: {
    height: "3rem",
    width: "3rem",
  },

  textRow: {
    flex: 1,
    flexDirection: "row",
    display: "flex",
    textWrap: "wrap",
    fontWeight: "700",
    marginLeft: "1rem",
    marginRight: "1rem",
  },
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

const DocCard = (props) => {
  const classes = useStyles();
  const fileReducer = useSelector((state) => state.file);
  const { user } = useSelector((state) => state.auth);
  const { fileDictionary } = fileReducer;
  const {
    fileId: fileIdProp,
    fileObject = false,
    file: fileProp = {},
    styleBody = {},
    deletable = false,
    handler,
  } = props;
  const fileId = fileObject ? fileProp?._id : fileIdProp;

  const file = fileObject ? fileProp : fileDictionary[fileId];
  const arr = file?.name.split(".") || [];
  const fileExt = arr[arr.length - 1];
  let FileIcon = DocSvg;
  if (fileExt == "pdf") {
    FileIcon = PdfIcon;
  } else if (fileExt == "xls" || fileExt == "xlsx") {
    FileIcon = XlsIcon;
  } else if (fileExt == "ppt" || fileExt == "pptx") {
    FileIcon = PptIcon;
  } else {
    FileIcon = DocSvg;
  }

  const openInNewTab = (url) => {
    const newWindow = window.open(url, "_blank", "noopener,noreferrer");
    if (newWindow) newWindow.opener = null;
  };

  const convertBase64 = async () => {
    let url = file?.url;
    let blob = await fetch(url).then((r) => r.blob());

    let reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = function () {
      var base64data = reader.result;
      //   console.log(base64data);
    };
  };
  convertBase64();
  return (
    <div style={{ position: "relative" }}>
      <Paper
        className={classes.root}
        onClick={() => {
          if (file?.url) {
            openInNewTab(file.url);
          }
        }}
      >
        <img src={FileIcon} className={classes.imgStyle} />
        <Typography variant="body2" className={classes.textRow}>
          {file?.name}
        </Typography>
      </Paper>
      {deletable ? (
        <CancelIcon
          className={classes.cancel__button}
          style={{ color: "grey" }}
          onClick={() => {
            handler(fileId);
          }}
        />
      ) : null}
    </div>
  );
};

export default DocCard;
