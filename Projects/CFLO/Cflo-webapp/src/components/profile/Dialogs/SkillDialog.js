import React, { useState, useEffect, useRef } from "react";
import { makeStyles, useTheme, withStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import EditIcon from "@material-ui/icons/Edit";
import { IconButton } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { ChildFriendlySharp, DoneAll } from "@material-ui/icons";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import CloseIcon from "@material-ui/icons/Close";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import Api from "../../../helpers/Api";
// import ManageCategory from "../../categories/manage.categories";
import { updateUserInfo, updateUserInfoArray } from "../api";
import arrayToReducer from "../../../helpers/arrayToReducer";
import _, { indexOf } from "lodash";
import SkillAutocomplete from "../skillInput/skill.autocomplete";
import { Chip } from "@material-ui/core";

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
  suggestion__box: {
    backgroundColor: "#f9fafb",
    border: "0.5px solid grey",
    borderRadius: "5px",
    display: "flex",
    flexDirection: "column",
    marginTop: "1rem",
    padding: "1rem",
  },
  suggestion__header: {
    display: "flex",
    justifyContent: "space-between",
    "& $h4": {
      fontSize: "1.2rem",
      fontWeight: "normal",
    },
  },
  saveBtn: {
    // marginTop: '1rem',
    padding: "0.5rem 1rem 0",
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  suggestion__content: {
    display: "flex",
    flexWrap: "wrap",
  },
  rounded_input: {
    cursor: "pointer",
    border: "1px solid grey",
    borderRadius: "5px",
    fontSize: ".7rem",
    backgroundColor: "#f9fafb",
    opacity: 0.95,
    fontWeight: "600",
    margin: "0.2rem",
    color: 'black',
    padding: "0.3rem 0.5rem",
  },
  selected_input: {
    cursor: "pointer",
    // border: "1px solid grey",
    borderRadius: "5px",
    fontSize: ".7rem",
    backgroundColor: "#2196f3",
    color: 'white',
    opacity: 0.95,
    fontWeight: "600",
    margin: "0.2rem",
    padding: "0.3rem 0.5rem",
  },
  selectedChip: {
    backgroundColor: theme.palette.primary.main,
    margin: theme.spacing(0.5),
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

const SkillDialog = ({ open, setOpen, setProgress, heading, button, subSkills, isPreLogin, stepLast, stepChange, setStepChange, setIsPreLogin, buttonName, setButtonName, mainOpen, setMainOpen }) => {
  const classes = useStyles();
  const {
    suggestion__box,
    suggestion__header,
    suggestion__content,
    rounded_input,
    skill__input,
    selectedChip,
    selected_input,
    saveBtn
  } = classes;

  const history = useHistory();

  const dispatch = useDispatch();
  const state = useSelector((state) => state);

  const { user, organizationIds } = useSelector((state) => state.auth);

  const [skills, setSkills] = useState([]);
  const [job, setJob] = useState(null);
  const oldCats = job?.categories ? job?.categories : [];
  const oldCatIds = oldCats.map((cat) => cat?._id);
  const [catIds, setCatIds] = useState(oldCatIds);
  const [catDict, setCatDict] = useState([]);
  const [inputRef, setInputRef] = useState(null);
  const [suggestedSkills, setSuggestedSkills] = useState([]);
  const [reSuggested, setReSuggested] = useState([]);
  const chipRef = useRef(null);
  const [focus, setFocus] = useState([]);
  const [inputRemove, setInputRemove] = useState();
  const [next, setNext] = useState(false);
  const [subCat, setSubCat] = useState(subSkills)

  const addCats = (newCats) => {
    const { newDict, idArr } = arrayToReducer(newCats);

    setCatDict({
      ...catDict,
      ...newDict,
    });

    setCatIds(Array.from(new Set([...catIds, ...idArr])));
  };

  const removeCat = (catId) => {
    var newArr = [...catIds];
    setCatIds(_.difference(newArr, [catId]));
  };

  const createCats = async () => {
    if (skills.length > 0) {
      const res = await Api.post("category/createMany", {
        names: [...subSkills, ...skills],
      });
      const data = res.data;
      if (data?.length > 0) {
        addCats(data);
      }
    }
  };

  const getSkills = async () => {
    const response = await Api.post('/getSkills');
    setSuggestedSkills(response.data.primaryJobs);
    setReSuggested(response.data)
  }
  const fetchSubSkills = async () => {
    const response = await Api.post('/getSkills');
    let temp = [];
    await subCat.forEach((v) => {
      temp.push(...response.data[v].subJobs);
    })
    setSubCat(temp)
  }

  const saveSkills = async () => {
    skills.forEach(async (skillTag) => {
      let flag = 1;



      // for (let entry of user?.skillSet) {
      //   if (entry.skillTag === skillTag) {
      //     flag = 0;
      //     break;
      //   }
      // }


      if (flag === 1) {
        const skillObj = {
          skillTag,
        };

        const updatedUser = await updateUserInfoArray({
          userId: user?._id,
          userInfo: skillObj,
          arrayName: "skills",
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


      }
    });
  };



  const newSaveSkills = async () => {
    console.log(skills)

    const updatedUser = await updateUserInfoArray({
      userId: user?._id,
      userInfo: [...subSkills, ...skills],
      arrayName: "skills",
    });

    dispatch({
      type: "AddAuth",
      payload: {
        user: {
          ...user,
          skills: [...subSkills, ...skills],
        },
      },
    });
  };




  const handleInputRemoval = (entry) => {
    let afterRemoval = focus.filter((ele) => ele !== entry)
    setFocus(afterRemoval);
    if (!subSkills) {
      setSuggestedSkills((prev) => {
        let deleteData = new Set(reSuggested[entry].subJobs)
        let newData = prev.filter((f) => !deleteData.has(f));
        return [entry, ...newData];
      });
    } else {
      setSubCat((prev) => {
        return [entry, ...prev]
      });
    }

  }


  const handleClose = () => {
    setOpen(false);
    setProgress((prev) => prev + 30)
  };


  const [suggestionBox, setSuggestionBox] = useState(true);

  useEffect(() => {
    if (oldCats && oldCats.length > 0) {
      addCats(oldCats);
    }
  }, [oldCats?.length]);

  useEffect(() => {
    if (!subSkills) {
      getSkills();
    } else {
      fetchSubSkills();
    }

  }, []);
  return (<>
    {!next ? (
      <Dialog
        open={open}
        hideBackdrop={isPreLogin ? true : false}
        onClose={!isPreLogin ? handleClose : null}
        aria-labelledby="form-dialog-title"
        scroll={"paper"}
        PaperProps={{
          style: {
            // backgroundColor: '#d6f1eb',
            backgroundColor: '#fff',
            borderRadius: "1rem",
            boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
            // width: '25rem',
            // height: '27rem',
            paddingBottom: "1rem"
          }
        }}
        fullWidth
      >
        {!isPreLogin ? (!button ? <DialogTitle id="form-dialog-title" onClose={handleClose}>
          Edit Skill
        </DialogTitle> : <DialogTitle id="form-dialog-title">
          Step 3
        </DialogTitle>) :
          (stepLast ? <DialogTitle id="form-dialog-title">
            Step 3
          </DialogTitle> : <DialogTitle id="form-dialog-title">
            Step 2
          </DialogTitle>)
        }
        <DialogContent dividers>
          {!isPreLogin ? <DialogContentText>Skills</DialogContentText> : <DialogContentText>Showcase Your Skills</DialogContentText>}
          <div style={{ display: 'flex', flexDirection: 'row', width: "100%" }}>
            <SkillAutocomplete
              catIds={catIds}
              catDict={catDict}
              addCats={addCats}
              skills={skills}
              setSkills={setSkills}
              inputRef={inputRef}
              setInputRef={setInputRef}
              inputRemove={inputRemove}
              handleInputRemoval={handleInputRemoval}
            />
          </div>
          {suggestionBox && (suggestedSkills || subSkills) ? (
            <div className={suggestion__box}>
              <div className={suggestion__header}>
                <h4>{heading ? heading : 'Suggested Primary Skills'}</h4>
                <IconButton
                  aria-label="close"
                  onClick={() => {
                    setSuggestionBox(false);
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </div>
              {!subSkills ? (
                <div className={suggestion__content}>
                  {focus && focus.map((entry, index) => {
                    return (
                      <Chip
                        key={index}
                        label={entry}
                        clickable
                        color="primary"
                        className={selected_input}
                        onDelete={() => {
                          setInputRemove(entry)
                          handleInputRemoval(entry)
                        }}
                      />
                    )
                  })}
                  {suggestedSkills && suggestedSkills.map((entry, index) => {
                    return (
                      <Chip
                        key={index}
                        label={entry}
                        className={rounded_input}
                        ref={chipRef}
                        onClick={() => {
                          let tmp = skills;
                          tmp.push(entry);
                          setSkills(tmp);
                          setFocus([...focus, entry])
                          setSuggestedSkills((prev) => {
                            let filterData = prev.filter((f) => f !== entry);
                            return filterData;
                          })
                          inputRef.focus();
                        }}
                        clickable
                      />
                    );
                  })}

                </div>
              ) : (
                <div className={suggestion__content}>
                  {focus && focus.map((entry, index) => {
                    return (
                      <Chip
                        key={index}
                        label={entry}
                        clickable
                        color="primary"
                        className={selected_input}
                        onDelete={() => {
                          setInputRemove(entry)
                          handleInputRemoval(entry)
                        }}
                      />
                    )
                  })}
                  {subCat && subCat.map((entry, index) => {
                    return (
                      <Chip
                        key={index}
                        label={entry}
                        className={rounded_input}
                        ref={chipRef}
                        onClick={() => {
                          let tmp = skills;
                          tmp.push(entry);
                          setSkills(tmp);
                          setFocus([...focus, entry])
                          setSubCat((prev) => {
                            let filterData = prev.filter((f) => f !== entry);
                            return filterData;
                          })
                          inputRef.focus();
                        }}
                        clickable
                      />
                    );
                  })}

                </div>
              )}
            </div>
          ) : null}
        </DialogContent>
        <DialogActions>
          <div className={saveBtn}>
            {(isPreLogin && !button) && <Button
              onClick={() => {
                setButtonName(!buttonName)
                setMainOpen(!mainOpen)
                setOpen(!open);
              }}
              color="primary"
              variant="outlined"
            >
              BACK
            </Button>}
            <Button
              onClick={() => {
                if (!heading) {
                  setNext(true);
                } else {
                  createCats();
                  newSaveSkills();
                  handleClose();
                }
              }}
              color="primary"
              variant="contained"
              style={{ boxShadow: "none" }}
            >
              {button ? button : 'SAVE & NEXT'}
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    ) : (<SkillDialog
      heading='Select SubSkills'
      setOpen={setOpen}
      open={open}
      setProgress={setProgress}
      button='SAVE'
      subSkills={skills}
      isPreLogin={isPreLogin}
      stepLast={true}
    />)}
  </>
  );
};

export default SkillDialog;
