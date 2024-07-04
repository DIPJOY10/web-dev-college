import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";

import CreateBtn from "../styled/actionBtns/create.btn";
import Alert from "@material-ui/lab/Alert";
import {
  BrowserRouter as Router,
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
import { updateDeleteFlagForSingleFiles } from "../propertyManagement/apiCall";
import useGetDocs from "./useGetDocs";
import CustomTitleInput from "../styled/customTitle.input";
import FileUploadButton from "../file/Uploader/FileUploadButton";
import FilesViewer from "../file/Viewer/FilesViewer";
import { SaveRounded } from "@material-ui/icons";

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

function CreateProfileEnvelope(props) {
  const history = useHistory();
  const classes = useStyles();

  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  //Docusign Auth Keys
  const docSignState = useSelector((state) => state.docSign);
  const isSignedIn = docSignState.isSignedIn;
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
  // Way of saving
  const [saveType, setSaveType] = useState("UPLOAD_DIRECTLY");
  //files to sign from url
  let fileToSignBase64data = "";
  // loading form
  const [isFormLoading, setIsFormLoading] = useState(false);
  // sign data tracker
  const signTracker = {
    provider: process.env.REACT_APP_DOCUMENT_SIGN_PROVIDER,
    id: "",
    status: "No Status",
  };
  // creating as template option
  const [createAsTemplate, setCreateAsTemplate] = useState(false);
  const saveRef = useRef();

  let selectedTemplateFiles;
  const { profileId } = useParams();
  const [selectedTemplateIdForEnvelope, setSelectedTemplateIdForEnvelope] =
    useState("");
  const file = useSelector((state) => state.file);

  const { user } = useSelector((state) => state.auth);

  const userId = user._id;
  const userProfileId = user?.profile;
  const [isPrivate, setPrivate] = useState(false);
  const sharedProps = useShared({
    initShared: [profileId, userProfileId],
    initAssigned: [],
  });
  //   console.log(Array.from(new Set(sharedProps?.shared)), "Type of");
  const profile = useGetProfile(profileId);
  let { createdFileIds } = file;
  const [recepients, setRecipients] = useState([{ mail: "", name: "", id: 1 }]);
  const [linkError, setLinkError] = useState(false);
  var { privateButton, sharedPeoples } = SharedList(
    sharedProps,
    isPrivate,
    setPrivate
  );
  const { docIds, docDictionary } = useGetDocs(profileId);
  // Pending Save Operation
  let isSavePending = false;
  // const loadTemplate = () => {
  let avialableTemplates =
    docIds != []
      ? docIds.map((docId) => {
          if (docDictionary[docId]?.docType == "ESIGN_TEMPLATE") {
            return { id: docId, ...docDictionary[docId] };
          } else {
            return {};
          }
        })
      : [];
  avialableTemplates = avialableTemplates.filter(function (element) {
    return Boolean(Object.keys(element).length);
  });
  const sendMailToSign = async () => {
    const accessToken = docSignState.accessToken;
    // let base64 = file.upload ? file.upload[0].base64 : "No";
    // base64 = base64.split(",")[1];
    const payload = {
      accessToken: accessToken,
      documentBase64: fileToSignBase64data,
      signerName: recepientName,
      signerEmail: recepientMail,
      signerId: Math.floor(Math.random() * 100),
      ccEmail: ccMail,
      ccName: ccName,
      ccId: Math.floor(Math.random() * 100),
      docName: title,
      documentId: Math.floor(Math.random() * 100),
      signersArray: recepients,
    };
    // setIsFormLoading(true);
    await Api.post("doc/sign/uploadEnvelope", payload)
      .then(async (res) => {
        // setEMailSignSuccess(true);

        if (res.status == "sent") {
          dispatch({
            type: "AddApiAlert",
            payload: {
              success: true,
              message: `Redirecting to Docusign Dashboard `,
            },
          });
          signTracker.id = res.envelopeId;
          signTracker.status = res.status;
          await createDocApi();

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
          // setIsFormLoading(false);
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
  const convertFileIdsToBase64 = async () => {
    //for single file only for now
    let fileBase64 = "";
    let fileUrl = "";
    let fileId;
    if (saveType == "UPLOAD_DIRECTLY") {
      fileId = createdFileIds[0]; // getting single id
      console.log("file is ", fileId);
    } else {
      fileId = selectedTemplateFiles[0]; // getting single id
    }
    await Api.post("file/get", { files: [fileId] }).then((res) => {
      // const {result: files} = res;
      // setFiles(files, fileReducer, dispatch);
      // converting URL to BASE64 Encod
      fileUrl = res.result[0].url;
    });

    let blob = await fetch(fileUrl).then((r) => r.blob());
    let reader = new FileReader();

    reader.readAsDataURL(blob);
    reader.onloadend = async function () {
      fileToSignBase64data = reader.result.split(";base64,")[1];
      await sendMailToSign();
    };
    let flag = true;
  };
  let getSelectedFileIdFromAvailableTemplates = async () => {
    if (avialableTemplates != [] && avialableTemplates != undefined) {
      let currentFilesList = avialableTemplates.filter(
        (temp) => temp.id == selectedTemplateIdForEnvelope
      );
      console.log("current fil lis is ", currentFilesList);
      if (currentFilesList != undefined) {
        currentFilesList = currentFilesList[0].files;
        selectedTemplateFiles = currentFilesList;
        console.log(
          "retrieved files are ",
          selectedTemplateFiles,
          currentFilesList
        );
        await convertFileIdsToBase64();
      }
    }
  };

  const onMailChange = (newValue, idx) => {
    let temp = [...recepients];
    temp[idx]["mail"] = newValue;
    setRecipients([...temp]);
  };
  const onNameChange = (newValue, idx) => {
    let temp = [...recepients];
    temp[idx]["name"] = newValue;
    setRecipients([...temp]);
  };
  const addNew = (idx) => {
    let temp = { mail: "", name: "", id: Math.floor(Math.random() * 100) };
    setRecipients([
      ...recepients.slice(0, idx),
      temp,
      ...recepients.slice(idx),
    ]);
  };
  const onDelete = (idx) => {
    if (recepients.length > 1) {
      setRecipients([
        ...recepients.slice(0, idx),
        ...recepients.slice(idx + 1),
      ]);
    }
  };

  const removeSingleImgFromReducerAndDelete = async (selectedId) => {
    const filteredFileIds = createdFileIds.filter((id) => id != selectedId);
    dispatch({
      type: "AddFile",
      payload: {
        createdFileIds: [...filteredFileIds],
      },
    });

    await updateDeleteFlagForSingleFiles({ fileId: selectedId })
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleSelectedTemplateIdForEnvelope = (event) => {
    setSelectedTemplateIdForEnvelope(event.target.value);
  };
  // Creating a template with local uploded file
  const createTemplateApi = async () => {
    let check = true;
    if (recepients.length == 1) {
      if (Boolean(recepients[0].mail) ^ Boolean(recepients[0].name)) {
        check = false;
        setLinkError(true);
        setTimeout(() => {
          setLinkError(false);
        }, 4000);
      }
    } else {
      for (var i = 0; i < recepients.length; i++) {
        let temp = recepients[i];
        if (temp.mail && temp.name) {
          continue;
        } else {
          check = false;
          setLinkError(true);
          setTimeout(() => {
            setLinkError(false);
          }, 4000);
          break;
        }
      }
    }
    if (check) {
      const docObject = {
        user: user._id,
        profile: profileId,
        title,
        description,
        shared: Array.from(new Set(sharedProps?.shared)),
        assigned: sharedProps?.assigned,
        isPrivate,
        files: createdFileIds,
        activeUserId: user,
        activeUserProfile: user?.profile,
        docType: "ESIGN_TEMPLATE",
        //adding dummy parent id as templates don't have parent
        parentTemplate: "507f191e810c19729de860ea",
      };

      const res = await Api.post("doc/create", docObject);

      dispatch({
        type: "AddApiAlert",
        payload: {
          success: true,
          message: "Template created successfully",
        },
      });

      dispatch({ type: "FileUploadReset" });
    }
  };
  // Creating a envelope with avialable templates
  const createDocApi = async () => {
    if (createAsTemplate) {
      console.log("Creating template");
      await createTemplateApi();
    }

    let check = true;
    if (recepients.length == 1) {
      if (Boolean(recepients[0].mail) ^ Boolean(recepients[0].name)) {
        check = false;
        setLinkError(true);
        setTimeout(() => {
          setLinkError(false);
        }, 4000);
      }
    } else {
      for (var i = 0; i < recepients.length; i++) {
        let temp = recepients[i];
        if (temp.mail && temp.name) {
          continue;
        } else {
          check = false;
          setLinkError(true);
          setTimeout(() => {
            setLinkError(false);
          }, 4000);
          break;
        }
      }
    }
    // sendMailToSign();

    if (check) {
      console.log("Creating Envelope");
      const docObject = {
        user: user._id,
        profile: profileId,
        title,
        description,
        shared: Array.from(new Set(sharedProps?.shared)),
        assigned: sharedProps?.assigned,
        isPrivate,
        files:
          saveType == "UPLOAD_DIRECTLY"
            ? createdFileIds
            : selectedTemplateFiles,
        activeUserId: user,
        activeUserProfile: user?.profile,
        docType: "ESIGN_ENVELOPE",
        parentTemplate:
          saveType == "UPLOAD_DIRECTLY"
            ? "507f191e810c19729de860ea"
            : selectedTemplateIdForEnvelope,
        signTracker: signTracker,
        signData: {
          recepientName: recepientName,
          recepientMail: recepientMail,
          ccName: ccName,
          ccMail: ccMail,
        },
      };

      const res = await Api.post("doc/create", docObject);

      dispatch({
        type: "AddApiAlert",
        payload: {
          success: true,
          message: "Doc created successfully",
        },
      });

      dispatch({ type: "FileUploadReset" });

      history.goBack();
    }
  };
  const fetchBase64FromFileIds = async () => {
    await convertFileIdsToBase64();
  };
  const handleClickCreateBtn = async () => {
    if (isSavePending == false) {
      isSavePending = true;
      saveRef.current.setAttribute("disabled", true);
      if (saveType == "GENERATE_TEMPLATE") {
        console.log("Generate template");
        await getSelectedFileIdFromAvailableTemplates();
      }
      if (saveType == "UPLOAD_DIRECTLY") {
        console.log("Calling directly");
        await fetchBase64FromFileIds();
      }
      saveRef.current.removeAttribute("disabled");
      isSavePending = false;
    }
  };
  const handleChangeCreateAsTemplateOption = (e) => {
    setCreateAsTemplate(e.target.checked);
  };
  const handleCloseIsSignedIn = () => {
    history.goBack();
  };
  return (
    <div className={classes.root}>
      <Dialog
        open={!isSignedIn}
        onClose={handleCloseIsSignedIn}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Docusign Verification Failed !"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You are currently not signed in with docusign. You will be
            redirected to the previous page.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseIsSignedIn} autoFocus>
            Okay
          </Button>
        </DialogActions>
      </Dialog>
      <ProfileAppbar
        name={"Create Envelope "}
        profile={profile}
        btns={
          <>
            {privateButton}
            <ShareIconBtn
              open={sharedProps?.open}
              setOpen={sharedProps?.setOpen}
            />

            <CreateBtn
              ref={saveRef}
              onClick={() => {
                handleClickCreateBtn();
              }}
              disabled={isSavePending}
            >
              Save
            </CreateBtn>
          </>
        }
      />

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
            padding: "10px",
            width: "100%",
          }}
        >
          <Grid item xs={12}>
            <TitleInput
              title={title}
              placeholder={"Doc Title"}
              setTitle={setTitle}
              type={"Template"}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography className={classes.text}>
              Choose how you want to save the document
            </Typography>
          </Grid>
          <Grid
            container
            style={{
              border: "1px solid black",
              borderRadius: "15px",
              margin: "1rem",
              padding: "0.7rem",
            }}
          >
            <FormControl fullWidth>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={saveType}
                onChange={(e) => setSaveType(e.target.value)}
              >
                <MenuItem value={"GENERATE_TEMPLATE"}>
                  Generate From Available Template
                </MenuItem>
                <MenuItem value={"UPLOAD_DIRECTLY"}>Upload Directly</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {saveType == "UPLOAD_DIRECTLY" ? (
            <>
              {" "}
              <Grid
                item
                sm={12}
                md={3}
                xs={12}
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography variant="h4" className={classes.text}>
                  Files
                </Typography>
              </Grid>
              <Grid
                item
                sm={12}
                md={9}
                xs={12}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <FileUploadButton
                  parentType="Doc"
                  used={false}
                  parentId={null}
                  IconColor="white"
                  iconBig={true}
                  aditionalText={"Add file"}
                  attachIconStyle={classes.attachIconFont}
                  iconWithTextStyle={classes.iconWithTextStyle}
                  isDocuSignFileTypes={true} //making true to only accept DocuSign Supported Types.
                />
                <div style={{ marginTop: "20px" }}>
                  <FilesViewer
                    fileIds={createdFileIds}
                    deletable={true}
                    handler={removeSingleImgFromReducerAndDelete}
                  />
                </div>
              </Grid>{" "}
              <Grid
                item
                xs={12}
                style={{
                  marginLeft: "1rem",
                  padding: "0.7rem",
                }}
              >
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={createAsTemplate}
                        onChange={handleChangeCreateAsTemplateOption}
                        defaultChecked
                      />
                    }
                    label="Create as a template"
                  />
                </FormGroup>
              </Grid>{" "}
            </>
          ) : null}
          {saveType == "GENERATE_TEMPLATE" ? (
            <>
              {" "}
              <Grid item xs={12}>
                <Typography className={classes.text}>
                  Generate from Template
                </Typography>
              </Grid>
              <Grid
                item
                xs={12}
                style={{
                  border: "1px solid black",
                  borderRadius: "15px",
                  margin: "1rem",
                  padding: "0.7rem",
                }}
              >
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Select from available envelopes
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedTemplateIdForEnvelope}
                    label="Generate From"
                    onChange={handleSelectedTemplateIdForEnvelope}
                  >
                    {avialableTemplates.map((template) => (
                      <MenuItem value={template.id}>{template.title}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </>
          ) : null}

          <Grid item xs={12}>
            <DescriptionInput
              description={description}
              placeholder={"Doc Description ( optional )"}
              setDescription={setDescription}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography className={classes.text}>Recipient Records</Typography>
          </Grid>
          <Grid
            item
            xs={12}
            style={{
              border: "1px solid black",
              borderRadius: "15px",
              margin: "1rem",
              padding: "0.7rem",
            }}
          >
            <div
              style={{
                display: "flex",
                margin: "1rem",
                width: "100%",
              }}
            >
              <Grid item xs={5}>
                <Typography align="center" className={classes.textTitle}>
                  Email
                </Typography>
              </Grid>
              <Grid item xs={5}>
                <Typography align="center" className={classes.textTitle}>
                  Name
                </Typography>
              </Grid>
            </div>
            {recepients.map((obj, idx) => (
              <Grid
                container
                style={{ width: "100%", margin: "0.7rem" }}
                spacing={1}
              >
                <Grid item xs={5}>
                  <TextField
                    label="Email"
                    fullWidth
                    value={recepients[idx]["mail"]}
                    onChange={(e) => onMailChange(e.target.value, idx)}
                    placeholder="Enter E-mail of recipient"
                    variant="outlined"
                    type="email"
                  ></TextField>
                </Grid>
                <Grid item xs={5}>
                  <TextField
                    label="Name"
                    fullWidth
                    value={recepients[idx]["name"]}
                    onChange={(e) => onNameChange(e.target.value, idx)}
                    inputProps={{ className: classes.link }}
                    placeholder="Enter name of recipients"
                    variant="outlined"
                  ></TextField>
                </Grid>
                <Grid item xs={2}>
                  <IconButton
                    style={{ display: "50%" }}
                    onClick={() => addNew(idx)}
                  >
                    <AddIcon />
                  </IconButton>
                  <IconButton
                    style={{ display: "50%" }}
                    disabled={recepients.length == 1}
                    onClick={() => onDelete(idx)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
            {linkError && (
              <Alert severity="error">
                Please fill all fields or delete them if not required.
              </Alert>
            )}
          </Grid>

          {/* CC Email */}
          <Grid item xs={12}>
            <CustomTitleInput
              title={ccMail}
              type={"email"}
              text={"Email of the CC "}
              placeholder={"cc@example.com"}
              setTitle={setCcMail}
              label="CC Email"
              name="CC Email"
            />
          </Grid>

          {/* CC Name */}
          <Grid item xs={12}>
            <CustomTitleInput
              title={ccName}
              text={"Name of the CC "}
              placeholder={"Mr. John Doe"}
              setTitle={setCcName}
              label="CC Name"
              name="CC Name"
            />
          </Grid>

          <Grid
            item
            sm={12}
            md={3}
            xs={12}
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: "1rem",
            }}
          >
            <Typography variant="h4" className={classes.text}>
              Shared
            </Typography>
          </Grid>
          <Grid item xs={12} md={9}>
            <div>{sharedPeoples}</div>
          </Grid>
        </Grid>
      )}
    </div>
  );
}

export default CreateProfileEnvelope;
