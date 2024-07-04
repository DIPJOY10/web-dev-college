import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useParams, useHistory } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
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
import { createPortfolio, editPortfolio, getProfileById } from "../apiCall";
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

export default function AddProjectDialog(props) {
  const history = useHistory();
  const classes = useStyles();
  const dispatch = useDispatch();
  const { teamId } = useParams();
  const {
    projects,
    portfolioData,
    setPortfolioData,
    setRows,
    setFilteredProjects,
  } = props;
  const DateNow = new Date();
  const { auth } = useSelector((state) => state);
  const [open, setOpen] = useState(false);
  const [portfolioProjects, setPortfolioProjects] = useState([]);

  useEffect(() => {
    let olderProject = [];
    projects.length > 0 &&
      projects.map((project) => {
        const obj = {
          _id: project?.project?._id,
        };
        olderProject.push(obj);
      });

    setPortfolioProjects(olderProject);
  }, [projects]);

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

  // create portfolio
  const onClickAddProjectToPortfolio = async () => {
    let oldProjectsInfo = portfolioData?.projects;
    let newProjectInfo = [];

    portfolioProjects.length > 0 &&
      portfolioProjects.map((project) => {
        if (project?.parentModelName) {
          const newObj = {
            projectProfile: project?._id,
            project: project?.parent,
            addedAt: DateNow,
            addedBy: auth?.user?.profile,
          };
          newProjectInfo.push(newObj);
        }
      });

    const updatedProject = [...oldProjectsInfo, ...newProjectInfo];

    await editPortfolio({
      _id: portfolioData?._id,
      projects: updatedProject,
    })
      .then(async (data) => {
        setPortfolioData(data);
        setFilteredProjects(data?.projects);
        setRows(data?.projects);
      })
      .catch((err) => {
        console.log(err);
      });
    handleClose();
  };

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setOpen(true);
        }}
      >
        <AddIcon /> New Project
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
          {/* portfolio's projects */}
          <>
            <div style={{ width: "100%", opacity: "0.5", marginTop: "35px" }}>
              <Typography>Projects</Typography>
            </div>
            <div className={classes.shareWithCont}>
              {portfolioProjects.length > 0 &&
                portfolioProjects.map((project, i) => (
                  <>
                    {project?.parentModelName ? (
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
                          <Typography
                            style={{ fontSize: "13px", opacity: "0.6" }}
                          >
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
                    ) : (
                      <></>
                    )}
                  </>
                ))}
            </div>
            <GetUserOrgProjectOptions
              userArr={portfolioProjects}
              setUserArr={setPortfolioProjects}
              userProfile={auth?.user?.profile}
              relationType={"Customer"}
              walletId={auth?.user?.wallet}
              userOp={false}
              projectOp={true}
              orgOp={false}
            />
          </>
        </DialogContent>
        <DialogActions
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <Button autoFocus onClick={handleClose} color="primary">
            Close
          </Button>
          {portfolioProjects.length > 0 &&
          portfolioProjects[portfolioProjects.length - 1]?.parentModelName ? (
            <Button
              autoFocus
              onClick={() => {
                onClickAddProjectToPortfolio();
              }}
              color="primary"
            >
              Add
            </Button>
          ) : (
            <Button autoFocus color="primary" disabled>
              Add
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}
