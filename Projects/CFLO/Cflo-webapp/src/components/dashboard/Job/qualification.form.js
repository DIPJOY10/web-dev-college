import React, {useState, useEffect} from 'react';
import {withFormik} from 'formik';
import * as Yup from 'yup';
import {withStyles} from '@material-ui/core';
import {connect} from 'react-redux';
import CreateBtn from '../../styled/actionBtns/create.btn';
import Api from '../../../helpers/Api';
import {setJobs} from './job.utils';
// import HandleJobCat from "./handlejobcat";
import HandleJobCat from '../../styled/handle.job.cat';
import TextField from '@material-ui/core/TextField';
import NumberInput from '../../styled/number.input';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

const styles = () => ({

  row: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    margin: '1rem',
  },

  experiencePaper: {
    marginLeft: '1rem',
    padding: '1rem',
  },

  container: {
    flex: 1,
    flexDirection: 'column',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});


class QualForm extends React.Component {
  componentDidUpdate(prevProps, prevState) {
    const {
      values,
      setForm,
    } = prevProps;
  }

  render() {
    const {
      classes,
      user,
      values,
      touched,
      errors,
      isSubmitting,
      handleChange,
      setFieldValue,
      handleBlur,
      handleSubmit,
      handleReset,
      jobId,
    } = this.props;

    // console.log(errors,' is errors');


    return (
      <div className={classes.container}>
        <form>
          <HandleJobCat />

          <div className={classes.row}>
            <TextField
              multiline
              rows={9}
              id="whoCanApply"
              placeholder="Who can apply (optional)"
              value={values.whoCanApply}
              onChange={handleChange}
              onBlur={handleBlur}
              helperText={touched.whoCanApply ? errors.whoCanApply : ''}
              error={touched.whoCanApply && Boolean(errors.whoCanApply)}
              margin="dense"
              variant="outlined"
              fullWidth
            />
            <div>
              <Paper className={classes.experiencePaper}>
                <Typography variant="h6" gutterBottom className={classes.paperText}>
                            Experience (years)
                </Typography>
                <NumberInput value={values.experience} setValue={(number)=>{
                  setFieldValue('experience', number);
                }} />
              </Paper>
            </div>


          </div>


          <div className={classes.container}>
            <CreateBtn type="submit" color="primary" disabled={isSubmitting} onClick={handleSubmit}>
                        Save
            </CreateBtn>
          </div>
        </form>
      </div>
    );
  }
};

const StyledUserForm = withStyles(styles)(QualForm);

const Form = withFormik({
  mapPropsToValues: ({
    jobDictionary,
    jobId,
  }) => {
    // console.log(jobId,' is the jobId')
    const job = jobDictionary[jobId];

    return {
      categories: job?.categories || [],
      experience: job?.experience || 0,
      whoCanApply: job?.whoCanApply || '',
    };
  },

  validationSchema: Yup.object().shape({

  }),

  handleSubmit: async (values, {props, setSubmitting, setValues}) => {
    const {
      setJob,
      setActiveStep,
      dashboard,
      dispatch,
      jobDictionary,
      jobId,
    } = props;

    const job = jobDictionary[jobId];

    Api.post('job/update', {
      ...job,
      experience: values.experience,
      whoCanApply: values.whoCanApply,
    }).then((job)=>{
      setJobs([job], dashboard, dispatch );
      setActiveStep(2);
    });
  },
})(StyledUserForm);

const mapStateToProps = ({dashboard}) => {
  const {jobDictionary} = dashboard;
  return {jobDictionary, dashboard};
};

const mapDispatchToProps = (dispatch) => {
  return {
    // dispatching plain actions
    dispatch,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form);
