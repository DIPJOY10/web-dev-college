import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import FileBase64 from "react-file-base64";
import {
  Box,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Typography,
  useMediaQuery,
} from "@material-ui/core";

import CreateBtn from "../styled/actionBtns/create.btn";
import Alert from "@material-ui/lab/Alert";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useHistory,
} from "react-router-dom";
import Api from "../../helpers/Api";
import TitleInput from "../styled/title.input";
import DescriptionInput from "../styled/description.input";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import ProfileAppbar from "../profile/profile.appbar.js";
import useShared from "../share/useShared.js";
import ShareIconBtn from "../share/share.icon.btn.js";
import SharedList from "../share/sharedList.js";
import useGetProfile from "../profile/useGetProfile";
import FilesViewer from "../file/Viewer/FilesViewer";
import FileUploadButton from "../file/Uploader/FileUploadButton";
import { updateDeleteFlagForSingleFiles } from "../propertyManagement/apiCall";
import CustomTitleInput from "../styled/customTitle.input";
import Button from "@material-ui/core/Button";
import { config } from "react-spring";
import { green } from "@material-ui/core/colors";
import fs from "fs";

import { fdatasync } from "fs";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    marginTop: "3rem",
    justifyContent: "center",
    alignItems: "center",
  },

  row: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  col: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    margin: "0rem 1rem",
  },
  textTitle: {
    fontSize: 19,
    fontWeight: "500",
    margin: "0rem 1rem",
  },
  link: {
    color: "blue",
    fontStyle: "italic",
  },
  attachIconFont: {
    fontSize: "25px",
    transform: "rotate(-20deg)",
    marginRight: "5px",
  },
  iconWithTextStyle: {
    border: `2px solid ${theme.palette.primary.main}`,
    width: "150px",
  },
}));
const CircularIndeterminate = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <CircularProgress />
    </Box>
  );
};

function CreateProfileSign(props) {
  const history = useHistory();
  const classes = useStyles();

  const { row, col } = classes;
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { profileId } = useParams();
  // const file = useSelector((state) => state.file);
  const { user, userProfile } = useSelector((state) => state.auth);
  //Docusign Auth Keys
  const docSignState = useSelector((state) => state.docSign);
  const [open, setOpen] = useState(false);
  //Document
  const [documentId, setDocumentId] = useState(0);
  const [documentName, setDocumentName] = useState("");
  //Recepient
  const [recepientMail, setRecepientMail] = useState("");
  const [recepientName, setRecepientName] = useState("");
  const [recepientId, setRecepientId] = useState(0);
  //CC
  const [ccMail, setCcMail] = useState("");
  const [ccName, setCcName] = useState("");
  const [cctId, setCcId] = useState(0);
  //form
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [emailSignSucess, setEMailSignSuccess] = useState(false);
  const [file, setFiles] = useState([]);
  const matches = useMediaQuery("(max-width:700px)");

  const userId = user._id;
  const userProfileId = user?.profile;
  const [tags, setTags] = useState([]);
  const [isPrivate, setPrivate] = useState(false);
  const sharedProps = useShared({
    initShared: [profileId, userProfileId],
    initAssigned: [],
  });
  // console.log(Array.from(new Set(sharedProps?.shared)), "Type of");
  const profile = useGetProfile(profileId);
  // const { createdFileIds } = file;
  const [links, setLinks] = useState([{ title: "", link: "" }]);
  const [linkError, setLinkError] = useState(false);
  const docusignAppIntegrationKey =
    process.env.REACT_APP_DOCUSIGN_APP_INTEGRATION_KEY;
  const deployMode = process.env.REACT_APP_DEPLOY_PROD_MODE;
  var { privateButton, assignButton, assigness, sharedPeoples } = SharedList(
    sharedProps,
    isPrivate,
    setPrivate
  );

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    const redirect_uri = deployMode
      ? "https://www.contractflo.com/"
      : "http://localhost:3000/";
    setOpen(false);
    alert("Please allow pop-ups for this site !");
    window.location.href = `https://account-d.docusign.com/oauth/auth?response_type=code&scope=signature%20impersonation&client_id=${docusignAppIntegrationKey}&redirect_uri=${redirect_uri}`;
  };
  const handleCloseCancel = () => {
    setOpen(false);
    // window.location.href = config.BASE_URL;
  };
  // TODO : Handle Later
  // useEffect(() => {
  //   handleClickOpen();
  // }, []);
  const sendMailToSign = () => {
    const accessToken = docSignState.accessToken;
    let base64 = file.upload ? file.upload[0].base64 : "No";
    base64 = base64.split(",")[1];
    const payload = {
      accessToken: accessToken,
      documentBase64: base64,
      signerName: recepientName,
      signerEmail: recepientMail,
      signerId: recepientId,
      ccEmail: ccMail,
      ccName: ccName,
      ccId: cctId,
      docName: documentName,
      documentId: documentId,
    };

    setIsFormLoading(true);
    Api.post("doc/sign/uploadEnvelope", payload)
      .then((res) => {
        // setEMailSignSuccess(true);
        if (res.status == "sent") {
          dispatch({
            type: "AddApiAlert",
            payload: {
              success: true,
              message: `Redirecting to Docusign Dashboard `,
            },
          });
          setIsFormLoading(false);
          let url = res.redirectUrl;
          window.open(url, "_blank", "noopener,noreferrer");
        } else {
          dispatch({
            type: "AddApiAlert",
            payload: {
              success: false,
              message:
                "Oops ! There was some problem while sending the E-mail. ",
            },
          });
          setIsFormLoading(false);
        }
      })
      .catch((err) => {
        setIsFormLoading(false);
        dispatch({
          type: "AddApiAlert",
          payload: {
            success: false,
            message: "Error Occured on the server .",
          },
        });
        console.log("error sending", err);
      });
  };
  const handleSubmit = () => {
    sendMailToSign();
  };
  const setFilesCallBack = (files) => {
    setFiles({ upload: files });
  };
  return (
    <div className={classes.root}>
      <ProfileAppbar name={"Signing Document"} profile={profile} />
      {sharedProps?.shareDrawer}
      {sharedProps?.assignedDialog}
      {isFormLoading ? (
        <Grid
          container
          style={{
            marginTop: "1rem",
            backgroundColor: "white",
            padding: "1rem",
            borderRadius: ".5rem",
            width: "100%",
            display: "grid",
            placeItems: "center",
          }}
        >
          <CircularIndeterminate />
        </Grid>
      ) : (
        <Grid
          container
          style={{
            backgroundColor: "white",
            padding: "1rem",
            borderRadius: ".5rem",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            margin: "1rem",
          }}
        >
          <Alert severity="warning">
            Please get verified with our signature provider <i>"DocuSign"</i> If
            you haven't already.{" "}
          </Alert>

          <Grid
            itemm
            sm={12}
            md={9}
            xs={12}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
              margin: "1rem",
            }}
          >
            <Button variant="contained" onClick={handleClickOpen}>
              Get Verified
            </Button>

            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {"Integrating with signature provider?"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Before continuing, you need to provide your consent by logging
                  in with Docusign. After login come to this option again
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseCancel}>Go back</Button>
                <Button
                  onClick={handleClose}
                  autoFocus
                  color="success"
                  variant="contained"
                >
                  Continue with docusign
                </Button>
              </DialogActions>
            </Dialog>
          </Grid>
          <Grid
            item
            xs={12}
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: "1rem",
            }}
          >
            <Typography
              variant="h4"
              className={classes.text}
              style={{
                marginBottom: "1rem",
              }}
            >
              Upload your file
            </Typography>
            {/* <FileUploadButton
              parentType="Doc"
              used={false}
              parentId={null}
              IconColor="white"
              iconBig={true}
              aditionalText={"Add file"}
              attachIconStyle={classes.attachIconFont}
              iconWithTextStyle={classes.iconWithTextStyle}
            /> */}
            <FileBase64 multiple={true} onDone={setFilesCallBack} />
            {/* <div style={{ marginTop: "20px" }}>
                          <FilesViewer
                            fileIds={createdFileIds}
                            deletable={true}
                            handler={removeSingleImgFromReducerAndDelete}
                          />
                        </div> */}
          </Grid>

          {/* Document ID */}
          <Grid item xs={12}>
            <CustomTitleInput
              title={documentId}
              text={"Document ID "}
              // placeholder={"ex.1001"}
              setTitle={setDocumentId}
              type={"number"}
            />
          </Grid>

          <Grid item xs={12}>
            <CustomTitleInput
              title={documentName}
              text={"Name of Document"}
              placeholder={"Pune Flat Rent Agreement"}
              setTitle={setDocumentName}
            />
          </Grid>
          {/* Recepient Email */}
          <Grid item xs={12}>
            <CustomTitleInput
              title={recepientMail}
              text={"Email of the Recepient "}
              placeholder={"johndoe@example.com"}
              setTitle={setRecepientMail}
            />
          </Grid>

          {/* Recepient Name */}
          <Grid item xs={12}>
            <CustomTitleInput
              title={recepientName}
              text={"Name of the Recepient "}
              placeholder={"Mr. John Doe"}
              setTitle={setRecepientName}
            />
          </Grid>

          {/* Recepient Id  */}
          <Grid item xs={12}>
            <CustomTitleInput
              title={recepientId}
              text={"Recepient ID "}
              // placeholder={"ex. 123"}
              setTitle={setRecepientId}
              type={"number"}
            />
          </Grid>

          {/* CC Email */}
          <Grid item xs={12}>
            <CustomTitleInput
              title={ccMail}
              text={"Email of the CC "}
              placeholder={"cc@example.com"}
              setTitle={setCcMail}
            />
          </Grid>

          {/* CC Name */}
          <Grid item xs={12}>
            <CustomTitleInput
              title={ccName}
              text={"Name of the CC "}
              placeholder={"Mr. John Doe"}
              setTitle={setCcName}
            />
          </Grid>

          {/* CC Id  */}
          <Grid item xs={12}>
            <CustomTitleInput
              title={cctId}
              text={"CC ID "}
              // placeholder={"ex. 123"}
              setTitle={setCcId}
              type={"number"}
            />
          </Grid>

          <Button variant="contained" onClick={handleSubmit}>
            Submit the form
          </Button>
        </Grid>
      )}
    </div>
  );
}

export default CreateProfileSign;
