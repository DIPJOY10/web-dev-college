import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import CloseIcon from "@material-ui/icons/Close";
import { isEqual } from "lodash";
import Api from "../../helpers/Api";
import LoadingButton from "../styled/actionBtns/loading.btn";

import {
	FormControl,
	Grid,
	InputLabel,
	makeStyles,
	MenuItem,
	Select,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { useEffect } from "react";

const useStyles = makeStyles((theme) => ({
	root: {
		width: "100%",
	},
	container: {
		maxHeight: 440,
	},
}));

const columns = [
	{ id: "index", label: "S No.", width: 25 },
	{ id: "title", label: "Title", width: 80 },
	{
		id: "template",
		label: "Template",
		width: 70,
	},
	{
		id: "final",
		label: "Final State",
		width: 60,
	},
];

function createData(tableRows, finalStates, setFinalStates) {
	let defaultFinal = {};
	let rows = tableRows.map((issue, idx) => {
		let index = idx + 1;
		let _id = issue?._id;
		let title = issue?.title;
		let template = issue?.template?.title ?? "No Template";
		let final = [];
		let isTemplate = Boolean(issue?.template);
		let isFinalState = Boolean(
			(issue?.template?.finalStates || []).length > 0
		);
		let startState = issue?.template?.startState;
		if (isFinalState) {
			defaultFinal = {
				...defaultFinal,
				[_id]: issue?.template?.finalStates[0],
			};
			final = issue?.template?.pipeline.filter((obj) => {
				return (issue?.template?.finalStates || []).includes(obj?._id);
			});
		}
		return {
			index,
			title,
			template,
			final,
			isTemplate,
			isFinalState,
			_id,
			startState,
		};
	});
	if (!isEqual(finalStates, defaultFinal)) {
		setFinalStates({ ...defaultFinal });
	}
	return rows;
}

export default function IssueDialog({
	open,
	setOpen,
	status,
	IdArr,
	issueDictionary,
}) {
	const classes = useStyles();
	const history = useHistory();
	const tableRows = IdArr.map((id) => {
		return issueDictionary[id];
	});

	const [loading, setLoading] = useState(false);

	const [finalStates, setFinalStates] = useState({});
	const [rows, setRows] = useState([]);
	const updateRows = rows.length != tableRows.length;

	const handleClose = () => {
		setOpen(false);
	};

	const handleFinalState = (issueId, stateId) => {
		// console.log("final", finalStates, issueId, stateId);
		setFinalStates((prev) => {
			return { ...(prev || {}), [issueId]: stateId };
		});
	};

	const handleSubmit = async () => {
		let arr = rows.map((obj) => {
			return {
				_id: obj?._id,
				set: {
					closed: !status,
					status: status ? obj?.startState : finalStates[obj?._id],
				},
			};
		});

		setLoading(true);
		const res = await Api.post("issue/updateMultiple", {
			IssueArray: arr,
		});
		if (res?.success) {
			history.go(0);
		} else {
			handleClose();
			console.error(res?.error);
		}
		setLoading(false);
	};
	// console.log("table rows", finalStates);

	useEffect(() => {
		let newRows = createData(tableRows, finalStates, setFinalStates);
		setRows([...newRows]);
	}, [updateRows]);

	useEffect(() => {
		setFinalStates([]);
	}, [status]);

	return (
		<div>
			<Dialog
				open={open && status == false}
				maxWidth={"md"}
				fullWidth
				onClose={handleClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle style={{ margin: "2%", padding: "0px 9px" }}>
					<Grid
						container
						justifyContent="space-between"
						alignItems="center"
					>
						<Typography variant="h6" component="div">
							{status ? "Mark as Open" : "Mark as Closed"}
						</Typography>
						<CloseIcon
							onClick={handleClose}
							style={{ cursor: "pointer" }}
						/>
					</Grid>
				</DialogTitle>
				<DialogContent>
					<TableContainer className={classes.container}>
						<Table stickyHeader aria-label="sticky table">
							<TableHead>
								<TableRow>
									{columns.map((column, idx) => (
										<TableCell
											align="center"
											key={column.id}
											style={
												idx == 0
													? { width: "1rem" }
													: {}
											}
										>
											{column.label}
										</TableCell>
									))}
								</TableRow>
							</TableHead>
							<TableBody>
								{rows.map((row) => {
									return (
										<TableRow
											hover
											role="checkbox"
											tabIndex={-1}
											key={row.index}
										>
											{columns.map((column, idx) => {
												const value = row[column.id];
												return (
													<TableCell
														align="center"
														key={column.id}
													>
														{idx == 3 ? (
															<div
																style={{
																	width: "100%",
																}}
															>
																{row.isFinalState ? (
																	<Select
																		variant="outlined"
																		value={
																			finalStates[
																				row[
																					"_id"
																				]
																			]
																		}
																		onChange={(
																			e
																		) => {
																			handleFinalState(
																				row?._id,
																				e
																					.target
																					.value
																			);
																		}}
																		// displayEmpty
																	>
																		{row.isFinalState ? (
																			row.final.map(
																				(
																					obj,
																					idx
																				) => (
																					<MenuItem
																						key={
																							idx
																						}
																						value={
																							obj?._id
																						}
																					>
																						{
																							obj?.text
																						}
																					</MenuItem>
																				)
																			)
																		) : (
																			<MenuItem value=""></MenuItem>
																		)}
																	</Select>
																) : (
																	<Typography>
																		No Final
																		States
																		Present
																	</Typography>
																)}
															</div>
														) : (
															value
														)}
													</TableCell>
												);
											})}
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					</TableContainer>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="primary">
						Discard
					</Button>
					<LoadingButton
						variant="contained"
						onClick={handleSubmit}
						color="primary"
						text={"Close Issues"}
						loading={loading}
					/>
				</DialogActions>
			</Dialog>
			<Dialog
				open={open && status}
				onClose={handleClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle style={{ margin: "2%", padding: "0px 9px" }}>
					<Grid
						container
						justifyContent="space-between"
						alignItems="center"
					>
						<Typography variant="h6" component="div">
							{status ? "Mark as Open" : "Mark as Closed"}
						</Typography>
						<CloseIcon
							onClick={handleClose}
							style={{ cursor: "pointer" }}
						/>
					</Grid>
				</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						All {rows.length} issues will be marked as open and will
						be in Start state of their respective templates
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="primary">
						Discard
					</Button>
					<LoadingButton
						variant="contained"
						onClick={handleSubmit}
						color="primary"
						text={"Open Issues"}
						loading={loading}
					/>
				</DialogActions>
			</Dialog>
		</div>
	);
}
