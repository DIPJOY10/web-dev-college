import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import {
  Chip,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@material-ui/core";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import { useSelector, useDispatch } from "react-redux";
import TitleInput from "../styled/title.input";
import DescriptionInput from "../styled/description.input";
import { useParams, useHistory, Link } from "react-router-dom";
import FilesViewer from "../file/Viewer/FilesViewer";
import Title from "../styled/DataDisplay/title";
import Description from "../styled/DataDisplay/description";
import useDocDetail from "./useDocDetail";
import EditBtn from "../styled/actionBtns/edit.btn";
import ProfileAppbar from "../profile/profile.appbar";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import useSharedData from "../share/useSharedData";
import AvatarLocal from "../profile/avatar";
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import moment from 'moment';
import LaunchIcon from '@material-ui/icons/Launch';
import ReactHtmlParser from "react-html-parser";
import AllFileViewers from "../styled/CommonComponents/AllFileViewer";
import SmartCommentList from "../comment/smart.comment.list";

function setHttp(link) {
  if (link.search(/^http[s]?\:\/\//) == -1) {
    link = "http://" + link;
  }
  return link;
}
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "100vh",
    overflow: "hidden",
  },
  navBar: {
    width: "100%",
    height: "60px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0px 7px",
    backgroundColor: "white"
  },
  mainCont: {
    width: "100%",
    height: "calc(100% - 60px)",
    padding: "10px 50px 100px",
    display: "flex",
    overflowY: "auto",
    flexDirection: "column"
  },
  flexShow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    "& h3": {
      fontWeight: "500",
      fontSize: "20px"
    }
  },
  titleText: {
    fontWeight: '400',
    fontSize: '38px',
    textTransform: "capitalize",
    [theme.breakpoints.down("xs")]: {
      fontSize: '25px',
    }
  },
  bodyCont: {
    "& ul": {
      marginLeft: "45px"
    }
  },
  linkCont: {
    marginTop: "5px",
    paddingLeft: "10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    "& a": {
      fontSize: "18px",
      textDecoration: "none",
      marginTop: "7px"
    }
  },
  sectionTitle: {
    fontSize: '20px',
    marginTop: "30px"
  },
  tagCont: {
    display: "flex",
    flexWrap: "wrap",
    marginTop: "7px",
    paddingLeft: "10px",
    "& div": {
      marginRight: "10px",
      fontSize: "16px",
      fontWeight: "500"
    }
  },




  editorStyle: {
    display: "flex",
    alignItems: "center",
    margin: "20px 0px",
    "& img": {
      width: "40px",
      height: "40px",
      borderRadius: "50%"
    },
    "& h3": {
      fontSize: "14px",
      color: "#8f919d",
      fontWeight: "400"
    },
    "& p": {
      fontSize: "14px",
      color: "#8f919d",
      fontWeight: "400"
    }
  },



  row: {
    // flex: 1,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    paddingLeft: "1rem",
  },
  chipStyle: {
    margin: "0.5rem",
    // maxWidth: "8rem",
  },
  text: {
    fontSize: "1.6rem",
    fontWeight: "600",
    margin: "1rem 0rem",
  },
  textLink: {
    fontSize: "1.2rem",
    fontWeight: "600",
    margin: "1rem 0.5rem",
  },
}));

export default function DocView() {
  const classes = useStyles();

  const history = useHistory();
  const dispatch = useDispatch();
  const { doc } = useDocDetail();

  const openLink = (link) => {
    window.open(setHttp(link), "_blank").focus();
  };
  const { sharedDict, assignableIds, loadingShared } = useSharedData({
    shared: doc?.shared,
  });

  console.log(doc)

  return (
    <div className={classes.root}>
      <div className={classes.navBar} >
        <div className={classes.flexShow} >
          <KeyboardBackspaceIcon
            style={{
              fontSize: "30px",
              marginRight: "5px",
              cursor: "pointer"
            }}
            onClick={() => {
              history.goBack();
            }}
          />
          <h3>Document</h3>
        </div>
        <div className={classes.flexShow} >
          <EditBtn
            onClick={() => {
              dispatch({
                type: "AddDoc",
                payload: {
                  tempDoc: doc,
                },
              });

              let path = "/"

              if (doc?.docType == "PUBLICDOC") {
                path = "/publicdoc/edit/" + doc?._id;
              } else {
                path = "/doc/edit/" + doc?._id;
              }
              history.push(path);
            }}
          />
        </div>
      </div>
      <div className={classes.mainCont} >
        <Paper style={{ padding: "20px 35px" }}>
          <Typography className={classes.titleText}>
            {doc?.title ? doc?.title : 'Untitled'}
          </Typography>

          <div className={classes.editorStyle} >
            <img src={doc?.user?.displayPicture?.url} />
            <div style={{ marginLeft: "15px" }} >
              <h3>Written by <span style={{ fontWeight: "500" }} >{doc?.user?.displayName}</span></h3>
              <p>Last Updated at {moment(doc?.updatedAt).format('DD MMM YYYY')}</p>
            </div>
          </div>

          {/* <h3 className={classes.sectionTitle} >Category Tag(s)</h3> */}
          <div className={classes.tagCont} >
            {doc?.tagStrs && doc.tagStrs.map((tag) => (<div>#{tag}</div>))}
          </div>

          <h3 className={classes.sectionTitle} >🌏</h3>
          <div className={classes.tagCont} >
            {doc?.nationwide && doc.nationwide.map((tag) => (<div style={{ fontWeight: "510" }} >#{tag}</div>))}
            {doc?.stateTags && doc.stateTags.map((tag) => (<div>#{tag.split("_")[0]}</div>))}
          </div>

          <div className={classes.bodyCont} >
            {doc?.description && (
              <>
                {ReactHtmlParser(
                  doc?.description?.length > 0 ? doc?.description : ''
                )}
              </>
            )}
          </div>

          <h3 className={classes.sectionTitle} >File(s)</h3>
          {doc?.files ? (
            <>
              <AllFileViewers files={doc?.files} />
            </>
          ) : null}

          <h3 className={classes.sectionTitle} >Link(s)</h3>
          <div className={classes.linkCont} >
            {doc?.links && doc?.links.map((link) => (
              <a target="_blank" href={link?.link} >{link?.title} <LaunchIcon style={{ fontSize: "18px", marginBottom: "-3px" }} /> </a>
            ))}
          </div>

          <SmartCommentList parent={doc?._id} parentModelName="Doc" />

        </Paper>
      </div>
    </div>
  );
}
