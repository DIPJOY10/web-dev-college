import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import DoneIcon from "@material-ui/icons/Done";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import CommentIcon from "@material-ui/icons/Comment";
import arrayToReducer from "../../helpers/arrayToReducer";
import { CircularProgress, InputBase, Typography } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import CommentList from "../comment/smart.comment.list";
import Api from "../../helpers/Api";
import { useSelector } from "react-redux";
import { useDebounce } from "react-use";

const useStyles = makeStyles((theme) => ({
	root: {
		width: "100%",
		maxWidth: "34rem",
		border: "1px solid #c7c7c7",
		borderRadius: "15px",

		backgroundColor: theme.palette.background.paper,
	},

	title: {
		fontWeight: "600",
		margin: "1rem 1rem",
	},

	textInput: {
		maxWidth: "22rem",
		width: "95vw",
		borderWidth: "1px",
		backgroundColor: "#fafafa",
		color: "#424242",
		borderRadius: "0",
		padding: "0.3rem",
		marginRight: "0.5rem",
		fontSize: 16,
	},
}));

export default function TaskList(props) {
	const classes = useStyles();
	const auth = useSelector((state) => state.auth);
	const user = auth?.user;
	const { issue, taskIds, setTaskIds, loading } = props;
	const [taskDict, setTaskDict] = useState({});
	const [showComment, setShowComment] = useState(false);
	const [activeTask, setActiveTask] = useState(null);
	const [text, setText] = useState("");
	const [textTask, setTextTask] = useState(null);
	const [updateLoading, setLoading] = useState(false);
	const [updated, setUpdated] = useState(false);

	useDebounce(
		() => {
			if (textTask) {
				updateApi({
					_id: textTask,
					text,
				});
			}
		},
		500,
		[text]
	);

	useEffect(() => {
		if (issue?.checklist.length > 0) {
			const { newDict, idArr } = arrayToReducer(issue?.checklist);

			setTaskIds(idArr);
			setTaskDict(newDict);
		} else {
			if (loading) {
			} else {
				onAdd(0);
			}
		}
	}, [issue?.checklist]);

	const onAdd = async (index) => {
		const res = await Api.post("task/create", {
			index,
			issue: issue?._id || null,
			text: "",
			user: user?._id,
		});

		const data = res?.data;

		const task = data?.task;

		const { newDict } = arrayToReducer([task]);

		setTaskDict({
			...taskDict,
			...newDict,
		});

		setTaskIds([
			...taskIds.slice(0, index + 1),
			task?._id,
			...taskIds.slice(index + 1),
		]);
	};

	const onDelete = async (taskId, index) => {
		console.log("on delete called");
		setTaskIds([...taskIds.slice(0, index), ...taskIds.slice(index + 1)]);

		const res = await Api.post("task/delete", {
			taskId,
		});
	};

	const updateApi = async (task) => {
		setLoading(true);
		const res = await Api.post("task/update", task);
		setUpdated(true);
		setLoading(false);
	};
	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				margin: "1rem",
			}}
		>
			<List className={classes.root}>
				<Typography
					variant="subtitle2"
					align="right"
					style={
						updateLoading || updated
							? { paddingRight: "1rem", color: "lightslategrey" }
							: { display: "none" }
					}
				>
					{updateLoading ? (
						<div
							style={{
								display: "flex",
								justifyContent: "flex-end",
								alignItems: "center",
							}}
						>
							<CircularProgress
								style={{ width: "14px", height: "14px" }}
							/>
							Updating...
						</div>
					) : updated ? (
						<div
							style={{
								display: "flex",
								justifyContent: "flex-end",
								alignItems: "center",
								gap: "2px",
							}}
						>
							<DoneIcon
								style={{
									color: "green",
									width: "14px",
									height: "14px",
									gap: "2px",
								}}
							/>
							Saved
						</div>
					) : null}
				</Typography>
				{taskIds.length == 0
					? null
					: taskIds.map((taskId, index) => {
							const task = taskDict[taskId];

							return (
								<>
									<ListItem
										key={index}
										role={undefined}
										dense
									>
										<ListItemIcon>
											<Checkbox
												color="primary"
												edge="start"
												checked={task?.closed}
												tabIndex={-1}
												disableRipple
												onChange={(event) => {
													var newTask = {
														...task,
														closed: !task.closed,
													};
													const { newDict } =
														arrayToReducer([
															newTask,
														]);

													setTaskDict({
														...taskDict,
														...newDict,
													});

													updateApi(newTask);
												}}
											/>
										</ListItemIcon>

										<InputBase
											value={task?.text}
											placeholder={
												"Write your Tasks here"
											}
											className={classes.textInput}
											onChange={(event) => {
												const text = event.target.value;
												var newTask = {
													...task,
													text,
												};
												const { newDict } =
													arrayToReducer([newTask]);

												setTaskDict({
													...taskDict,
													...newDict,
												});

												setTextTask(task?._id);
												setText(text);
											}}
										/>
										<ListItemSecondaryAction>
											<IconButton
												edge="end"
												aria-label="comments"
												onClick={() => {
													setActiveTask(taskId);
													setShowComment(
														!showComment
													);
												}}
											>
												<CommentIcon />
											</IconButton>
											<IconButton
												edge="end"
												aria-label="Add"
												onClick={() => {
													onAdd(index);
													setShowComment(false);
												}}
											>
												<AddIcon />
											</IconButton>
											<IconButton
												edge="end"
												aria-label="Delete"
												style={
													taskIds.length == 1
														? { display: "none" }
														: {}
												}
												onClick={() => {
													onDelete(taskId, index);
												}}
											>
												<DeleteIcon />
											</IconButton>
										</ListItemSecondaryAction>
									</ListItem>
									{activeTask == taskId && showComment ? (
										<CommentList
											parent={taskId}
											parentModelName={"Task"}
										/>
									) : null}
								</>
							);
					  })}
			</List>
		</div>
	);
}
