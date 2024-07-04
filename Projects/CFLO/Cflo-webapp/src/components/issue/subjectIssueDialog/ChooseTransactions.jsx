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
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import ReceiptIcon from "@material-ui/icons/Receipt";
import AssignmentIcon from "@material-ui/icons/Assignment";
import BusinessIcon from "@material-ui/icons/Business";
import PersonIcon from "@material-ui/icons/Person";
import { useSelector } from "react-redux";
import Api from "../../../helpers/Api";

const useStyles = makeStyles((theme) => ({
	hoverUnderline: {
		"&:hover": {
			textDecoration: "underline",
			color: "blue",
			cursor: "pointer",
		},
	},
}));

function ChooseTransactions({
	parent,
	setParent,
	setParentObject,
	selectedProfile,
	setSelectedProfile,
}) {
	const classes = useStyles();
	const { teamDictionary, orgTeamIds, projectTeamIds } = useSelector(
		(state) => state.team
	);
	const { user } = useSelector((state) => state.auth);
	const [invoice, setInvoice] = useState([]);
	const [bill, setBill] = useState([]);
	const userWallet = user?.wallet;
	const userProfile = user?.profile;
	const [adminOrgs, setAdminOrgs] = useState([]);
	const [adminProjects, setAdminProjects] = useState([]);
	const [temp, setTemp] = useState(null);
	const [tab, setTab] = useState(null);
	const [text, setText] = useState("");
	const [parentProfileObject, setParentProfileObject] = useState({});
	const [loading, setLoading] = useState(false);
	let items = ["Organisation", "Project", user?.displayName];
	let icons = [BusinessIcon, AssignmentIcon, PersonIcon];
	let selectItems = ["Invoices", "Bills"];
	let selectIcons = [ReceiptIcon, AttachMoneyIcon];
	const [breadcrumbHistory, setBreadcrumbHistory] = useState(["Home"]);

	const showChoices = () => {
		if (tab !== null) {
			if (breadcrumbHistory.length == 1) {
				if (tab == 0) {
					setBreadcrumbHistory(["Home", "Organisation"]);
				} else if (tab == 1) {
					setBreadcrumbHistory(["Home", "Project"]);
				} else {
					setBreadcrumbHistory(["Home", "Users"]);
				}
			} else {
				if (tab == 0) {
					setBreadcrumbHistory([
						...breadcrumbHistory,
						selectItems[0],
					]);
				} else {
					setBreadcrumbHistory([
						...breadcrumbHistory,
						selectItems[1],
					]);
				}
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
			setTab(null);
			setText("");
			showChoices();
		}
	};
	const bringTransaction = () => {
		setText("");
		setBreadcrumbHistory([
			...breadcrumbHistory,
			parentProfileObject?.displayName,
		]);
		getAllTransactions(temp[0] || false);
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

				{adminOrgs.length === 0 ? (
					<Typography
						variant="subtitle1"
						component="div"
						align="center"
					>
						No Results Found
					</Typography>
				) : (
					adminOrgs
						.filter((id) => {
							let team = teamDictionary[id];
							if (text && tab == 0) {
								return (team?.parent?.displayName || "")
									.toLowerCase()
									.includes(text.toLocaleLowerCase());
							} else {
								return true;
							}
						})
						.map((id) => {
							let team = teamDictionary[id];
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
					onClick={bringTransaction}
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

				{adminProjects.length === 0 ? (
					<Typography
						variant="subtitle1"
						component="div"
						align="center"
					>
						No Results Found
					</Typography>
				) : (
					adminProjects
						.filter((id) => {
							let team = teamDictionary[id];
							if (text && tab == 1) {
								return (team?.parent?.displayName || "")
									.toLowerCase()
									.includes(text);
							} else {
								return true;
							}
						})
						.map((id) => {
							let team = teamDictionary[id];
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
					onClick={bringTransaction}
				>
					Confirm
				</Button>
			</div>
		</>
	);
	const handleProfileClick = () => {
		setText("");
		setBreadcrumbHistory([...breadcrumbHistory, user?.displayName]);
		getAllTransactions(userProfile);
	};
	const showListprofile = () => {
		switch (tab) {
			case 0:
				return orgSelect;
			case 1:
				return projectSelect;
			case 2:
				handleProfileClick();
			default:
				return null;
		}
	};
	const getAllTransactions = async (profileId) => {
		if (profileId) {
			setLoading(true);
			const res = await Api.post("transaction/byprofileget/bothside", {
				profileId: profileId,
			});
			console.log("res = ", res);
			if (res?.data) {
				let invoiceTemp = [];
				let billTemp = [];
				let data = res?.data;
				data.map((obj) => {
					if (obj?.firstParty?._id == profileId) {
						invoiceTemp.push(obj);
					} else {
						billTemp.push(obj);
					}
					return null;
				});
				setInvoice([...invoiceTemp]);
				setTab(null);
				setBill([...billTemp]);
				setLoading(false);
			}
		}
	};
	useEffect(() => {
		let temp = [];
		orgTeamIds.map((id) => {
			let teamObj = teamDictionary[id];
			if (
				teamObj?.permissions[userProfile] == "Owner" ||
				teamObj?.permissions[userProfile] == "Admin"
			) {
				temp.push(id);
			}
		});
		setAdminOrgs([...temp]);
	}, [orgTeamIds]);
	useEffect(() => {
		let temp = [];
		projectTeamIds.map((id) => {
			let teamObj = teamDictionary[id];
			if (
				teamObj?.permissions[userProfile] == "Owner" ||
				teamObj?.permissions[userProfile] == "Admin"
			) {
				temp.push(id);
			}
		});
		setAdminProjects([...temp]);
	}, [projectTeamIds]);

	useEffect(() => {
		showChoices();
	}, [tab]);
	console.log("here = 0", tab, invoice, bill);
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
				) : breadcrumbHistory.length == 3 ? (
					<DialogOptionSelect
						items={selectItems}
						setTab={setTab}
						icons={selectIcons}
					/>
				) : tab == 0 ? (
					<List
						dense
						sx={{ width: "100%", bgcolor: "background.paper" }}
					>
						<SearchBar
							text={text}
							setText={setText}
							placeholder={"Search Invoice"}
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
						) : invoice.length === 0 ? (
							<Typography
								variant="subtitle1"
								component="div"
								align="center"
							>
								No Invoice Found
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
									{invoice
										// .filter((issue) => {
										// 	if (text) {
										// 		return (
										// 			issueDictionary[issue]
										// 				?.title || ""
										// 		)
										// 			.toLowerCase()
										// 			.includes(
										// 				text.toLocaleLowerCase()
										// 			);
										// 	} else {
										// 		return true;
										// 	}
										// })
										.map((obj) => {
											return (
												<EntityListItemByID
													key={obj?.id}
													radioMode={true}
													setParentObject={
														setParentObject
													}
													entity={obj}
													shared={parent}
													setShared={setParent}
												/>
											);
										})}
								</>
							</List>
						)}
					</List>
				) : (
					<List
						dense
						sx={{ width: "100%", bgcolor: "background.paper" }}
					>
						<SearchBar
							text={text}
							setText={setText}
							placeholder={"Search Bills"}
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
						) : invoice.length === 0 ? (
							<Typography
								variant="subtitle1"
								component="div"
								align="center"
							>
								No Bills Found
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
									{bill
										// .filter((issue) => {
										// 	if (text) {
										// 		return (
										// 			issueDictionary[issue]
										// 				?.title || ""
										// 		)
										// 			.toLowerCase()
										// 			.includes(
										// 				text.toLocaleLowerCase()
										// 			);
										// 	} else {
										// 		return true;
										// 	}
										// })
										.map((obj) => {
											return (
												<EntityListItemByID
													key={obj?.id}
													radioMode={true}
													setParentObject={
														setParentObject
													}
													entity={obj}
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
}

export default ChooseTransactions;
