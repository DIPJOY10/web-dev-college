import { Button, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, fade, IconButton, InputBase, makeStyles, TextField, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Api from '../../helpers/Api';
import arrayToReducer from '../../helpers/arrayToReducer';
import { updateUserInfo, updateUserInfoArray } from '../profile/api';
import SkillDialog from '../profile/Dialogs/SkillDialog';
import SkillAutocomplete from '../profile/skillInput/skill.autocomplete';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100vw',
    height: '100vh',
    display: 'grid',
    placeItems: 'center',
    backgroundColor: "red",
  },
  main: {
    marginTop: '-5rem',
    display: 'flex',
    flexDirection: "column",
    width: '25rem',
    height: '30rem',
    background: '#d6f1eb',
    color: "#2196f3",
    borderRadius: '2rem',
    padding: '1.5rem'
  },
  subMain: {
    marginTop: '-5rem',
    display: 'flex',
    flexDirection: "column",
    width: '40rem',
    height: '35rem',
    background: '#d6f1eb',
    color: "#2196f3",
    borderRadius: '2rem',
    padding: '1.5rem'
  },
  ContentText: {
    color: '#2196f3',
    fontFamily: 'Ovo',
    fontSize: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '1.5rem'
  },
  form: {
    width: '100vw',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: "100vh",
    backgroundColor: "#F5F5F5"
  },
  field: {
    marginBottom: '1rem'
  },
  saveBtn: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'start'
  },
  input: {
    'border': '2px solid #2196f3',
    'borderRadius': 3,
    '& input': {
      '&::placeholder': {
        color: 'black'
      },
      padding: '.8rem',
      'color': 'black',
      'backgroundColor': 'white',
      'transition': theme.transitions.create(['border-color', 'box-shadow']),
      'fontSize': 15,
    },
  },
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
  suggestion__content: {
    display: "flex",
    flexWrap: "wrap",
  },
  rounded_input: {
    cursor: "pointer",
    border: "1px solid grey",
    borderRadius: "60px",
    fontSize: ".7rem",
    backgroundColor: "#f9fafb",
    opacity: 0.95,
    fontWeight: "600",
    margin: "0.2rem",
    color: 'black',
    padding: "6px",
  },
  selected_input: {
    cursor: "pointer",
    border: "1px solid grey",
    borderRadius: "60px",
    fontSize: ".7rem",
    backgroundColor: "#2196f3",
    color: 'white',
    opacity: 0.95,
    fontWeight: "600",
    margin: "0.2rem",
    padding: "6px",
  },
  selectedChip: {
    backgroundColor: theme.palette.primary.main,
    margin: theme.spacing(0.5),
  },
}))

const PreLogin = ({ stepChangeNext, setStepChangeNext }) => {
  const { auth } = useSelector((state) => state);
  const { user } = auth;
  const classes = useStyles();
  const {
    suggestion__box,
    suggestion__header,
    suggestion__content,
    rounded_input,
    skill__input,
    selectedChip,
    selected_input
  } = classes;

  console.log(user, ' is the user')

  const [fName, setFName] = useState("")
  const [lName, setLName] = useState("");
  const [description, setDescription] = useState("");
  const dispatch = useDispatch();
  const [stepChange, setStepChange] = useState(false);
  const [locationCity, setLocationCity] = useState("");
  const [locationCountry, setLocationCountry] = useState("");
  const [isPreLogin, setIsPreLogin] = useState(true)
  const [buttonName, setButtonName] = useState(false);
  const saveLocation = async () => {
    const userObj = {
      locationCity,
      locationCountry
    };
    const newUserState = await updateUserInfo({
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
  }
  const [skills, setSkills] = useState([]);
  const [job, setJob] = useState(null);
  const oldCats = job?.categories ? job?.categories : [];
  const oldCatIds = oldCats.map((cat) => cat?._id);
  const [catIds, setCatIds] = useState(oldCatIds);
  const [catDict, setCatDict] = useState([]);
  const [inputRef, setInputRef] = useState(null);
  const [suggestedSkills, setSuggestedSkills] = useState([]);
  const [reSuggested, setReSuggested] = useState([]);
  const [focus, setFocus] = useState([]);
  const [inputRemove, setInputRemove] = useState();
  const [subSkills, setSubSkills] = useState([]);
  const [next, setNext] = useState(false);
  const [subCat, setSubCat] = useState(subSkills)
  const [open, setOpen] = useState(false)
  const [mainOpen, setMainOpen] = useState(true)
  const savePreData = async () => {
    const userObj = {
      displayName: fName + ' ' + lName,
      description,
    };
    const newUserState = await updateUserInfo({
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
    setMainOpen(!mainOpen)
    setOpen(!open)
    setButtonName(!buttonName)
  }

  const addCats = (newCats) => {
    const { newDict, idArr } = arrayToReducer(newCats);

    setCatDict({
      ...catDict,
      ...newDict,
    });

    setCatIds(Array.from(new Set([...catIds, ...idArr])));
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

  const saveSkills = async () => {
    skills.forEach(async (skillTag) => {
      let flag = 1;
      for (let entry of user?.skillSet) {
        if (entry.skillTag === skillTag) {
          flag = 0;
          break;
        }
      }
      if (flag === 1) {
        const skillObj = {
          skillTag,
        };
        const updatedUser = await updateUserInfoArray({
          userId: user?._id,
          userInfo: skillObj,
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
      }
    });
  };
  const fetchSubSkills = async () => {
    const response = await Api.post('/getSkills');
    let temp = [];
    await subCat.forEach((v) => {
      temp.push(...response.data[v].subJobs);
    })
    setSubCat(temp)
  }
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


  const [suggestionBox, setSuggestionBox] = useState(true);

  useEffect(() => {
    if (oldCats && oldCats.length > 0) {
      addCats(oldCats);
    }
  }, [oldCats?.length]);

  useEffect(() => {
    getSkills();
  }, []);
  return (
    <>
      {!stepChange ? (
        <div className={classes.form}>
          {!buttonName ? (
            <Dialog
              hideBackdrop={true}
              open={mainOpen}
              aria-labelledby="form-dialog-title"
              scroll={"paper"}
              PaperProps={{
                style: {
                  // backgroundColor: '#d6f1eb',
                  backgroundColor: '#fff',
                  borderRadius: "1rem",
                  boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
                  width: '25rem',
                  // height: '27rem',
                  paddingBottom: "1rem"
                }
              }}
            >
              <DialogTitle id="form-dialog-title">Step 1</DialogTitle>
              <DialogContent>
                <Typography variant='h5' style={{ marginBottom: "1rem" }} component={"h3"}>Tell Us Something...</Typography>
                <div className={classes.field}>
                  <TextField
                    label="First Name"
                    required
                    id="name"
                    placeholder='eg. John'
                    color='white'
                    value={fName}
                    onChange={(e) => {
                      setFName(e.target.value);
                    }}
                    variant="outlined"
                    size="small"
                    fullWidth
                  />
                </div>
                <div className={classes.field}>
                  <TextField
                    label="Last Name"
                    required
                    id="name"
                    placeholder='eg. Smith'
                    value={lName}
                    onChange={(e) => {
                      setLName(e.target.value);
                    }}
                    variant="outlined"
                    size="small"
                    fullWidth
                  />
                </div>
                <div className={classes.field}>
                  <TextField
                    label="Description"
                    id="description"
                    placeholder="eg. I really love real estate "
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                    }}
                    variant="outlined"
                    size="small"
                    multiline={true}
                    rows={3}
                    fullWidth
                  />
                </div>
                <div className={classes.saveBtn}>
                  <Button
                    onClick={buttonName ? saveLocation : savePreData}
                    color="primary"
                    variant="contained"
                    fullWidth
                    style={{ boxShadow: "none", borderRadius: "0.3rem" }}
                  >
                    {buttonName ? buttonName : "Next"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          ) : (
            <SkillDialog mainOpen={mainOpen} setMainOpen={setMainOpen} isPreLogin={isPreLogin} buttonName={buttonName} setButtonName={setButtonName} setIsPreLogin={setIsPreLogin} setStepChange={setStepChange} stepChange={stepChange} open={open} setOpen={setOpen} />)}
        </div>
      ) : (<></>)}
    </>
  )
}

export default PreLogin