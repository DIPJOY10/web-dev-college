import React from 'react';
import {withFormik} from 'formik';
import * as Yup from 'yup';
import {withStyles} from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import {connect} from 'react-redux';
import Api from '../../helpers/Api';
import Typography from '@material-ui/core/Typography';
import getGeocodeFromZip from '../../helpers/geoCode';
import Checkbox from '@material-ui/core/Checkbox';

const styles = () => ({
  card: {
    flex: 1,
    display: 'flex',
    maxWidth: 420,
    marginTop: 50,
  },

  row: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    margin: '0.5rem',
    marginBottom: 0,
    alignItems: 'center',
  },

  rowReverse: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row-reverse',
    margin: '0.5rem',
    marginBottom: 0,
  },


  zipCode: {
    width: '9rem',
    marginLeft: '1rem',
  },


  container: {
    display: 'Flex',
    justifyContent: 'center',
  },
});


class UserForm extends React.Component {
  render() {
    const {
      classes,
      user,
      pal,
      setPal,
      values,
      touched,
      errors,
      isSubmitting,
      handleChange,
      handleBlur,
      handleSubmit,
      handleReset,
      onSelect
    } = this.props;

    // console.log(user,' is the user')
    // console.log(errors,' are the errors')

    return (
      <div className={classes.container}>
        <form onSubmit={handleSubmit}>


          <TextField
            id="fullName"
            label="Name "
            value={values.fullName}
            onChange={handleChange}
            onBlur={handleBlur}
            helperText={touched.fullName ? errors.fullName : ''}
            error={touched.fullName && Boolean(errors.fullName)}
            margin="dense"
            variant="outlined"
            fullWidth
          />

          <Typography variant="overline" display="block" gutterBottom>
                  OPTIONAL
          </Typography>

          <div className={classes.row}>
            <Checkbox
              color="primary"
              checked={pal.isPerson}
              onChange={(event)=>{
                setPal({
                  ...pal,
                  isPerson: true,
                });
              }}
            />
            <Typography>
                            Person
            </Typography>
            <Checkbox
              color="primary"
              checked={!pal.isPerson}
              onChange={(event)=>{
                setPal({
                  ...pal,
                  isPerson: false,
                });
              }}
            />
            <Typography>
                            Organization
            </Typography>
          </div>

          <TextField
            id="email"
            label="Email"
            type="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            helperText={touched.email ? errors.email : ''}
            error={touched.email && Boolean(errors.email)}
            margin="dense"
            variant="outlined"
            fullWidth
          />

          <TextField
            id="address"
            multiline
            rows={2}
            value={values.address}
            placeholder={'Address'}
            onChange={handleChange}
            onBlur={handleBlur}
            helperText={touched.address ? errors.address : ''}
            error={touched.address && Boolean(errors.address)}
            variant="outlined"
            fullWidth
          />

          <div className={classes.row}>
            <PhoneInput
              id="phone"
              country={'us'}
              value={pal.phone}
              onChange={(phone) => {
                setPal({
                  ...pal,
                  phone,
                });
              } }
            />
          </div>

          <div className={classes.row}>

            <TextField
              id="zip"
              label="ZIPCODE"
              className={classes.zipCode}
              value={values.zip}
              onChange={handleChange}
              onBlur={handleBlur}
              helperText={touched.zip ? errors.zip : ''}
              error={touched.zip && Boolean(errors.zip)}
              margin="dense"
              variant="outlined"
            />

            <div className={classes.rowReverse}>
              <Button type="submit" color="primary" disabled={isSubmitting}>
                            Add
              </Button>
              <Button color="secondary" onClick={handleReset}>
                            Cancel
              </Button>
            </div>
          </div>


        </form>
      </div>
    );
  }
};

const StyledUserForm = withStyles(styles)(UserForm);

const Form = withFormik({
  mapPropsToValues: ({
    fullName,
    email,
    address,
    zip,
    pal,

  }) => {
    return {
      fullName: pal?.displayName || '',
      zip: zip || '',
      address: address || '',
      email: email || '',
    };
  },

  validationSchema: Yup.object().shape({
    fullName: Yup.string()
        .min(3, 'Fullname must contain at least 3 characters')
        .required('Required'),
    email: Yup.string()
        .email('Enter a valid email'),
  }),

  handleSubmit: async (values, {props, setSubmitting, setValues}) => {
    const {
      loading, setLoading, pal, callback, onSelect
    } = props;

    let zipCodeData = {};

    if (values.zip.length>0) {
      zipCodeData = await getGeocodeFromZip(values.zip);
    }


    if (loading) {
      return;
    }
    else {
      setLoading(true);


      Api.post('pal/create', {
        ...pal,
        type: pal.isPerson?'User':'Organization',
        address: {...zipCodeData, postal_code: values.zip, line1: values.address},
        displayName: values.fullName,
        email: values.email.toLowerCase(),
      }).then((res)=>{
        const pal = res.data;
        onSelect(pal)
        setLoading(false);
        if (callback) {
          callback(pal);
        }
      });
    }
  },
})(StyledUserForm);


const mapStateToProps = ({auth}) => {
  const {user, userProfile} = auth;
  return {user, userProfile};
};

const mapDispatchToProps = (dispatch) => {
  return {
    // dispatching plain actions
    dispatch,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form);
