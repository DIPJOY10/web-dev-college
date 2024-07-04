import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import UserWithRoleComponent from "../styled/CommonComponents/UserWithRoleComponent";
import { makeStyles, Typography } from "@material-ui/core";
import { useSelector } from "react-redux";
import AddProjectId from "./AddProjectId";
import {
	createPolicyByTeamId,
	getPolicyByTeamId,
	getProfileById,
	updatePolicyByTeamId,
} from "./apiCall";

const roles = ["Admin", "Owner", "Editor", "Viewer"];
const Msgroles = ["Admin", "User"];
const durationType = ["Monthly", "Weekly", "Other"];

const useStyles = makeStyles((theme) => ({
	root: {},
	contStyle: {
		width: "100%",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		flexDirection: "column",
		overflowY: "auto",
		paddingTop: "10px",
	},
	datePickerDual: {
		width: "45%",
		margin: "0px",
		marginTop: "-10px",
	},
	datePickerTriple: {
		width: "27%",
		margin: "0px",
		marginTop: "-10px",
	},
	datePicker30Triple: {
		width: "30%",
		margin: "0px",
		marginTop: "-10px",
	},
	inputCont: {
		width: "100%",
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: "10px",
	},
	tripleInput: {
		width: "27%",
	},
	triple30Input: {
		width: "30%",
	},
	dualInput: {
		width: "45%",
	},
	singleInput: {
		width: "100%",
	},
	multiInput: {
		width: "100%",
		border: "1px solid #E1E2E5",
		padding: "10px",
		paddingTop: "15px",
		marginBottom: "15px",
	},
	addBtn: {
		padding: "4px 10px",
	},
	addBtnCont: {
		width: "100%",
		display: "flex",
		justifyContent: "space-between",
		marginBottom: "30px",
	},
}));

export default function PolicyDialog(props) {
	const classes = useStyles();
	const { open, setOpen, team, reloadUnits, numRentalUnits, projectTeamId } =
		props;
	const [msgWith, setMsgWith] = useState([]);
	const [msgWithRole, setMsgWithRole] = useState([]);
	const { auth } = useSelector((state) => state);
	const [docShareWith, setDocShareWith] = useState([]);
	const [docShareWithRole, setDocShareWithRole] = useState([]);
	const [multiInputBool, setmultiInputBool] = useState(false);
	const [issuesShareWith, setIssuesShareWith] = useState([]);
	const [issuesShareWithRole, setIssuesShareWithRole] = useState([]);
	const [deleteRoles, setDeleteRoles] = useState([]);
	const [originalRes, setOriginalRes] = useState([]);
	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};
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
	const handleSubmit = async () => {
		try {
			let obj = {
				user: auth?.user?.profile,
				deleteRoles: deleteRoles,
				original: originalRes,
				issuesShareWithRole: issuesShareWithRole,
				docShareWithRole: docShareWithRole,
				msgWithRole: msgWithRole,
				projectTeamId: projectTeamId,
			};
			const res = await updatePolicyByTeamId(obj);
		} catch (error) {
			console.error(error);
		}
		handleClose();
	};
	const getPolicy = async () => {
		const res = await getPolicyByTeamId(projectTeamId);

		if (res?.error) {
			console.error(res?.error);
			getProfileById({ profileId: auth?.user?.profile })
				.then((data) => {
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
					}
				})
				.catch((err) => {});
		} else {
			const policyRes = (res?.policy)[0];
			setOriginalRes(policyRes);
			setMsgWithRole(policyRes?.chatWithRole);
			setDocShareWithRole(policyRes?.shareDocsWithRole);
			setIssuesShareWithRole(policyRes?.shareTicketsWithRole);
		}
	};
	useEffect(() => {
		getPolicy();
	}, []);
	return (
		<div>
			<Dialog
				open={open}
				onClose={handleClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				maxWidth={"md"}
				fullWidth
			>
				<DialogTitle id="alert-dialog-title">
					Set Default Settings for this project
				</DialogTitle>
				<DialogContent>
					<div>
						<AddProjectId team={team} />
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
					</div>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="primary">
						Close
					</Button>
					<Button onClick={handleSubmit} color="primary" autoFocus>
						Update
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
