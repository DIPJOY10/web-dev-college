//Check, there is a need to handle "project" and "projectProfile" properties
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useParams, useHistory } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/Clear";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import AddIcon from "@material-ui/icons/Add";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import TextField from "@material-ui/core/TextField";
import { Typography } from "@material-ui/core";
import { editPortfolio } from "../apiCall";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CreatePortfolioDialog from "./Create.Portfolio.Dialog";
import ShowPortfolios from "./ShowPortfolios";
import Avatar from "@material-ui/core/Avatar";
import LessText from "../../styled/CommonComponents/LessText";
import GetUserOrgProjectOptions from "../../styled/CommonComponents/GetUserOrgProjectOptions.Dialog";

const roles = ["Admin", "Owner", "Editor", "Viewer"];

const useStyles = makeStyles((theme) => ({
  titleCont: {
    width: "600px",
  },
  headerCont: {
    width: "100%",
    position: "relative",
  },
  headerTitle: {
    fontSize: "20px",
    fontWeight: "550",
  },
  addNewBtn: {
    position: "absolute",
    right: "0px",
    top: "0px",
  },
  dialogCont: {
    width: "100%",
  },
  showSecondPartyInfoCont: {
    width: "65%",
    display: "flex",
    justifyContent: "space-around",
  },
  showSecondPartyInfoContProject: {
    width: "65%",
    display: "flex",
    justifyContent: "space-around",
  },
  showSecondPartyImgCont: {
    width: "10%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  showSecondPartyCont: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "10px",
  },
  secondPartyEditCont: {
    width: "27%",
  },
  shareWithCont: {
    width: "100%",
    border: "1px solid #E1E2E5",
    display: "flex",
    flexDirection: "column",
    padding: "10px",
    justifyContent: "space-between",
    marginBottom: "15px",
  },
}));

export default function EditPortfolioDialog(props) {
  const history = useHistory();
  const classes = useStyles();
  const { teamId } = useParams();
  const {
    setSelectedAccessablePortfolio,
    selectedAccessablePortfolio,
    getAccessablePortfolios,
    walletId,
  } = props;
  const DateNow = new Date();
  const { auth } = useSelector((state) => state);
  const [open, setOpen] = useState(false);

  const [usersWithAccess, setUsersWithAccess] = useState([]);
  const [olderUsersWithAccess, setOlderUsersWithAccess] = useState([]);
  const [accessableUsersWithRole, setAccessableUsersWithRole] = useState([]);
  const [name, setName] = useState("");
  const [idCode, setIdCode] = useState("");
  const [portfolioProjects, setPortfolioProjects] = useState([]);
  const [multiInputBool, setmultiInputBool] = useState(false);
  const [isIdAlreadyExists, setIsIdAlreadyExists] = useState(false);

  useEffect(() => {
    setUsersWithAccess(selectedAccessablePortfolio?.access);
    setOlderUsersWithAccess(selectedAccessablePortfolio?.access);
    setAccessableUsersWithRole(selectedAccessablePortfolio?.accessWithRole);
    setName(selectedAccessablePortfolio?.name);
    setIdCode(selectedAccessablePortfolio?.idCode);
    setPortfolioProjects(selectedAccessablePortfolio?.projects);
  }, [selectedAccessablePortfolio]);

  console.log(selectedAccessablePortfolio);

  const handleClose = () => {
    setOpen(false);
  };

  const getOptionLabel = (option) => {
    return option;
  };

  const onSelectRole = (value, index) => {
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

  useEffect(() => {
    setmultiInputBool(!multiInputBool);
    let lenNew = usersWithAccess?.length;
    let lenOld = olderUsersWithAccess?.length;
    if (lenNew > lenOld) {
      // newly Added
      let len = usersWithAccess?.length - 1;
      const accessableUserWithRoleObj = {
        user: usersWithAccess[len],
        role: "Admin",
      };
      let newAccessableUsersWithRoleArr = [
        ...accessableUsersWithRole,
        accessableUserWithRoleObj,
      ];
      setAccessableUsersWithRole(newAccessableUsersWithRoleArr);
    } else if (lenOld > lenNew) {
      // user remove
      let newUserIdArr = [];
      let oldUserIdArr = [];
      olderUsersWithAccess.map((user) => {
        oldUserIdArr.push(user?._id);
      });
      usersWithAccess.map((user) => {
        newUserIdArr.push(user?._id);
      });
      let removedUserId = oldUserIdArr.filter(
        (user) => !newUserIdArr.includes(user)
      );
      let newUserAccessRoleArr = [];
      accessableUsersWithRole.map((userRole) => {
        if (userRole?.user?._id !== removedUserId[0]) {
          newUserAccessRoleArr.push(userRole);
        }
      });
      setAccessableUsersWithRole(newUserAccessRoleArr);
    }
    setOlderUsersWithAccess(usersWithAccess);
    setmultiInputBool(!multiInputBool);
  }, [usersWithAccess]);

  const onClickUpdatePortfolio = async () => {
    let accessableUserId = [];
    let accessableUserIdRole = [];
    let projectIds = [];
    usersWithAccess.map((user) => {
      accessableUserId.push(user?._id);
    });
    accessableUsersWithRole.map((userRole) => {
      const userRoleObj = {
        role: userRole?.role,
        user: userRole?.user,
      };
      accessableUserIdRole.push(userRoleObj);
    });
    portfolioProjects.map((user) => {
      console.log("portfolioProject", user);
      projectIds.push(user?._id);
    });

    if (
      usersWithAccess?.length > 0 &&
      accessableUsersWithRole?.length > 0 &&
      name?.length > 4 &&
      idCode?.length > 4
    ) {
      await editPortfolio({
        _id: selectedAccessablePortfolio?._id,
        access: accessableUserId,
        accessWithRole: accessableUserIdRole,
        projects: projectIds,
        name: name,
        idCode: idCode,
        lastUpdatedBy: auth?.user?._id,
      })
        .then(async (data) => {
          console.log(data);
          setSelectedAccessablePortfolio(data);
          await getAccessablePortfolios();
          handleClose();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const removeUser = (id) => {
    const filteredUserArr = usersWithAccess.filter((user) => user?._id !== id);
    setUsersWithAccess(filteredUserArr);
  };

  const removeProject = (id) => {
    const filteredProjectArr = portfolioProjects.filter(
      (user) => user?._id !== id
    );
    setPortfolioProjects(filteredProjectArr);
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
        edit
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

          <TextField
            id="outlined-basic"
            variant="outlined"
            label="ID Code"
            size="small"
            style={{ width: "100%" }}
            value={idCode}
            onChange={(e) => {
              setIdCode(e.target.value);
            }}
            disabled
          />
          <div style={{ marginBottom: "30px", color: "red" }}>
            {isIdAlreadyExists && <>The given ID Code already exists</>}
          </div>

          <div style={{ width: "100%", opacity: "0.5", marginTop: "35px" }}>
            <Typography>User Access With Role</Typography>
          </div>
          <div className={classes.shareWithCont}>
            {accessableUsersWithRole?.length > 0 &&
              accessableUsersWithRole.map((userWithRole, i) => (
                <div key={i} className={classes.showSecondPartyCont}>
                  <div className={classes.showSecondPartyImgCont}>
                    <Avatar
                      alt="ProfilePic"
                      src={userWithRole?.user?.parent?.displayPicture?.thumbUrl}
                    />
                  </div>
                  <div className={classes.showSecondPartyInfoCont}>
                    <Typography style={{ fontSize: "16px", fontWeight: "550" }}>
                      <LessText
                        limit={16}
                        string={userWithRole?.user?.parent?.displayName}
                      />
                    </Typography>
                    <Typography style={{ fontSize: "13px", opacity: "0.6" }}>
                      <LessText
                        limit={23}
                        string={
                          userWithRole?.user?.parent?.email ||
                          "mailId Not Avaliable"
                        }
                      />
                    </Typography>
                  </div>
                  <div className={classes.secondPartyEditCont}>
                    <Autocomplete
                      id={"Role Type"}
                      size="small"
                      value={userWithRole?.role}
                      options={roles}
                      getOptionLabel={getOptionLabel}
                      getOptionSelected={(option) => {
                        return option == userWithRole?.role;
                      }}
                      style={{ width: "100%" }}
                      onChange={(event, value) => {
                        if (onSelectRole) {
                          onSelectRole(value, i);
                        }
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={"Role Type"}
                          variant="outlined"
                        />
                      )}
                    />
                  </div>
                  <div className={classes.secondPartyCancleCont}>
                    <IconButton
                      color="primary"
                      onClick={() => {
                        removeUser(userWithRole?.user?._id);
                      }}
                    >
                      <ClearIcon />
                    </IconButton>
                  </div>
                </div>
              ))}
          </div>

          {/* change the "GetUserOrgProjectOptions" component with "UserWithRoleComponent" component */}

          <GetUserOrgProjectOptions
            userArr={usersWithAccess}
            setUserArr={setUsersWithAccess}
            userProfile={auth?.user?.profile}
            relationType={"Customer"}
            walletId={walletId}
            userOp={true}
            projectOp={false}
            orgOp={true}
          />

          <div style={{ width: "100%", opacity: "0.5", marginTop: "35px" }}>
            <Typography>Projects</Typography>
          </div>
          <div className={classes.shareWithCont}>
            {portfolioProjects?.length > 0 &&
              portfolioProjects.map((project, i) => (
                <div key={i} className={classes.showSecondPartyCont}>
                  <div className={classes.showSecondPartyImgCont}>
                    <Avatar
                      alt="ProfilePic"
                      src={project?.parent?.displayPicture?.thumbUrl}
                    />
                  </div>
                  <div className={classes.showSecondPartyInfoContProject}>
                    <Typography style={{ fontSize: "16px", fontWeight: "550" }}>
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

          {/* change the "GetUserOrgProjectOptions" component with "UserWithRoleComponent" component */}

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
        </DialogContent>
        <DialogActions
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <Button autoFocus onClick={handleClose} color="primary">
            Cancel
          </Button>

          {portfolioProjects?.length > 0 &&
          usersWithAccess?.length > 0 &&
          accessableUsersWithRole?.length > 0 &&
          name?.length > 4 &&
          idCode?.length > 4 ? (
            <Button
              autoFocus
              onClick={() => {
                onClickUpdatePortfolio();
              }}
              color="primary"
            >
              Create
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
