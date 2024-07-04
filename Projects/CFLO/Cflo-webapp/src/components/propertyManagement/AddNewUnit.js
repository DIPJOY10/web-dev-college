import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useParams, useHistory } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/Clear";
import {
	MuiPickersUtilsProvider,
	KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import AddIcon from "@material-ui/icons/Add";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import TextField from "@material-ui/core/TextField";
import { Typography } from "@material-ui/core";
import { createRentalRelationWithUnit, getProfileById } from "./apiCall";
import MyAutocomplete from "../styled/CommonComponents/MyAutoComplete";
import LessText from "../styled/CommonComponents/LessText";
import Avatar from "@material-ui/core/Avatar";
import UserWithRoleComponent from "../styled/CommonComponents/UserWithRoleComponent";

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

export default function AddNewUnit(props) {
	const history = useHistory();
	const classes = useStyles();
	const { teamId } = useParams();
	const {
		openCreateDialog,
		setOpenCreateDialog,
		team,
		reloadUnits,
		numRentalUnits,
	} = props;
	const DateNow = new Date();
	const { auth } = useSelector((state) => state);

	const [numUnits, setNumUnits] = useState(0);
	const [open, setOpen] = useState(false);
	const [openNewBill, setOpenNewBill] = useState(false);

	const [msgWith, setMsgWith] = useState([]);
	const [msgWithRole, setMsgWithRole] = useState([]);

	const [docShareWith, setDocShareWith] = useState([]);
	const [docShareWithRole, setDocShareWithRole] = useState([]);

	const [issuesShareWith, setIssuesShareWith] = useState([]);
	const [issuesShareWithRole, setIssuesShareWithRole] = useState([]);

	const [startDate, setStartDate] = useState(DateNow);
	const [durationValue, setDurationValue] = useState(durationType[0]);
	const [intervalDays, setIntervalDays] = useState(1);
	const [leaseStartDate, setLeaseStartDate] = useState(DateNow);
	const [leaseEndDate, setLeaseEndDate] = useState(DateNow);
	const [newBillName, setNewBillName] = useState("");
	const [multiInputBool, setmultiInputBool] = useState(false);
	const [createBillType, setCreateBillType] = useState("");
	const [intervalText, setIntervalText] = useState("");

	const newInputObj1 = {
		type: "Rent",
		amount: 0,
		period: 0,
		Latefees: 0,
	};
	const [monthlyBills, setMonthlyBills] = useState([newInputObj1]);
	const newInputObj2 = [
		{
			type: "Security Money",
			amount: 0,
			dueDate: DateNow,
			Latefees: 0,
		},
		{
			type: "Move-In Cost",
			amount: 0,
			dueDate: DateNow,
			Latefees: 0,
		},
	];
	const [oneTimeBills, setOneTimeBills] = useState([...newInputObj2]);

	useEffect(() => {
		setOpen(openCreateDialog);
	}, [openCreateDialog]);

	const handleClose = () => {
		setOpen(false);
		setOpenCreateDialog(false);
	};

	const handleCloseNewBill = () => {
		setOpenNewBill(false);
	};

	useEffect(() => {
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
	}, [auth?.user?.profile, team?.parent?.profile]);

	const createNewBill = () => {
		if (createBillType === "OneTime" && newBillName?.length > 2) {
			let newOneTimeBills = oneTimeBills;
			let newOneTimeBillObj = {
				type: newBillName,
				amount: 0,
				dueDate: DateNow,
				Latefees: 0,
			};
			newOneTimeBills.push(newOneTimeBillObj);
			setOneTimeBills(newOneTimeBills);
		} else if (createBillType === "Monthly" && newBillName?.length > 2) {
			let newMonthlyBills = monthlyBills;
			let newMonthlyBillObj = {
				type: newBillName,
				amount: 0,
				period: 0,
				Latefees: 0,
			};
			newMonthlyBills.push(newMonthlyBillObj);
			setMonthlyBills(newMonthlyBills);
		}
		setNewBillName("");
		handleCloseNewBill();
	};

	const editMonthlyInput = (index, key, value) => {
		setmultiInputBool(!multiInputBool);
		let inputDataArr = monthlyBills;
		let editObj = {
			...monthlyBills[index],
			[key]: value,
		};
		inputDataArr[index] = editObj;
		setMonthlyBills(inputDataArr);
		setmultiInputBool(!multiInputBool);
	};

	const editOneTimeInput = (index, key, value) => {
		setmultiInputBool(!multiInputBool);
		let inputDataArr = oneTimeBills;
		let editObj = {
			...oneTimeBills[index],
			[key]: value,
		};
		inputDataArr[index] = editObj;
		setOneTimeBills(inputDataArr);
		setmultiInputBool(!multiInputBool);
	};

	const removeInputLinesMonthlyBills = (index) => {
		let editedMonthlyBills = [];
		monthlyBills.map((bill, i) => {
			if (i !== index) {
				editedMonthlyBills.push(bill);
			}
		});
		setMonthlyBills(editedMonthlyBills);
	};

	const removeInputLinesOneTimeBills = (index) => {
		let editedOneTimeBills = [];
		oneTimeBills.map((bill, i) => {
			if (i !== index) {
				editedOneTimeBills.push(bill);
			}
		});
		setOneTimeBills(editedOneTimeBills);
	};

	const getOptionLabel = (option) => {
		return option;
	};

	const selectDuration = (option) => {
		setDurationValue(option);
	};

	//
	const createRentalRelationAndUnits = async () => {
		console.log("get call");

		let msgWithId = [];
		let docShareWithId = [];
		let issuesShareWithId = [];
		let msgWithIdAndRole = [];
		let docShareWithIdAndRole = [];
		let issuesShareWithIdAndRole = [];
		let monthlyBillsArr = [];
		let oneTimeBillsArr = [];

		msgWithRole?.length > 0 &&
			msgWithRole.map((userRole) => {
				const newRoleObj = {
					user: userRole?.user?._id,
					role: userRole?.role,
				};
				msgWithId.push(userRole?.user?._id);
				msgWithIdAndRole.push(newRoleObj);
			});

		docShareWithRole?.length > 0 &&
			docShareWithRole.map((userRole) => {
				const newRoleObj = {
					user: userRole?.user?._id,
					role: userRole?.role,
				};
				docShareWithId.push(userRole?.user?._id);
				docShareWithIdAndRole.push(newRoleObj);
			});

		issuesShareWithRole?.length > 0 &&
			issuesShareWithRole.map((userRole) => {
				const newRoleObj = {
					user: userRole?.user?._id,
					role: userRole?.role,
				};
				issuesShareWithId.push(userRole?.user?._id);
				issuesShareWithIdAndRole.push(newRoleObj);
			});

		const createObj = {
			numUnits,
			msgWith: msgWithId,
			docShareWith: docShareWithId,
			issuesShareWith: issuesShareWithId,
			numRentalUnits,
			msgWithIdAndRole,
			docShareWithIdAndRole,
			issuesShareWithIdAndRole,
			user: auth?.user?.profile,
			startDate,
			durationValue,
			intervalDays,
			leaseStartDate,
			leaseEndDate,
			monthlyBillsArr,
			oneTimeBillsArr,
			projectId: team?.parent?._id,
			teamId: team?._id,
			walletId: team?.wallet,
		};

		await createRentalRelationWithUnit(createObj)
			.then((data) => {
				console.log(data);
			})
			.catch((err) => {
				console.log(err);
			});

		handleClose();
		reloadUnits();
	};

	// handle chat user selecting

	//remove user
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

	return (
		<div className={classes.root}>
			<Dialog
				scroll={"paper"}
				onClose={handleClose}
				maxWidth={"md"}
				fullWidth
				aria-labelledby="scroll-dialog-title"
				aria-describedby="scroll-dialog-description"
				open={open}
			>
				<DialogTitle
					id="customized-dialog-title"
					onClose={handleClose}
					style={{ padding: "8px 24px" }}
				>
					Create New Unit(s)
				</DialogTitle>
				<DialogContent dividers={true}>
					<div className={classes.contStyle}>
						<div className={classes.inputCont}>
							<TextField
								id="outlined-basic"
								size="small"
								label="Number of New Units"
								variant="outlined"
								className={classes.singleInput}
								value={numUnits}
								onChange={(e) => {
									setNumUnits(e.target.value);
								}}
							/>
						</div>

						{/* <div style={{ width: "100%", opacity: "0.5" }}>
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
						/> */}
					</div>
				</DialogContent>
				<DialogActions
					style={{ display: "flex", justifyContent: "space-between" }}
				>
					<Button autoFocus onClick={handleClose} color="primary">
						Cancel
					</Button>
					<Button
						autoFocus
						onClick={() => {
							createRentalRelationAndUnits();
						}}
						color="primary"
					>
						Create
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
