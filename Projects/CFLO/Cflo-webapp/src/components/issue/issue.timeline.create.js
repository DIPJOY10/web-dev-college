import {
	alpha,
	Button,
	Divider,
	Grid,
	makeStyles,
	TextField,
	Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import ProfileAppbar from "../profile/profile.appbar";
import CreateBtn from "../styled/actionBtns/create.btn";
import useProfileIssueData from "./useProfileIssueData";
import Popper from "@material-ui/core/Popper";
import DeleteIcon from "@material-ui/icons/Delete";
import DoneIcon from "@material-ui/icons/Done";
import Autocomplete from "@material-ui/lab/Autocomplete";
import InputBase from "@material-ui/core/InputBase";
import IssueGraph from "./issue.graph";
import { MarkerType } from "react-flow-renderer";
import Alert from "@material-ui/lab/Alert";
import useShared from "../share/useShared.js";
import { useDispatch, useSelector } from "react-redux";
import SharedList from "../share/sharedList";
import ShareIconBtn from "../share/share.icon.btn";
import Api from "../../helpers/Api";

function containsObject(obj, list) {
	var i;
	for (i = 0; i < list.length; i++) {
		if (list[i]?._id == obj?._id) {
			return false;
		}
	}
	return true;
}
const position = { x: 0, y: 0 };
const edgeType = "smoothstep";
const useStyles = makeStyles((theme) => ({
	root: {
		display: "flex",
		flex: 1,
		flexDirection: "column",
		height: "100vh",
		marginTop: "8vh",
		// justifyContent: "center",
		alignItems: "center",
	},
	text: {
		fontSize: "1.1rem",
		fontWeight: "600",
		margin: "0rem 1rem",
		flexGrow: 1,
	},
	button: {
		fontSize: 13,
		width: "100%",
		height: "100%",
		textAlign: "center",
		paddingBottom: 8,
		fontWeight: 600,
		"& svg": {
			width: 16,
			height: 16,
		},
	},
	tag: {
		marginTop: 3,
		height: 20,
		padding: ".15em 4px",
		fontWeight: 600,
		lineHeight: "15px",
		borderRadius: 2,
	},
	popper: {
		border: "1px solid rgba(27,31,35,.15)",
		boxShadow: "0 3px 12px rgba(27,31,35,.15)",
		borderRadius: 3,
		width: 300,
		zIndex: 1,
		fontSize: 13,
		color: "#586069",
		backgroundColor: "#f6f8fa",
	},
	header: {
		borderBottom: "1px solid #e1e4e8",
		padding: "8px 10px",
		fontWeight: 600,
	},
	inputBase: {
		padding: 10,
		width: "100%",
		borderBottom: "1px solid #dfe2e5",
		"& input": {
			borderRadius: 4,
			backgroundColor: theme.palette.common.white,
			padding: 8,
			transition: theme.transitions.create([
				"border-color",
				"box-shadow",
			]),
			border: "1px solid #ced4da",
			fontSize: 14,
			"&:focus": {
				boxShadow: `${alpha(
					theme.palette.primary.main,
					0.25
				)} 0 0 0 0.2rem`,
				borderColor: theme.palette.primary.main,
			},
		},
	},
	paper: {
		boxShadow: "none",
		margin: 0,
		color: "#586069",
		fontSize: 13,
	},
	option: {
		minHeight: "auto",
		alignItems: "flex-start",
		padding: 8,
		'&[aria-selected="true"]': {
			backgroundColor: "transparent",
		},
		'&[data-focus="true"]': {
			backgroundColor: theme.palette.action.hover,
		},
	},
	popperDisablePortal: {
		position: "relative",
	},
	iconSelected: {
		width: 17,
		height: 17,
		marginRight: 5,
		marginLeft: -2,
	},
	color: {
		width: 14,
		height: 14,
		flexShrink: 0,
		borderRadius: 3,
		marginRight: 8,
		marginTop: 2,
	},

	close: {
		opacity: 0.6,
		width: 18,
		height: 18,
	},
}));

function IssueTimelineCreate() {
	const [title, setTitle] = useState("");
	const classes = useStyles();
	const history = useHistory();
	const dispatch = useDispatch();
	const { profileId } = useParams();
	const {
		issueIds,
		setIssueIds,
		issueDictionary,
		setIssueDictionary,
		totalIssues,
		loading,
	} = useProfileIssueData(profileId);
	const [nodes, setNodes] = useState([]);
	const [startPendingValue, setStartPendingValue] = useState([]);
	const [endPendingValue, setEndPendingValue] = useState([]);
	const [anchorEl, setAnchorEl] = React.useState([null]);
	const [anchorElEnd, setAnchorElEnd] = React.useState([null]);
	const options = Object.values(issueDictionary).sort(function (x, y) {
		if (x?.template?.title && y?.template?.title) {
			if (
				x.template.title.toLowerCase() > y.template.title.toLowerCase()
			) {
				return 1;
			} else {
				return -1;
			}
		} else {
			if (x?.template?.title) {
				return -1;
			}
			if (y?.template?.title) {
				return 1;
			}
		}
	});
	const [startArr, setStartArr] = useState([
		{ _id: "start", title: "Start", template: { title: "Start" } },
	]);
	const [endArr, setEndArr] = useState([
		{ _id: "finish", title: "Finish", template: { title: "Finish" } },
	]);
	const [startNodes, setStartNodes] = useState([[startArr[0]]]);
	const [endNodes, setEndNodes] = useState([[endArr[0]]]);
	const [issueCount, setIssueCount] = useState([0]); // need a for loop in jsx so this will act like counter
	// preview section
	const [initialNodes, setInitialNodes] = useState([
		{
			id: "start",
			type: "input",
			data: {
				label: "Start",
				issue: startArr[0],
			},
			position: {
				x: 0,
				y: 0,
			},
			style: {
				backgroundColor: "#53d769",
			},
			targetPosition: "top",
			sourcePosition: "bottom",
		},
		{
			id: "finish",
			type: "output",
			data: {
				label: "Finish",
				issue: endArr[0],
			},
			position: {
				x: 0,
				y: 172,
			},
			style: {
				backgroundColor: "rgb(239 85 5)",
			},
			targetPosition: "top",
			sourcePosition: "bottom",
		},
	]);
	const [initialEdges, setInitialEdges] = useState([
		{
			id: "default",
			source: "start",
			target: "finish",
			type: "smoothstep",
			animated: false,
			style: {
				color: "black",
			},
			markerEnd: {
				type: "arrowclosed",
			},
		},
	]);
	const [dataUnit, setDataUnit] = useState([]);
	const [error, setError] = useState(null);
	const [errorMessgae, setErrorMessage] = useState(null);

	//shared box
	const { user, userProfile } = useSelector((state) => state.auth);
	const userProfileId = user?.profile;
	const [isPrivate, setPrivate] = useState(false);
	const sharedProps = useShared({
		initShared: [profileId, userProfileId],
		initAssigned: [],
	});
	var { sharedPeoples } = SharedList(sharedProps, isPrivate, setPrivate);
	const createContract = async () => {
		//checks to see if any blank issue is present or any start end node is not connected
		if (errorMessgae) {
			setError(true);
			setTimeout(() => {
				setError(false);
			}, 5000);
		} else {
			let contractObj = {
				title: title,
				units: nodes.map((issueObj, index) => {
					let tempSource = startNodes[index].filter(
						(obj) => obj?._id != "start"
					);
					let tempDestination = endNodes[index].filter(
						(obj) => obj?._id != "finish"
					);
					return {
						issue: issueObj?._id,
						connectedToStart: startNodes[index].includes(
							startArr[0]
						),
						connectedToEnd: endNodes[index].includes(endArr[0]),
						source: tempSource.map((obj) => {
							return obj?._id;
						}),
						destination: tempDestination.map((obj) => {
							return obj?._id;
						}),
					};
				}),

				user: user._id,
				profile: profileId,
				shared: sharedProps?.shared,
			};
			const res = await Api.post("issue/project/create", contractObj);
			if (res?.success) {
				dispatch({
					type: "AddApiAlert",
					payload: {
						success: true,
						message: "Task Map created successfully",
					},
				});
				var path = "/issue/timeline/" + profileId;
				history.push(path);
			} else {
				setErrorMessage(res?.data);
				setError(true);
				setTimeout(() => {
					setError(false);
				}, 5000);
			}
		}
	};

	const updateNode = async (newValue, idx) => {
		// add a fucntion to travel start and end nodes array and remove this node if found at any place. make a function for it.
		let oldValue = nodes[idx];
		let temp = [...nodes];
		temp[idx] = {
			...newValue,
		};
		setNodes([...temp]);

		//removing this old value from other indexes start and end array as this node does not exist
		temp = startNodes;
		temp[idx] = [startArr[0]];
		temp = temp.map((subArr) => {
			return subArr.filter((obj) => {
				return obj?._id != oldValue?._id;
			});
		});
		await setStartNodes([...temp]);

		temp = endNodes;
		temp[idx] = [endArr[0]];
		temp = temp.map((subArr) => {
			return subArr.filter((obj) => {
				return obj?._id != oldValue?._id;
			});
		});

		await setEndNodes([...temp]);
	};
	// newValue is array of issues
	const updateStartNode = async (newValue, idx) => {
		let temp = [...startNodes];
		temp[idx] = newValue;
		await setStartNodes([...temp]);
		// now use this updated array to add end nodes for these new starts
		let temparr = [];
		nodes.map((nodeObj, index) => {
			if (index != idx) {
				if (newValue.filter((e) => e._id === nodeObj?._id).length > 0) {
					temparr = [...temparr, index];
				}
			}
		});
		let tempend = endNodes.map((arrays) => {
			return arrays.filter((obj) => {
				return obj?._id !== nodes[idx]?._id;
			});
		});
		temparr.map((index) => {
			tempend[index] = [...tempend[index], nodes[idx]];
		});
		await setEndNodes([...tempend]);
		// console.log("here = ", temparr, tempend);
	};

	// console.log("start nodes = ", startNodes);
	// console.log("end nodes = ", endNodes);
	// newValue is array of issues
	const updateEndNode = async (newValue, idx) => {
		let temp = [...endNodes];
		temp[idx] = newValue;
		await setEndNodes([...temp]);
		// if you add a node as end node then the respective node should show the node in start

		let tempArr = [];
		nodes.map((nodeObj, index) => {
			if (index != idx) {
				if (
					newValue.filter((e) => e?._id === nodeObj?._id).length > 0
				) {
					tempArr = [...tempArr, index];
				}
			}
		});
		let tempstart = startNodes.map((arrays) => {
			return arrays.filter((obj) => {
				return obj?._id !== nodes[idx]?._id;
			});
		});
		tempArr.map((index) => {
			tempstart[index] = [...tempstart[index], nodes[idx]];
		});
		setStartNodes([...tempstart]);
		// console.log("here end = ", tempArr, tempstart);
	};

	const handleStartClick = (event, idx) => {
		setStartPendingValue(startNodes[idx]);
		let temp = [...anchorEl];
		temp[idx] = event.currentTarget;
		setAnchorEl([...temp]);
	};
	const handleEndClick = (event, idx) => {
		setEndPendingValue(endNodes[idx]);
		let temp = [...anchorElEnd];
		temp[idx] = event.currentTarget;
		setAnchorElEnd([...temp]);
	};
	const handleStartClose = (event, reason, idx) => {
		if (reason === "toggleInput") {
			return;
		}
		updateStartNode(startPendingValue, idx);
		if (anchorEl[idx]) {
			anchorEl[idx].focus();
		}
		let temp = [...anchorEl];
		temp[idx] = null;
		setAnchorEl([...temp]);
	};
	const handleEndClose = (event, reason, idx) => {
		if (reason === "toggleInput") {
			return;
		}
		updateEndNode(endPendingValue, idx);
		if (anchorElEnd[idx]) {
			anchorElEnd[idx].focus();
		}
		let temp = [...anchorElEnd];
		temp[idx] = null;
		setAnchorElEnd([...temp]);
	};
	const handleDelete = (idx) => {
		// delete idx index
		let temp = [];
		setIssueCount([...Array(issueCount.length - 1).keys()]);

		temp = nodes;
		temp.splice(idx, 1);
		setNodes([...temp]);

		temp = startNodes;
		temp.splice(idx, 1);
		setStartNodes([...temp]);

		temp = endNodes;
		temp.splice(idx, 1);
		setEndNodes([...temp]);
	};
	useEffect(() => {
		setStartArr([startArr[0], ...nodes]);
		setEndArr([endArr[0], ...nodes]);
	}, [nodes]);

	// preview section
	useEffect(() => {
		if (nodes?.length == startNodes?.length) {
			let temp = [];
			temp = nodes.map((obj, idx) => {
				return {
					_id: obj?._id,
					title: obj?.title,
					source_id: startNodes[idx].map((obj) => obj?._id),
					destination_id: endNodes[idx].map((obj) => obj?._id),
					isClosed: obj?.closed,
				};
			});
			setDataUnit([...temp]);
		}
	}, [nodes, startNodes, endNodes]);
	// console.log(initialNodes, initialEdges);

	useEffect(() => {
		if (nodes?.length == startNodes?.length) {
			// update the check
			let status = "";
			let tempinitialNodes = [
				{
					id: "start",
					type: "input",
					data: { label: "Start", issue: startArr[0] },
					position,
					style: { backgroundColor: "#53d769" },
				},
				...dataUnit.map((issueObj) => {
					if (issueDictionary[issueObj?._id]?.template?.pipeline) {
						status = issueDictionary[
							issueObj?._id
						]?.template?.pipeline.filter((obj) => {
							return (
								obj?._id ==
								issueDictionary[issueObj?._id]?.status
							);
						})[0];
					}
					return {
						id: issueObj?._id,
						data: {
							label: issueObj?.title,
							issue: {
								...issueDictionary[issueObj?._id],
								currentStatus: status,
							},
						},
						position,
					};
				}),
				{
					id: "finish",
					type: "output",
					data: { label: "Finish", issue: endArr[0] },
					position,
					style: { backgroundColor: "rgb(239 85 5)" },
				},
			];
			let newinitialEdges = [
				...dataUnit.map((Obj, indexid) => {
					return [
						...Obj.source_id.map((sid, index) => {
							return {
								id: `${indexid}${index}${Obj._id}`,
								source: sid,
								target: Obj?._id,
								type: edgeType,
								animated: false,
								style: { color: "black" },
								markerEnd: {
									type: MarkerType.ArrowClosed,
								},
							};
						}),
						...Obj.destination_id.map((did, idx) => {
							return {
								id: `${indexid}${Obj?._id}${idx}`,
								source: Obj?._id,
								target: did,
								type: edgeType,
								animated: false,
								style: { color: "black" },
								markerEnd: {
									type: MarkerType.ArrowClosed,
								},
							};
						}),
					];
				}),
			].flat(3);
			let tempinitialEdges = newinitialEdges.filter(
				(value, index, self) =>
					index ===
					self.findIndex(
						(t) =>
							t.source === value.source &&
							t.target === value.target
					)
			);
			setInitialNodes([...tempinitialNodes]);
			setInitialEdges([...tempinitialEdges]);
		}
	}, [dataUnit, issueDictionary]);

	//error check
	useEffect(() => {
		let nodesError = false;
		let startError = false;
		let endError = false;

		for (var i = 0; i < issueCount.length; i++) {
			if (Boolean(nodes[i])) {
				if (Object.keys(nodes[i]).length == 0) {
					nodesError = true;
					break;
				}
			} else {
				nodesError = true;
				break;
			}
			if (startNodes[i].length == 0) {
				startError = true;
				break;
			} else if (endNodes[i].length == 0) {
				endError = true;
				break;
			}
		}

		if (title == "") {
			setErrorMessage("Please enter a title.");
		} else if (nodesError) {
			setErrorMessage(
				"Please add issues to all nodes or delete the node if not required."
			);
		} else if (startError) {
			setErrorMessage(
				"The start point for a node cannot be left empty. Please select a node from Start list"
			);
		} else if (endError) {
			setErrorMessage(
				"The end point for a node cannot be left empty. Please select a node from End list"
			);
		} else {
			setErrorMessage("");
		}
	}, [title, nodes, startNodes, endNodes]);

	return (
		<div className={classes.root}>
			<ProfileAppbar
				name={"New Task Map"}
				btns={
					<>
						<ShareIconBtn
							open={sharedProps?.open}
							setOpen={sharedProps?.setOpen}
						/>
						<CreateBtn
							onClick={() => {
								createContract();
							}}
						>
							Save
						</CreateBtn>
					</>
				}
			/>
			{sharedProps?.shareDrawer}
			{sharedProps?.assignedDialog}
			<Grid
				container
				style={{
					backgroundColor: "white",
					padding: "10px",
					width: "100%",
				}}
			>
				<Grid item xs={12}>
					{error && <Alert severity="error">{errorMessgae}</Alert>}
				</Grid>
				<Grid
					item
					sm={12}
					md={3}
					xs={12}
					style={{
						display: "flex",
						alignItems: "center",
					}}
				>
					<Typography variant="h4" className={classes.text}>
						Title
					</Typography>
				</Grid>
				<Grid item sm={12} md={9} xs={12}>
					<TextField
						value={title}
						placeholder={"Task Map Title"}
						onChange={(event) => setTitle(event.target.value)}
						variant="outlined"
						style={{ padding: "1rem" }}
						fullWidth
					/>
				</Grid>
				<Grid item xs={12}>
					<Grid
						container
						style={{
							backgroundColor: "white",
							padding: "10px",
							width: "100%",
						}}
						spacing={2}
					>
						{issueCount.map((idx) => (
							<>
								<Grid item md={7} xs={12}>
									<Autocomplete
										options={
											nodes[idx] == undefined
												? options.filter((obj) => {
														return containsObject(
															obj,
															Object.values(nodes)
														);
												  })
												: [nodes[idx]].concat(
														options.filter(
															(obj) => {
																return containsObject(
																	obj,
																	Object.values(
																		nodes
																	)
																);
															}
														)
												  )
										}
										value={nodes?.idx}
										loading={loading}
										onChange={(event, newValue) => {
											updateNode(newValue, idx);
											//call a function to update.
										}}
										getOptionSelected={(option, value) => {
											return option._id == value._id;
										}}
										noOptionsText="No issues found"
										groupBy={(option) =>
											option?.template?.title ||
											"No Template"
										}
										getOptionLabel={(option) =>
											option.title
										}
										// style={{ width: 300 }}
										renderInput={(params) => (
											<TextField
												{...params}
												label={`Issue ${idx + 1}`}
												variant="outlined"
											/>
										)}
									/>
								</Grid>
								<Grid item xs={5} md={2}>
									<Button
										disableRipple
										color="primary"
										disabled={!Boolean(nodes[idx])}
										variant="contained"
										className={classes.button}
										onClick={(e) =>
											handleStartClick(e, idx)
										}
									>
										<div
											style={{
												display: "flex",
												justifyContent: "space-around",
												width: "100%",
											}}
										>
											Start
											{Boolean(nodes[idx]) ? (
												<div
													style={{
														borderRadius: "50%",
														width: "1.5rem",

														backgroundColor:
															"darkblue",
													}}
												>
													{startNodes[idx]?.length}
												</div>
											) : null}
										</div>
									</Button>
									<Popper
										open={Boolean(anchorEl[idx])}
										anchorEl={anchorEl[idx]}
										placement="bottom-start"
										className={classes.popper}
									>
										<div className={classes.header}>
											Select Start Nodes for this Issue
										</div>
										<Autocomplete
											open={Boolean(anchorEl[idx])}
											multiple
											onClose={(event, reason) =>
												handleStartClose(
													event,
													reason,
													idx
												)
											}
											classes={{
												paper: classes.paper,
												option: classes.option,
												popperDisablePortal:
													classes.popperDisablePortal,
											}}
											value={startPendingValue}
											onChange={(event, newValue) => {
												setStartPendingValue(newValue);
											}}
											groupBy={(option) =>
												option?.template?.title ||
												"No Template"
											}
											getOptionSelected={(
												option,
												value
											) => {
												return option._id == value._id;
											}}
											disableCloseOnSelect
											disablePortal
											renderTags={() => null}
											noOptionsText="No issues found"
											renderOption={(
												option,
												{ selected }
											) => (
												<React.Fragment>
													<DoneIcon
														className={
															classes.iconSelected
														}
														style={{
															visibility: selected
																? "visible"
																: "hidden",
														}}
													/>

													<div
														className={classes.text}
													>
														{option.title}
													</div>
												</React.Fragment>
											)}
											options={[
												...startArr.filter((obj) => {
													return (
														nodes[idx]?._id !==
														obj?._id
													);
												}),
											].sort((a, b) => {
												// Display the selected labels first.
												let ai =
													startNodes[idx] == undefined
														? undefined
														: startNodes[
																idx
														  ].indexOf(a);
												ai =
													ai === undefined
														? startArr.indexOf(a)
														: ai === -1
														? startNodes[idx]
																.length +
														  startArr.indexOf(a)
														: ai;
												let bi =
													startNodes[idx] == undefined
														? undefined
														: startNodes[
																idx
														  ].indexOf(b);
												bi =
													bi === undefined
														? startArr.indexOf(b)
														: bi === -1
														? startNodes[idx]
																.length +
														  startArr.indexOf(b)
														: bi;
												return ai - bi;
											})}
											getOptionLabel={(option) =>
												option.title
											}
											renderInput={(params) => (
												<InputBase
													ref={params.InputProps.ref}
													inputProps={
														params.inputProps
													}
													autoFocus
													className={
														classes.inputBase
													}
												/>
											)}
										/>
									</Popper>
								</Grid>
								<Grid item xs={5} md={2}>
									<Button
										disableRipple
										color="primary"
										disabled={!Boolean(nodes[idx])}
										variant="contained"
										className={classes.button}
										onClick={(e) => handleEndClick(e, idx)}
									>
										<div
											style={{
												display: "flex",
												justifyContent: "space-around",
												width: "100%",
											}}
										>
											End
											{Boolean(nodes[idx]) ? (
												<div
													style={{
														borderRadius: "50%",
														width: "1.5rem",

														backgroundColor:
															"darkblue",
													}}
												>
													{endNodes[idx]?.length}
												</div>
											) : null}
										</div>
									</Button>
									<Popper
										open={Boolean(anchorElEnd[idx])}
										anchorEl={anchorElEnd[idx]}
										placement="bottom-start"
										className={classes.popper}
									>
										<div className={classes.header}>
											Select End Nodes for this Issue
										</div>
										<Autocomplete
											open={Boolean(anchorElEnd[idx])}
											multiple
											onClose={(event, reason) =>
												handleEndClose(
													event,
													reason,
													idx
												)
											}
											classes={{
												paper: classes.paper,
												option: classes.option,
												popperDisablePortal:
													classes.popperDisablePortal,
											}}
											value={endPendingValue}
											onChange={(event, newValue) => {
												setEndPendingValue(newValue);
											}}
											groupBy={(option) =>
												option?.template?.title ||
												"No Template"
											}
											getOptionSelected={(
												option,
												value
											) => {
												return option._id == value._id;
											}}
											disableCloseOnSelect
											disablePortal
											renderTags={() => null}
											noOptionsText="No issues found"
											renderOption={(
												option,
												{ selected }
											) => (
												<React.Fragment>
													<DoneIcon
														className={
															classes.iconSelected
														}
														style={{
															visibility: selected
																? "visible"
																: "hidden",
														}}
													/>

													<div
														className={classes.text}
													>
														{option.title}
													</div>
												</React.Fragment>
											)}
											options={[
												...endArr.filter((obj) => {
													return (
														nodes[idx]?._id !==
														obj?._id
													);
												}),
											].sort((a, b) => {
												// Display the selected labels first.
												let ai =
													endNodes[idx] == undefined
														? undefined
														: endNodes[idx].indexOf(
																a
														  );
												ai =
													ai === undefined
														? endArr.indexOf(a)
														: ai === -1
														? endNodes[idx].length +
														  endArr.indexOf(a)
														: ai;
												let bi =
													endNodes[idx] == undefined
														? undefined
														: endNodes[idx].indexOf(
																b
														  );
												bi =
													bi === undefined
														? endArr.indexOf(b)
														: bi === -1
														? endNodes[idx].length +
														  endArr.indexOf(b)
														: bi;
												return ai - bi;
											})}
											getOptionLabel={(option) =>
												option.title
											}
											renderInput={(params) => (
												<InputBase
													ref={params.InputProps.ref}
													inputProps={
														params.inputProps
													}
													autoFocus
													className={
														classes.inputBase
													}
												/>
											)}
										/>
									</Popper>
								</Grid>
								<Grid item md={1} xs={2}>
									<Button
										disabled={issueCount.length == 1}
										style={{
											height: "100%",
											width: "100%",
										}}
										onClick={() => {
											handleDelete(idx);
										}}
									>
										<DeleteIcon />
									</Button>
								</Grid>
							</>
						))}
					</Grid>
				</Grid>
				<Grid item sx={12}>
					<Button
						onClick={async () => {
							await updateStartNode(
								[startArr[0]],
								issueCount.length
							);
							await updateEndNode([endArr[0]], issueCount.length);
							setIssueCount([...issueCount, issueCount.length]);
						}}
					>
						Add More Issues
					</Button>
				</Grid>
				<Grid item sx={12} style={{ width: "100%", height: "50vh" }}>
					<Alert severity="info">
						Add issues to your Task Map to generate preview
					</Alert>
					<Divider />
					<Typography className={classes.text}>Preview</Typography>
					<IssueGraph
						initialNodes={initialNodes}
						initialEdges={initialEdges}
					/>
				</Grid>
				<Grid item sm={12} xs={12} style={{ marginTop: "6rem" }}>
					<Typography variant="h4" className={classes.text}>
						Shared
					</Typography>
				</Grid>
				<Grid item sm={12} xs={12}>
					{sharedPeoples}
				</Grid>
			</Grid>
		</div>
	);
}

export default IssueTimelineCreate;
