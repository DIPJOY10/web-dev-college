import React from "react";
import { withFormik } from "formik";
import * as Yup from "yup";
import { withStyles } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import ButtonBase from "@material-ui/core/ButtonBase";
import getGeocodeFromZip from "../../../helpers/geoCode";
import SocialAuth from "../../auth/SocialAuth";
import Api from "../../../helpers/Api";
import { connect } from "react-redux";
import { TextInputBase, ZipInput, ErrorText } from "./styles";
import Paper from "@material-ui/core/Paper";

const styles = () => ({
  card: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    padding: "1rem",
    maxWidth: 420,
    marginTop: 50,
  },

  row: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
  },

  rowReverse: {
    flex: 1,
    display: "flex",
    flexDirection: "row-reverse",
  },

  zipCode: {
    maxWidth: "8rem",
    height: "2.5rem",
  },

  container: {
    display: "Flex",
    justifyContent: "center",
  },
  actions: {
    float: "right",
  },
  textAreaBar: {
    flex: 1,
    paddingLeft: "1rem",
    paddingTop: "0.8rem",
    fontSize: 16,
    color: "#424242",
    borderWidth: "1px",
  },

  cancelBtn: {
    height: "2rem",
    width: "6rem",
    marginTop: "1rem",
    marginBottom: "1rem",
    fontSize: "0.9rem",
    fontWeight: "700",
    backgroundColor: "#f57c00",
    color: "white",
    borderRadius: "1rem",
  },
});

class BillingAddressForm extends React.Component {
  render() {
    const {
      classes,
      user,
      values,
      touched,
      errors,
      isSubmitting,
      handleChange,
      handleBlur,
      handleSubmit,
      handleReset,
      accounts,
      onCancel,
    } = this.props;

    // console.log(user,' is the user')
    // console.log(errors,' are the errors')

    return (
      <div className={classes.container}>
        <form onSubmit={handleSubmit}>
          {/* <TextField
                id="fullName"
                label="Name for Billing"
                value={values.fullName}
                onChange={handleChange}
                onBlur={handleBlur}
                helperText={touched.fullName ? errors.fullName : ""}
                error={touched.fullName && Boolean(errors.fullName)}
                margin="dense"
                variant="outlined"
                fullWidth
              /> */}

          <Paper className={classes.card}>
            {accounts.length > 0 ? (
              <div className={classes.row}>
                <div className={classes.row}></div>
                <ButtonBase
                  className={classes.cancelBtn}
                  onClick={() => {
                    if (onCancel) {
                      onCancel();
                    }
                  }}
                >
                  Cancel
                </ButtonBase>
              </div>
            ) : null}

            <TextInputBase
              id="fullName"
              placeholder="Name for Billing"
              value={values.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              helperText={touched.fullName ? errors.fullName : ""}
              error={touched.fullName && Boolean(errors.fullName)}
              margin="dense"
              variant="outlined"
              fullWidth
            />

            <ErrorText
              show={touched.fullName && Boolean(errors.fullName)}
              msg={"Name is required 👀"}
            />

            <TextInputBase
              id="email"
              value={values.email}
              placeholder={"Email"}
              onChange={handleChange}
              onBlur={handleBlur}
              helperText={touched.email ? errors.email : ""}
              error={touched.email && Boolean(errors.email)}
              variant="outlined"
            />

            <ErrorText
              show={touched.email && Boolean(errors.email)}
              msg={"Valid Email Needed  📨"}
            />

            <TextInputBase
              id="address"
              value={values.address}
              placeholder={"Address 1st Line"}
              onChange={handleChange}
              onBlur={handleBlur}
              helperText={touched.address ? errors.address : ""}
              error={touched.address && Boolean(errors.address)}
              variant="outlined"
            />

            <ErrorText
              show={touched.address && Boolean(errors.address)}
              msg={"Address 1st line required 🧐"}
            />

            <div className={classes.row}>
              <ZipInput
                id="zip"
                label="ZIPCODE"
                placeholder={"ZIPCODE"}
                className={classes.zipCode}
                value={values.zip}
                onChange={handleChange}
                onBlur={handleBlur}
                helperText={touched.zip ? errors.zip : ""}
                error={touched.zip && Boolean(errors.zip)}
                margin="normal"
                variant="outlined"
              />

              <div className={classes.rowReverse}>
                <Button type="submit" color="primary" disabled={isSubmitting}>
                  SUBMIT
                </Button>
                <Button color="secondary" onClick={handleReset}>
                  CLEAR
                </Button>
              </div>
            </div>

            <ErrorText
              show={touched.zip && Boolean(errors.zip) && values.zipError}
              msg={"Check Zip ⛳️"}
            />
          </Paper>
        </form>
      </div>
    );
  }
}

const StyledBillingDetailForm = withStyles(styles)(BillingAddressForm);

const Form = withFormik({
  mapPropsToValues: ({ fullName, email, address, zip }) => {
    return {
      fullName: fullName || "",
      zip: zip || "",
      address: address || "",
      email: email || "",
    };
  },

  validationSchema: Yup.object().shape({
    fullName: Yup.string()
      .min(3, "Fullname must contain at least 3 characters")
      .required("Required"),
    address: Yup.string().required("Required"),
    zip: Yup.string().required("Required"),
    email: Yup.string()
      .email("Enter a valid email")
      .required("Email is required"),
  }),

  handleReset: async (values, { setValues }) => {
    setValues({
      fullName: "",
      zip: "",
      address: "",
      email: "",
      zipError: false,
    });
  },

  handleSubmit: async (
    values,
    { props, setSubmitting, setValues, setErrors }
  ) => {
    const { user, userProfile, onSelect, walletId } = props;

    console.log(values, " is the values ");
    // console.log(' props is ',props)
    // console.log(' user is ',user)
    const zipCodeData = await getGeocodeFromZip(values.zip);

    console.log(zipCodeData, " is the zipCodeData");

    if (zipCodeData) {
      const stripeCustomerData = {
        address: {
          ...zipCodeData,
          postal_code: values.zip,
          line1: values.address,
        },
        email: values.email.toLowerCase(),
        name: values.fullName,
        profile: user?.profile,
        addedBy: user?.model === "User" ? user?.profile : userProfile?.profile,
        wallet: walletId,
      };

      Api.post("wallet/billing/account/create", stripeCustomerData).then(
        (res) => {
          const data = res.data;
          if (data && onSelect) {
            onSelect(data);
          }
        }
      );
    } else {
      setValues({
        ...values,
        zip: "",
        zipError: true,
      });
    }
    setSubmitting(false);
  },
})(StyledBillingDetailForm);

const mapStateToProps = ({ auth, wallet }) => {
  const { user, userProfile } = auth;
  const { userWallet } = wallet;
  return { user, userProfile, userWallet };
};

const mapDispatchToProps = (dispatch) => {
  return {
    // dispatching plain actions
    dispatch,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form);
