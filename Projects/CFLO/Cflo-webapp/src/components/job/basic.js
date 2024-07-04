import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
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
import GooglePlace from '../google.places';
import DescriptionInput from '../styled/description.input';
import CreateBtn from '../styled/actionBtns/create.btn';
import Api from '../../helpers/Api';

import TitleInput from '../styled/title.input';
import TextField from '@material-ui/core/TextField';
import ProfileSelect from '../styled/profile.select';
import { FormatListBulletedTwoTone } from '@material-ui/icons';
import LoadingButton from '../styled/actionBtns/loading.btn';

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    [theme.breakpoints.down('xs')]: {
      width: '90%',
    },
    // alignItems: 'center'
  },

  row: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    margin: '1rem',
  },
  row2: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    margin: '1rem',
    width: '90%',
    alignItems: 'center',
    justifyContent: 'space-between'
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
    flexDirection: 'row',
    display: 'flex',
    marginTop: '3vh',
    // maxWidth: '32rem',
    width: '90%',
    justifyContent: 'flex-end',
    [theme.breakpoints.down('xs')]: {
      width: '100%'
    },
  },

  boxWidth: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '9rem',
    margin: '0.5rem',
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    margin: "0rem 1rem",
  },
}));

export default function S(props) {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const theme = useTheme();
  const {
    job, setJob, setActiveStep, adminProfiles,
    jobEdit, reviewData, setreviewData, isMobile
  } = props;
  const jobId = job?._id

  const [owner, setOwner] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [payType, setPayType] = useState('Negotiable');
  const [fixed, setFixed] = useState(100);
  const [negoMin, setNegoMin] = useState(100);
  const [negoMax, setNegoMax] = useState(100);
  const [minAssured, setMinAssured] = useState();
  const [incentive, setIncentive] = useState(100);
  const [hourly, setHourly] = useState(100);
  const [startDate, setStartDate] = useState(null);
  const [remote, setRemote] = useState('');
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  console.log(location, ' is the location')


  const reloadJob = () => {

    const ownerOld = job?.owner?.parent || null;
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
    const locationOld = job?.location || null;
    setOwner(ownerOld);
    setTitle(titleOld);
    setDescription(descriptionOld);
    setPayType(payTypeOld);
    setFixed(fixedOld);
    setNegoMin(negoMinOld);
    setNegoMax(negoMaxOld);
    setMinAssured(minAssuredOld)
    setIncentive(incentiveOld)
    setHourly(hourlyOld)
    setStartDate(startDateOld)
    setRemote(remoteOld)
    setLocation(locationOld)
  }

  const {
    root, row, col,
  } = classes;

  useEffect(() => {
    reloadJob()
  }, [job])

  const updateApi = () => {
    const newJobObject = {
      _id: jobId,
      title,
      description,
      payType, fixed, negoMin, negoMax, negoMax,
      minAssured, incentive, hourly, startDate, location,
      owner: owner?.profile
    }
    jobEdit(newJobObject, (jobRes) => {
      setActiveStep(1);
      setJob(jobRes)
      setreviewData({
        owner: owner,
        title: title,
        subject: reviewData?.subject
      });
      setLoading(false);
    })
  };

  // useEffect(() => {
  //   // console.log(owner,' is the owner')
  //   Api.post('job/update', {
  //     _id: jobId,
  //     payType, fixed, negoMin, negoMax, negoMax,
  //     minAssured, incentive, hourly, startDate, location,
  //     owner: owner?.profile,
  //   }).then((job)=>{
  //     // console.log(job,' is the new updated job')
  //     // setJobs([job], dashboard, dispatch );
  //   });
  // }, [
  //   payType, fixed, negoMin, negoMax, negoMax,
  //   minAssured, incentive, hourly, startDate, location,
  //   owner,
  // ]);

  const getPayForm = (payType) => {
    switch (payType) {
      case 'Fixed':
        return (
          <div className={classes.row}>
            <div className={classes.boxWidth}>
              <Typography variant="button">
                <b>Fixed</b>
              </Typography>
              <NumberFormat value={fixed} thousandSeparator={true} prefix={'$'} customInput={TextField} onValueChange={(values) => {
                const { value } = values;
                setFixed(value);
              }} />
            </div>
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
                const { value } = values;
                setNegoMin(value);
                if (value > Number(negoMax)) {
                  setNegoMax(value);
                }

              }} />
            </div>
            <div className={classes.boxWidth}>
              <Typography variant="button">
                <b>Maximum</b>
              </Typography>
              <NumberFormat value={negoMax} thousandSeparator={true} prefix={'$'} customInput={TextField} onValueChange={(values) => {
                const { value } = values;
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
              const { value } = values;
              setMinAssured(value);
            }} /> -
            <NumberFormat value={incentive} thousandSeparator={true} prefix={'$'} customInput={TextField} onValueChange={(values) => {
              const { value } = values;
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
                const { value } = values;
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
      <div style={{
        display: 'flex',
        //  border: '1px solid red',
        justifyContent: 'center', width: '100%'
      }}>
        <ProfileSelect
          owner={owner}
          adminProfiles={adminProfiles}
          displayOwner={true}
          title={'Post Job As'}
          onChange={(value) => {
            setOwner(value);
            console.log('valueisOwner ', value)
          }}
          placeholder={'Job proposal owner'}
        />
      </div>
      <div style={{
        display: 'flex',
        //  border: '1px solid red',
        flexDirection: 'column',
        alignSelf: 'center', width: '95%'
      }}>
        <TitleInput
          title={title}
          placeholder={'Title (required)'}
          type={"Job"}
          isMobile={isMobile}
          setTitle={(title) => {
            setTitle(title);

          }}
        />

        <DescriptionInput
          isMobile={isMobile}
          description={description}
          placeholder={'Description (required)'}
          setDescription={(description) => {
            setDescription(description);
          }}
        />
      </div>
      <div className={isMobile ? classes.col : classes.row2}>
        <Typography className={classes.text}>Payment Type</Typography>
        <div className={classes.row}>
          {['Fixed', 'Negotiable', 'Hourly'].map((payTypeChip) => {
            return (
              <Chip
                key={payTypeChip}
                variant="outlined"
                size="medium"
                color={payTypeChip == payType ? 'primary' : 'default'}
                label={payTypeChip}
                style={{ marginRight: '1vh' }}
                onClick={(e) => setPayType(payTypeChip)}
              />);
          })}
        </div>
        {getPayForm(payType)}
      </div>


      <div className={isMobile ? classes.col : classes.row2}>
        <Typography className={classes.text}>Start Date</Typography>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            value={startDate}
            className={classes.datePicker}
            margin="normal"
            id="date-picker-dialog"
            label="Start Date"
            format="MM/dd/yyyy"
            onChange={(date) => {
              setStartDate(date);
            }}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
            style={isMobile ? { marginLeft: '4vw' } : null}
          />

        </MuiPickersUtilsProvider>
      </div>
      <div className={isMobile ? classes.col : classes.row2} style={isMobile ? { margin: '2vh 0' } : null}>
        <Typography className={classes.text} style={isMobile ? { marginBottom: '2vh' } : null}>Location</Typography>
        <div style={isMobile ? { marginLeft: '4vw' } : null}>
          <GooglePlace
            location={location}
            setLocation={(location) => setLocation(location)}
          />
        </div>
      </div>

      <div className={classes.container}>
        {/* <CreateBtn type="submit" color="primary" onClick={() => {
          updateApi();
        }}>
          Save
        </CreateBtn> */}
        <LoadingButton
          loading={loading}
          styleBody={{
            height: "35px",
            borderRadius: "20px",
            padding: "5.5px 15px",
          }}
          text={'Save and Next'}
          onClick={() => {
            setLoading(true);
            updateApi()
          }}
          style={
            {
              backgroundColor: theme.palette.primary.light,
              color: "white",
              marginBottom: '2vh'
            }
          }
          progressStyle={{ color: "white" }}
        >

          Save and Next
          {/* {console.log(btn, "Apps")} */}
        </LoadingButton>
      </div>
    </div>
  );
}
