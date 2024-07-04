import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import Api from '../../../helpers/Api';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import SuccessBtn from '../../styled/actionBtns/success.btn';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import _ from 'lodash';
import { setJobs } from '../../job/job.utils';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: '6rem',
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  selectedPaper: {
    flex: 1,
    display: 'flex',
    flexWrap: 'wrap',
    backgroundColor: theme.palette.primary.main,
    padding: '2rem',
    color: 'white',
  },
  selectedTag: {
    margin: theme.spacing(0.5),
    backgroundColor: 'white',
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  selectedChip: {
    backgroundColor: theme.palette.primary.main,
    margin: theme.spacing(0.5),
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

export default function JobCategories(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const theme = useTheme();
  const history = useHistory();
  const [jobArray, setJobArray] = useState([]);

  const dashboard = useSelector((state) => state.dashboard);
  const { propCats, propDictionary, propCatDictionary, jobDictionary } = dashboard;

  const { jobId } = useParams();
  const job = jobDictionary[jobId];
  const { propertyTypes } = job;
  const tagsOld = propertyTypes && propertyTypes.length ? propertyTypes : [];
  const [tagIds, settagIds] = useState(tagsOld);

  const [state, setstate] = useState({});
  const mixedUsedCat = propCats.filter((primaryCat) => primaryCat.main.name === 'Mixed Use');
  const normalPropCats = propCats.filter((primaryCat) => primaryCat.main.name !== 'Mixed Use');
  // console.log(propCats.filter(primaryCat=>primaryCat.main.name=='Mixed Use'))

  const toggleTags = (category) => {
    const catId = category._id;
    settagIds(_.xor(tagIds, [catId]));
  };

  return (
    <div className={classes.root}>
      <Paper component="ul" className={classes.selectedPaper}>
        <Typography className={classes.heading}>Select Property Type : </Typography>
        {tagIds.map((tagId) => {
          const tag = propCatDictionary[tagId];

          return <Chip label={tag.name} className={classes.selectedTag} onDelete={() => toggleTags(tag)} />;
        })}
        {tagIds.length > 0 ? (
          <SuccessBtn
            color={'success'}
            variant="contained"
            endIcon={<DoneAllIcon />}
            onClick={() => {
              Api.post('job/update', {
                ...job,
                propertyTypes: tagIds,
              }).then((job) => {
                setJobs([job], dashboard, dispatch);
                history.goBack();
              });
            }}
          >
            Done
          </SuccessBtn>
        ) : null}
      </Paper>
      <div>
        {normalPropCats.map((job, i) => {
          const subs = job.subs;
          return (
            <Accordion key={i}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                <Typography className={classes.heading}>{job.main.name}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div>
                  {subs.map((subJob) => {
                    let icon;
                    const tagId = subJob._id;
                    const { chip, selectedChip } = classes;

                    let chipStyle = chipStyle;

                    if (tagIds.indexOf(tagId) > -1) {
                      // console.log(subJob.name)
                      chipStyle = selectedChip;
                    }

                    return (
                      <>
                        {tagIds.indexOf(tagId) > -1 ? (
                          <Chip key={tagId} icon={icon} label={subJob.name} className={selectedChip} onClick={() => toggleTags(subJob)} />
                        ) : (
                          <Chip key={tagId} icon={icon} label={subJob.name} className={chip} onClick={() => toggleTags(subJob)} />
                        )}
                      </>
                    );
                  })}
                </div>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </div>
    </div>
  );
}
