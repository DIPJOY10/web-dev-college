import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import PropTypes from "prop-types";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	FormControl,
	IconButton,
	InputAdornment,
	InputLabel,
	makeStyles,
	MenuItem,
	Select,
	TextField,
	Typography,
	useTheme,
} from "@material-ui/core";
import CancelIcon from "@material-ui/icons/Cancel";
import SearchIcon from "@material-ui/icons/Search";
import CreateButton from "../styled/actionBtns/create.btn";
import Api from "../../helpers/Api";
import { useDispatch, useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
	root: {
		flex: 1,
		marginLeft: "1rem",
		display: "flex",
		padding: ".5rem",
		minHeight: "8rem",
		flexWrap: "wrap",
	},
}));

function TablePaginationActions(props) {
	const theme = useTheme();
	const { count, page, rowsPerPage, onPageChange } = props;

	const handleFirstPageButtonClick = (event) => {
		onPageChange(event, 0);
	};

	const handleBackButtonClick = (event) => {
		onPageChange(event, page - 1);
	};

	const handleNextButtonClick = (event) => {
		onPageChange(event, page + 1);
	};

	const handleLastPageButtonClick = (event) => {
		onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
	};

	return (
		<Box sx={{ flexShrink: 0, ml: 2.5 }}>
			<IconButton
				onClick={handleFirstPageButtonClick}
				disabled={page === 0}
				aria-label="first page"
			>
				{theme.direction === "rtl" ? (
					<LastPageIcon />
				) : (
					<FirstPageIcon />
				)}
			</IconButton>
			<IconButton
				onClick={handleBackButtonClick}
				disabled={page === 0}
				aria-label="previous page"
			>
				{theme.direction === "rtl" ? (
					<KeyboardArrowRight />
				) : (
					<KeyboardArrowLeft />
				)}
			</IconButton>
			<IconButton
				onClick={handleNextButtonClick}
				disabled={page >= Math.ceil(count / rowsPerPage) - 1}
				aria-label="next page"
			>
				{theme.direction === "rtl" ? (
					<KeyboardArrowLeft />
				) : (
					<KeyboardArrowRight />
				)}
			</IconButton>
			<IconButton
				onClick={handleLastPageButtonClick}
				disabled={page >= Math.ceil(count / rowsPerPage) - 1}
				aria-label="last page"
			>
				{theme.direction === "rtl" ? (
					<FirstPageIcon />
				) : (
					<LastPageIcon />
				)}
			</IconButton>
		</Box>
	);
}

TablePaginationActions.propTypes = {
	count: PropTypes.number.isRequired,
	onPageChange: PropTypes.func.isRequired,
	page: PropTypes.number.isRequired,
	rowsPerPage: PropTypes.number.isRequired,
};

function padTo2Digits(num) {
	return num.toString().padStart(2, "0");
}

function formatDate(date) {
	if (date) {
		return [
			padTo2Digits(date.getDate()),
			padTo2Digits(date.getMonth() + 1),
			date.getFullYear(),
		].join("-");
	}
}

const columns = [
	{ id: "index", label: "S.No.", width: 10 },
	{ id: "Title", label: "Title", width: 70 },
	{
		id: "NumberofNodes",
		label: "Total Issues",
		width: 70,
	},
	{
		id: "CreatedBy",
		label: "Created By",
		width: 60,
	},
	{
		id: "CreatedAt",
		label: "Created At",
		width: 50,
	},
	{
		id: "Edit",
		label: "Edit",
		width: 60,
	},
	{
		id: "Delete",
		label: "Delete",
		width: 60,
	},
];

export default function IssuesContractTable(props) {
	const { projectArray, searchQuery, profileId } = props;
	const history = useHistory();
	const classes = useStyles();
	const { auth } = useSelector((state) => state);
	const user = auth?.user;
	const dispatch = useDispatch();
	const [rows, setRows] = useState([]);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [filteredRows, setFilteredRows] = useState([]);
	const [open, setOpen] = React.useState(false);
	const [deleteObj, setDeleteObj] = useState(null);

	const handleClickOpen = (obj) => {
		setDeleteObj(obj);
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
		setDeleteObj(null);
	};

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};
	const deleteContract = async () => {
		const response = await Api.post("issue/project/delete", {
			_id: deleteObj?._id,
		});
		if (response?.success) {
			history.go(0);
		} else {
			console.error("error : ", response);
		}
	};
	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};
	useEffect(() => {
		let tempRows = [];
		tempRows = projectArray.map((Obj, idx) => {
			let index = idx + 1;
			let Title = Obj?.title;
			let NumberofNodes = (Obj?.units).length;
			let CreatedBy = Obj?.user?.displayName;
			let CreatedAt = formatDate(new Date(Obj?.createdAt));
			let Edit = "Edit";
			let Delete = "Delete";
			let _id = Obj?._id;

			return {
				index,
				Title,
				NumberofNodes,
				CreatedBy,
				CreatedAt,
				Edit,
				Delete,
				_id,
			};
		});
		setRows(tempRows);
	}, [projectArray]);

	useEffect(() => {
		if (searchQuery == "") {
			setFilteredRows(rows);
			setPage(0);
		} else {
			setPage(0);
			let arr = [];
			let title = "";
			arr = rows.filter((rowObj) => {
				title = (rowObj?.Title).toLocaleLowerCase();
				return title.includes(searchQuery.toLocaleLowerCase());
			});
			setFilteredRows([...arr]);
		}
	}, [searchQuery, rows]);
	// console.log("running render");
	// console.log("rows", rows);
	// console.log("tempids", templateIds);
	return (
		<>
			{rows.length == 0 ? (
				<>
					<Typography
						align="center"
						variant="h4"
						style={{
							height: "50%",
							height: "50vh",
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						No Contracts Found. To Create Click On New Contract
					</Typography>
				</>
			) : (
				<>
					<TableContainer>
						<Table stickyHeader aria-label="sticky table">
							<TableHead>
								<TableRow>
									{columns.map((column) => (
										<TableCell
											key={column.id}
											align={"center"}
											style={
												{
													// width: column.width,
												}
											}
										>
											{column.label}
										</TableCell>
									))}
								</TableRow>
							</TableHead>
							<TableBody>
								{filteredRows
									.slice(
										page * rowsPerPage,
										page * rowsPerPage + rowsPerPage
									)
									.map((row, idx) => {
										return (
											<TableRow
												hover
												role="checkbox"
												tabIndex={-1}
												key={idx}
												onClick={() =>
													console.log("row click")
												}
												style={{ cursor: "pointer" }}
											>
												{columns.map((column, idx) => {
													const value =
														row[column.id];
													return (
														<TableCell
															key={column.id}
															align="center"
															style={{
																textTransform:
																	"capitalize",
															}}
														>
															{idx == 5 ? (
																<IconButton
																	onClick={(
																		event
																	) => {
																		event.stopPropagation();
																		history.push(
																			"/issue/timeline/" +
																				profileId +
																				"/update/" +
																				row[
																					"_id"
																				]
																		);
																	}}
																>
																	<EditIcon
																		style={{
																			color: "black",
																		}}
																	/>
																</IconButton>
															) : idx == 6 ? (
																<IconButton
																	onClick={(
																		event
																	) => {
																		event.stopPropagation();
																		handleClickOpen(
																			row
																		);
																	}}
																>
																	<DeleteIcon
																		style={{
																			color: "black",
																		}}
																	/>
																</IconButton>
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
					<TablePagination
						rowsPerPageOptions={[5, 10, 25, 100]}
						component="div"
						ActionsComponent={TablePaginationActions}
						count={filteredRows.length}
						rowsPerPage={rowsPerPage}
						page={page}
						SelectProps={{
							inputProps: {
								"aria-label": "rows per page",
							},
							native: true,
						}}
						onPageChange={handleChangePage}
						onRowsPerPageChange={handleChangeRowsPerPage}
					/>
				</>
			)}
			<Dialog
				open={open}
				onClose={handleClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">
					{`Delete ${deleteObj?.Title}?`}
				</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						Are you sure you want to delete {deleteObj?.Title}. This
						cannot be undone
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={handleClose}
						color="primary"
						variant="contained"
					>
						Cancel
					</Button>
					<Button
						onClick={deleteContract}
						color="primary"
						autoFocus
						variant="contained"
						style={{ backgroundColor: " #C7372F", color: "white" }}
					>
						Delete
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
