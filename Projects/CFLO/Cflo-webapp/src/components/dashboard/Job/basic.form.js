import React, { useState, useEffect } from 'react';
import { withFormik } from 'formik';
import * as Yup from 'yup';
import { withStyles } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import CreateBtn from '../../styled/actionBtns/create.btn';
import Api from '../../../helpers/Api';
import { setJobs } from './job.utils';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import NumberFormat from 'react-number-format';
import { MuiPickersUtilsProvider, KeyboardTimePicker, KeyboardDatePicker } from '@material-ui/pickers';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import GooglePlace from '../../google.places';
import Checkbox from '@material-ui/core/Checkbox';
import DescriptionInput from '../../styled/description.input';
import RoomIcon from '@material-ui/icons/Room';
import EditBtn from '../../styled/actionBtns/edit.btn';

const styles = () => ({
  row: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    margin: '1rem',
  },

  colDiv: {},

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
});

class BasicForm extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { dashboard, dispatch, user, job } = this.props;
    const owner = job.owner;
    if (owner && owner._id) {
    } else {
      Api.post('job/update', {
        _id: this.props.jobId,
        owner: user._id,
        ownerModelName: user.model,
      }).then((job) => {
        setJobs([job], dashboard, dispatch);
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { values, setForm } = prevProps;
  }

  getPayForm = (payType, values, setFieldValue) => {
    //console.log(payType,values,' is props')
    const { classes } = this.props;

    //console.log(values[payType])
    const amount = values.payType;
    //console.log(values,' is values ',amount,' is the amount')

    switch (payType) {
      case 'Fixed':
        return (
          <div className={classes.boxWidth}>
            <Typography variant="button">
              <b>Fixed</b>
            </Typography>
            <NumberFormat
              value={values.fixed}
              thousandSeparator={true}
              prefix={'$'}
              customInput={TextField}
              onValueChange={(values) => {
                const { value } = values;
                setFieldValue('fixed', value);
              }}
            />
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
              <NumberFormat
                value={values.negoMin}
                thousandSeparator={true}
                prefix={'$'}
                customInput={TextField}
                onValueChange={(values) => {
                  const { value } = values;
                  setFieldValue('negoMin', value);
                }}
              />
            </div>
            <div className={classes.boxWidth}>
              <Typography variant="button">
                <b>Maximum</b>
              </Typography>
              <NumberFormat
                value={values.negoMax}
                thousandSeparator={true}
                prefix={'$'}
                customInput={TextField}
                onValueChange={(values) => {
                  const { value } = values;
                  setFieldValue('negoMax', value);
                }}
              />
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
            <NumberFormat
              value={values.minAssured}
              thousandSeparator={true}
              prefix={'$'}
              customInput={TextField}
              onValueChange={(values) => {
                const { value } = values;
                setFieldValue('minAssured', value);
              }}
            />{' '}
            -
            <NumberFormat
              value={values.incentive}
              thousandSeparator={true}
              prefix={'$'}
              customInput={TextField}
              onValueChange={(values) => {
                const { value } = values;
                setFieldValue('incentive', value);
              }}
            />
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
              <NumberFormat
                value={values.hourly}
                thousandSeparator={true}
                prefix={'$'}
                customInput={TextField}
                onValueChange={(values) => {
                  const { value } = values;
                  setFieldValue('Hourly', value);
                }}
              />
            </div>
          </div>
        );
        break;
      default:
        break;
    }
  };

  updateJobOwner = (owner) => {
    const { dashboard, dispatch, setFieldValue } = this.props;
    Api.post('job/update', {
      _id: this.props.jobId,
      owner: owner._id,
      ownerModelName: owner.model,
    }).then((job) => {
      setJobs([job], dashboard, dispatch);
    });
  };

  render() {
    const { classes, user, job, values, touched, errors, isSubmitting, setFieldValue, handleChange, handleBlur, handleSubmit, handleReset } =
      this.props;
    var oldPayType = values?.payType;
    //console.log(errors,' is errors',values,' are values');

    return (
      <div className={classes.container}>
        <form className={classes.container}>
          <TextField
            id="title"
            placeholder="Title (required)"
            value={values.title}
            onChange={handleChange}
            onBlur={handleBlur}
            helperText={touched.title ? errors.title : ''}
            error={touched.title && Boolean(errors.title)}
            margin="dense"
            variant="outlined"
            fullWidth
          />

          {/* <TextField
                    multiline
                    rows={5}
                    id="description"
                    placeholder="Description (required)"
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    helperText={touched.description ? errors.description : ""}
                    error={touched.description && Boolean(errors.description)}
                    margin="dense"
                    variant="outlined"
                    fullWidth
                />    */}

          <DescriptionInput
            description={values.description}
            placeholder={'Description (required)'}
            setDescription={(description) => {
              setFieldValue('description', description);
            }}
          />

          <Typography>Payment Type</Typography>
          <div className={classes.row}>
            {['Fixed', 'Negotiable', 'Hourly'].map((payType) => {
              var oldPayType = values?.payType;
              return (
                <Chip
                  key={payType}
                  variant="outlined"
                  size="small"
                  color={payType === oldPayType ? 'primary' : 'default'}
                  label={payType}
                  onClick={(e) => setFieldValue('payType', payType)}
                />
              );
            })}
          </div>

          {this.getPayForm(oldPayType, values, setFieldValue)}

          <div className={classes.boxWidth}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                value={values.startDate}
                className={classes.datePicker}
                margin="normal"
                id="date-picker-dialog"
                label="Start Date"
                format="MM/dd/yyyy"
                onChange={(date) => {
                  setFieldValue('startDate', date);
                }}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
            </MuiPickersUtilsProvider>
          </div>

          <GooglePlace setLocation={(location) => setFieldValue('location', location)} />
          {/* <div className={classes.row}>
                            <Checkbox
                                checked={values.remote}
                                onChange={(e)=>{setFieldValue('remote',e.target.checked )}}
                                color="primary"
                                inputProps={{ 'aria-label': 'secondary checkbox' }}
                            />
                            <Typography>Allow remote work</Typography>
                        </div> */}

          <div className={classes.container}>
            <CreateBtn type="submit" color="primary" disabled={isSubmitting} onClick={handleSubmit}>
              Save
            </CreateBtn>
          </div>
        </form>
      </div>
    );
  }
}

const StyledUserForm = withStyles(styles)(BasicForm);

const Form = withFormik({
  mapPropsToValues: ({ jobDictionary, jobId }) => {
    //console.log(jobId,' is the jobId')
    const job = jobDictionary[jobId];

    return {
      owner: job?.owner || null,
      title: job?.title || '',
      description: job?.description || '',
      payType: job?.payType || 'Negotiable',
      fixed: job?.fixed || 100,
      negoMin: job?.negoMin || 100,
      negoMax: job?.negoMax || 100,
      minAssured: job?.minAssured || 100,
      incentive: job?.incentive || 100,
      hourly: job?.hourly || 100,
      startDate: job?.startDate || null,
      remote: job?.remote || '',
      location: job?.location || null,
      remote: job?.remote || false,
    };
  },

  validationSchema: Yup.object().shape({
    title: Yup.string().min(3, 'Title must contain at least 3 characters').required('Required'),

    description: Yup.string().min(3, 'Description must contain at least 3 characters').required('Required'),

    startDate: Yup.date(),

    remote: Yup.boolean(),

    location: Yup.object().shape({
      name: Yup.string().required('Required'),
    }),
  }),

  handleSubmit: async (values, { props, setSubmitting, setValues }) => {
    const { job, setJob, setActiveStep, dashboard, dispatch } = props;

    Api.post('job/update', {
      ...job,
      title: values.title,
      description: values.description,
      payType: values.payType,
      fixed: values.fixed,
      negoMin: values.negoMin,
      negoMax: values.negoMax,
      minAssured: values.minAssured,
      incentive: values.incentive,
      hourly: values.hourly,
      location: values.location,
      remote: values.remote,
    }).then((job) => {
      setJobs([job], dashboard, dispatch);
      setActiveStep(1);
    });
  },
})(StyledUserForm);

const mapStateToProps = ({ dashboard, auth }) => {
  const { jobDictionary } = dashboard;
  const { user } = auth;
  return { jobDictionary, dashboard, user };
};

const mapDispatchToProps = (dispatch) => {
  return {
    // dispatching plain actions
    dispatch,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form);
