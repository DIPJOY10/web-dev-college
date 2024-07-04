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
import CloseIcon from "@material-ui/icons/Close";
import RadioButtonCheckedIcon from "@material-ui/icons/RadioButtonChecked";
import * as h2p from "html2plaintext";
import {
	Avatar,
	Box,
	Button,
	ButtonBase,
	Checkbox,
	CircularProgress,
	Drawer,
	IconButton,
	InputAdornment,
	InputBase,
	makeStyles,
	Popper,
	TableSortLabel,
	TextField,
	Typography,
	useMediaQuery,
	useTheme,
} from "@material-ui/core";
import { alpha } from "@material-ui/core/styles";
import VisibilityIcon from "@material-ui/icons/Visibility";
import {
	Autocomplete,
	ToggleButton,
	ToggleButtonGroup,
} from "@material-ui/lab";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import DoneIcon from "@material-ui/icons/Done";
import CancelPresentationIcon from "@material-ui/icons/CancelPresentation";
import EditIcon from "@material-ui/icons/Edit";
import IndeterminateCheckBoxIcon from "@material-ui/icons/IndeterminateCheckBox";
import IssueDialog from "./issue.table.dialog";

const useStyles = makeStyles((theme) => ({
	root: {
		flex: 1,
		marginLeft: "1rem",
		display: "flex",
		padding: ".5rem",
		minHeight: "8rem",
		flexWrap: "wrap",
	},
	avatarBox: {
		width: "2rem",
		padding: "0.7rem",
		[theme.breakpoints.down("sm")]: {
			padding: "0.3rem",
			marginRight: "0.4rem",
		},
	},
	button: {
		marginRight: "1rem",
		fontSize: 13,
		width: "100%",
		textAlign: "left",
		color: "#586069",
		fontWeight: 600,
		"&:hover,&:focus": {
			color: "#0366d6",
		},
		"& span": {
			width: "100%",
		},
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
	text: {
		flexGrow: 1,
	},
	close: {
		opacity: 0.6,
		width: 18,
		height: 18,
	},
	avatar: {
		width: "22px",
		height: "22px",
	},
	redButton: {
		backgroundColor: "#db2121",
		"&:hover": {
			backgroundColor: "rgb(173 21 21)",
		},
	},
	visuallyHidden: {
		border: 0,
		clip: "rect(0 0 0 0)",
		height: 1,
		margin: -1,
		overflow: "hidden",
		padding: 0,
		position: "absolute",
		top: 20,
		width: 1,
	},
	tableRowRoot: {
		"&$tableRowSelected, &$tableRowSelected:hover": {
			backgroundColor: "#2196f336",
		},
	},
	tableRowSelected: {
		backgroundColor: theme.palette.primary.main,
	},
}));
const columns = [
	{ id: "index", label: "Issue No.", width: 25 },
	{ id: "Title", label: "Title", width: 80 },
	{
		id: "Template",
		label: "Template",
		width: 70,
	},
	{
		id: "Assigned",
		label: "Assignees",
		width: 60,
	},
	{
		id: "CreatedBy",
		label: "Author",
		width: 60,
	},
	{
		id: "CreatedAt",
		label: "Created At",
		width: 60,
	},
];

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

function descendingComparator(a, b, orderBy) {
	if (b[orderBy] < a[orderBy]) {
		return -1;
	}
	if (b[orderBy] > a[orderBy]) {
		return 1;
	}
	return 0;
}

function getComparator(order, orderBy) {
	return order === "desc"
		? (a, b) => descendingComparator(a, b, orderBy)
		: (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
	const stabilizedThis = array.map((el, index) => [el, index]);
	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0]);
		if (order !== 0) return order;
		return a[1] - b[1];
	});
	return stabilizedThis.map((el) => el[0]);
}

function EnhancedTableHead(props) {
	const {
		classes,
		onSelectAllClick,
		order,
		orderBy,
		numSelected,
		rowCount,
		onRequestSort,
	} = props;
	const createSortHandler = (property) => (event) => {
		onRequestSort(event, property);
	};

	return (
		<TableHead>
			<TableRow>
				<TableCell
					padding="checkbox"
					align="center"
					style={{
						width: "25px",
					}}
				>
					<Checkbox
						color="primary"
						indeterminateIcon={
							<IndeterminateCheckBoxIcon color="primary" />
						}
						indeterminate={
							numSelected > 0 && numSelected < rowCount
						}
						checked={rowCount > 0 && numSelected === rowCount}
						onChange={onSelectAllClick}
						inputProps={{ "aria-label": "select all desserts" }}
					/>
				</TableCell>
				{columns.map((headCell) => (
					<TableCell
						align={"center"}
						style={{ width: headCell.width }}
						key={headCell.id}
						sortDirection={orderBy === headCell.id ? order : false}
					>
						<TableSortLabel
							active={orderBy === headCell.id}
							direction={orderBy === headCell.id ? order : "asc"}
							onClick={createSortHandler(headCell.id)}
						>
							{headCell.label}
							{orderBy === headCell.id ? (
								<span className={classes.visuallyHidden}>
									{order === "desc"
										? "sorted descending"
										: "sorted ascending"}
								</span>
							) : null}
						</TableSortLabel>
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
}

EnhancedTableHead.propTypes = {
	classes: PropTypes.object.isRequired,
	numSelected: PropTypes.number.isRequired,
	onRequestSort: PropTypes.func.isRequired,
	onSelectAllClick: PropTypes.func.isRequired,
	order: PropTypes.oneOf(["asc", "desc"]).isRequired,
	orderBy: PropTypes.string.isRequired,
	rowCount: PropTypes.number.isRequired,
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

export default function IssuesTable(props) {
	const history = useHistory();
	const {
		totalIssues,
		issueIds,
		onSelect,
		profileId,
		issueDictionary,
		templateIds,
		templateDictionary,
		searchQuery,
	} = props;
	// console.log("props = ", props);
	const classes = useStyles();
	const [issues, setIssues] = useState([]);
	const [rows, setRows] = useState([]);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [filteredRows, setFilteredRows] = useState([]);
	const [open, setOpen] = useState(false);
	const [drawerIssue, setDrawerIssue] = useState({});
	const matches = useMediaQuery("(max-width:500px)");
	//open closed issues
	const [openIssuesTab, setopenIssuesTab] = React.useState(1);
	const [openIssues, setOpenIssues] = useState([]);
	const [closedIssues, setClosedIssues] = useState([]);
	const [selectedIssues, setSelectedIssues] = useState([]);

	// popper template
	const [filteredTempRows, setFilteredTempRows] = useState([]);
	const [anchorEl, setAnchorEl] = React.useState(null);
	const [templateFilter, setTemplateFilter] = useState([]);
	const [value, setValue] = useState([]);
	const [pendingValue, setPendingValue] = React.useState([]);
	// popper assignes
	const [assignedFilter, setAssignedFilter] = useState([]);
	const [anchorEl2, setAnchorEl2] = React.useState(null);
	const [value2, setValue2] = useState([]);
	const [pendingValue2, setPendingValue2] = React.useState([]);

	//table checklist
	const [order, setOrder] = React.useState("asc");
	const [orderBy, setOrderBy] = React.useState("index");
	const [selected, setSelected] = React.useState([]);
	const [openDialogOC, setOpenDialogOC] = React.useState(false);

	const handleRequestSort = (event, property) => {
		const isAsc = orderBy === property && order === "asc";
		setOrder(isAsc ? "desc" : "asc");
		setOrderBy(property);
	};

	const handleSelectAllClick = (event) => {
		if (event.target.checked) {
			const newSelecteds = filteredRows.map((n) => n._id);
			setSelected(newSelecteds);
			return;
		}
		setSelected([]);
	};

	const handleCheckClick = (event, id) => {
		const selectedIndex = selected.indexOf(id);
		let newSelected = [];

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, id);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1));
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(
				selected.slice(0, selectedIndex),
				selected.slice(selectedIndex + 1)
			);
		}

		setSelected(newSelected);
	};
	const isSelected = (id) => selected.indexOf(id) !== -1;

	const handleClick = (event) => {
		setPendingValue(value);
		setAnchorEl(event.currentTarget);
	};
	const handleClick2 = (event) => {
		setPendingValue2(value2);
		setAnchorEl2(event.currentTarget);
	};

	const handleClose = (event, reason) => {
		if (reason === "toggleInput") {
			return;
		}
		setValue(pendingValue);
		setValue2(pendingValue2);
		if (anchorEl) {
			anchorEl.focus();
		}
		if (anchorEl2) {
			anchorEl2.focus();
		}
		setAnchorEl(null);
		setAnchorEl2(null);
	};

	const openPopper = Boolean(anchorEl);
	const openPopper2 = Boolean(anchorEl2);
	const id = openPopper ? "template-label" : undefined;

	const handleopenIssuesTab = (event, newstate) => {
		if (newstate !== null) {
			setopenIssuesTab(newstate);
		}
	};
	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};
	useEffect(() => {
		let temp = [];
		let tempOpenIssues = [];
		let tempClosedIssues = [];
		temp = issueIds.map((id) => {
			return {
				...issueDictionary[id],
				pipeline: {
					...templateDictionary[issueDictionary[id]?.template?._id]
						?.pipeline,
				},
			};
		});
		let tempFilter = templateIds.map((key) => {
			return { _id: key, title: templateDictionary[key]?.title };
		});
		temp.map((obj) => {
			if (obj?.closed) {
				tempClosedIssues.push(obj);
			} else {
				tempOpenIssues.push(obj);
			}
		});
		setTemplateFilter([...tempFilter]);
		setSelectedIssues(tempOpenIssues);
		setIssues([...temp]);
		setOpenIssues([...tempOpenIssues]);
		setClosedIssues([...tempClosedIssues]);
		// console.log("open issue = ", tempOpenIssues, tempClosedIssues);
	}, [issueIds, issueDictionary, templateDictionary]);
	// console.log("issueDict = ", issueDictionary, selectedIssues);
	useEffect(() => {
		if (openIssuesTab == 1) {
			setSelectedIssues([...openIssues]);
		} else {
			setSelectedIssues([...closedIssues]);
		}
		setPage(0);
	}, [openIssuesTab]);

	useEffect(() => {
		// console.log("called row change", selectedIssues);
		let tempRows = [];
		let assignedFiltertemp = [
			{ _id: "none", displayName: "Assigned to nobody" },
		];
		tempRows = selectedIssues.map((issue, idx) => {
			let _id = issue?._id;
			let template_id = issue?.template?._id;
			let assigned_id = [];
			let index = idx + 1;
			let Title = issue?.title || "No Title";
			let Template = issue?.template?.title;
			let tempobj = {};
			let Assigned = [];
			try {
				Assigned = issue?.assigned.map((ele) => {
					assignedFiltertemp.push({
						_id: ele?.parent?._id,
						displayName: ele?.parent?.displayName,
						displayPicture: ele?.parent?.displayPicture,
					});
					assigned_id.push(ele?.parent?._id);
					return `${ele?.parent?.displayName}`;
				});
			} catch (error) {
				Assigned = [];
			}
			for (const keys in issue?.pipeline) {
				// getting text and color for issue status
				if (issue?.pipeline[keys]?._id == issue?.status) {
					tempobj = { ...issue?.pipeline[keys] };
					break;
				}
			}
			let CurrentStatus = tempobj || "null";
			let CreatedBy = issue?.user?.displayName || "Not Available";
			let CreatedAt = formatDate(new Date(issue?.createdAt));

			return {
				index,
				Title,
				Template,
				Assigned,
				CreatedBy,
				CreatedAt,
				CurrentStatus,
				template_id,
				_id,
				assigned_id,
			};
		});
		setAssignedFilter(
			[...new Set(assignedFiltertemp.map(JSON.stringify))].map(JSON.parse)
		);
		setRows(tempRows);
		setFilteredTempRows(tempRows);
		setFilteredRows(tempRows);
	}, [selectedIssues, openIssuesTab, issueDictionary, issues]);
	console.log("issues ", issues, selectedIssues);
	console.log("filterrows", filteredRows);
	console.log("rows", rows);
	// console.log("assignees = ", assignedFilter);

	useEffect(() => {
		if (pendingValue != undefined && pendingValue.length > 0) {
			let filterIds = pendingValue.map((obj) => {
				return obj?._id;
			});
			let temp = rows.filter((obj) => {
				return filterIds.includes(obj?.template_id);
			});
			if (pendingValue2 != undefined && pendingValue2.length > 0) {
				filterIds = pendingValue2.map((obj) => {
					return obj?._id;
				});
				temp = temp.filter((obj) => {
					if (filterIds.includes("none")) {
						if ((obj?.assigned_id).length == 0) return true;
					}
					let len = 0;
					if (obj?.assigned_id != undefined) {
						len = obj?.assigned_id.length;
					}
					for (let i = 0; i < len; i = i + 1) {
						if (filterIds.includes(obj.assigned_id[i])) {
							return true;
						}
					}
					return false;
				});
			}
			// console.log("temp = ", temp);
			setFilteredTempRows([...temp]);
			setFilteredRows([...temp]);
			setPage(0);
		} else if (pendingValue2.length > 0) {
			let filterIds = pendingValue2.map((obj) => {
				return obj?._id;
			});
			let temp = rows.filter((obj) => {
				if (filterIds.includes("none")) {
					if ((obj?.assigned_id).length == 0) return true;
				}
				let len = 0;
				if (obj?.assigned_id != undefined) {
					len = obj?.assigned_id.length;
				}
				for (let i = 0; i < len; i = i + 1) {
					if (filterIds.includes(obj.assigned_id[i])) {
						return true;
					}
				}
				return false;
			});
			setFilteredTempRows([...temp]);
			setFilteredRows([...temp]);
			setPage(0);
		} else {
			setFilteredTempRows([...rows]);
			setFilteredRows([...rows]);
			setPage(0);
		}
	}, [pendingValue, pendingValue2]);

	useEffect(() => {
		if (searchQuery == "") {
			setFilteredRows(filteredTempRows);
			setPage(0);
		} else {
			setPage(0);
			{
				let arr = [];
				let title = "";
				arr = filteredTempRows.filter((rowObj) => {
					title = (rowObj?.Title).toLocaleLowerCase();
					return title.includes(searchQuery.toLocaleLowerCase());
				});
				setFilteredRows([...arr]);
			}
		}
	}, [searchQuery, rows]);

	const setDrawer = (row) => {
		let arr = [];
		arr = issues.filter((issue) => {
			return issue?._id == row?._id;
		});
		arr[0].CurrentStatus = row?.CurrentStatus;

		setDrawerIssue({ ...arr }[0]);
		setOpen(true);
	};
	const DrawerClose = () => {
		setDrawerIssue({});
		setOpen(false);
	};

	const clearAllFilter = () => {
		setFilteredTempRows([...rows]);
		setFilteredRows([...rows]);
		setPage(0);
		setPendingValue([]);
		setValue([]);
		setPendingValue2([]);
		setValue2([]);
	};

	return (
		<>
			{totalIssues == 0 ? (
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
						No Issues Found. To Create Click On New Issue
					</Typography>
				</>
			) : (
				<>
					<div>
						<div
							style={{
								display: "flex",
								border: "1px solid #ececec",
								justifyContent: "space-between",
								flexWrap: "wrap",
							}}
						>
							<div>
								{selected.length == 0 ? (
									<ToggleButtonGroup
										value={openIssuesTab}
										exclusive
										onChange={handleopenIssuesTab}
									>
										<ToggleButton
											value={1}
											style={
												openIssuesTab == 1
													? {
															color: "white",
															backgroundColor:
																"rgb(77,171,245)",
													  }
													: {}
											}
										>
											<RadioButtonCheckedIcon
												style={{
													marginRight: "0.4rem",
												}}
											/>
											{openIssues.length} Open
										</ToggleButton>
										<ToggleButton
											value={0}
											style={
												openIssuesTab == 0
													? {
															color: "white",
															backgroundColor:
																"rgb(77,171,245)",
													  }
													: {}
											}
										>
											<DoneIcon
												style={{
													marginRight: "0.4rem",
												}}
											/>
											{closedIssues.length} Closed
										</ToggleButton>
									</ToggleButtonGroup>
								) : (
									<Typography
										variant="h6"
										component="div"
										style={{
											padding: "0.9rem",
											fontSize: "1.1rem",
										}}
									>
										{selected.length} Issues Selected
									</Typography>
								)}
							</div>
							<div style={{ display: "flex" }}>
								<ButtonBase
									disableRipple
									style={
										selected.length == 0
											? {
													display: "none",
											  }
											: {}
									}
									className={classes.button}
									onClick={() => setOpenDialogOC(true)}
								>
									<span>
										{openIssuesTab == 0
											? "Mark as Open"
											: "Mark As Closed"}
									</span>
								</ButtonBase>
								<ButtonBase
									disableRipple
									className={classes.button}
									onClick={handleClick}
								>
									<span>Template</span>
									<ArrowDropDownIcon />
								</ButtonBase>
								<ButtonBase
									disableRipple
									className={classes.button}
									onClick={handleClick2}
								>
									<span>Assigned</span>
									<ArrowDropDownIcon />
								</ButtonBase>

								<Popper
									id={id}
									open={openPopper}
									anchorEl={anchorEl}
									placement="bottom-end"
									className={classes.popper}
								>
									<div className={classes.header}>
										Filter By Template
									</div>
									<Autocomplete
										open={openPopper}
										onClose={handleClose}
										multiple
										classes={{
											paper: classes.paper,
											option: classes.option,
											popperDisablePortal:
												classes.popperDisablePortal,
										}}
										value={pendingValue}
										onChange={(event, newValue) => {
											setPendingValue(newValue);
										}}
										disableCloseOnSelect
										disablePortal
										renderTags={() => null}
										noOptionsText="No Templates"
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

												<div className={classes.text}>
													{option.title}
												</div>
												<CloseIcon
													className={classes.close}
													style={{
														visibility: selected
															? "visible"
															: "hidden",
													}}
												/>
											</React.Fragment>
										)}
										options={[...templateFilter].sort(
											(a, b) => {
												// Display the selected labels first.
												let ai = value.indexOf(a);
												ai =
													ai === -1
														? value.length +
														  templateFilter.indexOf(
																a
														  )
														: ai;
												let bi = value.indexOf(b);
												bi =
													bi === -1
														? value.length +
														  templateFilter.indexOf(
																b
														  )
														: bi;
												return ai - bi;
											}
										)}
										getOptionLabel={(option) =>
											option.title
										}
										renderInput={(params) => (
											<InputBase
												ref={params.InputProps.ref}
												inputProps={params.inputProps}
												autoFocus
												className={classes.inputBase}
											/>
										)}
									/>
								</Popper>

								<Popper
									id={id}
									open={openPopper2}
									anchorEl={anchorEl2}
									placement="bottom-end"
									className={classes.popper}
								>
									<div className={classes.header}>
										Filter By Assignees
									</div>
									<Autocomplete
										open={openPopper2}
										onClose={handleClose}
										multiple
										classes={{
											paper: classes.paper,
											option: classes.option,
											popperDisablePortal:
												classes.popperDisablePortal,
										}}
										value={pendingValue2}
										onChange={(event, newValue) => {
											setPendingValue2(newValue);
										}}
										disableCloseOnSelect
										disablePortal
										renderTags={() => null}
										noOptionsText="No Assignee"
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
												<Avatar
													src={
														option?.displayPicture
															?.thumbUrl
													}
													style={{
														width: "2rem",
														height: "2rem",
														marginRight: "1rem",
													}}
												/>
												<div className={classes.text}>
													{option.displayName}
												</div>
												<CloseIcon
													className={classes.close}
													style={{
														visibility: selected
															? "visible"
															: "hidden",
													}}
												/>
											</React.Fragment>
										)}
										options={[...assignedFilter].sort(
											(a, b) => {
												// Display the selected labels first.
												let ai = value2.indexOf(a);
												ai =
													ai === -1
														? value2.length +
														  assignedFilter.indexOf(
																a
														  )
														: ai;
												let bi = value2.indexOf(b);
												bi =
													bi === -1
														? value2.length +
														  assignedFilter.indexOf(
																b
														  )
														: bi;
												return ai - bi;
											}
										)}
										getOptionLabel={(option) =>
											option.displayName
										}
										renderInput={(params) => (
											<InputBase
												ref={params.InputProps.ref}
												inputProps={params.inputProps}
												autoFocus
												className={classes.inputBase}
											/>
										)}
									/>
								</Popper>
							</div>
						</div>
						<IssueDialog
							open={openDialogOC}
							IdArr={open ? [drawerIssue?._id] : selected}
							issueDictionary={issueDictionary}
							setOpen={setOpenDialogOC}
							status={
								open ? drawerIssue?.closed : openIssuesTab == 0
							}
						/>
						<div
							style={{
								display: "flex",
							}}
						>
							{filteredTempRows.length !== rows.length ? (
								<Typography
									style={{
										color: "darkgrey",
										display: "flex",
										marginTop: "5px",
										cursor: "pointer",
									}}
									onClick={clearAllFilter}
								>
									<CancelPresentationIcon
										sx={{ paddingRight: 2 }}
									/>
									Clear All Filters.
								</Typography>
							) : null}
						</div>
					</div>

					<TableContainer>
						<Table stickyHeader aria-label="sticky table">
							<EnhancedTableHead
								classes={classes}
								numSelected={selected.length}
								order={order}
								orderBy={orderBy}
								onSelectAllClick={handleSelectAllClick}
								onRequestSort={handleRequestSort}
								rowCount={rows.length}
							/>
							<TableBody>
								{stableSort(
									filteredRows,
									getComparator(order, orderBy)
								)
									.slice(
										page * rowsPerPage,
										page * rowsPerPage + rowsPerPage
									)
									.map((row, idx) => {
										const isItemSelected = isSelected(
											row._id
										);
										const labelId = `enhanced-table-checkbox-${idx}`;
										return (
											<TableRow
												hover
												role="checkbox"
												tabIndex={-1}
												key={idx}
												color="primary"
												selected={isItemSelected}
												style={{ cursor: "pointer" }}
												onClick={() => setDrawer(row)}
												classes={{
													root: classes.tableRowRoot,
													selected:
														classes.tableRowSelected,
												}}
											>
												<TableCell
													align="center"
													padding="checkbox"
													style={{
														width: "25px",
													}}
												>
													<Checkbox
														color="primary"
														checked={isItemSelected}
														onClick={(event) => {
															event.stopPropagation();
															handleCheckClick(
																event,
																row._id
															);
														}}
														inputProps={{
															"aria-labelledby":
																labelId,
														}}
													/>
												</TableCell>
												{columns.map((column, idx) => {
													const value =
														row[column.id];
													return (
														<TableCell
															style={{
																width: column.width,
															}}
															key={column.id}
															align="center"
														>
															{
																// targeting the current status column
																idx === 2 ? (
																	<div
																		style={{
																			display:
																				"flex",
																			justifyContent:
																				"center",
																			flexWrap:
																				"wrap",
																		}}
																	>
																		<div
																			style={{
																				width: "100%",
																			}}
																		>
																			{
																				value
																			}
																		</div>
																		<div
																			style={{
																				width: "max-content",
																				backgroundColor:
																					row
																						?.CurrentStatus
																						?.color,
																				borderRadius:
																					"15px",
																				margin: "0.5rem",
																				padding:
																					"0.1rem 0.4rem 0.1rem 0.4rem",
																			}}
																		>
																			{
																				row
																					?.CurrentStatus
																					?.text
																			}
																		</div>
																	</div>
																) : idx == 3 ? (
																	value.length >
																	0 ? (
																		value.join()
																	) : (
																		"No Assignee"
																	)
																) : (
																	value
																)
															}
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
					<React.Fragment>
						<Drawer
							anchor={"right"}
							open={open}
							onClose={DrawerClose}
						>
							<div
								style={
									matches
										? {
												width: "80vw",
												height: "100vh",
										  }
										: {
												width: "40vw",
												height: "100vh",
										  }
								}
							>
								{Object.keys(drawerIssue).length == 0 ? (
									<CircularProgress />
								) : (
									<React.Fragment>
										<Paper
											variant="outlined"
											style={{
												display: "flex",
												justifyContent: "space-between",
												height: "4rem",
												alignItems: "center",
											}}
										>
											<Typography
												variant="h5"
												style={{
													margin: "1rem",
													textDecoration: "capataize",
												}}
											>
												{drawerIssue?.title}
											</Typography>
											<CloseIcon
												onClick={() => setOpen(false)}
												style={{
													cursor: "pointer",
												}}
											/>
										</Paper>
										<TableContainer
											style={{ marginTop: "10%" }}
										>
											<Table align="center">
												{/* <TableHead>
													<TableRow>
														<TableCell>
															Title
														</TableCell>
														<TableCell>
															Values
														</TableCell>
													</TableRow>
												</TableHead> */}
												<TableBody>
													<TableRow>
														<TableCell>
															Description
														</TableCell>
														<TableCell>
															{drawerIssue?.description ==
															""
																? "---"
																: h2p(
																		drawerIssue?.description
																  )}
														</TableCell>
													</TableRow>
													<TableRow>
														<TableCell>
															Status
														</TableCell>
														<TableCell>
															{drawerIssue?.closed ? (
																<div
																	style={{
																		display:
																			"flex",
																		justifyContent:
																			"space-between",
																	}}
																>
																	<div
																		style={{
																			display:
																				"flex",
																			alignItems:
																				"center",
																		}}
																	>
																		<RadioButtonCheckedIcon
																			style={{
																				color: "red",
																			}}
																		/>
																		&nbsp;&nbsp;Closed
																	</div>
																	<div>
																		<Button
																			onClick={() =>
																				setOpenDialogOC(
																					true
																				)
																			}
																			startIcon={
																				<DoneIcon />
																			}
																			color={
																				"primary"
																			}
																			variant="contained"
																		>
																			Open
																			Issue
																		</Button>
																	</div>
																</div>
															) : (
																<div
																	style={{
																		display:
																			"flex",
																		justifyContent:
																			"space-between",
																	}}
																>
																	<div
																		style={{
																			display:
																				"flex",
																			alignItems:
																				"center",
																		}}
																	>
																		<RadioButtonCheckedIcon
																			style={{
																				color: "lightgreen",
																			}}
																		/>
																		&nbsp;&nbsp;
																		Open
																	</div>
																	<div>
																		<div>
																			<Button
																				onClick={() =>
																					setOpenDialogOC(
																						true
																					)
																				}
																				startIcon={
																					<DoneIcon />
																				}
																				color={
																					"primary"
																				}
																				variant="contained"
																			>
																				Close
																				Issue
																			</Button>
																		</div>
																	</div>
																</div>
															)}
														</TableCell>
													</TableRow>

													<TableRow>
														<TableCell>
															Author
														</TableCell>
														<TableCell>
															<div
																style={{
																	display:
																		"flex",
																	alignItems:
																		"center",
																}}
															>
																<Avatar
																	className={
																		classes.avatar
																	}
																	alt={
																		drawerIssue
																			?.user
																			?.displayName
																	}
																	src={
																		drawerIssue
																			?.user
																			?.displayPicture
																			?.thumbUrl
																	}
																/>

																<Typography>
																	{
																		drawerIssue
																			?.user
																			?.displayName
																	}
																</Typography>
															</div>
														</TableCell>
													</TableRow>
													<TableRow>
														<TableCell>
															Current State
														</TableCell>
														<TableCell>
															{
																drawerIssue
																	?.CurrentStatus
																	?.text
															}
														</TableCell>
													</TableRow>
													<TableRow>
														<TableCell>
															Comments
														</TableCell>
														<TableCell>
															{
																(drawerIssue
																	?.comments)
																	.length
															}
														</TableCell>
													</TableRow>
													<TableRow>
														<TableCell>
															Assigned
														</TableCell>
														<TableCell>
															<div
																style={{
																	display:
																		"flex",
																	gap: "7px",
																	flexWrap:
																		"wrap",
																}}
															>
																{(drawerIssue
																	?.assigned)
																	.length > 0
																	? (drawerIssue?.assigned).map(
																			(
																				ele
																			) => (
																				<div
																					style={{
																						display:
																							"flex",
																						alignItems:
																							"center",
																						gap: "3px",
																					}}
																				>
																					<Avatar
																						className={
																							classes.avatar
																						}
																						src={
																							ele
																								?.parent
																								?.displayPicture
																								?.thumbUrl
																						}
																						alt={
																							ele
																								?.parent
																								?.displayName
																						}
																					/>
																					{
																						ele
																							?.parent
																							?.displayName
																					}
																				</div>
																			)
																	  )
																	: "No assignee"}
															</div>
														</TableCell>
													</TableRow>
													<TableRow>
														<TableCell>
															Shared
														</TableCell>
														<TableCell>
															<div
																style={{
																	display:
																		"flex",
																	gap: "7px",
																	flexWrap:
																		"wrap",
																}}
															>
																{(drawerIssue?.shared).map(
																	(ele) => (
																		<div
																			style={{
																				display:
																					"flex",
																				alignItems:
																					"center",
																				gap: "3px",
																			}}
																		>
																			<Avatar
																				className={
																					classes.avatar
																				}
																				src={
																					ele
																						?.parent
																						?.displayPicture
																						?.thumbUrl
																				}
																				alt={
																					ele
																						?.parent
																						?.displayName
																				}
																			/>
																			{
																				ele
																					?.parent
																					?.displayName
																			}
																		</div>
																	)
																)}
															</div>
														</TableCell>
													</TableRow>
												</TableBody>
											</Table>
										</TableContainer>
									</React.Fragment>
								)}
								<div
									style={{
										display: "flex",
										width: "90%",
										margin: "5%",
										gap: "5px",
									}}
								>
									<Button
										onClick={() => {
											if (onSelect) {
												// onSelect(issue);
											} else {
												history.push(
													"/issue/view/" +
														drawerIssue?._id
												);
											}
										}}
										variant={"contained"}
										style={{ width: "50%" }}
										color="primary"
										startIcon={<VisibilityIcon />}
									>
										View Issue
									</Button>
									<Button
										onClick={() => {
											if (onSelect) {
												// onSelect(issue);
											} else {
												history.push(
													"/issue/edit/" +
														drawerIssue?._id
												);
											}
										}}
										variant={"contained"}
										style={{ width: "50%" }}
										color="secondary"
										startIcon={<EditIcon />}
									>
										Edit Issue
									</Button>
								</div>
							</div>
						</Drawer>
					</React.Fragment>
				</>
			)}
		</>
	);
}
