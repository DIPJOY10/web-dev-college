import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Typography from "@material-ui/core/Typography";
import { withFormik } from "formik";
import * as Yup from "yup";
import { withStyles } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import CreateBtn from "../styled/actionBtns/create.btn";

const styles = () => ({
	row: {
		flex: "1",
		alignItems: "center",
		margin: "1rem",
		display: "flex",
		flexDirection: "row",
		justifyContent: "center",
	},
});

class BasicForm extends React.Component {
	render() {
		const {
			classes,
			user,
			label,
			values,
			touched,
			errors,
			isSubmitting,
			setFieldValue,
			handleChange,
			handleBlur,
			handleSubmit,
		} = this.props;

		return (
			<form className={classes.row}>
				<TextField
					id="email"
					label={label}
					type="email"
					value={values.email}
					onChange={handleChange}
					onBlur={handleBlur}
					helperText={touched.email ? errors.email : ""}
					error={touched.email && Boolean(errors.email)}
					margin="dense"
					variant="outlined"
					fullWidth
					style={{ backgroundColor: "white" }}
				/>

				<CreateBtn
					type="submit"
					color="primary"
					disabled={isSubmitting}
					onClick={handleSubmit}
					style={{ margin: "0", marginLeft: "1rem" }}
				>
					Add
				</CreateBtn>
			</form>
		);
	}
}

const StyledUserForm = withStyles(styles)(BasicForm);

const Form = withFormik({
	mapPropsToValues: () => {
		return {
			email: "",
		};
	},

	validationSchema: Yup.object().shape({
		email: Yup.string().email("Enter a valid email"),
	}),

	handleSubmit: async (values, { props, setSubmitting, setValues }) => {
		const { addEmail } = props;

		addEmail(values.email);

		setValues({
			email: "",
		});
	},
})(StyledUserForm);

export default Form;
