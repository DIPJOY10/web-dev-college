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
import EmailHandler from './email.handler';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import 'date-fns';
import {
  useParams,
  useHistory,
} from 'react-router-dom';

import {
  makeStyles,
  useTheme,
} from '@material-ui/core/styles';

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
      <div className={classes.container}>
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


          <HandleFiles profileId={profileId} />

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

const StyledUserForm = withStyles(styles)(BasicForm);

const Form = withFormik({
  mapPropsToValues: ({
    profileDictionary,
    profileId,
  }) => {
    // console.log(profileId,' is the profileId')
    const profile = profileDictionary[profileId];

    return {
      displayName: profile?.displayName||'',
      description: profile?.description || '',
    };
  },

  validationSchema: Yup.object().shape({


    description: Yup.string()
        .min(3, 'Description must contain at least 3 characters')
        .required('Required'),

  }),

  handleSubmit: async (values, {props, setSubmitting, setValues}) => {
    const {
      profileId,
      setActiveStep,
      auth,
      dispatch,
    } = props;

    const {
      profileDictionary,
    } = auth;
    const profile = profileDictionary[profileId];

    Api.post('profile/update', {
      ...profile,
      displayName: values.displayName,
      description: values.description,
    }).then((profile)=>{
      setUserProfiles([profile], auth, dispatch );
      setActiveStep(1);
    });
  },
})(StyledUserForm);

const mapStateToProps = ({auth}) => {
  const {profileDictionary} = auth;
  return {profileDictionary, auth};
};

const mapDispatchToProps = (dispatch) => {
  return {
    // dispatching plain actions
    dispatch,
  };
};

const EditProfileForm = connect(mapStateToProps, mapDispatchToProps)(Form);


const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
  },
}));

const ProfileSetting = (props) => {
  const classes = useStyles();
  const {profileId} = props;

  return (
    <div className={classes.root}>
      <EmailHandler profileId={profileId} />
      <EditProfileForm profileId={profileId} />
    </div>
  );
};

export default ProfileSetting;
