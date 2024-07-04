import React, { useState, useEffect } from 'react';
import { makeStyles, TextField, withStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import CreateButton from './actionBtns/create.btn';
import PropTypeSelect from './property.types';
import AddIcon from '@material-ui/icons/Add';
import EditBtn from './actionBtns/edit.btn';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogActions from '@material-ui/core/DialogActions';
import _ from 'lodash';
import { getPropertyType } from '../ProjectAnalysis/api.call';
import Autocomplete from "@material-ui/lab/Autocomplete";

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minWidth: '19rem',
  },
  rowDiv: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  paperText: {
    margin: '1rem',
  },
  chip: {
    margin: '0.3rem',
  },
  actionBtn: {
    position: 'absolute',
    botton: 0,
    right: 0,
  },
  autoComplete_container: {
    display: "flex",
    flexDirection: 'column',
    margin: '2vh 2vw'
    // border: '1px solid red',
    // width: '80%'
  },
}));

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

const HandlePropCat = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const { propCatDictionary } = useSelector((state) => state.dashboard);

  const { propertyTypes, setPropertyTypes } = props;

  // const [tagIds, setTagIds] = useState(propertyTypes);
  const [primary, setPrimary] = useState([]);
  const [types, setTypes] = useState({});
  const [category, setCategory] = useState(propertyTypes[0] || "");
  const [subCategories, setSubCategories] = useState([]);
  const [subCategory, setSubCategory] = useState(propertyTypes[1] || "");
  const handleClose = () => {
    setOpen(false);
  };
  const onCategorySelect = (value) => {
    setSubCategories(types?.[value]?.type);
    setCategory(value);
  };
  useEffect(() => {
    getPropertyType()
      .then((data) => {
        setPrimary(data.primary);
        setTypes(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);


  // const toggleTags = (catId) => {
  //   setTagIds(_.xor(tagIds, [catId]));
  // };

  return (
    <div className={classes.root}>
      <div className={classes.rowDiv}>
        <Typography variant="h6" gutterBottom className={classes.paperText}>
          {propertyTypes.length > 0 ? null : 'Select'} Asset type
        </Typography>
        {propertyTypes?.length > 0 ? (
          <EditBtn
            onClick={() => {
              setOpen(true);
            }}
          />
        ) : (
          <CreateButton
            variant="contained"
            className={classes.button}
            startIcon={<AddIcon />}
            onClick={() => {
              setOpen(true);
            }}
          >
            {'Select'}
          </CreateButton>
        )}
      </div>

      <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
        <DialogTitle id="propcatdialog">{'Select Asset Type'}</DialogTitle>

        {/* <PropTypeSelect tagIds={tagIds} setTagIds={setTagIds} /> */}
        <div className={classes.autoComplete_container}>
          <Autocomplete
            id="propertyType"
            options={primary}
            value={category}
            getOptionLabel={(option) => option}
            style={{ width: 250, marginBottom: '2vh' }}
            onChange={(event, value) => {
              onCategorySelect(value);
            }}
            renderInput={(params) => (
              <TextField {...params} label="Property Type" variant="outlined" />
            )}
          />
          {category !== null ? (
            <Autocomplete
              id="propertyCategory"
              options={subCategories}
              getOptionLabel={(option) => option}
              style={{ width: 250 }}
              value={subCategory}
              onChange={(event, value) => {
                setSubCategory(value);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Main Category"
                  variant="outlined"
                />
              )}
            />
          ) : null}
        </div>
        <DialogActions className={classes.actionBtn}>
          <Button
            onClick={() => {
              setPropertyTypes([category, subCategory]);
              setOpen(false);
            }}
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <div className={classes.rowDiv}>
        {propertyTypes?.map((types) => {
          // const tag = propCatDictionary[tagId];

          return <Chip className={classes.chip} label={types}
          // onDelete={() => toggleTags(tag._id)} 
          />
        })}
      </div>
    </div>
  );
};

export default HandlePropCat;
