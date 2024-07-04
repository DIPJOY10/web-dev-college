import React from 'react';
import {withFormik} from 'formik';
import * as Yup from 'yup';
import {withStyles} from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import {connect} from 'react-redux';
import Api from '../helpers/Api';
import Typography from '@material-ui/core/Typography';

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
  },

  rowReverse: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row-reverse',
    margin: '0.5rem',
    marginBottom: 0,
  },

  zipCode: {
    width: '7rem',
    marginLeft: '1rem',
  },

  container: {
    display: 'Flex',
    justifyContent: 'center',
  },
});

class UserForm extends React.Component {
  render() {
    const {classes, user, phone, setPhone, values, touched, errors, isSubmitting, handleChange, handleBlur, handleSubmit, handleReset} = this.props;

    // console.log(user,' is the user')
    // console.log(errors,' are the errors')

    return (
      <div className={classes.container}>
        <form onSubmit={handleSubmit}>
          <Card className={classes.card}>
            <CardContent>
              <Typography variant="overline" display="block" gutterBottom>
                Required
              </Typography>
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

              <PhoneInput id="phone" country={'us'} value={phone} onChange={(phone) => setPhone(phone)} />

              <div className={classes.rowReverse}>
                <Button type="submit" color="primary" disabled={isSubmitting}>
                  SUBMIT
                </Button>
                <Button color="secondary" onClick={handleReset}>
                  CLEAR
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    );
  }
}

const StyledUserForm = withStyles(styles)(UserForm);

const Form = withFormik({
  mapPropsToValues: ({fullName, email}) => {
    return {
      fullName: fullName || '',
      email: email || '',
    };
  },

  validationSchema: Yup.object().shape({
    fullName: Yup.string().min(3, 'Fullname must contain at least 3 characters').required('Required'),
    email: Yup.string().email('Enter a valid email'),
  }),

  handleSubmit: async (values, {props, setSubmitting, setValues}) => {
    const {phone, setParticipant, user, setSelectUser} = props;

    Api.post('pal/create', {
      phone,
      displayName: values.fullName,
      email: values.email,
      parent: user._id,
      parentModelName: user.model,
    }).then((res) => {
      const pal = res.data;

      setParticipant(pal);
      setSelectUser(false);
    });
  },
})(StyledUserForm);

const mapStateToProps = ({auth, wallet}) => {
  const {user, userProfile} = auth;
  const {userWallet} = wallet;
  return {user, userProfile, userWallet};
};

const mapDispatchToProps = (dispatch) => {
  return {
    // dispatching plain actions
    dispatch,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form);
