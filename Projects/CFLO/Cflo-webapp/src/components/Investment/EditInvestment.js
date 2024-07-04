import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {withFormik} from 'formik';
import * as Yup from 'yup';
import {withStyles} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {connect} from 'react-redux';
import CreateBtn from '../../styled/actionBtns/create.btn';
import Api from '../../../helpers/Api';
import {setInvestments} from './investment.utils';
import HandleFiles from './handle.files';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import ProfileSelect from '../../profile/profile.select';
import GooglePlace from '../../google.places';
import Autocomplete from '@material-ui/lab/Autocomplete';

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

  card2Style: {
    marginTop: '1.5rem',
  },

  container: {
    flex: 1,
    flexDirection: 'column',
    display: 'flex',
    maxWidth: '32rem',
  },
});


class BasicForm extends React.Component {
  render() {
    const {
      classes,
      investmentDictionary,
      values,
      touched,
      errors,
      isSubmitting,
      setFieldValue,
      handleChange,
      handleBlur,
      handleSubmit,
      submit,
      investmentId,
      onProfileSelect,
    } = this.props;

    const investment = investmentDictionary[investmentId];
    // console.log(errors,' is errors',values,' are values');
    const progress = ['Back of the Napkin', 'Plans/drawings/Permits', 'Construction/ Remodelling in progress'];

    return (
      <div className={classes.container}>
        <form>


          <Card>
            <CardContent>

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

              <GooglePlace
                setLocation={(location)=>setFieldValue('location', location)}/>

              <Autocomplete
                id="combo-box-demo"
                options={progress}
                getOptionLabel={(option) => option}
                onChange={(event, value)=>{
                  // console.log(value,' is the progress')
                  setFieldValue('progress', value.progress);
                }}
                style={{width: 300}}
                renderInput={(params) => <TextField {...params}
                  placeholder={'Progress'}
                  value={values.progress}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  helperText={touched.progress ? errors.progress : ''}
                  error={touched.progress && Boolean(errors.progress)}
                  margin="dense"
                  variant="outlined"
                  fullWidth
                />}
              />

            </CardContent>
          </Card>

          <HandleFiles investmentId={investmentId} />

          <div className={classes.row}>
            <CreateBtn type="submit" color="primary" disabled={isSubmitting} onClick={handleSubmit}>
                            Save
            </CreateBtn>
            <CreateBtn onClick={submit(values)}>
                            Submit
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
    investmentDictionary,
    investmentId,
  }) => {
    // console.log(investmentId,' is the investmentId')
    const investment = investmentDictionary[investmentId];

    return {
      title: investment?.title || '',
      description: investment?.description || '',
      location: investment?.location||null,
      progress: investment?.progress||'Back of the Napkin',
    };
  },

  validationSchema: Yup.object().shape({
    title: Yup.string()
        .min(3, 'Title must contain at least 3 characters')
        .required('Required'),

    description: Yup.string()
        .min(3, 'Description must contain at least 3 characters')
        .required('Required'),

    location: Yup.object().shape({
      name: Yup.string()
          .required('Required'),
    }),

    progress: Yup.string()
        .required('Required'),

  }),

  handleSubmit: async (values, {props, setSubmitting, setValues}) => {
    const {
      investmentDictionary,
      investmentId,
      setActiveStep,
      dashboard,
      auth,
      dispatch,
    } = props;

    const investment = investmentDictionary[investmentId];
    const {user, selectedProfileId} = auth;

    Api.post('investment/update', {
      ...investment,
      title: values.title,
      description: values.description,
      location: values.location,
    }).then((investment)=>{
      setInvestments([investment], dashboard, dispatch );
    });
  },
})(StyledUserForm);

const mapStateToProps = ({dashboard, auth}) => {
  const {investmentDictionary} = dashboard;
  return {investmentDictionary, dashboard, auth};
};

const mapDispatchToProps = (dispatch) => {
  return {
    // dispatching plain actions
    dispatch,
  };
};

const EditInvestmentForm = connect(mapStateToProps, mapDispatchToProps)(Form);


const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    marginTop: '6rem',
  },
}));

const EditInvestment = () => {
  const classes = useStyles();
  const {investmentId} = useParams();
  const dashboard = useSelector((state) => state.dashboard);
  const dispatch = useDispatch();
  const {investmentDictionary} = dashboard;
  const investment = investmentDictionary[investmentId];
  const [profileId, setProfileId] = useState(investment.profile);

  const updateProfile = (profile)=>{
    Api.post('investment/update', {
      ...investment,
      profile: profile,
    }).then((investment)=>{
      setInvestments([investment], dashboard, dispatch );
      setProfileId(profile);
    });
  };

  const submit = (values)=>{
    const publishedAt = new Date();
    Api.post('investment/update', {
      ...investment,
      title: values.title,
      description: values.description,
      location: values.location,
      status: 'Accepted',
      published: true,
      publishedAt,
    }).then((investment)=>{
      setInvestments([investment], dashboard, dispatch );
    });
  };

  return (
    <div className={classes.root}>
      <ProfileSelect
        profileId={profileId}
        onProfileSelect={updateProfile}
      />
      <EditInvestmentForm investmentId={investmentId} submit={submit}/>
    </div>
  );
};

export default EditInvestment;
