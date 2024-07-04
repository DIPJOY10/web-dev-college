import {
	Breadcrumbs,
	Button,
	CircularProgress,
	List,
	makeStyles,
	Typography,
} from "@material-ui/core";
import EntityListItemByID from "../../share/list.item.byID";
import SearchBar from "../../share/searchbar";
import EntityListItem from "../../share/team.list.item";
import DialogOptionSelect from "../subject.issue.dialog.choose";
import React, { useEffect, useState } from "react";
import useProfileIssueData from "../useProfileIssueData";
import AssignmentIcon from "@material-ui/icons/Assignment";
import BusinessIcon from "@material-ui/icons/Business";
import PersonIcon from "@material-ui/icons/Person";

const useStyles = makeStyles((theme) => ({
	hoverUnderline: {
		"&:hover": {
			textDecoration: "underline",
			color: "blue",
			cursor: "pointer",
		},
	},
}));

const ChooseIssue = ({
	orgTeams,
	parent,
	setParent,
	setParentObject,
	projectTeams,
	selectedProfile,
	setSelectedProfile,
}) => {
	const classes = useStyles();
	const [temp, setTemp] = useState(null);
	const [tab, setTab] = useState(null);
	const [text, setText] = useState("");
	const [parentProfileObject, setParentProfileObject] = useState({});
	let items = ["Organisation", "Project", "Users"];
	let icons = [BusinessIcon, AssignmentIcon, PersonIcon];
	const [breadcrumbHistory, setBreadcrumbHistory] = useState(["Home"]);

	const {
		issueIds,
		setIssueIds,
		issueDictionary,
		setIssueDictionary,
		loading,
	} = useProfileIssueData(selectedProfile || false);

	const showChoices = () => {
		if (tab !== null) {
			if (tab == 0) {
				setBreadcrumbHistory(["Home", "Organisation"]);
			} else if (tab == 1) {
				setBreadcrumbHistory(["Home", "Project"]);
			} else {
				setBreadcrumbHistory(["Home", "Users"]);
			}
		}
	};

	const handleClick = (idx) => {
		if (idx == 0) {
			setTab(null);
			setTemp(null);
			setText("");
			setBreadcrumbHistory(["Home"]);
		} else if (idx == 1) {
			setSelectedProfile(null);
			setTemp(null);
			setText("");
			showChoices();
		}
	};
	const bringIssues = () => {
		setText("");
		setBreadcrumbHistory([
			...breadcrumbHistory,
			parentProfileObject?.displayName,
		]);
		setSelectedProfile(temp[0] || false);
		// issues is being called in useProfileIssueData
	};
	let orgSelect = (
		<>
			<List dense sx={{ width: "100%", bgcolor: "background.paper" }}>
				<SearchBar
					text={text}
					setText={setText}
					placeholder={"Search Organizations"}
					style={{ margin: 0, width: "100%" }}
				/>

				{orgTeams.length === 0 ? (
					<Typography
						variant="subtitle1"
						component="div"
						align="center"
					>
						No Results Found
					</Typography>
				) : (
					orgTeams
						.filter((team) => {
							if (text && tab == 0) {
								return (team?.parent?.displayName || "")
									.toLowerCase()
									.includes(text.toLocaleLowerCase());
							} else {
								return true;
							}
						})
						.map((team) => {
							return (
								<EntityListItem
									key={team?._id}
									radioMode={true}
									setParentObject={setParentProfileObject}
									entity={team}
									shared={temp}
									setShared={setTemp}
								/>
							);
						})
				)}
			</List>
			<div style={{ display: "flex", justifyContent: "flex-end" }}>
				<Button
					variant="contained"
					color="secondary"
					disabled={!temp}
					onClick={bringIssues}
				>
					Confirm
				</Button>
			</div>
		</>
	);
	let projectSelect = (
		<>
			<List dense sx={{ width: "100%", bgcolor: "background.paper" }}>
				<SearchBar
					text={text}
					setText={setText}
					placeholder={"Search Projects"}
					style={{ margin: 0, width: "100%" }}
				/>

				{projectTeams.length === 0 ? (
					<Typography
						variant="subtitle1"
						component="div"
						align="center"
					>
						No Results Found
					</Typography>
				) : (
					projectTeams
						.filter((team) => {
							if (text && tab == 1) {
								return (team?.parent?.displayName || "")
									.toLowerCase()
									.includes(text);
							} else {
								return true;
							}
						})
						.map((team) => {
							return (
								<EntityListItem
									key={team?._id}
									radioMode={true}
									setParentObject={setParentProfileObject}
									entity={team}
									shared={temp}
									setShared={setTemp}
								/>
							);
						})
				)}
			</List>
			<div style={{ display: "flex", justifyContent: "flex-end" }}>
				<Button
					variant="contained"
					color="secondary"
					disabled={!temp}
					onClick={bringIssues}
				>
					Confirm
				</Button>
			</div>
		</>
	);

	const showListprofile = () => {
		switch (tab) {
			case 0:
				return orgSelect;
			case 1:
				return projectSelect;
			default:
				return null;
		}
	};
	useEffect(() => {
		showChoices();
	}, [tab]);
	return (
		<div>
			<Breadcrumbs
				separator="›"
				aria-label="breadcrumb"
				style={{ marginTop: "0.5rem" }}
			>
				{breadcrumbHistory.map((value, idx) => {
					let last = breadcrumbHistory.length - 1;
					if (idx == last) {
						return (
							<Typography color="textPrimary" key={idx}>
								{value}
							</Typography>
						);
					} else {
						return (
							<Typography
								color="textPrimary"
								className={classes.hoverUnderline}
								key={idx}
								// color="inherit"
								onClick={() => handleClick(idx)}
							>
								{value}
							</Typography>
						);
					}
				})}
			</Breadcrumbs>
			<div style={{ marginTop: "1rem" }}>
				{breadcrumbHistory.length == 1 ? (
					<DialogOptionSelect
						items={items}
						setTab={setTab}
						icons={icons}
					/>
				) : breadcrumbHistory.length == 2 ? (
					<div>{showListprofile()}</div>
				) : (
					<List
						dense
						sx={{ width: "100%", bgcolor: "background.paper" }}
					>
						<SearchBar
							text={text}
							setText={setText}
							placeholder={"Search Issues"}
							style={{ margin: 0, width: "100%" }}
						/>

						{loading ? (
							<div
								style={{
									display: "flex",
									justifyContent: "center",
								}}
							>
								<CircularProgress />
							</div>
						) : issueIds.length === 0 ? (
							<Typography
								variant="subtitle1"
								component="div"
								align="center"
							>
								No Issue Found
							</Typography>
						) : (
							<List
								dense
								sx={{
									width: "100%",
									bgcolor: "background.paper",
								}}
							>
								<>
									{issueIds
										.filter((issue) => {
											if (text) {
												return (
													issueDictionary[issue]
														?.title || ""
												)
													.toLowerCase()
													.includes(
														text.toLocaleLowerCase()
													);
											} else {
												return true;
											}
										})
										.map((id) => {
											return (
												<EntityListItemByID
													key={id}
													radioMode={true}
													setParentObject={
														setParentObject
													}
													entity={issueDictionary[id]}
													shared={parent}
													setShared={setParent}
												/>
											);
										})}
								</>
							</List>
						)}
					</List>
				)}
			</div>
		</div>
	);
};

export default ChooseIssue;
