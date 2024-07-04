import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import _ from "lodash";
import useGetProfile from "../profile/useGetProfile";
import useGetFolders from "./useGetFolders";
import useGetDocs from "./useGetDocs";
import SelectDocDialog from "./select.dialog";
import DocTable from "./profile.doc.table";
import FolderCard from "./profile.folder.card";
import EmptyFolder from "../../Assets/FileIcon/emptyfolder.png";
import DocsBreadcrumbs from "./docs.breadcrumps";
import { Loadinglogo } from "../../helpers/loadinglogo";
import YoutubeTuts from "../youtubeTuts";
import FilePreviewer from "react-file-previewer";
import Paper from "@material-ui/core/Paper";
import ButtonBase from "@material-ui/core/ButtonBase";
import AddIcon from "@material-ui/icons/Add";

import {
  Button,
  Divider,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useMediaQuery,
  Snackbar,
  Chip,
} from "@material-ui/core";
import DocCard from "./profile.doc.card";
import IssueSvg from "../../Assets/issue.svg";
import FileReducer from "../../reducers/File/FileReducer";
import Api from "../../helpers/Api";
import { Alert } from "@material-ui/lab";
import DocTableEnvelope from "./profile.doc.envelope.table";
import { LensTwoTone } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: "4rem",
  },
  emptyFolder: {
    padding: "2rem",
  },
  createBtn: {
    padding: "0.5rem",
    paddingTop: "0.25rem",
    paddingBottom: "0.25rem",
  },

  createBtnPaper: {
    alignSelf: "flex-end",
    marginRight: "1rem",
  },
}));

export default function ProfileDocs(props) {
  const classes = useStyles();
  const { profileId } = useParams();
  const history = useHistory();
  const { auth } = useSelector((state) => state);
  const theme = useTheme();
  const user = auth?.user;
  const [skip, setSkip] = useState(0);
  const [value, setValue] = React.useState(1);
  const { fileDictionary } = FileReducer;
  const profile = useGetProfile(profileId);
  //Docusign Auth Keys
  const docSignState = useSelector((state) => state.docSign);
  const accessToken = docSignState.accessToken;
  console.log("docsignstate", docSignState);
  const [docusignAuthRedirectOpen, setDocusignAuthRedirectOpen] =
    useState(false);
  const [signProviderUserText, setSignProviderUserText] = useState("-");
  const [openSignSucess, setOpenSignSuccess] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const dispatch = useDispatch();
  const {
    folderIds,
    setFolderIds,
    folderDictionary,
    setFolderDictionary,
    loadingFolder,
  } = useGetFolders(profileId);
  const { docIds, setDocIds, docDictionary, setDocDictionary, loadingDocs } =
    useGetDocs(profileId);
  const handleClickOpenDocusignVerification = () => {
    setDocusignAuthRedirectOpen(true);
  };
  const handleCloseCancelDocusignVerification = () => {
    setDocusignAuthRedirectOpen(false);
    dispatch({
      type: "ToggleSignIn",
      payload: {
        isSignedIn: false,
      },
    });
    // window.location.href = config.BASE_URL;
  };
  const handleCloseDocusignVerification = () => {
    const redirect_uri = process.env.REACT_APP_DOCUSIGN_REDIRECT_URL;
    dispatch({
      type: "AddDoc",
      payload: {
        docusignProfileId: profileId,
      },
    });
    dispatch({
      type: "ToggleSignIn",
      payload: {
        isSignedIn: true,
      },
    });
    setDocusignAuthRedirectOpen(false);

    const integrationKey = process.env.REACT_APP_DOCUSIGN_APP_INTEGRATION_KEY;
    const url =
      process.env.REACT_APP_DOCUSIGN_BASE_SIGNIN_URI +
      `/auth?response_type=code&scope=signature%20impersonation&client_id=${integrationKey}&redirect_uri=${redirect_uri}`;
    window.location = url;
  };
  const handleClickSignSuccess = () => {
    setOpenSignSuccess(true);
  };

  const handleCloseSignSuccess = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSignSuccess(false);
  };
  const parseUrlForSign = () => {
    // let codeFromUrl = window.location.href.split("?code=")[1];
    // localStorage.setItem("codeFromUrl", codeFromUrl);
    let codeFromUrl = localStorage.getItem("codeFromUrl");
    const payload = { codeFromUrl: codeFromUrl };
    if (codeFromUrl != undefined && codeFromUrl != "") {
      Api.post("doc/sign/authdata", payload)
        .then((res) => {
          dispatch({
            type: "SignToken",
            payload: {
              accessToken: res.access_token,
              refreshToken: res.refresh_token,
            },
          });
        })
        .catch((err) => console.log(err));
      dispatch({
        type: "DocSignAuth",
        payload: codeFromUrl,
      });
      if (codeFromUrl) handleClickSignSuccess();
    }
  };
  //will be used in future DO NOT DELETE
  const getEnvelopeStatus = (envId) => {
    console.log("././././..............", envId);
    const payload = { accessToken: accessToken, envelopeId: envId };
    if (!!envId) {
      Api.post("doc/sign/envelopedata", payload)
        .then((res) => {
          return res.status;
        })
        .catch((err) => {
          console.log(err);
          return "Request Failure";
        });
    }
  };

  const checkSignProviderSignIn = () => {
    const payload = { accessToken: accessToken };
    Api.post("doc/sign/userdata", payload)
      .then((res) => {
        console.log("Userdata result is  ", res);
        if (res.email != undefined && res.email != "") {
          setSignProviderUserText(`${res.given_name} ${res.family_name}`);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    // parseUrlForSign();
    checkSignProviderSignIn();
  }, []);
  // docIds.map((docId) => )
  // const loadTemplates = () => {

  // // };
  // useEffect(() => {
  //   let count = 0;
  //   if (avialableTemplates != []) {
  //     dispatch({
  //       type: "AddAvialableTemplates",
  //       payload: {
  //         avialableTemplates: avialableTemplates,
  //       },
  //     });
  //   }
  // });
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  return (
    <div className={classes.row}>
      {!loadingDocs && !loadingFolder ? (
        <>
          <Snackbar
            open={openSignSucess}
            autoHideDuration={6000}
            onClose={handleCloseSignSuccess}
          >
            <Alert
              onClose={handleCloseSignSuccess}
              severity="success"
              sx={{ width: "100%" }}
            >
              Signature Provider Integration Success!
            </Alert>
          </Snackbar>
          <div>
            <div style={{ padding: "1rem" }}>
              <div
                style={{
                  display: "flex",
                  gap: "7px",
                  marginBottom: "16px",
                }}
              >
                <img src={IssueSvg} style={{ width: "3rem" }} />
                <Typography variant="h3" style={{ fontWeight: "600" }}>
                  Document Management
                </Typography>
              </div>
              <Typography
                style={{
                  fontSize: "1.06rem",
                  fontFamily: "Inter",
                  fontWeight: "500",
                  lineHeight: "1.5",
                }}
              >
                Document Management enables users to store and modify the
                documents
              </Typography>
              <Typography
                style={{
                  fontSize: "1.06rem",
                  fontFamily: "Inter",
                  fontWeight: "500",
                  lineHeight: "1.5",
                }}
              >
                Document Signing enables users to sign to an document and then
                forward to anyone.
              </Typography>
              <Typography
                style={{
                  fontSize: "1.06rem",
                  fontFamily: "Inter",
                  fontWeight: "500",
                  lineHeight: "1.5",
                }}
              >
                You can upload the document and they will be listed below
              </Typography>
              <div
                style={{
                  fontSize: "1.06rem",
                  fontFamily: "Inter",
                  fontWeight: "500",
                  lineHeight: "1.5",
                }}
              >
                <span
                  style={{
                    backgroundColor: "rgba(135,131,120,0.15)",
                    color: "#EB5757",
                    fontSize: "1.06rem",
                    fontFamily: "Inter",
                    fontWeight: "500",
                    lineHeight: "1.5",
                  }}
                >
                  Note
                </span>{" "}
                to create a new{" "}
                <span
                  style={{
                    backgroundColor: "rgba(135,131,120,0.15)",
                    color: "#EB5757",
                    fontSize: "1.06rem",
                    fontFamily: "Inter",
                    fontWeight: "500",
                    lineHeight: "1.5",
                  }}
                >
                  {value == 0 ? "Task Map" : value == 1 ? "Template" : "Issue"}
                </span>{" "}
                You first have to create a Docusign Account.
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <Grid
              itemm
              sm={12}
              md={9}
              xs={12}
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                flexDirection: "row",
                marginRight: 5,
              }}
            >
              {signProviderUserText != "-" ? (
                <Chip label={signProviderUserText} />
              ) : (
                <Button
                  variant="contained"
                  onClick={handleClickOpenDocusignVerification}
                >
                  DocuSign ™ Login
                </Button>
              )}
              <Dialog
                open={docusignAuthRedirectOpen}
                onClose={handleCloseDocusignVerification}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  {"Integrating with signature provider?"}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    Before continuing, you need to provide your consent by
                    logging in with Docusign. After login come to this option
                    again. Please allow for Pop-ups for this website to proceed.
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseCancelDocusignVerification}>
                    Go back
                  </Button>
                  <Button
                    onClick={handleCloseDocusignVerification}
                    autoFocus
                    color="success"
                    variant="contained"
                  >
                    Continue with docusign
                  </Button>
                </DialogActions>
              </Dialog>
            </Grid>

            {/* <DocsBreadcrumbs /> */}
            <Paper className={classes.createBtnPaper}>
              <ButtonBase
                className={classes.createBtn}
                onClick={() => {
                  setDialogOpen(true);
                }}
              >
                <Typography>Add New</Typography>

                <AddIcon />
              </ButtonBase>
            </Paper>
            {dialogOpen && (
              <SelectDocDialog
                profileId={profileId}
                setDialogOpen={setDialogOpen}
                // avialableTemplates={avialableTemplates}
              />
            )}

            <YoutubeTuts
              name={"Documents"}
              dialogTitle={"Document Management"}
            />
          </div>
          {folderIds.length > 0 ? (
            <>
              <Typography
                gutterBottom
                variant="h5"
                style={{
                  marginBottom: "1rem",
                  fontWeight: "600",
                }}
              >
                Folders
              </Typography>
              <FolderCard
                profileId={profileId}
                folderIds={folderIds}
                folderDictionary={folderDictionary}
              />
            </>
          ) : null}
          <Typography
            variant="h5"
            gutterBottom
            style={{
              margin: "1rem 0",
              fontWeight: "600",
            }}
          >
            Sign & Send
          </Typography>
          <Divider />
          {docIds.length > 0 ? (
            <>
              {console.log(
                "Doc IDs with parent ====>",
                docIds.map((docId) => docDictionary[docId].parentTemplate)
              )}
              {!isMobile ? (
                <DocTableEnvelope
                  docIds={docIds.filter(
                    (docId) => docDictionary[docId].docType == "ESIGN_ENVELOPE"
                  )}
                  docDictionary={docDictionary}
                  signStatus={"default"}
                  isEnvelope={true}
                  docUrl={docIds
                    .filter(
                      (v, i) =>
                        docDictionary[v].docType == "DOCUMENT" ||
                        docDictionary[v]?.docType == "PUBLICDOC"
                    )
                    .map((v, i) => docDictionary[v].files[0])
                    .map((v, i) => v?.url)}
                />
              ) : (
                docIds.map((docId) => {
                  return docDictionary[docId].docType == "ESIGN_ENVELOPE" &&
                    !!docDictionary[docId].signTracker.id ? (
                    <DocCard
                      key={docId}
                      doc={docDictionary[docId]}
                      envelopeId={docDictionary[docId].signTracker.id}
                      isEnvelope={true}
                    />
                  ) : null;
                })
              )}
            </>
          ) : null}

          <Typography
            variant="h5"
            gutterBottom
            style={{
              margin: "1rem 0",
              fontWeight: "600",
            }}
          >
            Your Documents
          </Typography>
          <Divider />
          {docIds.length > 0 ? (
            <>
              {!isMobile ? (
                <DocTable
                  docIds={docIds.filter(
                    (docId) =>
                      docDictionary[docId]?.docType == "DOCUMENT" ||
                      docDictionary[docId]?.docType == "PUBLICDOC"
                  )}
                  docDictionary={docDictionary}
                  docUrl={docIds
                    .filter(
                      (v, i) =>
                        docDictionary[v]?.docType == "DOCUMENT" ||
                        docDictionary[v]?.docType == "PUBLICDOC"
                    )
                    .map((v, i) => docDictionary[v].files[0])
                    .map((v, i) => v?.url)}
                />
              ) : (
                docIds.map((docId) => {
                  return docDictionary[docId]?.docType == "DOCUMENT" ||
                    docDictionary[docId]?.docType == "PUBLICDOC" ? (
                    <DocCard key={docId} doc={docDictionary[docId]} />
                  ) : null;
                })
              )}
            </>
          ) : null}
          {/* FALL BACK SCREEN IF NO DOCS OR FOLDERS */}
          {folderIds.length == 0 && docIds.length == 0 ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                height: "76vh",
              }}
            >
              <img
                src={EmptyFolder}
                style={{
                  width: "18rem",
                }}
              />
            </div>
          ) : null}
          <Typography
            variant="h5"
            gutterBottom
            style={{
              margin: "1rem 0",
              fontWeight: "600",
            }}
          >
            Your Templates
          </Typography>
          <Divider />
          {docIds.length > 0 ? (
            <>
              {!isMobile ? (
                <DocTable
                  docIds={docIds.filter(
                    (docId) => docDictionary[docId].docType == "ESIGN_TEMPLATE"
                  )}
                  docDictionary={docDictionary}
                  docUrl={docIds
                    .filter(
                      (v, i) =>
                        docDictionary[v]?.docType == "DOCUMENT" ||
                        docDictionary[v]?.docType == "PUBLICDOC"
                    )
                    .map((v, i) => docDictionary[v].files[0])
                    .map((v, i) => v?.url)}
                />
              ) : (
                docIds.map((docId) => {
                  return docDictionary[docId].docType == "ESIGN_TEMPLATE" ? (
                    <DocCard key={docId} doc={docDictionary[docId]} />
                  ) : null;
                })
              )}
            </>
          ) : null}
        </>
      ) : (
        <Loadinglogo />
      )}
    </div>
  );
}
