import React, { useState, useEffect } from "react";
import { makeStyles, useTheme, withStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import EditIcon from "@material-ui/icons/Edit";
import { IconButton } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import CloseIcon from "@material-ui/icons/Close";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
// import { parseWithOptions } from "date-fns/fp";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { updateUserInfoArray } from "../api";
import AvatarSquare from "@material-ui/core/Avatar";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import WorkIcon from "@material-ui/icons/Work";
import LibraryAddCheckIcon from "@material-ui/icons/LibraryAddCheck";
import DeleteIcon from "@material-ui/icons/Delete";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Api from "../../../helpers/Api";
import { updateUserInfo, deleteArrayItem } from "../api";

import ExperienceDialog from "./ExperienceDialog";

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
  dialog__content: {
    "& $p": {
      // borderBottom: "1px solid grey",
      fontSize: "1rem",
      // padding: "1rem",
      fontWeight: "400",
    },
  },
  educationCard: {
    display: "flex",
    // justifyContent: "space-around",
    borderBottom: "0.5px solid grey",
    padding: "1rem",
    alignItems: "center",
  },
  educationCard__middle: {
    flex: 0.9,
    marginLeft: "1rem",
    "& $h4": {
      fontWeight: "normal",
      fontSize: "1.1rem",
    },
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

const SkillEdit = ({ open, setOpen }) => {
  const classes = useStyles();
  const {
    dialog__content,
    educationCard,
    educationCard__left,
    educationCard__middle,
    educationCard__right,
  } = classes;

  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const { user, organizationIds } = useSelector((state) => state.auth);
  const [currentSkillObj, setCurrentSkillObj] = useState({});
  const handleClose = () => {
    setOpen(false);
  };

  const handleOnDragEnd = async (result) => {
    if (!result.destination) return;
    const items = Array.from(user?.skillSet);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    console.log(items);
    dispatch({
      type: "AddAuth",
      payload: {
        user: {
          ...user,
          skillSet: items,
        },
      },
    });
    const updatedData = await updateUserInfo({
      userId: user?._id,
      userInfo: {
        skillSet: items,
      },
    });
    console.log(updatedData?.skills);
  };

  const handleDelete = async (itemId) => {
    const updatedUser = await deleteArrayItem({
      userId: user?._id,
      arrayObjId: itemId,
      arrayName: "skillSet",
    });
    dispatch({
      type: "AddAuth",
      payload: {
        user: {
          ...user,
          skillSet: updatedUser?.skillSet,
        },
      },
    });
    // setOpen(false);
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        scroll={"paper"}
        fullWidth
      >
        <DialogTitle id="form-dialog-title" onClose={handleClose}>
          Edit Skills
        </DialogTitle>
        <DialogContent dividers className={dialog__content}>
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="skills">
              {(provided) => (
                <div
                  className="skills"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {user?.skillSet &&
                    user?.skillSet.map((skillObj, index) => {
                      return (
                        <Draggable
                          key={index}
                          draggableId={skillObj.skillTag}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              className={educationCard}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <div className={educationCard__left}>
                                <AvatarSquare>
                                  <LibraryAddCheckIcon />
                                </AvatarSquare>
                              </div>
                              <div className={educationCard__middle}>
                                <p>{skillObj.skillTag}</p>
                              </div>
                              <div className={educationCard__right}>
                                <IconButton
                                  onClick={() => {
                                    setOpen(false);
                                    setCurrentSkillObj(skillObj);
                                  }}
                                >
                                  <DeleteIcon
                                    onClick={() => handleDelete(skillObj._id)}
                                  />
                                </IconButton>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SkillEdit;
