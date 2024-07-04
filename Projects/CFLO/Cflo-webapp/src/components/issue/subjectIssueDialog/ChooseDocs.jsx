import {
	Breadcrumbs,
	Button,
	CircularProgress,
	List,
	makeStyles,
	Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import AssignmentIcon from "@material-ui/icons/Assignment";
import BusinessIcon from "@material-ui/icons/Business";
import PersonIcon from "@material-ui/icons/Person";
import FolderCard from "../../doc/profile.folder.card";
import EntityListItemByID from "../../share/list.item.byID";
import SearchBar from "../../share/searchbar";
import EntityListItem from "../../share/team.list.item";
import DialogOptionSelect from "../subject.issue.dialog.choose";
import useGetFolders from "../../doc/useGetFolders";
import useGetDocs from "../../doc/useGetDocs";

const useStyles = makeStyles((theme) => ({
	hoverUnderline: {
		"&:hover": {
			textDecoration: "underline",
			color: "blue",
			cursor: "pointer",
		},
	},
}));

const ChooseDocs = ({
	orgTeams,
	parent,
	setParent,
	setParentObject,
	projectTeams,
	selectedProfile,
	setSelectedProfile,
}) => {
	const classes = useStyles();
	const [text, setText] = useState("");
	const [parentProfileObject, setParentProfileObject] = useState({});
	const [parentFolder, setParentFolder] = useState(null);
	const [temp, setTemp] = useState(null);
	const [breadcrumbHistory, setBreadcrumbHistory] = useState([
		["Home", "home"],
	]);
	// storing bredcrumps history like [[displayname,profile id]] it will help in calling folders
	const [tab, setTab] = useState(null);
	const [nextFolders, setNextFolders] = useState(null);
	let items = ["Organisation", "Project", "Users"];
	let icons = [BusinessIcon, AssignmentIcon, PersonIcon];
	const {
		folderIds,
		setFolderIds,
		folderDictionary,
		setFolderDictionary,
		loadingFolder,
	} = useGetFolders(selectedProfile);
	const { docIds, setDocIds, docDictionary, setDocDictionary, loadingDocs } =
		useGetDocs(selectedProfile);
	const showChoices = () => {
		if (tab !== null) {
			if (tab == 0) {
				setBreadcrumbHistory([
					["Home", "home"],
					["Organisation", "org"],
				]);
			} else if (tab == 1) {
				setBreadcrumbHistory([
					["Home", "home"],
					["Projects", "project"],
				]);
			} else {
				setBreadcrumbHistory([
					["Home", "home"],
					["Users", "user"],
				]);
			}
		}
	};
	const bringDocsAndFolders = () => {
		// this will bring the front page for docs page with folders of org,project,user
		setText("");
		setBreadcrumbHistory([
			...breadcrumbHistory,
			[parentProfileObject?.displayName, parentProfileObject?.profile],
		]);
		setSelectedProfile(parentProfileObject?.profile || false);
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
					onClick={bringDocsAndFolders}
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
					shared={parent}
					setShared={setParent}
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
					onClick={bringDocsAndFolders}
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
	const handleFolderClick = (id, profile) => {
		setText("");
		setParentFolder({ _id: id });
		setBreadcrumbHistory([
			...breadcrumbHistory,
			[folderDictionary[id]?.title, profile],
		]);
		setSelectedProfile(profile);
	};
	useEffect(() => {
		showChoices();
	}, [tab]);
	const handleClick = (idx) => {
		// for breadcrumb click
		if (idx == 0) {
			setTab(null);
			setTemp(null);
			setText("");
			setBreadcrumbHistory([["Home", "home"]]);
		} else if (idx == 1) {
			setSelectedProfile(null);
			setTemp(null);
			setText("");
			showChoices();
		} else {
			setText("");
			setBreadcrumbHistory(breadcrumbHistory.slice(0, idx + 1));
			setSelectedProfile(breadcrumbHistory[idx][1]);
			setParentFolder(breadcrumbHistory[idx - 1][1]);
		}
	};
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
								{value[0]}
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
								{value[0]}
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
					<div>
						{loadingDocs || loadingFolder ? (
							<div
								style={{
									display: "flex",
									justifyContent: "center",
								}}
							>
								<CircularProgress />
							</div>
						) : (docIds || []).length == 0 &&
						  (folderIds || []).length == 0 ? (
							<Typography varaint="h6" align="center">
								No Folders or Docs to Show
							</Typography>
						) : (
							<div>
								<List
									dense
									sx={{
										width: "100%",
										bgcolor: "background.paper",
									}}
								>
									<SearchBar
										text={text}
										setText={setText}
										placeholder={"Search Docs"}
										style={{ margin: 0, width: "100%" }}
									/>
									<div style={{ marginBottom: "1rem" }}>
										<FolderCard
											folderIds={folderIds}
											folderDictionary={folderDictionary}
											parentFolder={parentFolder}
											onClick={handleFolderClick}
										/>
									</div>
									{docIds.length === 0 ? (
										<Typography
											variant="subtitle1"
											component="div"
											align="center"
										>
											No Documents Found
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
												{docIds
													.filter((id) => {
														if (text) {
															return (
																docDictionary[
																	id
																]?.title || ""
															)
																.toLowerCase()
																.includes(
																	text.toLowerCase()
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
																docMode
																setParentObject={
																	setParentObject
																}
																entity={
																	docDictionary[
																		id
																	]
																}
																shared={parent}
																setShared={
																	setParent
																}
															/>
														);
													})}
											</>
										</List>
									)}
								</List>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
};
export default ChooseDocs;
