import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles, styled } from "@material-ui/core/styles";
import { useHistory, useLocation } from "react-router-dom";
import { connect } from "react-redux";
import {
	Button,
	CircularProgress,
	Dialog,
	DialogContent,
	DialogTitle,
	Divider,
	Grid,
	InputAdornment,
	TextField,
	Typography,
} from "@material-ui/core";
import AssignmentIcon from "@material-ui/icons/Assignment";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import clsx from "clsx";
import Api from "../../helpers/Api";
import _ from "lodash";
import CancelIcon from "@material-ui/icons/Cancel";
import SearchIcon from "@material-ui/icons/Search";
import IssueTemplateCard from "./issue.template.card";
import CreateButton from "../styled/actionBtns/create.btn";
import IssuesTemplateTable from "./issue.template.table";
import CloseIcon from "@material-ui/icons/Close";
import IssueTemplateViewManager from "./issue.template.view.manager";
import useGetTemplates from "./useGetTemplates";
import TemplateCardList from "./template.cardList";
import configObject from "../../config";
import TableChartIcon from "@material-ui/icons/TableChart";
import DashboardIcon from "@material-ui/icons/Dashboard";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import useProfileIssueData from "./useProfileIssueData";
import IssuesTable from "./issue.table";
import useGetProfile from "../profile/useGetProfile";
import SelectTemplate from "./select.template.dialog";

const useStyles = makeStyles((theme) => ({
	root: {
		flex: "1",
		display: "flex",
		padding: "1rem",
		paddingTop: "0",
		minHeight: "8rem",
		textAlign: "right",
		marginLeft: "1rem",
		flexDirection: "column",
	},

	row: {
		flex: 1,
		display: "flex",
		flexDirection: "row",
	},

	rowDiv: {
		flex: 1,
		display: "flex",
		flexDirection: "row",
		maxWidth: "44rem",
		flexWrap: "wrap",
	},
}));
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

function IssueTemplateList(props) {
	const classes = useStyles();
	const {
		profileId,
		templateIds,
		templateDictionary,
		setTemplateIds,
		setTemplateDictionary,
		issueIds,
		setIssueIds,
		issueDictionary,
		setIssueDictionary,
		loading,
		totalIssues,
	} = props;

	const [openChoose, setOpenChoose] = useState(false)

	// console.log("template list : ", props);
	const { auth } = useSelector((state) => state);
	const user = auth?.user;
	const dispatch = useDispatch();
	// const { profileId } = useParams();
	const history = useHistory();
	const [currentTemplateId, setCurrentTemplateId] = useState(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [open, setOpen] = React.useState(false);
	const [toggleButtonValue, setToggleButtonValue] = useState("list"); // table or list
	const [grouped, setGrouped] = useState({})
	const [filterIssueIds, setFilterIssueIds] = useState([...issueIds]);
	const profile = useGetProfile(profileId);

	useEffect(() => {
		setFilterIssueIds([...issueIds]);
		const issues = issueIds.map(issueId => issueDictionary[issueId]);

		let gr = _.groupBy(issues, function (i) {
			return i?.template?._id;
		})
		setGrouped(gr)

	}, [issueIds, issueDictionary]);


	const handleClickOpen = (id) => {
		setCurrentTemplateId(id);
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
		setCurrentTemplateId(null);
		history.go(0);
	};

	// console.log(profileId, " is the profileId in issueTemplateList");
	const createIssue = () => {
		var path = "/issues/create/" + profileId + "/new";
		history.push(path);
	};

	const createTemplate = async () => {
		const res = await Api.post("issue/template/create", {
			profile: profileId,
			shared: [profileId],
			managers: [user?.profile],
		});

		const data = res?.data;
		if (data?._id) {
			dispatch({
				type: "AddApiAlert",
				payload: {
					success: true,
					message: "Template created successfully",
				},
			});
			// handleClickOpen(data?._id);
			var path = "/issue/template/" + data?._id + "/edit";
			history.push(path);
		} else {
			dispatch({
				type: "AddApiAlert",
				payload: {
					success: false,
					message: "Template create failed",
				},
			});
		}
	};

	const onDelete = async (templateId) => {
		console.log("onDelete called");
		const res = await Api.post("issue/template/delete", {
			templateId: templateId,
		});

		if (res?.data) {
			if (res?.data?.delete) {
				const newTempIds = _.pull(templateIds, templateId);
				console.log(
					"newTempIds is ",
					newTempIds.length,
					templateIds.length
				);
				setTemplateIds(newTempIds);
				dispatch({
					type: "AddApiAlert",
					payload: {
						success: true,
						message: "Template deleted successfully",
					},
				});
			} else {
				// if not deleted then
				console.error(res);
			}
		}
	};
	return (
		<div className={classes.root}>
			<div>
				<div style={{ display: "flex", marginBottom: "1rem", alignItems: "center" }}>
					<TextField
						label="Search"
						placeholder="Search By Title"
						type="text"
						variant="outlined"
						margin="normal"
						style={{ flexBasis: "80%" }}
						onChange={(e) => setSearchQuery(e.target.value)}
						value={searchQuery}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<SearchIcon />
								</InputAdornment>
							),
							endAdornment: searchQuery && (
								<IconButton onClick={() => setSearchQuery("")}>
									<CancelIcon />
								</IconButton>
							),
						}}
					/>
					<CreateButton
						style={{ flexBasis: "20%" }}
						startIcon={<AddIcon />}
						onClick={() => {
							createTemplate();
						}}
					>
						Template
					</CreateButton>

					<SelectTemplate
						templateIds={templateIds}
						templateDictionary={templateDictionary}
						profile={profile}
					/>
				</div>
				{/* <div>
					<ToggleButtonGroup
						value={toggleButtonValue}
						exclusive
						onChange={(event, newValue) => {
							if (newValue != null) {
								setToggleButtonValue(newValue);
							}
						}}
					>
						<ToggleButtonPrimary value="table" color="primary">
							<TableChartIcon />
						</ToggleButtonPrimary>
						<ToggleButtonPrimary value="list">
							<DashboardIcon />
						</ToggleButtonPrimary>
					</ToggleButtonGroup>
				</div> */}


				<TemplateCardList
					templateIds={templateIds}
					templateDictionary={templateDictionary}
					setTemplateIds={setTemplateIds}
					setTemplateDictionary={setTemplateDictionary}
					onDelete={onDelete}
					issueIds={filterIssueIds}
					issueDictionary={issueDictionary}
					grouped={grouped}
					profileId={profileId}
				/>

				<IssuesTable
					totalIssues={totalIssues}
					issueIds={filterIssueIds}
					issueDictionary={issueDictionary}
					profileId={profileId}
					profile={profile}
					templateIds={templateIds}
					templateDictionary={templateDictionary}
					searchQuery={searchQuery}
				/>


				{/* <Dialog
					open={open}
					onClose={handleClose}
					maxWidth={"md"}

				>
					<DialogTitle style={{ margin: "2%", padding: "0px 9px" }}>
						<Grid
							container
							justifyContent="space-between"
							alignItems="center"
						>
							<Typography variant="h6">Edit Template</Typography>
							<CloseIcon
								onClick={handleClose}
								style={{ cursor: "pointer" }}
							/>
						</Grid>
					</DialogTitle>
					<DialogContent>
						<IssueTemplateViewManager
							handleClose={handleClose}
							templateId={currentTemplateId}
						/>
					</DialogContent>
				</Dialog> */}
			</div>
		</div>
	);
}

export default IssueTemplateList;
