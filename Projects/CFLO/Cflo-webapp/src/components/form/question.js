import {
	Box,
	Divider,
	IconButton,
	InputBase,
	makeStyles,
	Paper,
	TextField,
	Tooltip,
	Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import FilesViewer from "../file/Viewer/FilesViewer";
import QuestionOptions from "./question.options";
import QuestionType from "./questiontype";
import DeleteIcon from "@material-ui/icons/Delete";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import Api from "../../helpers/Api";
import { useDebounce } from "react-use";
import arrayToReducer from "../../helpers/arrayToReducer";
import { blue } from '@material-ui/core/colors';
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";

const useStyles = makeStyles((theme) => ({
	question: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		// border: '1px solid red',
		width: "100%",
		padding: "1rem",
		// marginBottom: "1rem",
		position: "relative",
		overflow: "hidden",
		borderRadius: "10px"
	},
	bar: {
		position: "absolute",
		width: "6px",
		backgroundColor: blue[400],
		height: "100%",
		top: "0px",
		left: "-6px",
		transition: "all 200ms ease-in"
	},
	barActive: {
		left: "0px !important"
	},
	questionTypeContainer: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		width: "100%",
		// border:"1px solid green"
	},
	questionText: {
		// width: "60%",
	},
	questionAnswer: {
		width: "100%",
		// border: '1px solid red',
	},
	questionEdit: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-evenly",
		width: "100%",
		// border: "1px solid green",
		justifyContent: "flex-end",
	},
}));
export default function Question(props) {
	const classes = useStyles();
	const { addQuestion, form, question, createQuestion, index, onDelete, isActive, setActiveQuestion } =
		props;

	const [questionId, setQuestionId] = useState(question?._id);

	const [type, setType] = useState(question?.type || "Linear Scale");
	const [questionText, setquestionText] = useState(
		question?.questionText || ""
	);
	const [questionImage, setquestionImage] = useState(
		question?.questionImage || ""
	);

	const [links, setLinks] = useState(question?.links || []);

	const [optionIds, setOptionIds] = useState([]);
	const [optionDict, setOptionDict] = useState([]);

	const [optionColIds, setOptionColIds] = useState([]);
	const [optionColDict, setOptionColDict] = useState([]);

	const [optionRowIds, setOptionRowIds] = useState([]);
	const [optionRowDict, setOptionRowDict] = useState([]);

	const [questionObj, setQuestionObj] = useState({
		type: question?.type || "Linear Scale",
		questionText: question?.questionText || "",
		questionImage: question?.questionImage || "",
		links: question?.links || [],
	});
	useEffect(() => {
		if (question?.options.length > 0) {
			const { newDict, idArr } = arrayToReducer(question?.options);
			console.log("newDict = ", newDict);

			setOptionIds(idArr);
			setOptionDict(newDict);
		}
	}, [question]);
	useEffect(() => {
		if (question?.options.length > 0) {
			const { newDict, idArr } = arrayToReducer(question?.optionCols);

			setOptionColIds(idArr);
			setOptionColDict(newDict);
		}
	}, [question]);
	useDebounce(
		() => {
			if (questionId) {
				updateApi({
					_id: questionId,
					type,
					questionText,
					questionImage,
					links,
				});
			}
		},
		100,
		[type, questionText, questionImage, links]
	);


	const updateApi = async (question) => {
		// setLoading(true);
		const res = await Api.post("question/update", question);
		console.log(res);
		// setUpdated(true);
		// setLoading(false);
	};
	// if()

	return (
		<Box component={"div"} style={{ width: "100%", minWidth: 500, height: "100%" }} onClick={() => {
			console.log(question._id)
			setActiveQuestion(question._id)
		}}>
			<Paper className={classes.question} variant="outlined">
				<div className={`${classes.bar} ${isActive ? classes.barActive : ''}`}></div>
				<div className={classes.questionTypeContainer}>
					{isActive ? (<TextField
						size="small"
						variant="filled"
						label="Question"
						className={classes.questionText}
						value={questionText}
						onChange={(e) => setquestionText(e.target.value)}
					// disabled={!isActive}
					/>) : (
						<Typography variant="h6" component="p">
							{questionText ? questionText : "Question"}
						</Typography>
					)}
					{isActive && (<QuestionType
						setType={setType}
						type={type}
					/>)}
				</div>
				<div className={classes.questionAnswer}>
					<QuestionOptions
						type={type}

						optionIds={optionIds}
						setOptionIds={setOptionIds}
						optionDict={optionDict}
						setOptionDict={setOptionDict}

						optionColIds={optionColIds}
						setOptionColIds={setOptionColIds}
						optionColDict={optionColDict}
						setOptionColDict={setOptionColDict}

						// optionRowIds={optionRowIds}
						// setOptionRowIds={setOptionRowIds}
						// optionRowDict={optionRowDict}
						// setOptionRowDict={setOptionRowDict}

						questionId={question?._id}
						question={question}
						isActive={isActive}
					/>
				</div>
				{isActive && (<div className={classes.questionEdit}>
					<div
						style={{
							display: "flex",
							justifyContent: "flex-end",
							width: "15%",
						}}
					>
						<Tooltip title="Add new">
							<IconButton aria-label="add" onClick={() => { createQuestion(index) }}>
								<AddCircleOutlineIcon />
							</IconButton>
						</Tooltip>

						<Tooltip title="Delete">
							<IconButton
								aria-label="delete"
								onClick={() => {
									onDelete(questionId, index);
								}}
							>
								<DeleteIcon />
							</IconButton>
						</Tooltip>

					</div>
				</div>)}

			</Paper>
		</Box>
	);
}
