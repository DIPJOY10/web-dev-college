import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  IconButton,
  InputBase,
  TextField,
  Typography,
  useMediaQuery,
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
import FilesViewer from "../file/Viewer/FilesViewer";
import FileUploadButton from "../file/Uploader/FileUploadButton";
import { updateDeleteFlagForSingleFiles } from "../propertyManagement/apiCall";
import useGetDocs from "./useGetDocs";

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
    fontSize: 22,
		fontWeight: 500,
		margin: "0rem 1rem",
		fontFamily:"Heebo"
  },
  textTitle: {
    fontSize: 19,
    fontWeight: "500",
    margin: "0rem 1rem",
    fontFamily:"Heebo"
  },
  link: {
    color: "blue",
    fontStyle: "italic",
  },
  attachIconFont: {
    fontSize: "15px",
    transform: "rotate(-20deg)",
    marginRight: "5px",
  },
  iconWithTextStyle: {
    border: `1px solid ${theme.palette.primary.main}`,
    width: "120px",
    '&:hover':{
      backgroundColor: '#BFEAF5',
    }
  },
}));

function CreateProfileTemplate(props) {
  const history = useHistory();
  const classes = useStyles();

  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { profileId } = useParams();
  const [selectedTemplateIdForEnvelope, setSelectedTemplateIdForEnvelope] =
    useState("");
  const file = useSelector((state) => state.file);

  const { user } = useSelector((state) => state.auth);

  const userProfileId = user?.profile;
  const [docType, setDocType] = useState("DOCUMENT");
  const [isPrivate, setPrivate] = useState(false);
  const sharedProps = useShared({
    initShared: [profileId, userProfileId],
    initAssigned: [],
  });
  //   console.log(Array.from(new Set(sharedProps?.shared)), "Type of");
  const profile = useGetProfile(profileId);
  const { createdFileIds } = file;
  const [links, setLinks] = useState([{ title: "", link: "" }]);
  const [linkError, setLinkError] = useState(false);
  var { privateButton, assignButton, assigness, sharedPeoples } = SharedList(
    sharedProps,
    isPrivate,
    setPrivate
  );
  const { docIds, setDocIds, docDictionary, setDocDictionary, loadingDocs } =
    useGetDocs(profileId);
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

  const onTitleChange = (newValue, idx) => {
    let temp = [...links];
    temp[idx]["title"] = newValue;
    setLinks([...temp]);
  };
  const onLinkChange = (newValue, idx) => {
    let temp = [...links];
    temp[idx]["link"] = newValue;
    setLinks([...temp]);
  };
  const addNew = (idx) => {
    let temp = { title: "", link: "" };
    setLinks([...links.slice(0, idx), temp, ...links.slice(idx)]);
  };
  const onDelete = (idx) => {
    if (links.length > 1) {
      setLinks([...links.slice(0, idx), ...links.slice(idx + 1)]);
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
  const handleChangeDocType = (event) => {
    setDocType(event.target.value);
  };
  const handleSelectedTemplateIdForEnvelope = (event) => {
    setSelectedTemplateIdForEnvelope(event.target.value);
  };
  const createDocApi = async () => {
    let check = true;
    if (links.length == 1) {
      if (Boolean(links[0].title) ^ Boolean(links[0].link)) {
        check = false;
        setLinkError(true);
        setTimeout(() => {
          setLinkError(false);
        }, 4000);
      }
    } else {
      for (var i = 0; i < links.length; i++) {
        let temp = links[i];
        if (temp.title && temp.link) {
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
        links,
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
          message: "Doc created successfully",
        },
      });

      dispatch({ type: "FileUploadReset" });

      history.goBack();
    }
  };

  return (
    <div className={classes.root}>
      <ProfileAppbar
        name={"Create Template"}
        profile={profile}
        btns={
          <>
            {privateButton}
            <ShareIconBtn
              open={sharedProps?.open}
              setOpen={sharedProps?.setOpen}
            />

            <CreateBtn
              onClick={() => {
                createDocApi();
              }}
            >
              Save
            </CreateBtn>
          </>
        }
      />

      {sharedProps?.shareDrawer}
      {sharedProps?.assignedDialog}

      <Grid
        container
        style={{
          backgroundColor: "white",
          padding: "2rem",
          marginTop:"1.5rem",
          width: "100%",
        }}
      >
        <Grid item xs={12}>
          <TitleInput
            title={title}
            placeholder={"Ex. Pune Flat.03 rental agreement"}
            setTitle={setTitle}
            type={"Template"}
          />
        </Grid>

        <Grid item xs={12}>
          <DescriptionInput
            description={description}
            placeholder={"Doc Description ( optional )"}
            setDescription={setDescription}
          />
        </Grid>
        <Grid item xs={12} style={{marginTop:'1rem'}}>
          <Typography className={classes.text}>Supporting Links</Typography>
        </Grid>
        <Grid
          item
          xs={12}
          style={{
          }}
        >
          <div
            style={{
              display: "flex",
              width: "100%",
              marginTop:'.5rem'
            }}
          >
            <Grid item xs={5}>
              <Typography align="start" className={classes.textTitle}>
                Title
              </Typography>
            </Grid>
            <Grid item xs={5}>
              <Typography align="start" className={classes.textTitle}>
                Link
              </Typography>
            </Grid>
          </div>
          {links.map((obj, idx) => (
            <Grid
              container
              style={{ width: "100%", margin: "0.8rem" }}
              spacing={1}
            >
              <Grid item xs={5}>
                <InputBase
                  label="Title"
                  fullWidth
                  value={links[idx]["title"]}
                  onChange={(e) => onTitleChange(e.target.value, idx)}
                  placeholder="Enter Title"
                  variant="outlined"
                  style={{padding:'.3rem',border:'1px solid gray',borderRadius: ".3rem", }}
                ></InputBase>
              </Grid>
              <Grid item xs={5}>
                <InputBase
                  style={{padding:'.3rem',border:'1px solid gray',borderRadius: ".3rem", }}
                  label="Link"
                  fullWidth
                  value={links[idx]["link"]}
                  onChange={(e) => onLinkChange(e.target.value, idx)}
                  inputProps={{ className: classes.link }}
                  placeholder="Enter Hyperlink"
                  variant="outlined"
                ></InputBase>
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
                  disabled={links.length == 1}
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
        <Grid
          item
          sm={12}
          md={3}
          xs={12}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent:'space-between',
            marginTop:'2rem'
          }}
        >
          <Typography variant="h4" className={classes.text}>
            Files
          </Typography>
          <div>
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
          </div>
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
          <div style={{ marginTop: "7.5rem" }}>
            <FilesViewer
              fileIds={createdFileIds}
              deletable={true}
              handler={removeSingleImgFromReducerAndDelete}
            />
          </div>
        </Grid>
        <Grid
          item
          sm={12}
          md={3}
          xs={12}
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: "2rem",
          }}
        >
          <Typography variant="h4" className={classes.text}>
            Shared
          </Typography>
        </Grid>
        <Grid style={{marginTop:'2.2rem'}} item xs={12} md={9}>
          <div>{sharedPeoples}</div>
        </Grid>
      </Grid>
    </div>
  );
}

export default CreateProfileTemplate;
