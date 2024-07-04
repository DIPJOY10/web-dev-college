import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory, useLocation } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import ButtonBase from "@material-ui/core/ButtonBase";
import moment from "moment";
import {
	Box,
	Drawer,
	IconButton,
	LinearProgress,
	Menu,
	MenuItem,
	Typography,
} from "@material-ui/core";

import clsx from "clsx";
import IssueSvg from "../../Assets/issue.svg";

import Api from "../../helpers/Api";
import IssueItemCard from "../profile/cards/issue.item.card";
import ListPaperCard from "./list.item.card";
import ListShowAll from "./list.showAll";
import MoreVertIcon from "@material-ui/icons/MoreVert";
const useStyles = makeStyles((theme) => ({
	root: {
		flex: 1,
		marginLeft: "1rem",
		width: "16rem",
		maxWidth: "16rem",
		minWidth: "16rem",
		display: "flex",
		padding: "0.7rem",
		flexDirection: "column",
		minHeight: "8rem",
		marginTop: "1rem",
		textAlign: "center",
		cursor: "pointer",
		borderRadius: "5px",
		boxShadow: "none",
		border: '1px solid rgba(27,31,35,.15)',
	},

	svgSize: {
		display: "flex",
		height: "30px",
		width: "30px",
	},

	header: {
		textAlign: "center",
	},

	row: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
	},

	column: {
		display: "flex",
		flexDirection: "column",
	},

	topRow: {
		marginBottom: "1rem",
	},

	title: {
		marginLeft: "1rem",
		fontWeight: "700",
	},

	createBtn: {
		paddingLeft: "1rem",
		padding: "0.5rem",
		paddingTop: "0.25rem",
		paddingBottom: "0.25rem",
	},

	createBtnPaper: {
		marginLeft: "2rem",
		alignSelf: "flex-end",
	},
	expand: {
		fontWeight: "bold",
		"&:hover": {
			textDecoration: "underline",
		},
	},
}));

export default function ListCard(props) {
	const classes = useStyles();
	const { templateId, title, onDelete, issueIds, issueDictionary } = props;

	const history = useHistory();
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState(null);
	const [open, setOpen] = useState(false);
	const [anchorEl, setAnchorEl] = React.useState(null);

	const handleClose = (e) => {
		e.stopPropagation();
		setAnchorEl(null);
	};

	useEffect(() => {
		const issues = issueIds.map(issueId => issueDictionary[issueId]);
		setData(issues);
	}, [issueIds.length])


	const getData = async () => {
		// await Api.post("/issue/template/getDataFromList", {
		// 	listId: templateId,
		// }).then((res) => {
		// 	console.log(res, "Data from list");
		// 	setData(res);
		// });
		// setLoading(false);
	};

	const handleMenu = (e) => {
		e.stopPropagation();
		setAnchorEl(e.currentTarget);
	};
	useEffect(() => {
		getData();
	}, [templateId]);
	return (
		<Paper
			className={classes.root}
			square
		// onClick={() => {
		// 	let path = "/issue/template/" + templateId + "/view";
		// 	history.push(path);
		// }}
		>
			<div className={clsx(classes.row, classes.topRow)}>
				<Box display={"flex"} alignItems="center" justifyContent={"space-between"} width="100%">
					<img className={classes.svgSize} src={IssueSvg} />
					<Typography className={classes.title}>
						{title || "Untitled"}
					</Typography>
					<IconButton size="small" onClick={handleMenu}>
						<MoreVertIcon />
					</IconButton>
				</Box>
				<Menu
					id="simple-menu"
					anchorEl={anchorEl}
					keepMounted
					open={Boolean(anchorEl)}
					onClose={handleClose}
				>
					<MenuItem
						onClick={(e) => {
							e.stopPropagation();
							history.push(`/issue/template/${templateId}/edit`);
						}}
					>
						Edit
					</MenuItem>
					<MenuItem onClick={() => { onDelete(templateId) }}>Delete</MenuItem>
				</Menu>
			</div>

			{loading ? (
				<LinearProgress loading={loading} />
			) : (
				<>
					{data?.length > 0 ? (
						<ButtonBase
							className={classes.column}
							onClick={() => {
								let path = "/issue/template/" + templateId + "/view";
								history.push(path);
							}}
						>
							<>
								{data?.slice(0, 2).map((dataItem) => {
									return (
										<ListPaperCard
											data={dataItem}
										// size={"xs"}
										/>
									);
								})}
							</>
						</ButtonBase>
					) : (

						<Typography variant="body2" style={{ textAlign: "center", fontSize: "14px" }} component="p">
							No data attached with the list
						</Typography>
					)}
				</>
			)}
			{data?.length > 2 ? (
				<Box style={{ padding: "1vh 0 0 0" }} textAlign="left">
					<Typography
						variant="caption"
						color="primary"
						className={classes.expand}
						onClick={() => {
							setOpen(true);
						}}
					>
						Show All ({data?.length - 2})
					</Typography>
				</Box>
			) : null}

			<Drawer anchor={"right"} open={open} onClose={() => setOpen(false)}>
				<ListShowAll data={data} setOpen={setOpen} />
			</Drawer>
		</Paper>
	);
}
