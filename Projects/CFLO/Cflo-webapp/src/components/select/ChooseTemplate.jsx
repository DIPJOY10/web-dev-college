import {
	Breadcrumbs,
	Button,
	CircularProgress,
	List,
	makeStyles,
	Typography,
} from "@material-ui/core";
import EntityListItemByID from "../share/list.item.byID";
import SearchBar from "../share/searchbar";
import EntityListItem from "../share/team.list.item";
import SelectParent from "./select.parent.dialog";
import TeamSelect from "./TeamSelect";
import React, { useEffect, useState } from "react";
import useProfileIssueData from "../issue/useProfileIssueData";
import IssueList from "./lists/index";
import TemplateList from "./lists/template.list";

const useStyles = makeStyles((theme) => ({
	hoverUnderline: {
		"&:hover": {
			textDecoration: "underline",
			color: "blue",
			cursor: "pointer",
		},
	},
}));

const ChooseTemplate = ({
	orgTeams,
	projectTeams,
	selectedDict, setSelectedDict, 
	selectedIds,setSelectedIds, multiple, 
	parentModelName
}) => {
	const classes = useStyles();
	const [temp, setTemp] = useState(null);
	const [tab, setTab] = useState(null);
	const [text, setText] = useState("");
	const [parentProfileObject, setParentProfileObject] = useState({});
	const [breadcrumbHistory, setBreadcrumbHistory] = useState(["Home"]);
	const [selectedProfile, setSelectedProfile] = useState(null);



	const showChoices = () => {
		if (tab !== null) {
			if (tab == 0) {
				setBreadcrumbHistory(["Home", "Organisation"]);
			} else if (tab == 1) {
				setBreadcrumbHistory(["Home", "Project"]);
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
			<TeamSelect 
				teams={orgTeams}
				shared={temp}
				setShared={setTemp}
				placeholder={'Select Organization'}
				setParentProfileObject={setParentProfileObject}
			/>
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
					<SelectParent
						setTab={setTab}
						setParentProfileObject={setParentProfileObject}
						setSelectedProfile={setSelectedProfile}
						setBreadcrumbHistory={setBreadcrumbHistory}
						breadcrumbHistory={breadcrumbHistory}
					/>
				) : breadcrumbHistory.length == 2 ? (
					<div>{showListprofile()}</div>
				) : (
					<IssueList 
						selectedProfile={selectedProfile}
						multiple={multiple}
						selectedDict={selectedDict}
						setSelectedDict={setSelectedDict}
						setSelectedIds={setSelectedIds}
						selectedIds={selectedIds}
						parentModelName={parentModelName}
					/>
				)}
			</div>
		</div>
	);
};

export default ChooseTemplate;
