import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import {
	Button,
	FormControl,
	FormControlLabel,
	FormLabel,
	IconButton,
	Radio,
	RadioGroup,
	TextField,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React from "react";
import MultipleChoice from "./multiple.choice";
import Api from "../../helpers/Api";
import arrayToReducer from "../../helpers/arrayToReducer";
import LinearScale from "./linear.scale";
import MultipleChoiceGrid from "./multiple.choice.grid";
import DateFnsUtils from '@date-io/date-fns';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import CheckboxGrid from "./checkbox.grid";
const useStyles = makeStyles((theme) => ({
	root: {
		display: "flex",
		// border: '1px solid green',
		width: "100%",
		margin: "1vh 0 1vw",
		// flexWrap: 'wrap',
	},
}));
export default function QuestionOptions(props) {
	const classes = useStyles();
	const {
		type,

		optionIds,
		setOptionIds,
		optionDict,
		setOptionDict,
		optionColIds,
		setOptionColIds,
		optionColDict,
		setOptionColDict,
		// optionRowIds,
		// setOptionRowIds,
		// optionRowDict,
		// setOptionRowDict,
		questionId,
		question,
		isActive
	} = props;

	// const createOptions

	const createOption = async (index) => {
		console.log(questionId, "QID")
		const res = await Api.post("question/option/create", {
			question: questionId,
			optionText: "",
			optionImage: ""
		})
		if (res?.data) {
			const { newDict, idArr } = arrayToReducer(res?.data?.options);
			setOptionDict({
				...optionDict,
				...newDict,
			});
			setOptionIds([
				...optionIds.slice(0, index + 1),
				idArr[idArr.length - 1],
				...optionIds.slice(index + 1),
			]);
		}
		// setOptions([...options, res.data.optionId]);
	}
	const createOptionCols = async (index) => {
		console.log(questionId, "QID")
		const res = await Api.post("question/option/create", {
			question: questionId,
			optionText: "",
			optionImage: "",
			isCol: true
		})
		console.log(res, "Created");
		if (res?.data) {
			const { newDict, idArr } = arrayToReducer(res?.data?.optionCols);
			setOptionColDict({
				...optionColDict,
				...newDict,
			});
			setOptionColIds([
				...optionColIds.slice(0, index + 1),
				idArr[idArr.length - 1],
				...optionColIds.slice(index + 1),
			]);
		}
		// setOptions([...options, res.data.optionId]);
	}
	const deleteOption = async (questionId, optionId, index) => {
		console.log("on delete called");
		// console.log(questionId, optionId, isCol, index);
		const res = await Api.post("question/option/delete", {
			isCol: false, questionId, optionId
		});
		console.log("Option deleted ????", res);
		if (res?.data) {
			setOptionIds([
				...optionIds.slice(0, index),
				...optionIds.slice(index + 1),
			]);
		}

	};
	const deleteOptionCols = async (questionId, optionId, index) => {
		console.log("on delete called");
		// console.log(questionId, optionId, isCol, index);
		const res = await Api.post("question/option/delete", {
			isCol: true, questionId, optionId
		});
		console.log("Option deleted ????", res);
		if (res?.data) {
			setOptionColIds([
				...optionColIds.slice(0, index),
				...optionColIds.slice(index + 1),
			]);
		}

	};
	const typeComp = (type) => {
		switch (type) {
			case "Short Answer":
				return (
					<div style={{ width: "100%" }}>
						<TextField
							variant="standard"
							disabled={true}
							label="Short Answer Text"
							style={{ width: "60%" }}
						/>
					</div>
				);
			case "Long Answer":
				return (
					<div style={{ width: "100%" }}>
						<TextField
							variant="standard"
							disabled={true}
							label="Long Answer Text"
							style={{ width: "90%" }}
						/>
					</div>
				);
			case "Multiple Choice":
				return (
					<div style={{ width: "100%", marginTop: "1vh" }}>
						<FormControl component="fieldset">
							{/* <FormLabel component="legend">True or False</FormLabel> */}
							<RadioGroup
								aria-label="multiple choice"
								name="multipleChoice"
							>
								{optionIds.length > 0 ? optionIds?.map((optionId, index) => {
									const option = optionDict[optionId];

									return (
										<FormControlLabel
											value="disabled"
											disabled
											control={<Radio />}
											style={{ width: "100%" }}
											label={
												<MultipleChoice
													createOption={createOption}
													option={option}
													index={index}
													deleteOption={deleteOption}
													isActive={isActive}
												/>
											}
										/>
									)
								}) : <Button variant="outlined" onClick={createOption}>Create Option</Button>}


								{/* <FormControlLabel value="disabled" disabled control={<Radio />} label="False" /> */}
							</RadioGroup>
						</FormControl>
					</div>
				);
			case "Boolean":
				return (
					<div style={{ width: "100%", marginTop: "1vh" }}>
						{/* <FormControl component="fieldset"> */}
						{/* <FormLabel component="legend">True or False</FormLabel> */}
						<RadioGroup row aria-label="boolean" name="trueorFalse">
							<FormControlLabel
								value="disabled"
								disabled
								control={<Radio />}
								label="True"
							/>
							<FormControlLabel
								value="disabled"
								disabled
								control={<Radio />}
								label="False"
							/>
						</RadioGroup>
						{/* </FormControl> */}
					</div>
				);
			case "Linear Scale":
				return (
					<div>
						<LinearScale
							questionId={questionId}
							question={question}
							isActive={isActive}
						/>
					</div>
				);
			case "Multiple Choice Grid":
				return (
					<MultipleChoiceGrid
						questionId={questionId}
						question={question}

						optionIds={optionIds}
						setOptionIds={setOptionIds}
						optionDict={optionDict}
						setOptionDict={setOptionDict}

						optionColIds={optionColIds}
						setOptionColIds={setOptionColIds}
						optionColDict={optionColDict}
						setOptionColDict={setOptionColDict}

						createOption={createOption}
						deleteOption={deleteOption}
						createOptionCols={createOptionCols}
						deleteOptionCols={deleteOptionCols}
					/>
				);

				case "Checkbox Grid":
					return (
						<CheckboxGrid
							questionId={questionId}
							question={question}
	
							optionIds={optionIds}
							setOptionIds={setOptionIds}
							optionDict={optionDict}
							setOptionDict={setOptionDict}
	
							optionColIds={optionColIds}
							setOptionColIds={setOptionColIds}
							optionColDict={optionColDict}
							setOptionColDict={setOptionColDict}
	
							createOption={createOption}
							deleteOption={deleteOption}
							createOptionCols={createOptionCols}
							deleteOptionCols={deleteOptionCols}
						/>
					);
			case "Date":
				return (
					<MuiPickersUtilsProvider utils={DateFnsUtils}>
						<KeyboardDatePicker
							margin="normal"
							id="date-picker-dialog"
							label="Date picker"
							format="MM/dd/yyyy"
							disabled
							// value={selectedDate}
							// onChange={handleDateChange}
							KeyboardButtonProps={{
								'aria-label': 'change date',
							}}
						/>
					</MuiPickersUtilsProvider>
				);
		}
	};
	return <div className={classes.root}>{typeComp(type)}</div>;
}
