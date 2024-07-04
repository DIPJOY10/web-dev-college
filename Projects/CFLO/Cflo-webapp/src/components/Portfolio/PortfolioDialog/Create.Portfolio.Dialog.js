import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useParams, useHistory } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import { useMediaQuery } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/Clear";
import AddIcon from "@material-ui/icons/Add";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import TextField from "@material-ui/core/TextField";
import LessText from "../../styled/CommonComponents/LessText";
import Avatar from "@material-ui/core/Avatar";
import { Typography } from "@material-ui/core";
import { createPortfolio, getProfileById } from "../apiCall";
import GetUserOrgProjectOptions from "../../styled/CommonComponents/GetUserOrgProjectOptions.Dialog";
import UserWithRoleComponent from "../../styled/CommonComponents/UserWithRoleComponent";
import { updateDeleteFlagForSingleFiles } from "../../profileChat/apiCall";
import FileUploadButton from "../../file/Uploader/FileUploadButton";
import FilesViewer from "../../file/Viewer/FilesViewer";

const roles = ["Admin", "Owner", "Editor", "Viewer"];

const useStyles = makeStyles((theme) => ({
  headerTitle: {
    fontSize: "20px",
    fontWeight: "550",
  },
  dialogCont: {
    width: "600px",
  },
  showSecondPartyInfoCont: {
    width: "55%",
    display: "flex",
    justifyContent: "space-around",
  },
  showSecondPartyInfoContProject: {
    width: "70%",
    display: "flex",
    justifyContent: "space-around",
  },
  showSecondPartyImgCont: {
    width: "8%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  secondPartyEditCont: {
    width: "25%",
  },
  secondPartyCancleCont: {
    width: "10%",
  },
  showSecondPartyCont: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "10px",
  },
  shareWithCont: {
    width: "100%",
    border: "1px solid #E1E2E5",
    display: "flex",
    flexDirection: "column",
    padding: "10px",
    paddingLeft: "5px",
    paddingRight: "5px",
    justifyContent: "space-between",
    marginBottom: "15px",
  },
}));

export default function CreatePortfolioDialog(props) {
  const history = useHistory();
  const classes = useStyles();
  const dispatch = useDispatch();
  const { teamId } = useParams();
  const { addNewlyCreatedPortfolio, walletId } = props;
  const DateNow = new Date();
  const { auth } = useSelector((state) => state);
  const { createdFileIds } = useSelector((state) => state.file);
  const [open, setOpen] = useState(false);
  const [usersWithAccess, setUsersWithAccess] = useState([]);
  const [accessableUsersWithRole, setAccessableUsersWithRole] = useState([]);
  const [portfolioProjects, setPortfolioProjects] = useState([]);
  const [multiInputBool, setmultiInputBool] = useState(false);
  const [name, setName] = useState("");
  const theme = useTheme();

  const smallScreen = useMediaQuery(theme.breakpoints.down("xs"));

  useEffect(() => {
    getProfileById({ profileId: auth?.user?.profile })
      .then((data) => {
        const userProfile = data;
        const initProfileArrs = [userProfile];
        setUsersWithAccess(initProfileArrs);
        const accessableUserWithRole = {
          user: userProfile,
          role: "Owner",
        };
        const accessableUserWithRoleArr = [accessableUserWithRole];
        setAccessableUsersWithRole(accessableUserWithRoleArr);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [auth?.user?.profile]);

  const handleClose = () => {
    setOpen(false);
  };

  // remove project
  const removeProject = (id) => {
    const filteredProjectArr = portfolioProjects.filter(
      (user) => user?._id !== id
    );
    setPortfolioProjects(filteredProjectArr);
  };

  // for accessable user
  //remove user
  const removeAccessableUsers = (id) => {
    setmultiInputBool(!multiInputBool);
    const filteredUserArr = usersWithAccess.filter((user) => user?._id !== id);
    setUsersWithAccess(filteredUserArr);

    let newUserAccessRoleArr = [];
    accessableUsersWithRole.map((userRole) => {
      if (userRole?.user?._id !== id) {
        newUserAccessRoleArr.push(userRole);
      }
    });
    setAccessableUsersWithRole(newUserAccessRoleArr);
    setmultiInputBool(!multiInputBool);
  };

  //update user role
  const updateAccessableUsersWithRole = (value, index) => {
    setmultiInputBool(!multiInputBool);
    let inputDataArr = accessableUsersWithRole;
    let editObj = {
      ...accessableUsersWithRole[index],
      role: value,
    };
    inputDataArr[index] = editObj;
    setAccessableUsersWithRole(inputDataArr);
    setmultiInputBool(!multiInputBool);
  };

  //add new user
  const addNewAccessableUsers = (newAccessRoleObj) => {
    const accessableUserWithRoleObj = {
      user: newAccessRoleObj?.user,
      role: newAccessRoleObj?.role,
    };
    let newAccessableUsersWithRoleArr = [
      ...accessableUsersWithRole,
      accessableUserWithRoleObj,
    ];
    setAccessableUsersWithRole(newAccessableUsersWithRoleArr);
  };

  // remove uploaded image
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

  // create portfolio
  const onClickCreatePortfolio = async () => {
    let accessableUserId = [];
    let accessableUserIdRole = [];
    let projectsAddedInfo = [];

    accessableUsersWithRole.map((userRole) => {
      const userRoleObj = {
        role: userRole?.role,
        user: userRole?.user,
      };

      accessableUserId.push(userRole?.user?._id);
      accessableUserIdRole.push(userRoleObj);
    });

    portfolioProjects.map((project) => {
      const newObj = {
        projectProfile: project?._id,
        project: project?.parent,
        addedAt: DateNow,
        addedBy: auth?.user?.profile,
      };

      projectsAddedInfo.push(newObj);
    });

    if (
      accessableUserId?.length > 0 &&
      accessableUserIdRole?.length > 0 &&
      projectsAddedInfo?.length > 0 &&
      name?.length > 4
    ) {
      await createPortfolio({
        accessableUserId,
        accessableUserIdRole,
        projectsAddedInfo,
        name,
        displayPicture: createdFileIds[0],
        user: auth?.user?._id,
      })
        .then((data) => {
          console.log(data);
          addNewlyCreatedPortfolio(data);
          handleClose();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setOpen(true);
        }}
        style={{ padding: "6px 8px" }}
      >
        <AddIcon /> New
      </Button>

      <Dialog
        scroll={"paper"}
        onClose={handleClose}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        open={open}
      >
        <DialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
          style={{ padding: "8px 24px" }}
        >
          <Typography className={classes.headerTitle}>
            Create Portfolio
          </Typography>
        </DialogTitle>
        <DialogContent dividers={true} className={classes.dialogCont}>
          <TextField
            id="outlined-basic"
            variant="outlined"
            label="Nick Name"
            size="small"
            style={{ width: "100%", marginBottom: "30px" }}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />

          {/* accessable users with role */}
          <>
            <div style={{ width: "100%", opacity: "0.5", marginTop: "20px" }}>
              <Typography>Participants</Typography>
            </div>
            <UserWithRoleComponent
              userArr={usersWithAccess}
              setUserArr={setUsersWithAccess}
              userRoleArr={accessableUsersWithRole}
              setUserRoleArr={setAccessableUsersWithRole}
              roles={roles}
              defaultType={"Viewer"}
              userProfile={auth?.user?.profile}
              walletId={auth?.user?.wallet}
              relationType={"Customer"}
              userOp={true}
              projectOp={false}
              orgOp={false}
              removeUserRole={removeAccessableUsers}
              updateRoleOfUserRole={updateAccessableUsersWithRole}
              addUserRole={addNewAccessableUsers}
            />
          </>

          {/* portfolio's projects */}
          <>
            <div style={{ width: "100%", opacity: "0.5", marginTop: "35px" }}>
              <Typography>Projects</Typography>
            </div>
            <div className={classes.shareWithCont}>
              {portfolioProjects.length > 0 &&
                portfolioProjects.map((project, i) => (
                  <div key={i} className={classes.showSecondPartyCont}>
                    <div className={classes.showSecondPartyImgCont}>
                      <Avatar
                        alt="ProfilePic"
                        src={project?.parent?.displayPicture?.thumbUrl}
                      />
                    </div>
                    <div className={classes.showSecondPartyInfoContProject}>
                      <Typography
                        style={{ fontSize: "16px", fontWeight: "550" }}
                      >
                        <LessText
                          limit={16}
                          string={project?.parent?.displayName}
                        />
                      </Typography>
                      <Typography style={{ fontSize: "13px", opacity: "0.6" }}>
                        <LessText
                          limit={23}
                          string={
                            project?.parent?.email || "mailId Not Avaliable"
                          }
                        />
                      </Typography>
                    </div>
                    <div className={classes.secondPartyCancleCont}>
                      <IconButton
                        color="primary"
                        onClick={() => {
                          removeProject(project?._id);
                        }}
                      >
                        <ClearIcon />
                      </IconButton>
                    </div>
                  </div>
                ))}
            </div>
            <GetUserOrgProjectOptions
              userArr={portfolioProjects}
              setUserArr={setPortfolioProjects}
              userProfile={auth?.user?.profile}
              relationType={"Customer"}
              walletId={walletId}
              userOp={false}
              projectOp={true}
              orgOp={false}
            />
          </>

          {/* profile picture */}
          <>
            <div className={classes.dpUploadCont}>
              <Typography>Upload Display Picture</Typography>

              <FileUploadButton
                parentType="Message"
                used={false}
                parentId={null}
              />
            </div>
            <FilesViewer
              fileIds={createdFileIds}
              deletable={true}
              styleBody={{
                width: "50%",
                height: "auto",
              }}
              handler={removeSingleImgFromReducerAndDelete}
            />
          </>
        </DialogContent>
        <DialogActions
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <Button autoFocus onClick={handleClose} color="primary">
            Cancel
          </Button>
          {portfolioProjects.length > 0 &&
          usersWithAccess?.length > 0 &&
          accessableUsersWithRole?.length > 0 &&
          name?.length > 4 ? (
            <Button
              autoFocus
              onClick={() => {
                onClickCreatePortfolio();
              }}
              color="primary"
            >
              <AddIcon /> {smallScreen ? <>New</> : <>Portfolio</>}
            </Button>
          ) : (
            <Button autoFocus color="primary" disabled>
              Create
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}
