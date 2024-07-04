import React, {useState, useEffect} from 'react';
import {withFormik} from 'formik';
import * as Yup from 'yup';
import {withStyles} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {connect} from 'react-redux';
import CreateBtn from '../styled/actionBtns/create.btn';
import Api from '../../helpers/Api';
import {setUserProfiles} from './profile.utils';
import HandleFiles from './handle.files';
import Paper from '@material-ui/core/Paper';

const styles = () => ({

  row: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    margin: '1rem',
  },

  colDiv: {

  },

  container: {
    flex: 1,
    flexDirection: 'column',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});


class BasicForm extends React.Component {
  render() {
    const {
      classes,
      user,
      values,
      touched,
      errors,
      isSubmitting,
      setFieldValue,
      handleChange,
      handleBlur,
      handleSubmit,
      profileId,
    } = this.props;

    // console.log(errors,' is errors',values,' are values');


    return (

      <form>

        <TextField
          id="Name"
          placeholder="Name (required)"
          value={values.displayName}
          onChange={handleChange}
          onBlur={handleBlur}
          helperText={touched.displayName ? errors.displayName : ''}
          error={touched.displayName && Boolean(errors.displayName)}
          margin="dense"
          variant="outlined"
          fullWidth
        />

        <TextField
          multiline
          rows={5}
          id="description"
          placeholder="Description (required)"
          value={values.description}
          onChange={handleChange}
          onBlur={handleBlur}
          helperText={touched.description ? errors.description : ''}
          error={touched.description && Boolean(errors.description)}
          margin="dense"
          variant="outlined"
          fullWidth
        />

        <div className={classes.container}>
          <CreateBtn type="submit" color="primary" disabled={isSubmitting} onClick={handleSubmit}>
                        Save
          </CreateBtn>
        </div>
      </form>

    );
  }
};

const StyledUserForm = withStyles(styles)(BasicForm);

const Form = withFormik({
  mapPropsToValues: ({
    user,
  }) => {
    return {
      displayName: user?.displayName||'',
      description: user?.description || '',
    };
  },

  validationSchema: Yup.object().shape({

    displayName: Yup.string()
        .min(3, 'Name')
        .required('Required'),

    description: Yup.string()
        .min(3, 'Description must contain at least 3 characters')
        .required('Required'),

  }),

  handleSubmit: async (values, {props, setSubmitting, setValues}) => {
    const {
      setActiveStep,
      auth,
      dispatch,
    } = props;

    const {
      user,
    } = auth;


    Api.post('user/update', {
      ...user,
      displayName: values.displayName,
      description: values.description,
    }).then((profile)=>{
      setUserProfiles([profile], auth, dispatch );
      setActiveStep(0);
    });
  },
})(StyledUserForm);

const mapStateToProps = ({auth}) => {
  const {user} = auth;
  return {user, auth};
};

const mapDispatchToProps = (dispatch) => {
  return {
    // dispatching plain actions
    dispatch,
  };
};

const BasicSetting = connect(mapStateToProps, mapDispatchToProps)(Form);

export default BasicSetting;
