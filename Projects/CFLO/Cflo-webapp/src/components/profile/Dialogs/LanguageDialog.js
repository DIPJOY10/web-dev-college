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
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import {
  updateUserInfoArray,
  editUserArray,
  deleteArrayItem,
  fetchUserInfo,
} from "../api";
import Api from "../../../helpers/Api";

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
      marginTop: "0.5rem",
    },
  },
   dataResult:{
    marginTop:'5px',
    width:'30rem',
    height:'5rem',
    backgroundColor:'white',
    boxShadow:'rgba(0, 0, 0, 0.35) 0px 5px 15px',
    overflow:'hidden',
    overflowY:'auto',
   },
   dataItem:{
    width:'100%',
    height:'2rem',
    display:'flex',
    alignItems:'center',
    color:'black'
   },
  pTag:{
    marginLeft:'1rem'
    
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

const LanguageDialog = ({ open, setOpen, enableEdit, currentLangObj,setProgress }) => {
  const classes = useStyles();
  const { dialog__content } = classes;
  const [lang,setLang] = useState([]);
  const [languages,setLanguages] = useState([]);

  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const { user, organizationIds } = useSelector((state) => state.auth);

  const [name, setName] = useState(currentLangObj?.name || "");

  const [proficiency, setProficiency] = useState(
    currentLangObj?.proficiency || ""
  );

  const proficiencyArray = [
    "Elementary Proficiency",
    "Limited Working Proficiency",
    "Professional Working Proficiency",
    "Full Professional Proficiency",
    "Native or Billingual Proficiency",
  ];

  const languageData = async()=>{
     const res = await Api.post("/languages/get");
     setLanguages(res.data);
  }  
   const handleSearchFilter = (e)=>{
    const searchWord = e.target.value;
    setName(e.target.value)
    const newFilter = languages.filter((f)=>{
      return f.title.toLowerCase().includes(searchWord.toLowerCase()) 
    })

    if(searchWord===""){
       setLang([])
    }else{
      setLang(newFilter)

    }
   }
  const handleClose = () => {
    setOpen(false);
  };

  const saveData = async (userData) => {
    if (enableEdit) {
      const updatedUser = await editUserArray({
        arrayId: currentLangObj._id,
        arrayObj: userData,
        arrayName: "languages",
      });
      dispatch({
        type: "AddAuth",
        payload: {
          user: {
            ...user,
            languages: updatedUser?.languages,
          },
        },
      });
    } else {
      const updatedUser = await updateUserInfoArray({
        userId: user?._id,
        userInfo: userData,
        arrayName: "languages",
      });
      dispatch({
        type: "AddAuth",
        payload: {
          user: {
            ...user,
            languages: updatedUser?.languages,
          },
        },
      });
    }
  };

  const deleteData = async (languageObjId) => {
    const updatedUser = await deleteArrayItem({
      userId: user._id,
      arrayObjId: languageObjId,
      arrayName: "languages",
    });
    dispatch({
      type: "AddAuth",
      payload: {
        user: {
          ...user,
          languages: updatedUser?.languages,
        },
      },
    });
  };
useState(()=>{
  languageData();
},[]);
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
      scroll={"paper"}
      fullWidth
    >
      <DialogTitle id="form-dialog-title" onClose={handleClose}>
        {enableEdit ? "Edit" : "Add"} Language
      </DialogTitle>
      <DialogContent dividers className={dialog__content}>
        <DialogContentText>Enter Language</DialogContentText>
        <TextField
          required
          id="languageName"
          value={name}
          onChange={handleSearchFilter}
          variant="outlined"
          fullWidth
        />
        {
          lang.length != 0 && (
            <div className={classes.dataResult}>
          {lang.map((val,key)=>(
            <div className={classes.dataItem}><p onClick={(e)=>  {
              setName(e.target.innerText)
              setLang([]);
            }} className={classes.pTag}>{val.title}</p></div>
          ))}
        </div>
          ) 
        }
        <DialogContentText>Proficiency</DialogContentText>
        <FormControl variant="outlined" fullWidth>
          <InputLabel htmlFor="outlined-age-native-simple">
            Please select
          </InputLabel>
          <Select
            native
            value={proficiency}
            onChange={(e) => {
              setProficiency(e.target.value);
            }}
            label="Please select"
          >
            <option aria-label="None" value="" />
            {proficiencyArray.map((entry, index) => {
              return (
                <option key={index} value={entry}>
                  {entry}
                </option>
              );
            })}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        {enableEdit ? (
          <Button
            onClick={() => {
              deleteData(currentLangObj._id);
              handleClose();
            }}
            color="secondary"
            variant="outlined"
          >
            DELETE
          </Button>
        ) : null}
        <Button
          onClick={() => {
            saveData({
              name,
              proficiency,
            });
            setProgress((prev)=> prev+30)
            handleClose();
          }}
          color="primary"
          variant="outlined"
        >
          SAVE
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LanguageDialog;
