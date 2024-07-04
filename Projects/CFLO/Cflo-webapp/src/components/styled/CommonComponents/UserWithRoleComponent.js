import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import LessText from "./LessText";
import { Typography } from "@material-ui/core";
import {
	getUserByName,
	getOrgByName,
	getOwnUsers,
	getAccessibleProject,
	findAndAddRelation,
} from "../../finance/transaction/api";
import MyNavBar from "./MyNavBar";
import ClearIcon from "@material-ui/icons/Clear";
import IconButton from "@material-ui/core/IconButton";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Avatar from "@material-ui/core/Avatar";
import _ from "lodash";
import areIntervalsOverlappingWithOptions from "date-fns/fp/areIntervalsOverlappingWithOptions/index.js";

const useStyles = makeStyles((theme) => ({
	bottomAct: {
		width: "100%",
		padding: "10px 20px",
		display: "flex",
		justifyContent: "space-between",
	},
	addCustomerCont: {
		width: "100%",
		padding: "10px 20px",
		display: "flex",
		justifyContent: "center",
		margin: "30px 0px",
	},
	optionCont: {
		display: "flex",
		width: "100%",
		justifyContent: "space-between",
	},
	optionImgCont: {
		width: "13%",
		display: "flex",
		alignItems: "center",
	},
	optionInfoCont: {
		width: "83%",
	},
	shareWithCont: {
		width: "100%",
		border: "1px solid #E1E2E5",
		display: "flex",
		flexDirection: "column",
		padding: "10px",
		justifyContent: "space-between",
		marginBottom: "15px",
	},
	addBtn: {
		padding: "4px 10px",
	},
	addBtnCont: {
		width: "100%",
		display: "flex",
		justifyContent: "space-between",
		marginBottom: "10px",
	},
	showSecondPartyInfoCont: {
		width: "55%",
		display: "flex",
		// justifyContent: "space-around",
	},
	showSecondPartyImgCont: {
		width: "8%",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
	},
	secondPartyEditCont: {
		width: "25%",
	},
	secondPartyCancleCont: {
		width: "10%",
	},
	showSecondPartyCont: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		marginTop: "10px",
	},
	shareWithCont: {
		width: "100%",
		border: "1px solid #E1E2E5",
		display: "flex",
		flexDirection: "column",
		padding: "10px",
		paddingLeft: "5px",
		paddingRight: "5px",
		justifyContent: "space-between",
		marginBottom: "15px",
	},
}));

export default function UserWithRoleComponent(props) {
	const {
		userArr,
		setUserArr,
		userRoleArr,
		roles,
		defaultType,
		removeUserRole,
		updateRoleOfUserRole,
		addUserRole,
		userProfile,
		walletId,
		relationType,
		userOp,
		projectOp,
		orgOp,
		setDeleteRoles,
	} = props;

	const classes = useStyles();

	const {
		bottomAct,
		addCustomerCont,
		optionCont,
		optionImgCont,
		optionInfoCont,
	} = classes;

	const { user } = useSelector((state) => state.auth);

	const [open, setOpen] = useState(false);
	const [multiInputBool, setmultiInputBool] = useState(false);
	const [show, setShow] = useState("user");

	const [allOwnUsers, setAllOwnUsers] = useState([]);
	const [allOwnProjects, setAllOwnProjects] = useState([]);
	const [allOwnOrgs, setAllOwnOrgs] = useState([]);

	const [accessibleProjects, setAccessibleProjects] = useState([]);

	const [userObj, setUserObj] = useState(null);
	const [userName, setUserName] = useState("");
	const [allUsers, setAllUsers] = useState([]);

	const [orgObj, setOrgObj] = useState(null);
	const [orgName, setOrgName] = useState("");
	const [allOrgs, setAllOrgs] = useState([]);

	const [projectObj, setProjectObj] = useState(null);
	const [projectName, setProjectName] = useState("");
	const [allProjects, setAllProjects] = useState([]);

	useEffect(() => {
		if (userOp) {
			setShow("user");
		} else if (projectOp) {
			setShow("project");
		} else {
			setShow("organization");
		}
	}, [userOp, projectOp, orgOp]);

	const handleClose = async () => {
		setOpen(false);
	};

	const getOptionLabel = (option) => {
		return option?.displayName || " ";
	};

	useEffect(() => {
		if (allUsers.length === 0) {
			setAllUsers(allOwnUsers);
		}
	}, [allUsers]);

	useEffect(() => {
		if (allProjects.length === 0) {
			setAllProjects(allOwnProjects);
		}
	}, [allProjects]);

	useEffect(() => {
		if (allOrgs.length === 0) {
			setAllOrgs(allOwnOrgs);
		}
	}, [allOrgs]);

	useEffect(() => {
		if (walletId) {
			getWalletContacts();
		}
	}, [walletId]);

	// set users
	const getWalletContacts = async () => {
		await getOwnUsers({ walletId })
			.then((data) => {
				let OnlyUsers = [];
				let OnlyProject = [];
				let OnlyOrg = [];
				data?.length > 0 &&
					data.map((d) => {
						if (d?.profile?.parentModelName === "Pal") {
							if (d?.profile?.parent?.type === "User") {
								const newObj = {
									profileId: d?.profile?._id,
									...d,
								};
								OnlyUsers.push(newObj);
							} else if (
								d?.profile?.parent?.type === "Organization"
							) {
								const newObj = {
									profileId: d?.profile?._id,
									...d,
								};
								OnlyOrg.push(newObj);
							} else if (d?.profile?.parent?.type === "Project") {
								const newObj = {
									profileId: d?.profile?._id,
									...d,
								};
								OnlyProject.push(newObj);
							}
						} else if (d?.profile?.parentModelName === "User") {
							const newObj = {
								profileId: d?.profile?._id,
								...d,
							};
							OnlyUsers.push(newObj);
						} else if (
							d?.profile?.parentModelName === "Organization"
						) {
							const newObj = {
								profileId: d?.profile?._id,
								...d,
							};
							OnlyOrg.push(newObj);
						} else if (d?.profile?.parentModelName === "Project") {
							const newObj = {
								profileId: d?.profile?._id,
								...d,
							};
							OnlyProject.push(newObj);
						}
					});
				let usersGroupById = _.groupBy(OnlyUsers, "profileId");
				let finalOnlyUsers = [];
				for (const key in usersGroupById) {
					let arrObj = usersGroupById[key];
					finalOnlyUsers.push(arrObj[0]);
				}
				usersGroupById = _.groupBy(OnlyOrg, "profileId");
				let finalOnlyOrg = [];
				for (const key in usersGroupById) {
					let arrObj = usersGroupById[key];
					finalOnlyOrg.push(arrObj[0]);
				}
				usersGroupById = _.groupBy(OnlyProject, "profileId");
				let finalOnlyProject = [];
				for (const key in usersGroupById) {
					let arrObj = usersGroupById[key];
					finalOnlyProject.push(arrObj[0]);
				}
				setAllUsers(finalOnlyUsers);
				setAllOrgs(finalOnlyOrg);
				setAllProjects(finalOnlyProject);
				setAllOwnUsers(finalOnlyUsers);
				setAllOwnOrgs(finalOnlyOrg);
				setAllOwnProjects(finalOnlyProject);
			})
			.catch((err) => {
				console.log(err);
			});

		getAccessibleProject({ userProfileId: userProfile })
			.then((data) => {
				setAccessibleProjects(data);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	// for users
	const onChangeUserNameInput = async (value) => {
		if (value.length > 1) {
			await getUserByName({ name: value })
				.then((users) => {
					let allUsers = [];
					users.length > 0 &&
						users.map((user) => {
							if (user?.profile?._id && user?.wallet?._id) {
								const newObj = {
									profileId: user?.profile?._id,
									...user,
								};
								allUsers.push(newObj);
							}
						});
					let filteredOwnUsers = [];
					allOwnUsers.map((user) => {
						let name = user?.displayName;
						const patt = new RegExp(value, "i");
						const res = patt.test(name);
						if (res) {
							filteredOwnUsers.push(user);
						}
					});
					const newUserArr = [...filteredOwnUsers, ...allUsers];
					const usersGroupById = _.groupBy(newUserArr, "profileId");
					let finalUserArr = [];
					for (const key in usersGroupById) {
						let arrObj = usersGroupById[key];
						finalUserArr.push(arrObj[0]);
					}
					setAllUsers(finalUserArr);
				})
				.catch((err) => {
					console.log(err);
				});
		} else if (value.length === 0) {
			setAllUsers(allOwnUsers);
		}
	};

	const onSelectUser = async (value) => {
		setUserObj(value);
		setOrgObj(null);
		setProjectObj(null);
	};

	// for orgs
	const onChangeOrgNameInput = async (value) => {
		if (value.length > 1) {
			await getOrgByName({ name: value })
				.then((orgs) => {
					let allOrgs = [];
					orgs.length > 0 &&
						orgs.map((org) => {
							if (org?.profile?._id && org?.wallet?._id) {
								const newObj = {
									profileId: org?.profile?._id,
									...org,
								};
								allOrgs.push(newObj);
							}
						});
					let filteredOwnOrgs = [];
					allOwnOrgs.map((org) => {
						let name = org?.displayName;
						const patt = new RegExp(value, "i");
						const res = patt.test(name);
						if (res) {
							filteredOwnOrgs.push(org);
						}
					});
					const newOrgArr = [...filteredOwnOrgs, ...allOrgs];
					const orgsGroupById = _.groupBy(newOrgArr, "profileId");
					let finalOrgArr = [];
					for (const key in orgsGroupById) {
						let arrObj = orgsGroupById[key];
						finalOrgArr.push(arrObj[0]);
					}
					setAllOrgs(finalOrgArr);
				})
				.catch((err) => {
					console.log(err);
				});
		} else if (value.length === 0) {
			setAllOrgs(allOwnOrgs);
		}
	};

	const onSelectOrg = async (value) => {
		setUserObj(null);
		setOrgObj(value);
		setProjectObj(null);
	};

	// for projects
	const onChangeProjectNameInput = async (value) => {
		if (value.length > 1) {
			let filteredOwnProjects = [];
			accessibleProjects.map((project) => {
				let name = project?.displayName;
				const patt = new RegExp(value, "i");
				const res = patt.test(name);
				if (res) {
					filteredOwnProjects.push(project);
				}
			});
			let allProjects = [];
			filteredOwnProjects.length > 0 &&
				filteredOwnProjects.map((project) => {
					if (project?.profile?._id && project?.wallet?._id) {
						const newObj = {
							profileId: project?.profile?._id,
							...project,
						};
						allProjects.push(newObj);
					}
				});
			let filteredProjects = [];
			allOwnProjects.map((project) => {
				let name = project?.displayName;
				const patt = new RegExp(value, "i");
				const res = patt.test(name);
				if (res) {
					filteredProjects.push(project);
				}
			});
			const newProjectArr = [...filteredProjects, ...allProjects];
			const projectsGroupById = _.groupBy(newProjectArr, "profileId");
			let finalProjectArr = [];
			for (const key in projectsGroupById) {
				let arrObj = projectsGroupById[key];
				finalProjectArr.push(arrObj[0]);
			}
			console.log(finalProjectArr);
			setAllProjects(finalProjectArr);
		} else if (value.length === 0) {
			setAllProjects(allOwnProjects);
		}
	};

	const onSelectProject = async (value) => {
		setUserObj(null);
		setOrgObj(null);
		setProjectObj(value);
	};

	const findOrAddRel = async (profile) => {
		if (profile) {
			const relObj = {
				profile: profile?._id,
				wallet: walletId,
				addedBy: user?.profile,
				user: user?._id,
				type: relationType,
			};

			await findAndAddRelation(relObj)
				.then((data) => {
					console.log(data);
				})
				.catch((err) => {
					console.log(err);
				});
		}
	};

	const getSimpleOptionLabel = (option) => {
		return option;
	};

	//add user
	const addNewUser = async () => {
		let value = null;
		if (userObj) {
			value = userObj;
		} else if (orgObj) {
			value = orgObj;
		} else if (projectObj) {
			value = projectObj;
		}
		if (value) {
			let newUser = value?.profile;
			setOpen(false);
			setUserObj(null);
			setUserName("");
			setOrgObj(null);
			setOrgName("");
			setProjectObj(null);
			setProjectName("");

			let allParticipants = [];

			userArr?.length > 0 &&
				userArr.map((user, i) => {
					allParticipants.push(user?._id);
				});

			let isCurrentUserExist = allParticipants.includes(newUser?._id);

			if (!isCurrentUserExist) {
				const newUserArr = [...userArr, newUser];
				findOrAddRel(newUser);
				setUserArr(newUserArr);

				const accessableUserWithRoleObj = {
					user: newUser,
					role: defaultType,
				};

				await addUserRole(accessableUserWithRoleObj);
			}
		}
	};

	const UsersComponent = (
		<div className={addCustomerCont}>
			<Autocomplete
				id="free-solo-demo"
				freeSolo
				value={userObj}
				inputValue={userName}
				options={allUsers}
				getOptionLabel={getOptionLabel}
				getOptionSelected={(option) => {
					return option?._id == userObj?._id;
				}}
				onChange={(event, value) => {
					onSelectUser(value);
				}}
				renderInput={(params) => (
					<TextField
						{...params}
						label="User"
						margin="normal"
						variant="outlined"
					/>
				)}
				onInputChange={(event, newValue) => {
					setUserName(newValue);
					onChangeUserNameInput(newValue);
				}}
				renderOption={(option, state) => {
					if (option) {
						return (
							<div className={optionCont}>
								<div className={optionImgCont}>
									<Avatar
										alt={option?.displayName}
										src={option?.displayPicture?.thumbUrl}
									/>
								</div>
								<div className={optionInfoCont}>
									<div>{option?.displayName}</div>
								</div>
							</div>
						);
					} else {
						return null;
					}
				}}
				style={{ width: "300px" }}
			/>
		</div>
	);
	const ProjectComponent = (
		<div className={addCustomerCont}>
			<Autocomplete
				id="free-solo-demo"
				freeSolo
				value={projectObj}
				inputValue={projectName}
				options={allProjects}
				getOptionLabel={getOptionLabel}
				getOptionSelected={(option) => {
					return option?._id == projectObj?._id;
				}}
				onChange={(event, value) => {
					onSelectProject(value);
				}}
				renderInput={(params) => (
					<TextField
						{...params}
						label="Project"
						margin="normal"
						variant="outlined"
					/>
				)}
				onInputChange={(event, newValue) => {
					setProjectName(newValue);
					onChangeProjectNameInput(newValue);
				}}
				renderOption={(option, state) => {
					if (option) {
						return (
							<div className={optionCont}>
								<div className={optionImgCont}>
									<Avatar
										alt={option?.displayName}
										src={option?.displayPicture?.thumbUrl}
									/>
								</div>
								<div className={optionInfoCont}>
									<div>{option?.displayName}</div>
								</div>
							</div>
						);
					} else {
						return null;
					}
				}}
				style={{ width: "300px" }}
			/>
		</div>
	);
	const OrganizationComponent = (
		<div className={addCustomerCont}>
			<Autocomplete
				id="free-solo-demo"
				freeSolo
				value={orgObj}
				inputValue={orgName}
				options={allOrgs}
				getOptionLabel={getOptionLabel}
				getOptionSelected={(option) => {
					return option?._id == userObj?._id;
				}}
				onChange={(event, value) => {
					onSelectOrg(value);
				}}
				renderInput={(params) => (
					<TextField
						{...params}
						label="Organization"
						margin="normal"
						variant="outlined"
					/>
				)}
				onInputChange={(event, newValue) => {
					setOrgName(newValue);
					onChangeOrgNameInput(newValue);
				}}
				renderOption={(option, state) => {
					if (option) {
						return (
							<div className={optionCont}>
								<div className={optionImgCont}>
									<Avatar
										alt={option?.displayName}
										src={option?.displayPicture?.thumbUrl}
									/>
								</div>
								<div className={optionInfoCont}>
									<div>{option?.displayName}</div>
								</div>
							</div>
						);
					} else {
						return null;
					}
				}}
				style={{ width: "300px" }}
			/>
		</div>
	);

	return (
		<>
			<div className={classes.shareWithCont}>
				{userRoleArr?.length > 0 &&
					userRoleArr.map((userWithRole, i) => (
						<div key={i} className={classes.showSecondPartyCont}>
							<div className={classes.showSecondPartyImgCont}>
								<Avatar
									alt={
										userWithRole?.user?.parent?.displayName
									}
									src={
										userWithRole?.user?.parent
											?.displayPicture?.thumbUrl
									}
								/>
							</div>
							<div
								className={classes.showSecondPartyInfoCont}
								style={{
									whiteSpace: "nowrap",
									overflow: "hidden",
									textOverflow: "ellipsis",
								}}
							>
								<Typography
									style={{
										fontSize: "16px",
										fontWeight: "550",
										overflow: "hidden",
										textOverflow: "ellipsis",
									}}
								>
									{userWithRole?.user?.parent?.displayName}
								</Typography>
							</div>
							<div className={classes.secondPartyEditCont}>
								<Autocomplete
									id={"Role Type"}
									size="small"
									value={userWithRole?.role}
									options={roles}
									getOptionLabel={getSimpleOptionLabel}
									getOptionSelected={(option) => {
										return option == userWithRole?.role;
									}}
									style={{ width: "100%" }}
									onChange={(event, value) => {
										if (updateRoleOfUserRole) {
											updateRoleOfUserRole(value, i);
										}
									}}
									renderInput={(params) => (
										<TextField
											{...params}
											label={"Role Type"}
											variant="outlined"
										/>
									)}
								/>
							</div>
							<div className={classes.secondPartyCancleCont}>
								<IconButton
									color="primary"
									onClick={() => {
										removeUserRole(userWithRole?.user?._id);
										if (userWithRole?._id) {
											//deleting an object which is stored in backend
											if (setDeleteRoles) {
												setDeleteRoles((prev) => {
													return [
														...(prev || []),
														userWithRole?._id,
													];
												});
											}
										}
									}}
								>
									<ClearIcon />
								</IconButton>
							</div>
						</div>
					))}
			</div>

			<div className={classes.addBtnCont}>
				<div></div>
				<Button
					variant="contained"
					size="large"
					color="primary"
					onClick={() => {
						setOpen(true);
					}}
					className={classes.addBtn}
				>
					<AddIcon />
					Add New
				</Button>
			</div>

			<Dialog
				open={open}
				onClose={handleClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogContent>
					{(userOp && !projectOp && !orgOp) ||
					(!userOp && projectOp && !orgOp) ||
					(!userOp && !projectOp && orgOp) ? (
						<>
							<>{userOp ? UsersComponent : null}</>
							<>{projectOp ? ProjectComponent : null}</>
							<>{orgOp ? OrganizationComponent : null}</>
						</>
					) : (
						<MyNavBar
							title={""}
							show={show}
							setShow={setShow}
							walletId={walletId}
							isMenu={false}
							Component={null}
							options={[
								userOp && {
									value: "user",
									label: "User",
									Component: UsersComponent,
								},
								projectOp && {
									value: "project",
									label: "Project",
									Component: ProjectComponent,
								},
								orgOp && {
									value: "organization",
									label: "Organization",
									Component: OrganizationComponent,
								},
							]}
						/>
					)}
				</DialogContent>
				<div className={bottomAct}>
					<Button
						onClick={handleClose}
						variant="contained"
						size="small"
						color="primary"
					>
						Cancel
					</Button>
					<Button
						onClick={() => {
							addNewUser();
						}}
						variant="contained"
						size="small"
						color="primary"
					>
						Save & Close
					</Button>
				</div>
			</Dialog>
		</>
	);
}
