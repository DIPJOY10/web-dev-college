import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { makeStyles, useTheme, withStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import EditIcon from "@material-ui/icons/Edit";
import Geocode from "react-geocode";
import geoCodeFromZip from "../../helpers/geoCode";
import { IconButton } from "@material-ui/core";
import FileUploadButton from "../file/Uploader/FileUploadButton";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import configObject from "../../config/index";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import CloseIcon from "@material-ui/icons/Close";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import { updateUserInfo } from "./api";
import AboutDialog from "./Dialogs/AboutDialog";
import EducationDialog from "./Dialogs/EducationDialog";
import ExperienceDialog from "./Dialogs/ExperienceDialog";
import OrganizationDialog from "./Dialogs/OrganizationDialog";
import OrganizationEdit from "./Dialogs/OrganizationEdit";
import SkillDialog from "./Dialogs/SkillDialog";
import EducationEdit from "./Dialogs/EducationEdit";
import ExperienceEdit from "./Dialogs/ExperienceEdit";
import SkillEdit from "./Dialogs/SkillEdit";
import AddIcon from "@material-ui/icons/Add";
import ReactToPrint from "react-to-print";
import GetAppIcon from "@material-ui/icons/GetApp";
import OrganizationSection from "./sections/OrganizationSection";
import SkillSection from "./sections/SkillSection";
import EducationSection from "./sections/EducationSection";
import ExperienceSection from "./sections/ExperienceSection";
import AboutSection from "./sections/AboutSection";
import ProjectSection from "./sections/ProjectSection";
import ProjectDialog from "./Dialogs/ProjectDialog";
import ProjectEdit from "./Dialogs/ProjectEdit";
import LanguageSection from "./sections/LanguageSection";
import LangugageDialog from "./Dialogs/LanguageDialog";
import LanguageEdit from "./Dialogs/LanguageEdit";
import ImageGalleryDialog from "./Dialogs/ImageGalleryDialog";
import LicenseSection from "./sections/LicenseSection";
import LicenseDialog from "./Dialogs/LicenseDialog";
import LicenseEdit from "./Dialogs/LicenseEdit";
import HonorSection from "./sections/HonorSection";
import HonorDialog from "./Dialogs/HonorDialog";
import HonorEdit from "./Dialogs/HonorEdit";
import PersonAddOutlinedIcon from "@material-ui/icons/PersonAddOutlined";
import HowToRegOutlinedIcon from "@material-ui/icons/HowToRegOutlined";
import ActionBtnCircle from "../action.btn.circle";
import PayDialog from "./PayDialog";
import SendMessage from "../profileChat/send.message";
import Api from "../../helpers/Api";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import UserAbout from "./UserAbout/index";
import PostAddIcon from "@material-ui/icons/PostAdd";
import InfoIcon from "@material-ui/icons/Info";
import WorkIcon from "@material-ui/icons/Work";
import { AppBar, Box, Toolbar } from "@material-ui/core";
import ProfileData from "../profile/cards/index";
import { Home } from "@material-ui/icons";
import ProfilePost from "../post/ProfilePost";
import Choose from "../select/choose";

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    borderTop: "1px solid white",
    borderBottom: "0",
    borderRadius: "10px",
    paddingBottom: "1rem",
  },
  overlay: {
    position: "relative",
    backgroundColor: (props) => (props.cover ? "none" : "#C9CCD5"),
    backgroundImage: (props) => (props.cover ? `url(${props.cover})` : "none"),
    backgroundSize: "cover",
    // backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    height: "15rem",
    width: "100%",
    borderRadius: "1px solid white",
    borderRadius: "10px",
    borderBottom: "0",
  },
  coverUploadButton: {
    position: "absolute",
    right: "10px",
    backgroundColor: "white",
    border: "1px solid #2296f3",
    borderRadius: "100%",
    top: "10px",
  },
  imgParent: {
    position: "absolute",
    zIndex: 100,
    cursor: (props) => (props.isOwnProfile ? "pointer" : null),
    top: "130px",
    left: "10px",
    "&:hover": {
      // opacity: (props) => (props.isOwnProfile ? "0.8" : "1"),
      "& $hoverUploadButton": {
        opacity: 1,
      },
    },
  },
  imgAvatar: {
    height: "10rem",
    width: "10rem",
    objectFit: "cover",
    border: "4px solid white",
    borderRadius: "100%",
  },
  profileContent: {
    display: "flex",
    justifyContent: "space-between",
    marginLeft: "1.5rem",
    "& $h2": {
      fontSize: "1.8rem",
      fontWeight: "normal",
      display: "inline",
    },
  },
  info__location: {
    display: "flex",
    width: "90%",
  },
  header_buttons: {
    marginLeft: "1.5rem",
    marginTop: "1rem",
    "& $Button": {
      marginRight: "1rem",
    },
  },
  content_left: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "left",
    "& $p": {
      fontSize: "1rem",
      color: "grey",
    },
  },
  editIcon: {
    marginTop: "0.5rem",
    marginLeft: "auto",
    marginRight: "1rem",
    height: "8vh",
  },
  hoverUploadButton: {
    transition: ".5s ease",
    position: "absolute",
    opacity: 0,
    backgroundColor: "white",
    border: "1px solid white",
    borderRadius: "100%",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  editDialog: {
    width: "100%",
    "& .MuiFormControl-root": {
      width: "90%",
      margin: theme.spacing(1),
    },
    padding: "2rem",
  },
  dialog__content: {
    width: "100%",
    "& $p": {
      borderBottom: "1px solid grey",
      fontSize: "1rem",
      cursor: "pointer",
      padding: "1rem",
      fontWeight: "400",
      "&:hover": {
        backgroundColor: "#F9F9F9",
      },
    },
    "& $h3": {
      fontWeight: "300",
      color: "grey",
    },
  },
  headerActionBtns: {
    display: "flex",
    alignItems: "center",
    marginLeft: "1.5rem",
    "& *": {
      marginTop: "0",
    },
    "& $Button": {
      marginRight: "1rem",
    },
  },
  tabs__panel: {
    // marginLeft: "1.5rem",
    marginTop: "1rem",
    paddingLeft: "1.5rem",
    borderTop: "2px solid #fafafa",
    flexGrow: 1,
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },

  followBox: {
    display: "flex",
    marginBottom: "10px",
    justifyContent:'flex-start'
  },

  followBold: {
    fontWeight: "600",
  },
}));

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const CustomTab = withStyles({
  root: {
    textTransform: "none",
    fontSize: "1rem",
    minWidth: 50,
  },
})(Tab);

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const UserProfileTopView = ({
  isGuestView,
  profile,
  onSearch,
  adminProfiles,
  isOwnProfile,
}) => {
  const componentRef = useRef();
  const history = useHistory();

  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const auth = useSelector((state) => state.auth);
  const { user, organizationIds, organizationDictionary } = useSelector(
    (state) => state.auth
  );
  const { createdFileIds } = useSelector((state) => state.file);
  const [cover, setCover] = useState(profile?.parent?.cover?.url || "");
  const [displayPicture, setDisplayPicture] = useState(
    'https://previews.123rf.com/images/triken/triken1608/triken160800028/61320729-male-avatar-profile-picture-default-user-avatar-guest-avatar-simply-human-head-vector-illustration-i.jpg'
  );

  const [openChoose, setOpenChoose] = useState(false)
  const [followingCount, setFollowingCount] = useState(
    profile?.followingCount || 0
  );
  const [followerCount, setFollowerCount] = useState(
    profile?.followerCount || 0
  );

  const [convId, setConvId] = useState(null);
  // console.log('conversation is the ',conversations);

  const [follow, setFollow] = useState({});
  const [isFollowing, setIsFollowing] = useState(false);
  const [sender, setSender] = useState(user);

  const [open, setOpen] = useState(false);
  const [sectionAddOpen, setSectionAddOpen] = useState(false);
  const [dialog, setDialog] = useState(false);
  const [showAbout, setShowAbout] = useState(true);
  const [showExperience, setShowExperience] = useState(true);
  const [showExperienceEdit, setShowExperienceEdit] = useState(true);
  const [showEducation, setShowEducation] = useState(true);
  const [showEducationEdit, setShowEducationEdit] = useState(true);
  const [showSkill, setShowSkill] = useState(true);
  const [showSkillEdit, setShowSkillEdit] = useState(true);
  const [showOrganization, setShowOrganization] = useState(true);
  const [showOrganizationEdit, setShowOrganizationEdit] = useState(true);
  const [showProject, setShowProject] = useState(true);
  const [showProjectEdit, setShowProjectEdit] = useState(true);
  const [showLang, setShowLang] = useState(true);
  const [showLangEdit, setShowLangEdit] = useState(true);
  const [showLicense, setShowLicense] = useState(true);
  const [showLicenseEdit, setShowLicenseEdit] = useState(true);
  const [showHonor, setShowHonor] = useState(true);
  const [showHonorEdit, setShowHonorEdit] = useState(true);
  const [galleryFileIds, setGalleryFileIds] = useState([]);
  const [showGallery, setShowGallery] = useState(true);

  //description form variables
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [description, setDescription] = useState(user?.description || "");

  const [locationCountry, setLocationCountry] = useState(
    user?.locationCountry || ""
  );
  const [locationCity, setLocationCity] = useState(user?.locationCity || "");
  const [zip, setLocationZIP] = useState(user?.zip || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");

  const handleEditOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSectionAddOpen(false);
  };

  const [view, setView] = useState("About");
  let View = UserAbout;

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const classes = useStyles({ cover, isOwnProfile });

  const {
    root,
    overlay,
    imgParent,
    imgAvatar,
    profileContent,
    content_left,
    content_right,
    editIcon,
    editBtn,
    coverUploadButton,
    hoverUploadButton,
    editDialog,
    dialog__content,
    header_buttons,
    info__location,
    headerActionBtns,
    tabs__panel,
  } = classes;

  const uploadImg = async (fileType) => {
    const res = await Api.post("user/dpChange", {
      userId: user?._id,
      fileId: createdFileIds[0],
      fileType: fileType,
    });
    if (res?.data) {
      if (fileType === "DP") {
        dispatch({
          type: "AddAuth",
          payload: {
            user: {
              ...user,
              displayPicture: res.data,
            },
          },
        });
        setDisplayPicture(res.data.url);
      } else {
        dispatch({
          type: "AddAuth",
          payload: {
            user: {
              ...user,
              cover: res.data,
            },
          },
        });
        setCover(res.data.url);
      }
    }
  };

  const saveIntro = async () => {
    //api call
    Geocode.setApiKey(configObject.mapKey);
    console.log(zip);
    const userObj = {
      displayName: fName+' '+lName,
      description,
      locationCountry,
      locationCity,
      email,
      phone,
      zip,
    };

    if (zip) {
      // let response, geoRes;
      try {
        const geoRes = await geoCodeFromZip(zip);
        const response = await Geocode.fromAddress(zip);
        const { lat, lng } = response?.results[0]?.geometry?.location || {};
        console.log("location", lng, lat);
        if (lat && lng) {
          userObj.latitude = lat;
          userObj.longitude = lng;
          userObj.location = {
            type: "Point",
            coordinates: [lng * 1, lat * 1],
            cityName: locationCity,
            countryName: locationCountry || geoRes?.country,
            stateName: geoRes?.state,
            zipCode: zip,
          };
        }
      } catch (error) {
        console.error(error);
      }
    }
    const newUserState = updateUserInfo({
      userId: user?._id,
      userInfo: userObj,
    });
    console.log(newUserState);

    dispatch({
      type: "AddAuth",
      payload: {
        user: {
          ...user,
          ...userObj,
        },
      },
    });
    setOpen(false);
  };

  const saveData = (userData) => {
    const newUserState = updateUserInfo({
      userId: user?._id,
      userInfo: userData,
    });
    console.log(newUserState);
    dispatch({
      type: "AddAuth",
      payload: {
        user: {
          ...user,
          ...userData,
        },
      },
    });
  };

  useEffect(() => {
    if (isOwnProfile === true) {
      setDisplayPicture(user?.displayPicture?.url);
      setCover(user?.cover?.url);
    }
  }, []);

  useEffect(() => {
    Api.post("chat/mutual", {
      userId: user?.profile,
      personId: profile?._id,
    }).then((res) => {
      const convAndMessages = res.data;
    });
  }, []);

  useEffect(() => {
    async function getIsFollowing() {
      // console.log("isFollowing Called", user?.profile);
      const isFollowingRes = await Api.post("follow/isfollowing", {
        userProfile: user?.profile,
        profile: profile?._id,
      });
      setIsFollowing(isFollowingRes.data);
    }
    getIsFollowing();
  }, [follow]);

  console.log({ user, profile });

  const handleFollow = async () => {
    const followRes = await Api.post("follow/follow", {
      profile: profile?._id,
      user: user?._id,
      userProfile: user?.profile,
    });
    setFollow(followRes.data);
    if (followRes?.data) setFollowerCount((prev) => prev + 1);
    else setFollowerCount((prev) => prev - 1);
  };

  const goToMessage = () => {
    const convPath = convId ? "" + convId : "";
    const path = "/messages/" + convPath;

    history.push(path);
  };

  console.log(profile);

  switch (view) {
    case "About":
      View = UserAbout;
      break;

    case "Home":
      View = ProfileData;
      break;

    case "Posts":
      View = ProfilePost;
      break;

    default:
      break;
  }

  const [isEducation,setIsEducation] = useState(false);
  const [progress,setProgress] = useState(10);
  return (
    <div className={root} ref={componentRef}>
      <Paper className={root}>
        <div className={overlay}>
          {isOwnProfile ? (
            <div className={coverUploadButton}>
              <FileUploadButton
                parentType="User"
                used={true}
                parentId={user._id}
                isDP={true}
                isCover={true}
                uploadImg={uploadImg}
              />
            </div>
          ) : null}
          <div className={imgParent}>
           <Avatar className={imgAvatar}  src={displayPicture} />
            {isOwnProfile ? (
              <div className={hoverUploadButton}>
                <FileUploadButton
                  parentType="User"
                  used={true}
                  parentId={user._id}
                  isDP={true}
                  isCover={false}
                  uploadImg={uploadImg}
                />
              </div>
            ) : null}
          </div>
        </div>
        <div className={editIcon}>
          {isOwnProfile ? (
            <div>
              <IconButton className={editBtn} onClick={handleEditOpen}>
                <EditIcon reverse />
              </IconButton>
              <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
                className={editDialog}
                scroll={"paper"}
              >
                <DialogTitle id="form-dialog-title" onClose={handleClose}>
                  Edit Profile Intro
                </DialogTitle>
                <DialogContent dividers className={dialog__content}>
                  <DialogContentText>Intro</DialogContentText>
                  <TextField
                    required
                    id="name"
                    label="FirstName"
                    value={fName}
                    onChange={(e) => {
                      setFName(e.target.value);
                    }}
                    variant="outlined"
                    fullWidth
                  />
                  <TextField
                    required
                    id="name"
                    label="LastName"
                    value={lName}
                    onChange={(e) => {
                      setLName(e.target.value);
                    }}
                    variant="outlined"
                    fullWidth
                  />
                  <TextField
                    required
                    id="description"
                    label="Short Description"
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                    }}
                    variant="outlined"
                    fullWidth
                  />
                  <DialogContentText>Location</DialogContentText>
                  <TextField
                    required
                    id="country"
                    label="Country/Region"
                    value={locationCountry}
                    onChange={(e) => {
                      setLocationCountry(e.target.value);
                    }}
                    variant="outlined"
                    fullWidth
                  />
                  <div className={info__location}>
                    <TextField
                      id="city"
                      label="City"
                      value={locationCity}
                      onChange={(e) => {
                        setLocationCity(e.target.value);
                      }}
                      variant="outlined"
                    />
                    <TextField
                      id="zip"
                      label="ZIP"
                      value={zip}
                      onChange={(e) => {
                        setLocationZIP(e.target.value);
                      }}
                      variant="outlined"
                    />
                  </div>
                  <DialogContentText>Contact Info</DialogContentText>
                  <TextField
                    required
                    id="email"
                    label="Email"
                    variant="outlined"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    fullWidth
                  />
                  <TextField
                    id="phone"
                    label="Phone"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                    }}
                    variant="outlined"
                    fullWidth
                  />
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={handleClose}
                    color="primary"
                    variant="outlined"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={saveIntro}
                    color="primary"
                    variant="outlined"
                  >
                    SAVE
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
          ) : null}
        </div>

        <div className={profileContent}>
          <div className={content_left}>
            <h2>{profile?.parent?.displayName}</h2>
            <p>{profile?.parent?.description}</p>
            <p>
              {profile?.parent?.locationCity}
              {profile?.parent?.locationCountry
                ? `, 
              ${profile?.parent?.locationCountry}`
                : null}
            </p>
            <div className={classes.followBox}>
              <div className={classes.followerCount}>
                <span className={classes?.followBold}>
                  {followerCount || 0}
                </span>{" "}
                followers
              </div>
              <div className={classes.followerCount} style={{marginLeft:'.7rem'}}>
                <span className={classes?.followBold}>
                  {followingCount || 0}
                </span>{" "}
                following
              </div>
            </div>
          </div>
          <div className={content_right}></div>
        </div>
        {isOwnProfile ? (
          <div className={header_buttons}>
            <Button
              style={{ textTransform: "none",borderRadius:'1.2rem' }}
              variant="outlined"
              color="primary"
              onClick={() => setSectionAddOpen(true)}
            >
              Add Profile Section
            </Button>
            <Button
              style={{ textTransform: "none",borderRadius:'1.2rem' }}
              variant="outlined"
              color="primary"
              onClick={() => setOpenChoose(true)}
            >
              Choose
            </Button>
            <Choose 
                open={openChoose}
                setOpen={setOpenChoose}
                multiple={true}
                placeHolder={'Import Template'}
                onSelected={(arr)=>{
                  console.log(arr,' is the array')
                }}
            />
            {/* <ReactToPrint
              trigger={() => (
                <Button
                  style={{ textTransform: "none" }}
                  variant="outlined"
                  color="primary"
                  className={editBtn}
                  startIcon={<GetAppIcon />}
                  aria-label="Download Pdf"
                >
                  Profile Pdf
                </Button>
              )}
              content={() => componentRef.current}
            /> */}
            <Dialog
              open={sectionAddOpen}
              onClose={handleClose}
              aria-labelledby="form-dialog-title"
              className={editDialog}
              scroll={"paper"}
              fullWidth
            >
              <DialogTitle id="form-dialog-title" onClose={handleClose}>
                Add to Profile
              </DialogTitle>
              <DialogContent dividers className={dialog__content}>
                <h3>
                  Add sections to increase your credibility & standout among the
                  rest
                </h3>
                <p
                  onClick={() => {
                    handleClose();
                    setShowAbout(true);
                    setDialog("about");
                  }}
                >
                  Add About
                </p>
                <p
                  onClick={() => {
                    handleClose();
                    setShowEducation(true);
                    setDialog("education");
                  }}
                >
                  Add Education
                </p>
                <p
                  onClick={() => {
                    handleClose();
                    setShowExperience(true);
                    setDialog("experience");
                  }}
                >
                  Add Experience
                </p>
                <p
                  onClick={() => {
                    handleClose();
                    setShowSkill(true);
                    setDialog("skills");
                  }}
                >
                  Add Skills
                </p>
                <p
                  onClick={() => {
                    handleClose();
                    setShowProject(true);
                    setDialog("projects");
                  }}
                >
                  Add Projects
                </p>
                <p
                  onClick={() => {
                    handleClose();
                    setShowLang(true);
                    setDialog("languages");
                  }}
                >
                  Add Languages
                </p>
                <p
                  onClick={() => {
                    handleClose();
                    setShowLicense(true);
                    setDialog("licenses");
                  }}
                >
                  Add Licenses & Certifications
                </p>
                <p>Add Recommendations</p>
              </DialogContent>
            </Dialog>
            {(() => {
              switch (dialog) {
                case "about":
                  return (
                    <AboutDialog
                      open={showAbout}
                      setOpen={setShowAbout}
                      saveData={saveData}
                    />
                  );
                case "education":
                  return (
                    <EducationDialog
                      open={showEducation}
                      setOpen={setShowEducation}
                      enableEdit={0}
                      currentEduObj={null}
                      setIsEducation={setIsEducation}
                      setProgress={setProgress}
                      
                    />
                  );
                case "educationEdit":
                  return (
                    <EducationEdit
                      open={showEducationEdit}
                      setOpen={setShowEducationEdit}
                      educationArray={user?.education}
                      setProgress={setProgress}
                    />
                  );
                case "experience":
                  return (
                    <ExperienceDialog
                      open={showExperience}
                      setOpen={setShowExperience}
                      saveData={saveData}
                      setProgress={setProgress}
                    />
                  );
                case "experienceEdit":
                  return (
                    <ExperienceEdit
                      open={showExperienceEdit}
                      setOpen={setShowExperienceEdit}
                    />
                  );
                case "skills":
                  return (
                    <SkillDialog
                      open={showSkill}
                      setOpen={setShowSkill}
                      saveData={saveData}
                      setProgress={setProgress}
                    />
                  );
                case "skillEdit":
                  return (
                    <SkillEdit
                      open={showSkillEdit}
                      setOpen={setShowSkillEdit}
                    />
                  );
                case "projects":
                  return (
                    <ProjectDialog
                      open={showProject}
                      setOpen={setShowProject}
                      saveData={saveData}
                    />
                  );
                case "projectEdit":
                  return (
                    <ProjectEdit
                      open={showProjectEdit}
                      setOpen={setShowProjectEdit}
                      saveData={saveData}
                    />
                  );
                case "languages":
                  return (
                    <LangugageDialog
                      open={showLang}
                      setOpen={setShowLang}
                      saveData={saveData}
                      setProgress={setProgress}
                    />
                  );
                case "languageEdit":
                  return (
                    <LanguageEdit
                      open={showLangEdit}
                      setOpen={setShowLangEdit}
                      saveData={saveData}
                    />
                  );
                case "licenses":
                  return (
                    <LicenseDialog
                      open={showLicense}
                      setOpen={setShowLicense}
                    />
                  );
                case "licenseEdit":
                  return (
                    <LicenseEdit
                      open={showLicenseEdit}
                      setOpen={setShowLicenseEdit}
                    />
                  );
                case "projImageGallery":
                  return (
                    <ImageGalleryDialog
                      open={showGallery}
                      setOpen={setShowGallery}
                      imageIds={galleryFileIds}
                    />
                  );
                default:
                  return null;
              }
            })()}
          </div>
        ) : (
          <div className={headerActionBtns}>
            <div>
              <Button
                style={{ textTransform: "none" }}
                variant={isFollowing ? "outlined" : "contained"}
                color="primary"
                startIcon={
                  isFollowing ? (
                    <HowToRegOutlinedIcon fontSize="large" />
                  ) : (
                    <AddIcon fontSize="large" />
                  )
                }
                onClick={() => {
                  handleFollow();
                }}
              >
                {isFollowing ? "Following" : "Follow"}
              </Button>
              {/* <ActionBtnCircle actionFn={handleFollow}>
                {isFollowing ? (
                  <HowToRegOutlinedIcon />
                ) : (
                  <PersonAddOutlinedIcon />
                )}
              </ActionBtnCircle> */}
            </div>

            {/* <PayDialog
              profile={profile}
              onSearch={onSearch}
              ownProfile={isOwnProfile}
            /> */}
            <SendMessage
              adminProfiles={adminProfiles}
              senderProfile={sender}
              receiverProfile={profile?.parent}
              setSenderProfile={setSender}
            />
          </div>
        )}
        <div className={tabs__panel}>
          <div>
            <Tabs
              value={value}
              onChange={handleChange}
              TabIndicatorProps={{
                style: {
                  backgroundColor: "#17804f",
                },
              }}
              variant="scrollable"
              scrollButtons="auto"
              aria-label="scrollable auto tabs example"
            >
              {/* {isOwnProfile ? (
                <CustomTab
                  label={
                    <div>
                      <Home style={{ verticalAlign: "middle" }} /> Home
                    </div>
                  }
                  onClick={() => {
                    setView("Home");
                  }}
                />
              ) : null} */}
              <CustomTab
                label={
                  <div>
                    <InfoIcon style={{ verticalAlign: "middle" }} /> About
                  </div>
                }
                onClick={() => {
                  setView("About");
                }}
              />
              <CustomTab
                label={
                  <div>
                    <PostAddIcon style={{ verticalAlign: "middle" }} /> Posts
                  </div>
                }
                onClick={() => {
                  setView("Posts");
                }}
              />
              <CustomTab
                label={
                  <div>
                    <WorkIcon style={{ verticalAlign: "middle" }} /> Jobs
                  </div>
                }
              />
              -
            </Tabs>
          </div>
        </div>
      </Paper>
      <View
        isGuestView={isGuestView}
        isOwnProfile={isOwnProfile}
        profile={profile}
        profileId={profile?._id}
        dialog={dialog}
        setDialog={setDialog}
        setShowAbout={setShowAbout}
        setShowExperience={setShowExperience}
        setShowExperienceEdit={setShowExperienceEdit}
        setShowEducation={setShowEducation}
        isEducation={isEducation}
        progress={progress}
        setProgress={setProgress}
        setShowEducationEdit={setShowEducationEdit}
        setShowSkill={setShowSkill}
        setShowSkillEdit={setShowSkillEdit}
        setShowOrganization={setShowOrganization}
        setShowOrganizationEdit={setShowOrganizationEdit}
        setShowProject={setShowProject}
        setShowProjectEdit={setShowProjectEdit}
        setShowGallery={setShowGallery}
        setGalleryFileIds={setGalleryFileIds}
        setShowLang={setShowLang}
        setShowLangEdit={setShowLangEdit}
        setShowLicense={setShowLicense}
        setShowLicenseEdit={setShowLicenseEdit}
        setShowHonor={setShowHonor}
        setShowHonorEdit={setShowHonorEdit}
      />
    </div>
  );
};

export default UserProfileTopView;