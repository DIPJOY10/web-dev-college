import React, { useState } from "react";
import PropTypes from "prop-types";
import Paper from "@material-ui/core/Paper";
import { makeStyles, useTheme, withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { AppBar, Box, Toolbar } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import Avatar from "@material-ui/core/Avatar";
import DomainIcon from "@material-ui/icons/Domain";
import PostAddIcon from "@material-ui/icons/PostAdd";
import InfoIcon from "@material-ui/icons/Info";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import Button from "@material-ui/core/Button";
import OrgAbout from "./OrgAbout/index";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import WorkIcon from "@material-ui/icons/Work";

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    marginTop: "1rem",
    justifyContent: "center",
    alignItems: "center",
    padding: "1rem",
    paddingBottom: "6rem",
  },

  title: {
    fontSize: "2.5rem",
    fontWeight: "800",
    textAlign: "center",
  },

  appBar: {
    backgroundColor: "white",
    height: "4rem",
    marginTop: "1rem",
  },

  settingBtn: {
    paddingLeft: "1rem",
    padding: "0.5rem",
    paddingTop: "0.25rem",
    paddingBottom: "0.25rem",
  },

  settingText: {
    marginLeft: "0.5rem",
  },

  settingBtnPaper: {
    marginRight: "1rem",
  },

  actionList: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: "2rem",
    marginBottom: "1rem",
    backgroundColor: "#fafafa",
    padding: "1rem",
    justifyContent: "center",
  },

  tabRoot: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginBottom: "1rem",
    padding: "1rem",
  },
  editIcon: {
    textAlign: "right",
    marginTop: "0.5rem",
    marginLeft: "auto",
    marginRight: "1rem",
    height: "8vh",
  },

  svgSize: {
    fontSize: 20,
    height: 25,
    width: 25,
    marginTop: 10,
    color: "grey",
  },

  chipStyleSm: {
    marginTop: "1.5rem",
  },

  chipStyle: {
    marginTop: 0,
    marginRight: "1rem",
  },
  profileHeader: {
    width: "100%",
    height: "auto",
    paddingBottom: "1rem",
    marginBottom: "1rem",
  },
  overlay: {
    position: "relative",
    backgroundColor: (props) => (props.cover ? "none" : "#C9CCD5"),
    backgroundImage: (props) => (props.cover ? `url(${props.cover})` : "none"),
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    height: "15rem",
    width: "100%",
  },
  header_buttons: {
    marginLeft: "1.5rem",
    marginTop: "1rem",
    "& $Button": {
      marginRight: "1rem",
    },
  },
  imgParent: {
    position: "absolute",
    zIndex: 100,
    cursor: "pointer",
    top: "130px",
    left: "20px",
    "&:hover": {
      "& $hoverUploadButton": {
        opacity: 1,
      },
    },
  },
  imgAvatar: {
    height: "10rem",
    width: "10rem",
    backgroundSize: "cover",
    border: "4px solid white",
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
  imgDefaultIcon: {
    height: "9rem",
    width: "9rem",
  },
  tab__section: {
    width: "100%",
    backgroundColor: "#fafafa",
  },
  tabs__panel: {
    marginTop: "1rem",
    paddingLeft: "5px",
    borderTop: "2px solid #fafafa",
    flexGrow: 1,
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
}));

const CustomTab = withStyles({
  root: {
    textTransform: "none",
    fontSize: "1rem",
    minWidth: 100,
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

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`,
  };
}

export default function OrgProfileTopView(props) {
  const { profile } = props;
  const [view, setView] = useState("About");

  const defaultDisplayPic =
    "https://firebasestorage.googleapis.com/v0/b/contractflo.appspot.com/o/company.png?alt=media&token=357e859b-cd94-4ddb-9407-bcda8b79bce7";

  const [cover, setCover] = useState(profile?.parent?.cover?.url || "");
  const [displayPicture, setDisplayPicture] = useState(
    profile?.parent?.displayPicture?.url || ""
  );

  let View = OrgAbout;

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const classes = useStyles({ cover });

  const {
    root,
    profileHeader,
    overlay,
    imgParent,
    imgAvatar,
    profileContent,
    content_left,
    content_right,
    editIcon,
    imgDefaultIcon,
    tabs__panel,
    header_buttons,
  } = classes;

  switch (profile?.parent?.team.parentModelName) {
    case "Project":
      // NavView = <NavTop open={open} setOpen={setOpen} teamId={teamId} />;
      break;

    case "Organization":
      break;

    default:
      break;
  }

  switch (view) {
    case "About":
      View = OrgAbout;
      break;

    default:
      break;
  }

  return (
    // <div className={root}>
    //   <Paper className={profileHeader}>
    //     <div className={overlay}>
    //       <div className={imgParent}>
    //         {displayPicture && displayPicture !== defaultDisplayPic ? (
    //           <Avatar
    //             className={imgAvatar}
    //             variant="square"
    //             style={{ objectFit: "cover" }}
    //             src={displayPicture}
    //           />
    //         ) : (
    //           <Avatar
    //             className={imgAvatar}
    //             variant="square"
    //             style={{ objectFit: "cover" }}
    //           >
    //             <DomainIcon className={imgDefaultIcon} fontSize="large" />
    //           </Avatar>
    //         )}
    //       </div>
    //     </div>
    //     <div className={editIcon}></div>

    //     <div className={profileContent}>
    //       <div className={content_left}>
    //         <h2>{profile?.parent?.displayName}</h2>
    //         {profile?.parent?.tagline ? (
    //           <p>{profile?.parent?.tagline}</p>
    //         ) : null}
    //         {profile?.parent?.industry ? (
    //           <p>{profile?.parent?.industry}</p>
    //         ) : null}
    //       </div>
    //       <div className={content_right}></div>
    //     </div>
    //     <div className={header_buttons}>
    //       <Button
    //         style={{ textTransform: "none" }}
    //         variant="contained"
    //         color="primary"
    //         startIcon={<AddIcon fontSize="large" />}
    //       >
    //         Follow
    //       </Button>
    //       <Button
    //         style={{ textTransform: "none" }}
    //         variant="contained"
    //         color="primary"
    //         href={profile?.parent?.website}
    //         target="_blank"
    //         startIcon={<FontAwesomeIcon icon={faUpRightFromSquare} size="sm" />}
    //       >
    //         Visit website
    //       </Button>
    //     </div>
    //     <div className={tabs__panel}>
    //       <div>
    //         <Tabs
    //           value={value}
    //           onChange={handleChange}
    //           TabIndicatorProps={{
    //             style: {
    //               backgroundColor: "#17804f",
    //             },
    //           }}
    //           variant="scrollable"
    //           scrollButtons="auto"
    //           aria-label="scrollable auto tabs example"
    //         >
    //           <CustomTab
    //             label={
    //               <div>
    //                 <InfoIcon style={{ verticalAlign: "middle" }} /> About
    //               </div>
    //             }
    //             onClick={() => {
    //               setView("About");
    //             }}
    //           />
    //           <CustomTab
    //             label={
    //               <div>
    //                 <PostAddIcon style={{ verticalAlign: "middle" }} /> Posts
    //               </div>
    //             }
    //           />
    //           <CustomTab
    //             label={
    //               <div>
    //                 <WorkIcon style={{ verticalAlign: "middle" }} /> Jobs
    //               </div>
    //             }
    //           />
    //           -
    //         </Tabs>
    //       </div>
    //     </div>
    //   </Paper>
    //   <View profile={profile} />
    // </div>
    <>Hello</>
  );
}
