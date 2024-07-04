import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import CommentIcon from "@material-ui/icons/Comment";
import arrayToReducer from "../../helpers/arrayToReducer";
import {
	Chip,
	FormControl,
	FormControlLabel,
	FormGroup,
	FormLabel,
	Grid,
	InputBase,
	Radio,
	RadioGroup,
	Typography,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";

import Api from "../../helpers/Api";
import { useSelector } from "react-redux";
import { useDebounce } from "react-use";
import ColorSelect from "../styled/color/color.select";
import { ColorBlob } from "../styled/color/color.blob";
import Kanban from "../styled/Kanban/Kanban";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
var getContrast = function (hexcolor) {
	// If a leading # is provided, remove it
	if (!hexcolor) return "white";
	if (hexcolor.slice(0, 1) === "#") {
		hexcolor = hexcolor.slice(1);
	}

	// If a three-character hexcode, make six-character
	if (hexcolor.length === 3) {
		hexcolor = hexcolor
			.split("")
			.map(function (hex) {
				return hex + hex;
			})
			.join("");
	}

	// Convert to RGB value
	var r = parseInt(hexcolor.substr(0, 2), 16);
	var g = parseInt(hexcolor.substr(2, 2), 16);
	var b = parseInt(hexcolor.substr(4, 2), 16);

	// Get YIQ ratio
	var yiq = (r * 299 + g * 587 + b * 114) / 1000;

	// Check contrast
	return yiq >= 128 ? "black" : "white";
};

const useStyles = makeStyles((theme) => ({
	root: {
		width: "100%",
		// maxWidth: "34rem",
		backgroundColor: theme.palette.background.paper,
	},
	text: {
		fontSize: 20,
		fontWeight: "bold",
		margin: "1rem 1rem",
	},

	title: {
		fontWeight: "600",
		margin: "1rem 1rem",
	},

	textInput: {
		// maxWidth: "24rem",
		width: "100%",
		borderWidth: "1px",
		backgroundColor: "#f1f1f1",
		color: "#424242",
		borderRadius: "11px",
		padding: "0.3rem",
		marginRight: "0.5rem",
		fontSize: 16,
		zIndex: 0,
	},
}));

export default function StatusList(props) {
	const classes = useStyles();
	const auth = useSelector((state) => state.auth);
	const user = auth?.user;
	const {
		template,
		setTemplate,
		statusIds,
		setStatusIds,
		statusDict,
		setStatusDict,
		startState,
		setStartState,
		finalStates,
		setFinalStates,
	} = props;
	console.log("template = ", template);
	const [showComment, setShowComment] = useState(false);
	const [activeStatus, setActiveStatus] = useState(null);
	const [text, setText] = useState("");
	const [disableState, setDisableState] = useState(0);
	const [color, setColor] = useState("");
	const [columns, setColumns] = useState([]);
	const [sideColumns, setSideColumns] = useState([]);
	// active status?._id
	const [textStatus, setTextStatus] = useState(null);
	const [statusColor, setStatusColor] = useState(null);

	useDebounce(
		() => {
			if (textStatus) {
				updateApi({
					_id: textStatus,
					text,
				});
			}
		},
		1000,
		[text]
	);

	useEffect(() => {
		if (template?.pipeline.length > 0) {
			const { newDict, idArr } = arrayToReducer(template?.pipeline);
			setStatusIds(idArr);
			setStatusDict(newDict);
		} else {
			createDefault();
		}
	}, [template?.pipeline?.length]);
	useEffect(() => {
		if (template?.pipeline.length != 0) {
			setStartState(template.startState);
			setFinalStates([...template?.finalStates]);
			setDisableState(template.startState);
		}
	}, [template]);

	const onAdd = async (index) => {
		const res = await Api.post("issue/status/create", {
			index,
			template: template?._id || null,
			text: "",
			color: "#fcb900",
			user: user?._id,
		});

		const data = res?.data;
		setTemplate(data?.issueTemplate)

		// const status = data?.status;

		// const { newDict } = arrayToReducer([status]);

		// setStatusIds([
		// 	...statusIds.slice(0, index),
		// 	status?._id,
		// 	...statusIds.slice(index),
		// ]);
		// setStatusDict({
		// 	...statusDict,
		// 	...newDict,
		// });
	};

	const createDefault = async () => {
		if (template?._id) {
			const res = await Api.post("issue/status/default", {
				template: template?._id,
			});

			const data = res?.data;

			const items = data?.items;

			const { newDict, idArr } = arrayToReducer(items);

			setStatusDict({
				...statusDict,
				...newDict,
			});

			setStatusIds(idArr);
			setStartState(idArr[0]);
			setFinalStates([idArr[2], idArr[3]]);
			setDisableState(idArr[0]);
		}
	};

	const onDelete = async (statusId, index) => {
		setStatusIds([
			...statusIds.slice(0, index),
			...statusIds.slice(index + 1),
		]);
		setStatusDict((prev) => {
			const { statusId, ...rest } = prev;
			return rest;
		});

		const res = await Api.post("issue/status/delete", {
			statusId,
		});
	};

	const updateApi = async (status) => {
		const res = await Api.post("issue/status/update", status);
	};
	const handleStartChange = (event) => {
		setStartState(event.target.value);
		setDisableState(event.target.value);
		if (finalStates.includes(event.target.value)) {
			let temp = finalStates.filter((ele) => ele != event.target.value);
			setFinalStates([...temp]);
		}
	};
	const handleCheck = (statusId) => {
		return finalStates.includes(statusId);
	};
	const handleFinalChange = (statusId) => {
		if (finalStates.includes(statusId)) {
			let temp = finalStates.filter((ele) => ele != statusId);
			setFinalStates([...temp]);
		} else {
			setFinalStates([...finalStates, statusId]);
		}
	};
	const onDragEnd = (result, columns, setColumns) => {
		if (!result.destination) return;
		const { source, destination } = result;

		const column = columns[source.droppableId];
		const copiedItems = [...column.items];
		const [removed] = copiedItems.splice(source.index, 1);
		copiedItems.splice(destination.index, 0, removed);
		let temp = copiedItems.map((obj) => obj?._id);
		setStatusIds([...temp]);

		setStartState(copiedItems[0]._id)

		setColumns({
			...columns,
			[source.droppableId]: {
				...column,
				items: copiedItems,
			},
		});
	};
	const onDragEndSide = (result, columns, setColumns) => {
		if (!result.destination) return;
		const { source, destination } = result;
		if (source.droppableId !== destination.droppableId) {
			const sourceColumn = columns[source.droppableId];
			const destColumn = columns[destination.droppableId];

			console.log(source,' is the source',destination,' is the destination')
			if(sourceColumn.minItems && (sourceColumn.minItems == sourceColumn.items.length) ){
				return;
			}

			const sourceItems = [...sourceColumn.items];
			const destItems = [...destColumn.items];
			const [removed] = sourceItems.splice(source.index, 1);
			destItems.splice(destination.index, 0, removed);
			console.log(sourceItems, destItems,' are source and destItems')
			const sourceItemIds = sourceItems.map(item => item._id)
			const destItemIds = destItems.map(item => item._id)

			if(source.droppableId=='1'){
				setFinalStates(destItemIds)
			}else{
				setFinalStates(sourceItemIds)
			}
			setColumns({
				...columns,
				[source.droppableId]: {
					...sourceColumn,
					items: sourceItems,
				},
				[destination.droppableId]: {
					...destColumn,
					items: destItems,
				},
			});
			console.log("sid", source.droppableId, destination.droppableId);
		} else {
			const column = columns[source.droppableId];
			const copiedItems = [...column.items];
			const [removed] = copiedItems.splice(source.index, 1);
			copiedItems.splice(destination.index, 0, removed);
			setColumns({
				...columns,
				[source.droppableId]: {
					...column,
					items: copiedItems,
				},
			});
		}
	};
	useEffect(() => {
		if (columns?.[1]?.items) {
			if (columns?.[1]?.items[0]?._id != startState) {
				setFinalStates((prev) => {
					let index = prev.indexOf(columns?.[1]?.items[0]?._id);
					if (index > -1) {
						prev.splice(index, 1); // 2nd parameter means remove one item only
					}
					return prev;
				});
				setStartState(columns?.[1]?.items[0]?._id);
			}
		}
	}, [columns]);
	useEffect(() => {
		let cols = {
			1: {
				title: "All States",
				items: statusIds.map((statusId, index) => {
					const status = statusDict[statusId];
					let obj = {
						_id: statusId,
						content: (
							<div
								style={{
									display: "flex",
									width: "100%",
									border: "1px solid lightgrey",
									paddingRight: "9px",
									borderRadius: "17px",
									position: "relative",
								}}
							>
								<Chip
									label="Start State"
									size="small"
									style={
										statusId == startState
											? {
													position: "absolute",
													backgroundColor:
														"rgb(19, 135, 19)",
													color: "white",
													top: "-11px",
													left: "3px",
											  }
											: { display: "none" }
									}
								/>
								<ListItem
									key={statusId}
									role={undefined}
									dense
									style={{
										paddingRight: 0,
										paddingLeft: 0,
									}}
								>
									<ListItemIcon>
										<DragIndicatorIcon />
										<ColorBlob
											open={statusId == statusColor}
											setOpen={() => {
												if (statusId == statusColor) {
													setStatusColor(null);
												} else {
													setStatusColor(statusId);
												}
											}}
											color={status?.color}
											setColor={(newColor) => {
												var newStatus = {
													...status,
													color: newColor,
												};
												const { newDict } =
													arrayToReducer([newStatus]);
												setStatusDict({
													...statusDict,
													...newDict,
												});

												updateApi(newStatus);
											}}
										/>
									</ListItemIcon>

									<InputBase
										style={{ width: "90%" }}
										value={status?.text}
										className={classes.textInput}
										onChange={(event) => {
											const text = event.target.value;
											var newStatus = {
												...status,
												text,
											};
											const { newDict } = arrayToReducer([
												newStatus,
											]);

											setStatusDict({
												...statusDict,
												...newDict,
											});

											setTextStatus(status?._id);
											setText(text);
										}}
									/>
									<div style={{ display: "inline-flex" }}>
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
											disabled={statusIds.length == 1}
											onClick={() => {
												onDelete(statusId, index);
											}}
										>
											<DeleteIcon />
										</IconButton>
									</div>
								</ListItem>
							</div>
						),
					};
					return obj;
				}),
			},
		};
		setColumns(cols);
	}, [statusDict, statusIds.length, startState, statusColor]);

	useEffect(() => {
		let restIds = statusIds.filter((id) => {
			return ![...finalStates, startState].includes(id);
		});
		const columnsData = {
			1: {
				title: "In Progress",
				items: restIds.map((id, idx) => {
					var text = statusDict?.[id]?.text
					var labelText = text.length>20?`${text.slice(0,20)+'...'}`: text
					let obj = {
						_id: id,
						content: (
							<Chip
								color="primary"
								style={{
									color: getContrast(statusDict?.[id]?.color),
									backgroundColor: statusDict?.[id]?.color,
								}}
								label={labelText}
							/>
						),
					};
					return obj;
				}),
			},
			2: {
				title: "Final States",
				minItems:1,
				items: finalStates.map((id, idx) => {
					let obj = {
						_id: id,
						content: (
							<Chip
								color="primary"
								style={{
									color: getContrast(statusDict?.[id]?.color),
									backgroundColor: statusDict?.[id]?.color,
								}}
								label={statusDict?.[id]?.text}
							/>
						),
					};
					return obj;
				}),
			},
		};
		setSideColumns(columnsData);
	}, [statusIds.length, statusDict, template.startState, template.finalStates]);

	return (
		<Grid container spacing={2}>
			<Grid item xs={12} md={7}>
				<Kanban
					columns={columns}
					setColumns={setColumns}
					dragDirection="vertical"
					onDragEnd={onDragEnd}
					columnStyles={{
						backgroundColor: "white",
						flex: "1 0 100%",
					}}
					itemStyles={{ display: "flex", flexDirection: "column" }}
				/>
			</Grid>
			<Grid item xs={12} md={5}>
				<Kanban
					columns={sideColumns}
					onDragEnd={onDragEndSide}
					setColumns={setSideColumns}
					columnStyles={{
						backgroundColor: "white",
						flex: "1 0 100%",
					}}
					itemStyles={{
						display: "flex",
						gap: "7px",
						flexWrap: "wrap",
					}}
				/>
			</Grid>
		</Grid>
	);
}

{
	/* <List
	className={classes.root}
	sx={{
		"& .MuiListItem-secondaryAction": {
			padding: 0,
		},
	}}
>
	<Typography className={classes.text}>Select States</Typography>


</List>; */
}
