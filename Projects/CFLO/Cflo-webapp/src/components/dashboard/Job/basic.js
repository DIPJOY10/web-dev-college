import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {useHistory} from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import NumberFormat from 'react-number-format';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import GooglePlace from '../../google.places';
import DescriptionInput from '../../styled/description.input';
import CreateBtn from '../../styled/actionBtns/create.btn';
import Api from '../../../helpers/Api';
import {setJobs} from './job.utils';
import TitleInput from '../../styled/title.input';
import TextField from '@material-ui/core/TextField';
import ProfileSelect from '../../styled/profile.select';

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
    margin: '1rem',
  },

  col: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },

  card2Style: {
    marginTop: '1.5rem',
  },

  container: {
    flex: 1,
    flexDirection: 'column',
    display: 'flex',
    maxWidth: '32rem',
  },

  boxWidth: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '9rem',
    margin: '0.5rem',
  },
}));

export default function S(props) {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const {
    job, setJob, setActiveStep, adminProfiles
  } = props;



  const jobId = job?._id;
  const ownerOld = job?.owner||null;
  const titleOld = job?.title || '';
  const descriptionOld = job?.description || '';
  const payTypeOld = job?.payType || 'Negotiable';
  const fixedOld = job?.fixed || 100;
  const negoMinOld = job?.negoMin || 100;
  const negoMaxOld = job?.negoMax || 100;
  const minAssuredOld = job?.minAssured || 100;
  const incentiveOld = job?.incentive || 100;
  const hourlyOld = job?.hourly || 100;
  const startDateOld = job?.startDate || null;
  const remoteOld = job?.remote || '';
  const locationOld = job?.location||null;

  const [owner, setOwner] = useState(ownerOld);
  const [title, setTitle] = useState(titleOld);
  const [description, setDescription] = useState(descriptionOld);
  const [payType, setPayType] = useState(payTypeOld);
  const [fixed, setFixed] = useState(fixedOld);
  const [negoMin, setNegoMin] = useState(negoMinOld);
  const [negoMax, setNegoMax] = useState(negoMaxOld);
  const [minAssured, setMinAssured] = useState(minAssuredOld);
  const [incentive, setIncentive] = useState(incentiveOld);
  const [hourly, setHourly] = useState(hourlyOld);
  const [startDate, setStartDate] = useState(startDateOld);
  const [remote, setRemote] = useState(remoteOld);
  const [location, setLocation] = useState(locationOld);

  const {
    root, row, col,
  } = classes;


  const updateApi = ()=>{
    Api.post('job/update', {
      _id: jobId,
      title,
      description,
    }).then((job)=>{

      setActiveStep(1);
    });
  };

  useEffect(() => {
    // console.log(owner,' is the owner')
    Api.post('job/update', {
      _id: jobId,
      payType, fixed, negoMin, negoMax, negoMax,
      minAssured, incentive, hourly, startDate, location,
      owner: owner?._id,
      ownerModelName: owner?.model,
    }).then((job)=>{
      // console.log(job,' is the new updated job')
      // setJobs([job], dashboard, dispatch );
    });
  }, [
    payType, fixed, negoMin, negoMax, negoMax,
    minAssured, incentive, hourly, startDate, location,
    owner,
  ]);

  const getPayForm = (payType)=>{
    switch (payType) {
      case 'Fixed':
        return (
          <div className={classes.boxWidth}>
            <Typography variant="button">
              <b>Fixed</b>
            </Typography>
            <NumberFormat value={fixed} thousandSeparator={true} prefix={'$'} customInput={TextField} onValueChange={(values) => {
              const {value} = values;
              setFixed(value);
            }} />
          </div>
        );
        break;

      case 'Negotiable':
        return (
          <div className={classes.row}>
            <div className={classes.boxWidth}>
              <Typography variant="button">
                <b>Minimum</b>
              </Typography>
              <NumberFormat value={negoMin} thousandSeparator={true} prefix={'$'} customInput={TextField} onValueChange={(values) => {
                const {value} = values;
                setNegoMin(value);
              }} />
            </div>
            <div className={classes.boxWidth}>
              <Typography variant="button">
                <b>Maximum</b>
              </Typography>
              <NumberFormat value={negoMax} thousandSeparator={true} prefix={'$'} customInput={TextField} onValueChange={(values) => {
                const {value} = values;
                setNegoMax(value);
              }} />
            </div>
          </div>
        );
        break;

      case 'Performance based':
        return (
          <div className={classes.row}>
            <Typography variant="button">
              <b>Minimum</b>
            </Typography>
            <NumberFormat value={minAssured} thousandSeparator={true} prefix={'$'} customInput={TextField} onValueChange={(values) => {
              const {value} = values;
              setMinAssured(value);
            }} /> -
            <NumberFormat value={incentive} thousandSeparator={true} prefix={'$'} customInput={TextField} onValueChange={(values) => {
              const {value} = values;
              setIncentive(value);
            }} />
          </div>
        );
        break;

      case 'Hourly':
        return (
          <div className={classes.row}>
            <div className={classes.boxWidth}>
              <Typography variant="button">
                <b>Hourly</b>
              </Typography>
              <NumberFormat value={hourly} thousandSeparator={true} prefix={'$'} customInput={TextField} onValueChange={(values) => {
                const {value} = values;
                setHourly(value);
              }} />
            </div>

          </div>
        );
        break;
      default:
        break;
    }
  };

  return (
    <div className={root}>

      <ProfileSelect
        owner={owner}
        adminProfiles={adminProfiles}
        displayOwner={true}
        title={'Post Job As'}
        onChange={(event, value) => {
          setOwner(value);
        }}
        placeholder={'Job proposal owner'}
      />

      <TitleInput
        title={title}
        placeholder={'Title (required)'}
        setTitle={(title)=>{
          setTitle(title);
        }}
      />

      <DescriptionInput
        description={description}
        placeholder={'Description (required)'}
        setDescription={(description)=>{
          setDescription(description);
        }}
      />

      <Typography>Payment Type</Typography>
      <div className={classes.row}>
        {['Fixed', 'Negotiable', 'Hourly'].map((payTypeChip)=>{
          return (
            <Chip
              key={payTypeChip}
              variant="outlined"
              size="small"
              color={payTypeChip==payType?'primary':'default'}
              label={payTypeChip}
              onClick={(e)=>setPayType(payTypeChip)}
            />);
        })}
      </div>

      {getPayForm(payType)}

      <div className={classes.boxWidth}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            value={startDate}
            className={classes.datePicker}
            margin="normal"
            id="date-picker-dialog"
            label="Start Date"
            format="MM/dd/yyyy"
            onChange={(date)=>{
              setStartDate(date);
            }}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />

        </MuiPickersUtilsProvider>
      </div>

      <GooglePlace setLocation={(location)=>setLocation(location)}/>

      <div className={classes.container}>
        <CreateBtn type="submit" color="primary" onClick={()=>{
          updateApi();
        }}>
                    Save
        </CreateBtn>
      </div>
    </div>
  );
}
