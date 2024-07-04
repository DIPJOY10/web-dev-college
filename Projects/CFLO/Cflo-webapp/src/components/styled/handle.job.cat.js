import React, {useState, useEffect} from 'react';
import {makeStyles, withStyles} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import {useSelector, useDispatch} from 'react-redux';
import {useHistory, useLocation} from 'react-router-dom';
import Button from '@material-ui/core/Button';
import CreateButton from './actionBtns/create.btn';
import PropTypeSelect from './skill.types';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import EditBtn from './actionBtns/edit.btn';
import clsx from 'clsx';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogActions from '@material-ui/core/DialogActions';
import _ from 'lodash';

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
}));

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

const HandleJobCat = (props)=>{
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const {jobCatDictionary} = useSelector((state)=>state.dashboard);

  const {skillTags, setSkillTags} = props;

  const [tagIds, setTagIds] = useState(skillTags);

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setSkillTags(tagIds);
  }, [tagIds]);

  const toggleTags = (catId)=>{
    setTagIds(_.xor(tagIds, [catId]));
  };


  return (
    <div className={classes.root}>
      <div className={classes.rowDiv}>
        <Typography variant="h6" gutterBottom className={classes.paperText}>
          {skillTags.length>0?null:'Select'} Skills Required
        </Typography>
        {skillTags?.length>0?<EditBtn onClick={()=>{
          setOpen(true);
        }} />:<CreateButton
          variant="contained"
          className={classes.button}
          startIcon={<AddIcon />}
          onClick={()=>{
            setOpen(true);
          }}
        >
          {'Select'}
        </CreateButton>}

      </div>

      <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
        <DialogTitle id="propcatdialog">{'Select Asset Type'}</DialogTitle>

        <PropTypeSelect
          tagIds={tagIds}
          setTagIds={setTagIds}
        />
        <DialogActions className={classes.actionBtn}>
          <Button onClick={()=>{
            setSkillTags(tagIds);
            setOpen(false);
          }} color="primary">
                            Save
          </Button>
        </DialogActions>
      </Dialog>

      <div className={classes.rowDiv}>
        {skillTags?.map((tagId) => {
          const tag = jobCatDictionary[tagId];

          return (

            <Chip
              className={classes.chip}
              label={tag.name}
              onDelete={()=>toggleTags(tag._id)}
            />

          );
        })}
      </div>

    </div>

  );
};

export default HandleJobCat;
