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
import HandlePropCat from '../../styled/handle.prop.cat';

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
    jobId, setActiveStep,
  } = props;
  const dashboard = useSelector((state) => state.dashboard);

  const {
    jobDictionary,
  } = dashboard;
  const job = jobDictionary[jobId];

  const oldPropertyTypes = job?.propertyTypes?job?.propertyTypes:[];
  const oldArea = job?.area?job?.area:0;
  const oldExperience = job?.experience?job?.experience:1;

  const [propertyTypes, setPropertyTypes] = useState(oldPropertyTypes);
  const [area, setArea] = useState(oldArea);
  const [experience, setExperience] = useState(oldExperience);


  const {
    root, row, col,
  } = classes;

  const _update = ()=>{
    Api.post('job/update', {
      _id: jobId,
      propertyTypes,
    }).then((job)=>{
      setJobs([job], dashboard, dispatch );
      setActiveStep(2);
    });
  };


  return (
    <div className={root}>

      <HandlePropCat
        propertyTypes={propertyTypes}
        setPropertyTypes={setPropertyTypes}
      />

      <div className={classes.col}>
        <Typography>
          <b>Area (sq/ft)</b>
        </Typography>
        <TextField id="standard-basic" type="number" value={area}
          helperText={'Total Project Area'}
          placeholder={area}
          onChange={(event) => {
            const target = Number(event.target.value);
            if (Number.isInteger(target)&&target>=0) {
              const str = String(event.target.value);

              const firstChar = String(event.target.value).slice(0, 1);

              if (firstChar.localeCompare('0')==0&&str.length>1) {
                setArea(str.slice(1));
              }
              else {
                setArea(str);
              }
            }
          }}/>
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
