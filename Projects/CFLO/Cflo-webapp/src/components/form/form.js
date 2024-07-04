import { Box, Button, Grid, IconButton, Typography } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Api from "../../helpers/Api";
import arrayToReducer from "../../helpers/arrayToReducer";
import Question from "./question";
import CircularProgress from "@material-ui/core/CircularProgress";
import Kanban from "../styled/Kanban/Kanban";

export default function Form(props) {
	const { form } = props;

	const [questions, setQuestions] = useState(form?.questions || []);
	const [questionState, setQuestionState] = useState({});
	const [loading, setLoading] = useState(false);
	const [questionIds, setQuestionIds] = useState([]);
	const [activeQuestion, setActiveQuestion] = useState(0);
	const [questionDict, setQuestionDict] = useState([]);
	const { user } = useSelector((state) => state.auth);
	const [columns, setColumns] = useState([]);
	console.log(columns)

	useEffect(() => {
		const questions = questionIds.map((questionId, index) => {
			const question = questionDict[questionId];
			let obj = {
				_id: questionId,
				content: (
					<Question
						key={index}
						index={index}
						question={question}
						createQuestion={createQuestion}
						setActiveQuestion={setActiveQuestion}
						onDelete={onDelete}
						// setQuestion={setQuestion}
						form={form}
						isActive={activeQuestion === questionId}
					/>
				)
			};
			return obj;
		})
		const cols = {
			1: {
				title: "Form",
				items: questions,
			},
		};
		setColumns(cols);
	}, [questionDict, questionIds.length, activeQuestion]);

	const createQuestion = async (index) => {
		var questionArr = [];
		const questionObj = {
			type: "Linear Scale",
			form,
			profile: user?.profile,
			questionText: "",
		};
		const res = await Api.post("question/create", questionObj);
		// const op = await Api.post('question/option/create', {
		// 	question: res.questionId,
		// 	optionText: "",
		// 	optionImage: ""
		// })
		console.log("res here = ", res);
		// console.log("op here = ", op);
		if (res?.data) {
			const { newDict, idArr } = arrayToReducer(res?.data?.questions);
			console.log("Question = ", newDict);
			setQuestionDict({
				...questionDict,
				...newDict,
			});
			setQuestionIds([
				...questionIds.slice(0, index + 1),
				idArr[idArr.length - 1],
				...questionIds.slice(index + 1),
			]);


			// questionArr.push(...res?.data?.questions);
			// setQuestions(questionArr);
		}
		setLoading(false);
	};

	const createQuestionDefault = async (index) => {
		console.log('createQuestion')
		const questionObj = {
			type: "Linear Scale",
			form: form?._id,
			questionText: "Select Issue Priority",
			profile: user?.profile,
		};
		const res = await Api.post("question/create/default", questionObj);
		console.log("createQuestion res ", res)
		if (res?.data) {
			const { newDict, idArr } = arrayToReducer(res?.data?.questions);

			setQuestionDict(newDict);
			setQuestionIds(idArr);
			setActiveQuestion(idArr[0] ? idArr[0] : "")
			// var questionArr = [...res?.data?.questions];
			// setQuestions(questionArr);

		}
		setLoading(false);
	};

	useEffect(() => {
		if (form?.questions.length > 0) {
			const { newDict, idArr } = arrayToReducer(form?.questions);
			// setActiveQuestion(idArr[0])
			setQuestionIds(idArr);
			setQuestionDict(newDict);
		} else {

			console.log(loading, ' is the loading')
			if (loading) {
			} else {
				// createQuestion(0);
				createQuestionDefault()

			}
		}
	}, [form?.questions]);

	const onDelete = async (questionId, index) => {
		console.log("on delete called");

		const res = await Api.post("question/delete", {
			questionId,
		});
		setQuestionIds([
			...questionIds.slice(0, index),
			...questionIds.slice(index + 1),
		]);
		console.log("Question deleted ????", res);
	};

	const onDragEnd = (result, columns, setColumns) => {
		if (!result.destination) return;
		const { source, destination } = result;

		const column = columns[source.droppableId];
		const copiedItems = [...column.items];
		const [removed] = copiedItems.splice(source.index, 1);
		copiedItems.splice(destination.index, 0, removed);
		let temp = copiedItems.map((obj) => obj?._id);
		setQuestionIds([...temp]);

		setQuestionState(copiedItems[0]._id)

		setColumns({
			...columns,
			[source.droppableId]: {
				...column,
				items: copiedItems,
			},
		});
	}
	// useEffect(()=>{
	//     if(questions.length==0){
	//         createQuestionDefault();
	//     }
	// },[questions])
	// const getQuestions = () => {
	//     setLoading(true);
	//     console.log(loading, "loading")
	//     var questiontempArr = [];
	//     Api.post('question/getQuestions', { form: form?._id })
	//         .then(res => {
	//             console.log(res, "Questions res")
	//             questiontempArr.push(...res?.data);
	//         })
	//     setQuestion(questiontempArr);
	//     setLoading(false);
	//     console.log(loading, "loading")
	// }
	// useEffect(() => {

	//     getQuestions();

	// }, [setQuestion, setLoading])

	// useEffect(() => {
	//     if (questions.length > 0) {
	//         const { newDict, idArr } = arrayToReducer(questions);
	//         console.log(newDict, "New Dict");

	//     }
	// }, [questions]);
	return (
		<>
			{loading ? (
				<CircularProgress />
			) : (
				<Box marginTop={"1rem"}>
					{
						questionIds?.length > 0 ? <Kanban
							// dragDirection="vertical"
							columns={columns}
							setColumns={setColumns}
							columnStyles={{
								backgroundColor: "white",
								flex: "1 0 100%",
							}}
							itemStyles={{
								display: "flex",
								gap: "7px",
								flexWrap: "wrap",
							}}
							onDragEnd={onDragEnd}
							// itemStyles={{ display: "flex", flexDirection: "column" }}
							containerStyles={{ width: "100%", margin: 0 }}
						/> : <>

							<Typography> Form is empty. Start by adding any number of question</Typography>
							<Button
								variant="contained"
								color="primary"
								onClick={createQuestionDefault}
							>
								Create Question
							</Button>

						</>
					}


				</Box>
			)}
		</>
	);
}
