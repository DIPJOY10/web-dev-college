import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {useHistory} from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import Api from '../../../helpers/Api';
import DescriptionInput from '../../styled/description.input';
import HandleJobCat from '../../styled/handle.job.cat';
import {setJobs} from './job.utils';
import CreateBtn from '../../styled/actionBtns/create.btn';
import TextField from '@material-ui/core/TextField';
import NumberInput from '../../styled/number.input';

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '32rem',
  },

  row: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
  },

  col: {
    display: 'flex',
    flexDirection: 'column',
  },
}));

export default function S(props) {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const {
    jobId, setActiveStep, jobEdit
  } = props;
  const dashboard = useSelector((state) => state.dashboard);

  const {
    jobDictionary,
  } = dashboard;
  const job = jobDictionary[jobId];

  const oldCats = job?.categories?job?.categories:[];
  const oldWhoCanApply = job?.whoCanApply?job?.whoCanApply:'';
  const oldExperience = job?.experience?job?.experience:1;

  const [tagIds, setTagIds] = useState(oldCats);
  const [whoCanApply, setWhoCanApply] = useState(oldWhoCanApply);
  const [experience, setExperience] = useState(oldExperience);


  const {
    root, row, col,
  } = classes;


  const _update = ()=>{
    jobEdit({
      _id: jobId,
      title,
      description,
      payType, fixed, negoMin, negoMax, negoMax,
      minAssured, incentive, hourly, startDate, location,
      owner: owner?.profile
    },(job)=>{
      setActiveStep(1);
    })
  };

  return (
    <div className={root}>
      <HandleJobCat
        skillTags={tagIds}
        setSkillTags={setTagIds}
      />
      <DescriptionInput
        description={whoCanApply}
        placeholder={'What are you looking for in applicant'}
        setDescription={setWhoCanApply}
      />
      <div className={classes.col}>
        <Typography>
          <b>Minimum Experience (yr)</b>
        </Typography>
        <NumberInput value={experience} setValue={(number)=>{
          setExperience(number);
        }} />
      </div>

      <div>
        <CreateBtn type="submit" color="primary" onClick={()=>{
          _update();
        }}>
                    Save
        </CreateBtn>
      </div>
    </div>
  );
}
