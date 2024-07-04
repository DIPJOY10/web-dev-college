import React, { useEffect, useRef, useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import MomentUtils from "@date-io/moment";
import {
	MuiPickersUtilsProvider,
	KeyboardTimePicker,
	KeyboardDatePicker,
	DateTimePicker,
} from "@material-ui/pickers";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
	rowDiv: {
		flexDirection: "row",
		display: "flex",
		alignItems: "center",
		width: "100%",
		justifyContent: "space-around",
		margin: "1rem 0",
	},

	datePicker: {
		// width: 150,
		margin: "1rem",
	},
}));

function useDatePickerMap(props) {
	const classes = useStyles();

	const { dateArr, isOrder } = props;

	const datesOnly = dateArr.map((dateItem) => dateItem?.value);

	const [newDateArr, setNewDateArr] = useState(datesOnly);
	var dateNow = new Date();

	useEffect(() => {
		setNewDateArr(datesOnly);
	}, [dateArr?.length]);

	var dateTimePickView = (
		<div className={classes.rowDiv}>
			{dateArr?.map((dateItem, index) => {
				const { label } = dateItem;
				var value = newDateArr[index];
				var olderDate = index === 0 ? dateNow : newDateArr[index - 1];
				var minDate = isOrder ? olderDate : dateNow;
				return (
					<MuiPickersUtilsProvider utils={DateFnsUtils}>
						<DateTimePicker
							value={value}
							className={classes.datePicker}
							margin="normal"
							id="date-picker-dialog"
							label={label}
							// minDate={minDate}
							onChange={(date) => {
								var newArr = [...newDateArr];
								newArr[index] = date;
								setNewDateArr(newArr);
							}}
							KeyboardButtonProps={{
								"aria-label": "change date",
							}}
						/>
					</MuiPickersUtilsProvider>
				);
			})}
		</div>
	);

	return {
		dateTimePickView,
		dateArr: newDateArr,
	};
}

export default useDatePickerMap;
