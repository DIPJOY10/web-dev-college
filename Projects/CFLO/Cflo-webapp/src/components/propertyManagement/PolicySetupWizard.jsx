import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Typography from "@material-ui/core/Typography";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useSelector } from "react-redux";
import AddProjectId from "./AddProjectId";
import { Grid, TextField } from "@material-ui/core";
import UserWithRoleComponent from "../styled/CommonComponents/UserWithRoleComponent";
import { getProfileById } from "./apiCall";

const useStyles = makeStyles((theme) => ({
	root: {
		width: "100%",
	},
	backButton: {
		marginRight: theme.spacing(1),
	},
	instructions: {
		marginTop: theme.spacing(1),
		marginBottom: theme.spacing(1),
	},
}));

function getSteps() {
	return [
		"Welcome",
		"Set up Project Policies",
		"Set up Payments",
		"Finishing up",
	];
}

export default function PolicySetupWizard({ open, setOpen, team }) {
	const classes = useStyles();
	const [activeStep, setActiveStep] = React.useState(0);
	const steps = getSteps();

	const handleNext = () => {
		setActiveStep((prevActiveStep) => prevActiveStep + 1);
	};

	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	};

	const handleReset = () => {
		setActiveStep(0);
	};
	const handleClose = () => {
		setOpen(false);
	};
	function getStepContent(stepIndex) {
		switch (stepIndex) {
			case 0:
				return "Welcome screen. show info page";
			case 1:
				return <ProjectIDPage team={team} />;
			case 2:
				return "Here we will choose user account or project account";
			case 3:
				return "Display all selected choice to check and then final submit";
			default:
				return "Unknown stepIndex";
		}
	}

	return (
		<div>
			<Dialog
				open={open}
				onClose={handleClose}
				maxWidth={"md"}
				fullWidth={true}
			>
				<DialogTitle id="alert-dialog-title">
					Propery Management Setup Wizard
				</DialogTitle>
				<DialogContent>
					<div className={classes.root}>
						<Stepper activeStep={activeStep} alternativeLabel>
							{steps.map((label) => (
								<Step key={label}>
									<StepLabel>{label}</StepLabel>
								</Step>
							))}
						</Stepper>
						<div>
							{activeStep === steps.length ? (
								<div>
									<Typography
										className={classes.instructions}
									>
										All steps completed
									</Typography>
									<Button onClick={handleReset}>Reset</Button>
								</div>
							) : (
								<div>
									<Typography
										className={classes.instructions}
									>
										{getStepContent(activeStep)}
									</Typography>
									<div>
										<Button
											disabled={activeStep === 0}
											onClick={handleBack}
											className={classes.backButton}
										>
											Back
										</Button>
										<Button
											variant="contained"
											color="primary"
											onClick={handleNext}
										>
											{activeStep === steps.length - 1
												? "Finish"
												: "Next"}
										</Button>
									</div>
								</div>
							)}
						</div>
					</div>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={handleClose}
						color="primary"
						variant="contained"
					>
						Disagree
					</Button>
					<Button
						onClick={handleClose}
						color="primary"
						variant="contained"
						autoFocus
					>
						Agree
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}

const roles = ["Admin", "Owner", "Editor", "Viewer"];
const Msgroles = ["Admin", "User"];
const ProjectIDPage = ({ team }) => {
	const [numUnits, setNumUnits] = React.useState(0);
	const { auth } = useSelector((state) => state);
	const [msgWith, setMsgWith] = useState([]);
	const [msgWithRole, setMsgWithRole] = useState([]);
	const [docShareWith, setDocShareWith] = useState([]);
	const [docShareWithRole, setDocShareWithRole] = useState([]);
	const [multiInputBool, setmultiInputBool] = useState(false);
	const [issuesShareWith, setIssuesShareWith] = useState([]);
	const [issuesShareWithRole, setIssuesShareWithRole] = useState([]);
	const [deleteRoles, setDeleteRoles] = useState([]);
	const [originalRes, setOriginalRes] = useState([]);
	const removeMsgWithUser = (id) => {
		setmultiInputBool(!multiInputBool);
		const filteredUserArr = msgWith.filter((user) => user?._id !== id);
		setMsgWith(filteredUserArr);

		let newUserAccessRoleArr = [];
		msgWithRole.map((userRole) => {
			if (userRole?.user?._id !== id) {
				newUserAccessRoleArr.push(userRole);
			}
		});
		setMsgWithRole(newUserAccessRoleArr);
		setmultiInputBool(!multiInputBool);
	};

	//update user role
	const updateMsgUserWithRole = (value, index) => {
		setmultiInputBool(!multiInputBool);
		let inputDataArr = msgWithRole;
		let editObj = {
			...msgWithRole[index],
			role: value,
		};
		inputDataArr[index] = editObj;
		setMsgWithRole(inputDataArr);
		setmultiInputBool(!multiInputBool);
	};

	//add new user
	const addNewMsgAccessUser = (newAccessRoleObj) => {
		const accessableUserWithRoleObj = {
			user: newAccessRoleObj?.user,
			role: newAccessRoleObj?.role,
		};
		let newAccessableUsersWithRoleArr = [
			...msgWithRole,
			accessableUserWithRoleObj,
		];
		setMsgWithRole(newAccessableUsersWithRoleArr);
	};

	// handle documents Share user selecting

	//remove user
	const removeDocShareWithUser = (id) => {
		setmultiInputBool(!multiInputBool);
		const filteredUserArr = docShareWith.filter((user) => user?._id !== id);
		setDocShareWith(filteredUserArr);

		let newUserAccessRoleArr = [];
		docShareWithRole.map((userRole) => {
			if (userRole?.user?._id !== id) {
				newUserAccessRoleArr.push(userRole);
			}
		});
		setDocShareWithRole(newUserAccessRoleArr);
		setmultiInputBool(!multiInputBool);
	};

	//update user role
	const updateDocShareWithUserRole = (value, index) => {
		setmultiInputBool(!multiInputBool);
		let inputDataArr = docShareWithRole;
		let editObj = {
			...docShareWithRole[index],
			role: value,
		};
		inputDataArr[index] = editObj;
		setDocShareWithRole(inputDataArr);
		setmultiInputBool(!multiInputBool);
	};

	//add new user
	const addNewDocShareWithUser = (newAccessRoleObj) => {
		const accessableUserWithRoleObj = {
			user: newAccessRoleObj?.user,
			role: newAccessRoleObj?.role,
		};
		let newAccessableUsersWithRoleArr = [
			...docShareWithRole,
			accessableUserWithRoleObj,
		];
		setDocShareWithRole(newAccessableUsersWithRoleArr);
	};

	// handle issues Share user selecting

	//remove user
	const removeIssuesShareWithUser = (id) => {
		setmultiInputBool(!multiInputBool);
		const filteredUserArr = issuesShareWith.filter(
			(user) => user?._id !== id
		);
		setIssuesShareWith(filteredUserArr);

		let newUserAccessRoleArr = [];
		issuesShareWithRole.map((userRole) => {
			if (userRole?.user?._id !== id) {
				newUserAccessRoleArr.push(userRole);
			}
		});
		setIssuesShareWithRole(newUserAccessRoleArr);
		setmultiInputBool(!multiInputBool);
	};

	//update user role
	const updateIssuesShareWithUserRole = (value, index) => {
		setmultiInputBool(!multiInputBool);
		let inputDataArr = issuesShareWithRole;
		let editObj = {
			...issuesShareWithRole[index],
			role: value,
		};
		inputDataArr[index] = editObj;
		setIssuesShareWithRole(inputDataArr);
		setmultiInputBool(!multiInputBool);
	};

	//add new user
	const addNewIssuesShareWithUser = (newAccessRoleObj) => {
		const accessableUserWithRoleObj = {
			user: newAccessRoleObj?.user,
			role: newAccessRoleObj?.role,
		};
		let newAccessableUsersWithRoleArr = [
			...issuesShareWithRole,
			accessableUserWithRoleObj,
		];
		setIssuesShareWithRole(newAccessableUsersWithRoleArr);
	};

	const getPolicy = async () => {
		getProfileById({ profileId: auth?.user?.profile })
			.then((data) => {
				console.log(data, team);
				const userProfile = data;
				const projectProfile = team?.parent?.profile;
				if (team?.parent?.profile) {
					const initProfileArrs = [userProfile, projectProfile];
					setMsgWith(initProfileArrs);
					setDocShareWith(initProfileArrs);
					setIssuesShareWith(initProfileArrs);

					let accessableMsgUserWithRoleObjArr = [
						{
							user: userProfile,
							role: "Admin",
						},
						{
							user: projectProfile,
							role: "Admin",
						},
					];

					let accessableIssueAndDocUserWithRoleObjArr = [
						{
							user: userProfile,
							role: "Owner",
						},
						{
							user: projectProfile,
							role: "Owner",
						},
					];

					setMsgWithRole(accessableMsgUserWithRoleObjArr);
					setDocShareWithRole(
						accessableIssueAndDocUserWithRoleObjArr
					);
					setIssuesShareWithRole(
						accessableIssueAndDocUserWithRoleObjArr
					);
					console.log(
						accessableIssueAndDocUserWithRoleObjArr,
						userProfile,
						projectProfile
					);
				}
			})
			.catch((err) => {
				console.error(err);
			});
	};
	useEffect(() => {
		getPolicy();
	}, []);
	console.log(issuesShareWithRole);
	return (
		<div>
			<Grid container spacing={2}>
				<Grid item xs={12}>
					{/* create a function for new select that only checks if the name is available or not  */}
					<AddProjectId team={team} newID={true} />
				</Grid>
				<Grid item xs={12}>
					<TextField
						label="Number of Units"
						placeholder="Enter number of units"
						type="number"
						value={numUnits}
						fullWidth
						variant="outlined"
						onChange={(e) => setNumUnits(e.target.value)}
					/>
				</Grid>
				<Grid item xs={12}>
					<div style={{ width: "100%", opacity: "0.5" }}>
						<Typography>Message With</Typography>
					</div>
					<UserWithRoleComponent
						userArr={msgWith}
						setUserArr={setMsgWith}
						userProfile={auth?.user?.profile}
						walletId={team?.wallet}
						relationType={"Customer"}
						userOp={true}
						projectOp={false}
						orgOp={true}
						roles={Msgroles}
						defaultType={"User"}
						userRoleArr={msgWithRole}
						setUserRoleArr={setMsgWithRole}
						removeUserRole={removeMsgWithUser}
						updateRoleOfUserRole={updateMsgUserWithRole}
						addUserRole={addNewMsgAccessUser}
						setDeleteRoles={setDeleteRoles}
					/>

					<div style={{ width: "100%", opacity: "0.5" }}>
						<Typography>Documents Share With</Typography>
					</div>
					<UserWithRoleComponent
						userArr={docShareWith}
						setUserArr={setDocShareWith}
						userProfile={auth?.user?.profile}
						walletId={team?.wallet}
						relationType={"Customer"}
						userOp={true}
						projectOp={false}
						orgOp={true}
						roles={roles}
						defaultType={"Viewer"}
						userRoleArr={docShareWithRole}
						setUserRoleArr={setDocShareWithRole}
						removeUserRole={removeDocShareWithUser}
						updateRoleOfUserRole={updateDocShareWithUserRole}
						addUserRole={addNewDocShareWithUser}
						setDeleteRoles={setDeleteRoles}
					/>

					<div style={{ width: "100%", opacity: "0.5" }}>
						<Typography>Issues Share With</Typography>
					</div>
					<UserWithRoleComponent
						userArr={issuesShareWith}
						setUserArr={setIssuesShareWith}
						userProfile={auth?.user?.profile}
						walletId={team?.wallet}
						relationType={"Customer"}
						userOp={true}
						projectOp={false}
						orgOp={true}
						roles={roles}
						defaultType={"Viewer"}
						userRoleArr={issuesShareWithRole}
						setUserRoleArr={setIssuesShareWithRole}
						removeUserRole={removeIssuesShareWithUser}
						updateRoleOfUserRole={updateIssuesShareWithUserRole}
						addUserRole={addNewIssuesShareWithUser}
						setDeleteRoles={setDeleteRoles}
					/>
				</Grid>
			</Grid>
		</div>
	);
};
