import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useParams, useHistory } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Tooltip from "@material-ui/core/Tooltip";
import SearchIcon from "@material-ui/icons/Search";
import Button from "@material-ui/core/Button";
import moment from "moment";
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/Clear";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import {
  useMediaQuery,
  ButtonBase,
  TextField,
  InputAdornment,
} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import DeleteIcon from "@material-ui/icons/Delete";
import DateFnsUtils from "@date-io/date-fns";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import PersonIcon from "@material-ui/icons/Person";
import AddIcon from "@material-ui/icons/Add";
import Avatar from "@material-ui/core/Avatar";
import { Typography } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import FileUploadButton from "../file/Uploader/FileUploadButton";
import EditIcon from "@material-ui/icons/Edit";
import {
  editPortfolio,
  getPortfolioDataById,
  updateAccessRole,
} from "./apiCall";
import ProjectsTable from "./ProjectTable";
import AddUserDialog from "./PortfolioDialog/AddUser.Dialog";
import AddProjectDialog from "./PortfolioDialog/AddProject.Dialog";
import LessText from "../styled/CommonComponents/LessText";

const roles = ["Admin", "Owner", "Editor", "Viewer"];

const useStyles = makeStyles((theme) => ({
  mainCont: {
    padding: "30px",
    [theme.breakpoints.down("xs")]: {
      padding: "15px",
    },
  },
  headerPart: {
    width: "100%",
    height: "170px",
    backgroundColor: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    padding: "30px",
    position: "relative",
    [theme.breakpoints.down("sm")]: {
      height: "230px",
      flexDirection: "column",
    },
    [theme.breakpoints.down("xs")]: {
      padding: "20px 0px",
    },
  },
  editStyle: {
    position: "absolute",
    right: "20px",
    top: "15px",
  },
  coverPicCont: {
    height: "60%",
    widht: "100%",
    backgroundColor: "gray",
    position: "relative",
  },
  dpCont: {
    width: "140px",
    height: "140px",
  },
  coverUploadButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    backgroundColor: "white",
    borderRadius: "50%",
    border: `1px solid ${theme.palette.primary.main}`,
  },
  cardCont: {
    width: "100%",
    marginTop: "30px",
    display: "flex",
    justifyContent: "space-around",
    flexWrap: "wrap",
  },
  cardStyle: {
    width: "260px",
    height: "200px",
  },
  ProgressCont: {
    width: "100%",
    height: "80vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  infoCont: {
    paddingTop: "80px",
    paddingLeft: "25px",
  },
  titleName: {
    fontSize: "25px",
    fontWeight: "530",
    marginLeft: "10px",
    marginTop: "100px",
    [theme.breakpoints.down("sm")]: {
      marginTop: "10px",
    },
  },
  accessUserCont: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    padding: "10px",
    marginTop: "25px",
  },
  accessUserContWithSpaceAround: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    flexWrap: "wrap",
    padding: "10px",
    marginTop: "25px",
  },
  singleUserCont: {
    height: "100px",
    width: "220px",
    position: "relative",
    padding: "5px 10px",
    margin: "5px",
  },
  singleUserContWithOutEdit: {
    position: "relative",
    padding: "5px 10px",
    margin: "5px",
  },
  editUserAccess: {
    position: "absolute",
    bottom: "7px",
    right: "12px",
    color: theme.palette.primary.main,
    cursor: "pointer",
  },
  saveBtn: {
    position: "absolute",
    bottom: "7px",
    right: "12px",
    cursor: "pointer",
    padding: "2px 0px",
  },
  deleteUserAccess: {
    position: "absolute",
    bottom: "7px",
    right: "50px",
    color: theme.palette.primary.main,
    cursor: "pointer",
  },
  cancelBtn: {
    position: "absolute",
    top: "6px",
    right: "10px",
    color: "red",
    cursor: "pointer",
  },
  searchAndAddnew: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 30px",
  },
  userAccessHeader: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0px 5px",
    marginBottom: "10px",
  },
  searchTextBox: {
    width: "65%",
  },
  nameBtnCont: {
    marginTop: "100px",
    [theme.breakpoints.down("sm")]: {
      marginTop: "10px",
    },
  },
  displayPicCont: {
    position: "relative",
    border: "4px solid gray",
    "&:hover": {
      "& $hoverUploadButton": {
        opacity: 1,
      },
    },
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
}));

export default function PortfolioHome(props) {
  const history = useHistory();
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const { portfolioId } = useParams();
  const { walletId } = props;

  const DateNow = new Date();
  const { createdFileIds } = useSelector((state) => state.file);
  const { auth } = useSelector((state) => state);
  const [portfolioData, setPortfolioData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUserRole, setCurrentUserRole] = useState("");
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [rows, setRows] = useState([]);
  const [editId, setEditId] = useState("");
  const [editableRole, setEditableRole] = useState("");
  const [name, setName] = useState("");
  const [editName, setEditName] = useState(false);

  const getPortfolioData = async () => {
    await getPortfolioDataById({ portfolioId: portfolioId })
      .then((data) => {
        setPortfolioData(data);
        console.log("portfoilio data", data);
        const accessRoles = data?.accessWithRole;

        setRows(data?.projects);
        setFilteredProjects(data?.projects);

        accessRoles.length > 0 &&
          accessRoles.map((userRole) => {
            if (userRole?.user?._id === auth?.user?.profile) {
              setCurrentUserRole(userRole?.role);
            }
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getPortfolioData();
  }, [portfolioId]);

  const onProjectNameChange = async (value) => {
    setSearchQuery(value);
    if (value) {
      let searchedProjects = [];
      filteredProjects.map((project) => {
        let name = project?.projectProfile?.parent?.displayName;
        const patt = new RegExp(value, "i");
        const res = patt.test(name);
        if (res) {
          searchedProjects.push(project);
        }
      });

      setRows(searchedProjects);
    } else {
      setRows(filteredProjects);
    }
  };

  const getSimpleOptionLabel = (option) => {
    return option;
  };

  const onRoleSelect = (value) => {
    setEditableRole(value);
  };

  const updateRole = async () => {
    if (editId) {
      await updateAccessRole({
        _id: editId,
        role: editableRole,
      })
        .then((data) => {
          console.log(data);
          let updatedAccessRoleUser = [];
          let updatedPortfolioData = portfolioData;
          const accessRoleUser = portfolioData?.accessWithRole || [];
          accessRoleUser.map((userR) => {
            if (userR._id === editId) {
              const obj = {
                ...userR,
                role: editableRole,
              };
              updatedAccessRoleUser.push(obj);
            } else {
              updatedAccessRoleUser.push(userR);
            }
          });

          updatedPortfolioData.accessWithRole = updatedAccessRoleUser;
          setPortfolioData(updatedPortfolioData);
        })
        .catch((err) => {
          console.log(err);
        });

      setEditId("");
    }
  };

  const updatePortfolioName = async () => {
    if (name.length > 0) {
      await editPortfolio({
        _id: portfolioData?._id,
        name: name,
      })
        .then((data) => {
          setPortfolioData(data);
        })
        .catch((err) => {
          console.log(err);
        });

      setName("");
      setEditName(false);
    }
  };

  const uploadImg = async (fileType) => {
    if (createdFileIds.length > 0) {
      await editPortfolio({
        _id: portfolioData?._id,
        displayPicture: createdFileIds[0],
      })
        .then((data) => {
          setPortfolioData(data);

          dispatch({ type: "FileUploadReset" });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <div className={classes.mainCont}>
      {portfolioData ? (
        <>
          <Paper className={classes.headerPart}>
            <div className={classes.displayPicCont}>
              <Avatar
                className={classes.dpCont}
                variant="square"
                src={portfolioData?.displayPicture?.url}
              />
              <div className={classes.hoverUploadButton}>
                <FileUploadButton
                  parentType="Organization"
                  used={true}
                  parentId={portfolioData?._id}
                  isDP={true}
                  isCover={false}
                  uploadImg={uploadImg}
                />
              </div>
            </div>
            {editName ? (
              <div className={classes.nameBtnCont}>
                <TextField
                  label="Edit Portfolio Name"
                  id="outlined-size-small"
                  value={name}
                  style={{ width: "65%", marginLeft: "5px" }}
                  onChange={(e) => setName(e.target.value)}
                  defaultValue="Small"
                  variant="outlined"
                  size="small"
                />

                <Button
                  variant="contained"
                  color="primary"
                  style={{ marginLeft: "10px" }}
                  onClick={() => {
                    updatePortfolioName();
                  }}
                >
                  save
                </Button>
              </div>
            ) : (
              <Typography className={classes.titleName}>
                {portfolioData?.name}
              </Typography>
            )}

            {editName ? (
              <IconButton className={classes.editStyle}>
                <ClearIcon
                  style={{ color: "red" }}
                  onClick={() => {
                    setName("");
                    setEditName(false);
                  }}
                />
              </IconButton>
            ) : (
              <IconButton className={classes.editStyle}>
                <EditIcon
                  style={{ color: theme.palette.primary.main }}
                  onClick={() => {
                    setName(portfolioData?.name);
                    setEditName(true);
                  }}
                />
              </IconButton>
            )}
          </Paper>

          <Paper
            className={
              portfolioData?.accessWithRole.length > 3
                ? classes.accessUserContWithSpaceAround
                : classes.accessUserCont
            }
          >
            <div className={classes.userAccessHeader}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <PersonIcon
                  style={{
                    color: theme.palette.primary.main,
                    width: "35px",
                    height: "35px",
                  }}
                />
                <p
                  style={{
                    fontSize: "16px",
                    fontWeight: "550",
                    opacity: "0.7",
                  }}
                >
                  Participants
                </p>
              </div>
              {currentUserRole !== "Viewer" && (
                <AddUserDialog
                  existingUsers={portfolioData?.access}
                  portfolioData={portfolioData}
                  setPortfolioData={setPortfolioData}
                />
              )}
            </div>
            {portfolioData?.accessWithRole &&
              portfolioData?.accessWithRole.map((userRole) => (
                <Paper
                  className={
                    currentUserRole !== "Viewer"
                      ? classes.singleUserCont
                      : classes.singleUserContWithOutEdit
                  }
                >
                  {editId === userRole?._id ? (
                    <>
                      <div style={{ display: "flex", marginBottom: "8px" }}>
                        <Avatar
                          src={userRole?.user?.parent?.displayPicture?.url}
                        />
                        <div style={{ marginLeft: "6px" }}>
                          <Typography>
                            <LessText
                              limit={14}
                              string={userRole?.user?.parent?.displayName}
                            />
                          </Typography>
                        </div>
                      </div>
                      <Autocomplete
                        id={"Role Type"}
                        size="small"
                        value={editableRole}
                        options={roles}
                        getOptionLabel={getSimpleOptionLabel}
                        getOptionSelected={(option) => {
                          return option == editableRole;
                        }}
                        style={{ width: "60%" }}
                        onChange={(event, value) => {
                          onRoleSelect(value);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size="small"
                            label={"Role Type"}
                            variant="outlined"
                          />
                        )}
                      />

                      <ClearIcon
                        className={classes.cancelBtn}
                        onClick={() => {
                          setEditableRole("");
                          setEditId("");
                        }}
                      />

                      <Button
                        variant="contained"
                        color="primary"
                        className={classes.saveBtn}
                        onClick={() => {
                          updateRole();
                        }}
                      >
                        save
                      </Button>
                    </>
                  ) : (
                    <>
                      <div style={{ display: "flex" }}>
                        <Avatar
                          src={userRole?.user?.parent?.displayPicture?.url}
                        />
                        <div style={{ marginLeft: "6px" }}>
                          <Typography>
                            <LessText
                              limit={14}
                              string={userRole?.user?.parent?.displayName}
                            />
                          </Typography>
                          <p
                            style={{
                              fontSize: "14px",
                              fontWeight: "510",
                              marginTop: "-2px",
                            }}
                          >
                            {userRole?.role}
                          </p>
                        </div>
                      </div>

                      <Typography
                        style={{
                          fontSize: "14px",
                          fontWeight: "550",
                          marginTop: "23px",
                        }}
                      >
                        {moment(userRole?.createdAt).format("DD MMM YYYY")}
                      </Typography>

                      <>
                        {currentUserRole !== "Viewer" && (
                          <Tooltip title="Remove User" placement="top-start">
                            <DeleteIcon className={classes.deleteUserAccess} />
                          </Tooltip>
                        )}
                      </>
                      <>
                        {currentUserRole !== "Viewer" && (
                          <Tooltip title="Edit Access" placement="top-start">
                            <EditIcon
                              className={classes.editUserAccess}
                              onClick={() => {
                                setEditableRole(userRole?.role);
                                setEditId(userRole?._id);
                              }}
                            />
                          </Tooltip>
                        )}
                      </>
                    </>
                  )}
                </Paper>
              ))}
          </Paper>

          <Paper className={classes.cardCont}>
            <div className={classes.searchAndAddnew}>
              <TextField
                placeholder="Search By Project Name"
                type="text"
                variant="outlined"
                size="small"
                onChange={(e) => onProjectNameChange(e.target.value)}
                value={searchQuery}
                className={classes.searchTextBox}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
              {currentUserRole !== "Viewer" && (
                <AddProjectDialog
                  projects={portfolioData?.projects}
                  portfolioData={portfolioData}
                  setPortfolioData={setPortfolioData}
                  setRows={setRows}
                  setFilteredProjects={setFilteredProjects}
                />
              )}
            </div>
            <ProjectsTable rows={rows} userRole={currentUserRole} />
          </Paper>
        </>
      ) : (
        <div className={classes.ProgressCont}>
          <CircularProgress />
        </div>
      )}
    </div>
  );
}
