import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import {useParams, useHistory, useLocation} from 'react-router-dom';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import SuccessBtn from './actionBtns/success.btn';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import _ from 'lodash';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    padding: '1rem',
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

export default function PropCatCategories(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const theme = useTheme();
  const history = useHistory();

  const dashboard = useSelector((state) => state.dashboard);
  const {propCats, propCatDictionary} = dashboard;

  const {tagIds, setTagIds} = props;
  const [updated, setUpdated] = useState(false);
  const [state, setstate] = useState({});
  const mixedUsedCat = propCats.filter((primaryCat) => primaryCat.main.name === 'Mixed Use');
  const normalPropCats = propCats.filter((primaryCat) => primaryCat.main.name !== 'Mixed Use');
  // console.log(updated,tagIds,' are updated and tagIds')

  const toggleTags = (category, primary) => {
    const catId = category._id;
    let newIds = _.xor(tagIds, [catId]);
    newIds = _.union([primary._id], newIds);
    setTagIds(newIds);
  };

  return (
    <div className={classes.root}>
      {tagIds.map((tagId) => {
        const tag = propCatDictionary[tagId];

        return <Chip label={tag.name} className={classes.selectedTag} onDelete={() => toggleTags(tag)} />;
      })}
      {/* <Paper component="ul" className={classes.selectedPaper}>
            <Typography className={classes.heading}>Select Property Type : </Typography>
                {tagIds.map((tagId) => {

                    const tag = propCatDictionary[tagId];

                    return (

                        <Chip
                            label={tag.name}
                            className={classes.selectedTag}
                            onDelete={()=>toggleTags(tag)}
                        />

                    );
                })}
                {tagIds.length>0?<SuccessBtn
                                color={'success'}
                                variant="contained"
                                endIcon={<DoneAllIcon />}
                                onClick={()=>{

                                }}
                >
                    Done
                </SuccessBtn>:null}
            </Paper> */}
      <div>
        {normalPropCats.map((propCat, i) => {
          const subs = propCat.subs;
          return (
            <Accordion key={i}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                <Typography className={classes.heading}>{propCat.main.name}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div>
                  {subs.map((subPropCat) => {
                    let icon;
                    const tagId = subPropCat._id;
                    const {chip, selectedChip} = classes;

                    const chipStyle = chipStyle;

                    return (
                      <Chip
                        key={tagId}
                        icon={icon}
                        label={subPropCat.name}
                        className={chip}
                        onClick={() => {
                          toggleTags(subPropCat, propCat.main);
                        }}
                      />
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
