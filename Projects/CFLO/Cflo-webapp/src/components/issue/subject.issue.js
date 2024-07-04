import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
	Grid,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Menu,
	MenuItem,
	Slide,
	Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import Api from "../../helpers/Api";
import CloseIcon from "@material-ui/icons/Close";
import { useSelector } from "react-redux";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ChooseOrg from "./subjectIssueDialog/ChooseOrg";
import ChooseProject from "./subjectIssueDialog/ChooseProject";
import ChooseRental from "./subjectIssueDialog/ChooseRentalUnit";
import ChooseIssue from "./subjectIssueDialog/ChooseIssue";
import ChooseRentalRelation from "./subjectIssueDialog/ChooseRentalRelation";
import ChooseDocs from "./subjectIssueDialog/ChooseDocs";
import ChooseTransactions from "./subjectIssueDialog/ChooseTransactions";

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

const ListOptions = [
	// use mongoDB model names as names
	"Organization",
	"Project",
	"Doc",
	"Issue",
	// "Transaction",
	"RentalUnit",
	// "FinanceRelation",
];

const ListDict = {
	// set your displayName for options
	Organization: "Organization",
	Project: "Project",
	Doc: "Documents",
	Issue: "Issues",
	RentalUnit: "Rental Units",
	FinanceRelation: "Contacts",
	Transaction: "Transactions",
};

function SubjectIssue({
	openDialog,
	setOpenDialog,
	parent,
	setParent,
	parentModel,
	setParentModel,
	parentObject,
	setParentObject,
}) {
	const [projectTeams, setProjectTeams] = useState([]);
	const [adminProfileIds, setAdminProfileIds] = useState([]);
	const [orgTeams, setOrgTeams] = useState([]);
	const [selectedProject, setSelectedProject] = useState(null);
	const [selectedProfile, setSelectedProfile] = useState(null);
	const { user, userProfile } = useSelector((state) => state.auth);
	const [anchorEl, setAnchorEl] = React.useState(null);
	// console.log("admin here", adminProfileIds, orgTeams, projectTeams);

	const handleClickListItem = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleMenuItemClick = (event, option) => {
		setParentModel(option);
		setParent(null);
		setSelectedProfile(null);
		setAnchorEl(null);
	};
	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const getBasicData = async () => {
		const res = await Api.post("shared/getBasicData", {
			userProfileId: user?.profile,
		});

		if (res?.data) {
			const data = res?.data;
			const adminProfileIdsRes = res.data.adminProfileIds;
			const orgTeamRes = data.orgTeams;
			const projectTeamRes = data.projectTeams;

			setAdminProfileIds(adminProfileIdsRes);
			setOrgTeams(orgTeamRes);
			setProjectTeams(projectTeamRes);
		}
	};
	const handleClose = () => {
		setOpenDialog(false);
	};
	const switchmodel = (model) => {
		switch (model) {
			case "Organization":
				return (
					<ChooseOrg
						orgTeams={orgTeams}
						parent={parent}
						setParentObject={setParentObject}
						setParent={setParent}
					/>
				);
			case "Project":
				return (
					<ChooseProject
						projectTeams={projectTeams}
						parent={parent}
						setParentObject={setParentObject}
						setParent={setParent}
					/>
				);
			case "RentalUnit":
				return (
					<ChooseRental
						projectTeams={projectTeams}
						selectedProject={selectedProject}
						setSelectedProject={setSelectedProject}
						parent={parent}
						setParentObject={setParentObject}
						setParent={setParent}
					/>
				);

			case "Issue":
				return (
					<ChooseIssue
						projectTeams={projectTeams}
						orgTeams={orgTeams}
						parent={parent}
						setParentObject={setParentObject}
						setParent={setParent}
						selectedProfile={selectedProfile}
						parentObject={parentObject}
						setSelectedProfile={setSelectedProfile}
					/>
				);
			case "FinanceRelation":
				return (
					<ChooseRentalRelation
						projectTeams={projectTeams}
						selectedProject={selectedProject}
						orgTeams={orgTeams}
						setSelectedProject={setSelectedProject}
						parent={parent}
						setParent={setParent}
						setParentObject={setParentObject}
						selectedProfile={selectedProfile}
						parentObject={parentObject}
						setSelectedProfile={setSelectedProfile}
					/>
				);
			case "Doc":
				return (
					<ChooseDocs
						projectTeams={projectTeams}
						orgTeams={orgTeams}
						parent={parent}
						setParentObject={setParentObject}
						setParent={setParent}
						selectedProfile={selectedProfile}
						parentObject={parentObject}
						setSelectedProfile={setSelectedProfile}
					/>
				);
			case "Transaction":
				return (
					<ChooseTransactions
						projectTeams={projectTeams}
						orgTeams={orgTeams}
						parent={parent}
						setParentObject={setParentObject}
						setParent={setParent}
						selectedProfile={selectedProfile}
						parentObject={parentObject}
						setSelectedProfile={setSelectedProfile}
					/>
				);
			default:
				return null;
		}
	};

	useEffect(() => {
		getBasicData();
		// console.log(templates, "temp");
	}, []);
	return (
		<div>
			<Dialog
				open={openDialog}
				TransitionComponent={Transition}
				keepMounted
				maxWidth={"md"}
				fullWidth={true}
				onClose={handleClose}
				aria-describedby="alert-dialog-slide-description"
			>
				<DialogTitle>
					<Grid
						container
						justifyContent="space-between"
						alignItems="center"
					>
						<Typography
							variant="h5"
							component="div"
							sx={{ maxWidth: "80%" }}
						>
							Select Subject
						</Typography>
						<CloseIcon
							onClick={handleClose}
							style={{ cursor: "pointer" }}
						/>
					</Grid>
				</DialogTitle>
				<DialogContent>
					<div>
						<List component="nav">
							<ListItem
								button
								aria-haspopup="true"
								onClick={handleClickListItem}
							>
								<ListItemText
									primary="Selected Group"
									secondary={ListDict[parentModel]}
								/>
								<ListItemIcon
									style={{ justifyContent: "center" }}
								>
									<ArrowDropDownIcon />
								</ListItemIcon>
							</ListItem>
						</List>
						<Menu
							id="lock-menu"
							anchorEl={anchorEl}
							keepMounted
							open={Boolean(anchorEl)}
							onClose={handleMenuClose}
						>
							{ListOptions.map((option, index) => (
								<MenuItem
									key={option}
									value={option}
									selected={option === parentModel}
									onClick={(event) =>
										handleMenuItemClick(event, option)
									}
								>
									{ListDict[option]}
								</MenuItem>
							))}
						</Menu>
					</div>
					<Divider />
					{switchmodel(parentModel)}
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>
						{parent ? "Done" : "Cancel"}
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}

export default SubjectIssue;
