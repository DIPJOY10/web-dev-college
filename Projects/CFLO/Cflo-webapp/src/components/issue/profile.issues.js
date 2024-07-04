import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import EditIcon from "@material-ui/icons/Edit";
import { Box, Tabs, Tab } from "@material-ui/core";
import PropTypes from "prop-types";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Api from "../../helpers/Api";
import _ from "lodash";
import CreateButton from "../styled/actionBtns/create.btn";
import arrayToReducer from "../../helpers/arrayToReducer";
import IssueList from "./issue.list";
import IssueTemplateList from "./issue.template.list";
import ProfileAppbar from "../profile/profile.appbar";
import useProfileIssueData from "./useProfileIssueData";
import useGetProfile from "../profile/useGetProfile";
import useGetTemplates from "./useGetTemplates";
import CancelIcon from "@material-ui/icons/Cancel";
import SearchIcon from "@material-ui/icons/Search";
import { Loadinglogo } from "../../helpers/loadinglogo";
import IssueContractList from "./issue.contract.list";
import useGetProject from "./useGetProject";
import YoutubeTuts from "../youtubeTuts";
import IssueSvg from "../../Assets/issue.svg";



function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`full-width-tabpanel-${index}`}
			aria-labelledby={`full-width-tab-${index}`}
			{...other}
		>
			{value === index && <Box p={1}>{children}</Box>}
		</div>
	);
}

TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.any.isRequired,
	value: PropTypes.any.isRequired,
};
function a11yProps(index) {
	return {
		id: `full-width-tab-${index}`,
		"aria-controls": `full-width-tabpanel-${index}`,
	};
}

const useStyles = makeStyles((theme) => ({
	root: {
		backgroundColor: theme.palette.background.paper,
		width: "100%",
		// marginTop: "3.7rem",
	},
	row: {
		flex: "1",
		display: "flex",
	},
}));

export default function ProfileIssues(props) {
	const classes = useStyles();
	const { profileId } = useParams();
	const history = useHistory();
	const dispatch = useDispatch();
	const { auth } = useSelector((state) => state);
	const user = auth?.user;
	const [value, setValue] = React.useState(1);

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	const handleChangeIndex = (index) => {
		setValue(index);
	};

	const profile = useGetProfile(profileId);
	const {
		templateIds,
		setTemplateIds,
		templateDictionary,
		setTemplateDictionary,
	} = useGetTemplates(profileId);
	const {
		issueIds,
		setIssueIds,
		issueDictionary,
		setIssueDictionary,
		loading,
		totalIssues,
	} = useProfileIssueData(profileId);
	// const { loading: LoadingContract, projectArray } = useGetProject(profileId);
	console.log("issues = ", issueDictionary);

	return (
		<div>
			{/* <ProfileAppbar
				profile={profile}
				name={"WorkFlow & Issues "}
				btns={
					<div style={{ marginRight: "2vw" }}>
						<YoutubeTuts
							name={"Workflow"}
							dialogTitle={"Project Management"}
						/>
					</div>
				}
			/> */}
			<div>
				<div>
					{loading ?(
						<Loadinglogo />
					) : (
						<div className={classes.root}>
							<Box sx={{ width: "100%" }}>
								<div style={{ padding: "1rem 3rem" }}>
									<div
										style={{
											display: "flex",
											gap: "7px",
											marginBottom: "16px",
										}}
									>
										<img
											src={IssueSvg}
											style={{ width: "3rem" }}
										/>
										<Typography
											variant="h3"
											style={{ fontWeight: "600" }}
										>
											Project Management
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
										Create template to manage any process.
									</Typography>
									<Typography
										style={{
											fontSize: "1.06rem",
											fontFamily: "Inter",
											fontWeight: "500",
											lineHeight: "1.5",
										}}
									>
										Template contains form (similar to google form) and
										sharing/ notification settings
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
											+ New
										</span>{" "}
										to create a new{" "}
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
											{value == 0
												? "Task Map"
												: value == 1
												? "Template"
												: "Issue"}
										</span>{" "}
										directly for this project.
									</div>
								</div>
								{/* <Tabs
									value={value}
									onChange={handleChange}
									indicatorColor="primary"
									textColor="primary"
									variant="fullWidth"
									aria-label="full width tabs example"
									style={{ backgroundColor: "white" }}
								>
							
									<Tab
										label=""
										value={1}
										{...a11yProps(1)}
									/>
							
								</Tabs> */}

								{/* <TabPanel value={value} index={2}>
									<IssueList
										loading={loading}
										profile={profile}
										profileId={profileId}
										totalIssues={totalIssues}
										templateIds={templateIds}
										templateDictionary={templateDictionary}
										issueIds={issueIds}
										issueDictionary={issueDictionary}
									/>
								</TabPanel> */}

								<TabPanel value={value} index={1}>
									<IssueTemplateList
										profileId={profileId}
										templateIds={templateIds}
										templateDictionary={templateDictionary}
										setTemplateIds={setTemplateIds}
										setTemplateDictionary={
											setTemplateDictionary
										}
										issueIds={issueIds}
										setIssueIds={setIssueIds}
										issueDictionary={issueDictionary}
										setIssueDictionary={setIssueDictionary}
										loading={loading}
										totalIssues={totalIssues}
									/>
								</TabPanel>
								{/* <TabPanel value={value} index={0}>
									<IssueContractList
										profileId={profileId}
										projectArray={projectArray}
									/>
								</TabPanel> */}
							</Box>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
