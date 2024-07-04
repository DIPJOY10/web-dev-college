import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Api from "../../helpers/Api";

import { useParams, useHistory } from "react-router-dom";
import {
	CircularProgress,
	Grid,
	Paper,
	TextField,
	Typography,
} from "@material-ui/core";
import ProfileAppbar from "../profile/profile.appbar";
import ListPaperCard from "./list.item.card";
import Kanban from "../styled/Kanban/Kanban";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import DoneIcon from "@material-ui/icons/Done";
import TableChartIcon from "@material-ui/icons/TableChart";
import DashboardIcon from "@material-ui/icons/Dashboard";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import styled from "styled-components";
import RateReviewIcon from "@material-ui/icons/RateReview";
import IssueTemplateViewTable from "./issue.template.view.table";
import IssuesTable from "./issue.table";
import arrayToReducer from "../../helpers/arrayToReducer";
const ToggleButtonPrimary = styled(ToggleButton)({
	"&.Mui-selected": {
		color: "white",
		backgroundColor: "rgb(77, 171, 245)",
	},
	"&.Mui-selected:hover": {
		color: "white",
		backgroundColor: "#2196f3 !important",
	},
});
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
		// marginTop: "4rem",
		// width: "90%",
	},
	center: {
		display: "flex",
		justifyContent: "center",
		minHeight: "80vh",
		alignItems: "center",
	},
	text: {
		fontSize: "1.3rem",
		fontWeight: "600",
		margin: "0rem 1rem",
	},
}));

function IssueTemplateView() {
	const history = useHistory();
	const classes = useStyles();
	const { templateId } = useParams();
	const {} = classes;
	const [template, setTemplate] = useState(null);
	const [issues, setIssues] = useState([]);
	const [loading, setLoading] = useState(true);
	const [columns, setColumns] = useState([]);
	const [finalStates, setFinalState] = useState([]);
	const [originalIssues, setOriginalIssues] = useState([]);
	const [toggleButtonValue, setToggleButtonValue] = useState("list");
	const [updateStatus, setUpdateStatus] = useState(null);
	const [searchQuery, setSeachQuery] = useState("");
	const [tableIssueIds, setTableIssueIds] = useState([]);
	const [tableIssueDict, setTableIssueDict] = useState({});

	const getData = async () => {
		try {
			const res = await Api.post("issue/template/getTemplateDetail", {
				template: templateId,
			});
			if (res?.data) {
				const { template, issues } = res?.data;
				setTemplate(template);
				const resIssues = issues?.length >0 ? issues :[]
				setOriginalIssues(resIssues);
			}

			setLoading(false);
		} catch (error) {
			console.log(error);
		}
	};
	const updateIssue = async (issueId, status, closed) => {
		try {
			setUpdateStatus("loading");
			const res = await Api.post("issue/updateFromKanban", {
				issueId: issueId,
				status: status,
				closed: closed,
			});
			console.log("res=", res);
			if (res?.success) {
				setUpdateStatus("success");
			} else {
				console.error(res?.error);
				setUpdateStatus("error");
			}
		} catch (error) {
			console.error(error);
			setUpdateStatus("error");
		}
	};
	const onDragEnd = (result, columns, setColumns) => {
		if (!result.destination) return;
		const { source, destination } = result;
		if (source.droppableId !== destination.droppableId) {
			const sourceColumn = columns[source.droppableId];
			const destColumn = columns[destination.droppableId];
			const sourceItems = [...sourceColumn.items];
			const destItems = [...destColumn.items];
			const [removed] = sourceItems.splice(source.index, 1);
			destItems.splice(destination.index, 0, removed);
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
			// issue id : removed?._id, status: destination.droppableId, closed: finalStates.includes(destination.dropableId)
			updateIssue(
				removed?._id,
				destination.droppableId,
				finalStates.includes(destination.droppableId)
			);
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
		if (templateId) {
			getData();
		}
	}, [templateId]);

	useEffect(() => {
		setIssues([...originalIssues]);
		const { newDict, idArr } = arrayToReducer(originalIssues);
		setTableIssueIds(idArr);
		setTableIssueDict(newDict);
	}, [originalIssues]);

	useEffect(() => {
		if (searchQuery) {
			let temp = originalIssues.filter((issue) => {
				let title = (issue?.title).toLocaleLowerCase();
				return title.includes(searchQuery.toLocaleLowerCase());
			});
			setIssues([...temp]);
		} else {
			setIssues([...originalIssues]);
		}
	}, [searchQuery]);

	useEffect(() => {
		let pipeline = {};
		let keys = (template?.pipeline || []).map((obj) => {
			pipeline[obj?._id] = {
				_id: obj?._id,
				title: obj?.text,
				color: obj?.color,
			};
			return obj?._id;
		});
		let cols = {};

		keys.forEach((element) => {
			cols[element] = [];
		});
		for (let i = 0; i < issues.length; i++) {
			let status = issues[i]?.status;
			cols[status] = [...cols[status], issues[i]];
		}
		let colsData = {};
		keys.map((statusId, idx) => {
			let obj = {
				chipTitle: {
					title: pipeline[statusId]?.title,
					backgroundColor: pipeline[statusId]?.color,
					color: getContrast(pipeline[statusId]?.color),
				},
				title: pipeline[statusId]?.title,
				items: cols[statusId].map((issue) => {
					let tempObj = {
						_id: issue?._id,
						content: <ListPaperCard data={issue} size={"xs"} />,
					};
					return tempObj;
				}),
			};

			colsData[statusId] = obj;
		});
		setColumns(colsData);
		setFinalState(template?.finalStates);
	}, [issues, template]);
	return (
		<div className={classes.root}>
			{loading ? (
				<div className={classes.center}>
					<CircularProgress />
				</div>
			) : (
				<>
					{template?._id ? (
						<div className={classes.root}>
							<Paper style={{ padding: "0 2rem" }}>
								<div style={{ padding: "1rem 0" }}>
									<div
										style={{
											display: "flex",
											gap: "7px",
											alignItems: "center",
											marginBottom: "16px",
										}}
									>
										<RateReviewIcon
											style={{
												width: "2.5rem",
												height: "2.5rem",
											}}
										/>
										<Typography
											variant="h3"
											style={{ fontWeight: "600" }}
										>
											{template?.title || "View Template"}
										</Typography>
									</div>
									<Typography
										style={{
											fontSize: "1.06rem",
											fontFamily: "Inter",
											fontWeight: "500",
											lineHeight: "1.5",
										}}
									>
										Some info ........................
									</Typography>
									<Typography
										style={{
											fontSize: "1.06rem",
											fontFamily: "Inter",
											fontWeight: "500",
											lineHeight: "1.5",
										}}
									>
										Add states and form questions for your
										issues.
									</Typography>
									<Typography
										style={{
											fontSize: "1.06rem",
											fontFamily: "Inter",
											fontWeight: "500",
											lineHeight: "1.5",
										}}
									>
										Some info ...svsv
									</Typography>
									<div
										style={{
											fontSize: "1.06rem",
											fontFamily: "Inter",
											fontWeight: "500",
											lineHeight: "1.5",
										}}
									>
										Click{" "}
										<span
											style={{
												backgroundColor:
													"rgba(135,131,120,0.15)",
												color: "#EB5757",
												fontSize: "1.06rem",
												fontFamily: "Inter",
												fontWeight: "500",
												lineHeight: "1.5",
											}}
										>
											Save
										</span>{" "}
										to save your changes.
									</div>
								</div>
								<Grid container spacing={2}>
									<Grid item xs={12}>
										<Typography
											variant="h4"
											className={classes.text}
										>
											Issues
										</Typography>
									</Grid>
									<Grid item xs={12}>
										{updateStatus ? (
											updateStatus == "loading" ? (
												<div
													style={{
														display: "flex",
														justifyContent:
															"flex-end",
														alignItems: "center",
														paddingRight: "2rem",
													}}
												>
													<CircularProgress
														style={{
															width: "14px",
															height: "14px",
														}}
													/>
													Updating...
												</div>
											) : updateStatus == "success" ? (
												<div
													style={{
														display: "flex",
														justifyContent:
															"flex-end",
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
													Changes are saved
												</div>
											) : (
												<div
													style={{
														display: "flex",
														justifyContent:
															"flex-end",
														alignItems: "center",
														gap: "2px",
													}}
												>
													<ErrorOutlineIcon
														style={{
															color: "red",
															width: "14px",
															height: "14px",
															gap: "2px",
														}}
													/>
													Error in saving changes
												</div>
											)
										) : null}
									</Grid>
									<Grid item xs={12}>
										<div style={{ padding: "1rem" }}>
											<TextField
												variant="outlined"
												label="Search Bar"
												placeholder="Filter Issues by Title"
												fullWidth
												value={searchQuery}
												onChange={(e) =>
													setSeachQuery(
														e.target.value
													)
												}
											/>
										</div>
									</Grid>
									<Grid item xs={12}>
										<div
											style={{
												display: "flex",
												justifyContent: "flex-end",
											}}
										>
											<ToggleButtonGroup
												value={toggleButtonValue}
												exclusive
												onChange={(event, newValue) => {
													if (newValue != null) {
														setToggleButtonValue(
															newValue
														);
													}
												}}
											>
												<ToggleButtonPrimary
													value="table"
													color="primary"
												>
													<TableChartIcon />
												</ToggleButtonPrimary>
												<ToggleButtonPrimary value="list">
													<DashboardIcon />
												</ToggleButtonPrimary>
											</ToggleButtonGroup>
										</div>
									</Grid>
									<Grid item xs={12}>
										{toggleButtonValue == "table" ? (
											<IssuesTable
												totalIssues={
													originalIssues.length
												}
												issueIds={tableIssueIds}
												issueDictionary={tableIssueDict}
												// profileId={profileId}
												// profile={profile}
												templateIds={[template?._id]}
												templateDictionary={template}
												searchQuery={searchQuery}
											/>
										) : (
											<Kanban
												columns={columns}
												containerStyles={
													{
														// overflowX: "scroll",
													}
												}
												allColumnStyles={{
													gap: "17px",
													overflowX: "scroll",
												}}
												setColumns={setColumns}
												onDragEnd={onDragEnd}
												dragDirection="vertical"
												columnStyles={{
													minHeight: "56vh",
												}}
												// chipTitle={true}
												itemStyles={{
													display: "flex",
													flexDirection: "column",
												}}
											/>
										)}
									</Grid>
								</Grid>
							</Paper>
						</div>
					) : null}
				</>
			)}
		</div>
	);
}

export default IssueTemplateView;
