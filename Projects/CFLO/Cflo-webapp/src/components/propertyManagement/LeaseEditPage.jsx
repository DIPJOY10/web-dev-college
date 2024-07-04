import {
	Button,
	Divider,
	FormControl,
	Grid,
	IconButton,
	InputLabel,
	ListSubheader,
	makeStyles,
	Menu,
	MenuItem,
	Paper,
	Select,
	TextareaAutosize,
	TextField,
	Typography,
} from "@material-ui/core";
import DateFnsUtils from "@date-io/date-fns";
import {
	KeyboardDatePicker,
	MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import React, { useRef, useState } from "react";
import ExpandCard from "../styled/CommonComponents/ExpandCard";
import AddIcon from "@material-ui/icons/Add";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import DialogActions from "@material-ui/core/DialogActions";

const useStyles = makeStyles((theme) => ({
	root: {
		marginTop: "66px",
	},
	listSection: {
		backgroundColor: "inherit",
	},
	ul: {
		backgroundColor: "inherit",
		padding: 0,
	},

	loaderCont: {
		position: "fixed",
		top: "0px",
		right: "0px",
		width: "100vw",
		height: "100vh",
		zIndex: "1000",
		paddingLeft: "100px",
		backgroundColor: "rgba(0, 0, 0, 0.7)",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		[theme.breakpoints.down("xs")]: {
			paddingLeft: "0px",
		},
	},

	unitEditHeader: {
		width: "100%",
		position: "absolute",
		left: "0px",
		display: "flex",
		top: "0px",
		justifyContent: "space-between",
		alignItems: "center",
		padding: "15px 20px",
		marginTop: "0px",
		marginBottom: "0px",
		backgroundColor: "#ffffff",
		zIndex: "10",
		boxShadow: "rgba(0, 0, 0, 0.05) 0px 1px 2px 0px",
	},

	unitTitle: {
		fontSize: "20px",
		fontWeight: "520",
		marginLeft: "20px",
		opacity: "0.8",
	},
	backIcon: {
		fontSize: "35px",
		opacity: "0.8",
		cursor: "pointer",
	},
	unitEditBody: {
		width: "100%",
		display: "flex",
		marginTop: "20px",
		justifyContent: "space-between",
	},
	sideNavBar: {
		minHeight: "calc(100vh - 70px)",
		width: "20%",
		// borderRight: '1px solid #BDBDBD',
		paddingTop: "30px",
		paddingLeft: "20px",
		backgroundColor: "#ffffff",
	},
	editMainCont: {
		width: "80%",
		padding: "20px",
		paddingBottom: "40px",
	},
	singleOption: {
		display: "flex",
		alignItems: "center",
		height: "47px",
		fontSize: "16px",
		fontWeight: "530",
		cursor: "pointer",
		backgroundColor: "#FFFFFF",
		"&:hover": {
			background: "#e7e7e7",
		},
	},
	selectedSingleOption: {
		display: "flex",
		alignItems: "center",
		height: "47px",
		fontSize: "16px",
		fontWeight: "530",
		cursor: "pointer",
		background: "#e7e7e7",
	},
	sideBlue: {
		width: "4px",
		height: "47px",
		marginRight: "5px",
		marginLeft: "-8px",
		backgroundColor: "#46A8F1",
	},
	displayNone: {
		display: "none",
	},
	iconStyle: {
		fontSize: "27px",
		marginRight: "10px",
	},
	editStyle: {
		color: "#46A8F1",
		marginLeft: "10px",
		cursor: "pointer",
	},
	showDisplayRow: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		gap: "10px",
	},
	datePicker: {
		marginTop: "0",
	},
	link: {
		color: "#2a7ab0",
		cursor: "pointer",
		"&:hover": {
			textDecoration: "underline",
		},
	},
	text: {
		fontSize: 20,
		fontWeight: "bold",
		margin: "0rem 1rem",
	},
}));
const incomeAccounts = [
	"Application Fee Income",
	"Association Fee Income",
	"Cleaning and Maint Income",
	"Convenience Fee",
	"Interest Income",
	"Late Fee Income",
	"Laundry Income",
	"NSF Fee Income",
	"Other Income",
	"Owner Contribution Convenience Fee",
	"Parking Income",
	"Renters Insurance Income",
	"Repairs Income",
	"Utility Income",
];
let liabilityAccounts = [
	"Last Month's Rent",
	"Prepayments",
	"Security Deposit Liability",
];
function LeaseEditPage() {
	const classes = useStyles();
	const [leaseType, setLeaseType] = useState("unsigned");
	const [anchorEl, setAnchorEl] = React.useState(null);
	const [leaseDetails, setLeaseDetails] = useState({
		leaseType: -1,
		startDate: Date.now(),
		dueDate: Date.now(),
		leasingAgent: -1,
	});
	const [tenants, setTenants] = useState(null);
	const [rentData, setRentData] = useState({
		rentCycle: "",
		amount: "",
		nextDueDate: Date.now(),
		memo: "",
		account: "",
	});
	const [securityDepositData, setSecurityDepositData] = useState({
		amount: "",
		nextDueDate: Date.now(),
	});
	const [oneTimePayments, setOneTimePayments] = useState({
		data: [{ amount: "", dueDate: Date.now(), account: "", memo: "" }],
		length: 1,
	});
	const [recurringCharges, setRecurringCharges] = useState({
		data: [
			{
				amount: "",
				dueDate: Date.now(),
				account: "",
				memo: "",
				rentCycle: "",
			},
		],
		length: 1,
	});
	const [tenantDateTemp, setTenantDateTemp] = useState(Date.now());
	const tenantDialogData = useRef({
		contactInfo: {
			firstName: "",
			lastName: "",
			phoneNumber: "",
			email: "",
			address: {
				line1: "",
				line2: "",
				city: "",
				state: "",
				zip: "",
				country: "",
			},
		},
		personalInfo: {
			dob: "",
			taxpayerID: "",
			comments: "",
		},
		emergencyContact: {
			contactName: "",
			relation: "",
			email: "",
			phone: "",
		},
	});
	const [openDialog, setOpenDialog] = React.useState(false);
	const handleClose = () => {
		setOpenDialog(false);
	};
	const handleSelectChange = (func, key, value) => {
		func((prev) => {
			return { ...prev, [key]: value };
		});
	};
	const handleMenuClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};
	const handleTenantSubmit = () => {
		// perform error checks to see if required fields are filled by user or not
		tenantDialogData.current.personalInfo = tenantDateTemp;
		console.log("ten", tenantDialogData);
		setTenants({
			name: `${tenantDialogData.current.contactInfo.firstName}  ${tenantDialogData.current.contactInfo.lastName}`,
			email: tenantDialogData.current.contactInfo.email || "N/A",
			phone: tenantDialogData.current.contactInfo.phoneNumber || "N/A",
		});
		handleClose();
	};
	return (
		<div>
			<Paper square>
				<Paper style={{ padding: "2rem" }}>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<Typography variant="h5">
								Signature Status
							</Typography>
						</Grid>
						<Grid item xs={12} style={{ margin: "0 20%" }}>
							<div style={{ width: "100%" }}>
								<Button
									variant={
										leaseType == "unsigned"
											? "outlined"
											: "contained"
									}
									color="primary"
									style={{ width: "50%" }}
									onClick={() => {
										setLeaseType("signed");
									}}
								>
									Signed
								</Button>
								<Button
									variant={
										leaseType == "unsigned"
											? "contained"
											: "outlined"
									}
									color="primary"
									style={{ width: "50%" }}
									onClick={() => {
										setLeaseType("unsigned");
									}}
								>
									Unsigned
								</Button>
							</div>
						</Grid>
						<Grid item xs={12}>
							<Typography variant="h5">Lease Deatils</Typography>
						</Grid>
						<Grid item xs={6} sm={4}>
							<FormControl
								variant="outlined"
								className={classes.formControl}
								style={{ width: "100%" }}
							>
								<InputLabel id="demo-simple-select-outlined-label">
									Lease Type*
								</InputLabel>
								<Select
									labelId="demo-simple-select-outlined-label"
									id="demo-simple-select-outlined"
									value={leaseDetails.leaseType}
									defaultValue={-1}
									onChange={(e) =>
										setLeaseDetails((prev) => {
											return {
												...prev,
												leaseType: e.target.value,
											};
										})
									}
									label="Lease Type"
								>
									<MenuItem value={-1}>
										<>Fixed</>
									</MenuItem>
									<MenuItem value={10}>Ten</MenuItem>
									<MenuItem value={20}>Twenty</MenuItem>
									<MenuItem value={30}>Thirty</MenuItem>
								</Select>
							</FormControl>
						</Grid>
						<Grid item xs={6} sm={4}>
							<div style={{ display: "flex", gap: "10px" }}>
								<MuiPickersUtilsProvider utils={DateFnsUtils}>
									<KeyboardDatePicker
										value={leaseDetails.startDate}
										className={classes.datePicker}
										margin="normal"
										id="date-picker-dialog"
										label="Start Date"
										format="MM/dd/yyyy"
										onChange={(date) => {
											setLeaseDetails((prev) => {
												return {
													...prev,
													startDate: date,
												};
											});
										}}
										KeyboardButtonProps={{
											"aria-label": "change date",
										}}
									/>

									<KeyboardDatePicker
										value={leaseDetails.dueDate}
										className={classes.datePicker}
										margin="normal"
										id="due-date-picker"
										label="Due Date"
										format="MM/dd/yyyy"
										onChange={(date) => {
											setLeaseDetails((prev) => {
												return {
													...prev,
													dueDate: date,
												};
											});
										}}
										KeyboardButtonProps={{
											"aria-label": "change date",
										}}
									/>
								</MuiPickersUtilsProvider>
							</div>
						</Grid>
						<Grid item xs={6} sm={4}>
							{leaseType == "unsigned" && (
								<FormControl
									variant="outlined"
									className={classes.formControl}
									style={{ width: "100%" }}
								>
									<InputLabel id="demo-simple-select-outlined-label">
										Leasing Agent
									</InputLabel>
									<Select
										labelId="demo-simple-select-outlined-label"
										id="demo-simple-select-outlined"
										value={leaseDetails.leasingAgent}
										defaultValue={-1}
										onChange={(e) => {
											setLeaseDetails((prev) => {
												return {
													...prev,
													leasingAgent:
														e.target.value,
												};
											});
										}}
										label="Leasing Agent"
									>
										<MenuItem value={-1}>
											<>Select an agent...</>
										</MenuItem>
										<MenuItem value={10}>Ten</MenuItem>
										<MenuItem value={20}>Twenty</MenuItem>
										<MenuItem value={30}>Thirty</MenuItem>
									</Select>
								</FormControl>
							)}
						</Grid>
						<Grid item xs={12}>
							<Divider />
						</Grid>
						<Grid item xs={12}>
							<Typography variant="h5">
								{" "}
								Tenants and cosigners
							</Typography>
						</Grid>
						<Grid item xs={12}>
							{!tenants && (
								<div
									style={{ display: "flex", gap: "10px" }}
									className={classes.link}
									onClick={() => {
										setOpenDialog(true);
									}}
								>
									<AddIcon />{" "}
									<Typography>Add Tenant</Typography>
								</div>
							)}
							<div>
								<Dialog
									open={openDialog}
									onClose={handleClose}
									aria-labelledby="alert-dialog-title"
									maxWidth={"md"}
									fullWidth
									aria-describedby="alert-dialog-description"
								>
									<DialogTitle id="alert-dialog-title">
										Add Tenant
									</DialogTitle>
									<DialogContent>
										<div
											style={{
												display: "flex",
												flexDirection: "column",
												gap: "15px",
											}}
										>
											<ExpandCard
												fields={{
													title: "Contact information",
													titleStyle: {
														backgroundColor:
															"rgb(26 145 218)",
														color: "white",
														border: "1px solid black",
													},
													initialFlag: true,
													body: (
														<>
															<Grid
																container
																spacing={2}
															>
																<Grid
																	item
																	xs={12}
																	sm={6}
																>
																	<Typography>
																		First
																		Name*
																	</Typography>
																	<TextField
																		defaultValue={
																			tenantDialogData
																				.current
																				.contactInfo
																				.firstName
																		}
																		onChange={(
																			e
																		) => {
																			tenantDialogData.current.contactInfo.firstName =
																				e.target.value;
																		}}
																		fullWidth
																		variant="outlined"
																	/>
																</Grid>
																<Grid
																	item
																	xs={12}
																	sm={6}
																>
																	<Typography>
																		Last
																		Name
																	</Typography>
																	<TextField
																		defaultValue={
																			tenantDialogData
																				.current
																				.contactInfo
																				.lastName
																		}
																		onChange={(
																			e
																		) =>
																		(tenantDialogData.current.contactInfo.lastName =
																			e.target.value)
																		}
																		fullWidth
																		variant="outlined"
																	/>
																</Grid>
																<Grid
																	item
																	xs={12}
																	sm={6}
																>
																	<Typography>
																		Phone
																		Number
																	</Typography>
																	<TextField
																		defaultValue={
																			tenantDialogData
																				.current
																				.contactInfo
																				.phoneNumber
																		}
																		type="number"
																		onChange={(
																			e
																		) =>
																		(tenantDialogData.current.contactInfo.phoneNumber =
																			e.target.value)
																		}
																		fullWidth
																		variant="outlined"
																	/>
																</Grid>
																<Grid
																	item
																	xs={12}
																	sm={6}
																>
																	<Typography>
																		Email
																	</Typography>
																	<TextField
																		defaultValue={
																			tenantDialogData
																				.current
																				.contactInfo
																				.email
																		}
																		fullWidth
																		onChange={(
																			e
																		) =>
																		(tenantDialogData.current.contactInfo.email =
																			e.target.value)
																		}
																		variant="outlined"
																	/>
																</Grid>
																<Grid
																	item
																	xs={12}
																>
																	<div
																		style={{
																			width: "100%",
																		}}
																	>
																		<Typography>
																			Street
																			Address
																		</Typography>
																	</div>
																	<div
																		className={
																			classes.multiInput
																		}
																	>
																		<div
																			className={
																				classes.inputCont
																			}
																		>
																			<div
																				style={{
																					display:
																						"flex",
																					flexDirection:
																						"column",
																					flexWrap:
																						"wrap",
																					gap: "8px",
																				}}
																			>
																				<div
																					style={{
																						width: "100%",
																						display:
																							"flex",
																						flexWrap:
																							"wrap",
																						gap: "8px",
																					}}
																				>
																					<TextField
																						defaultValue={
																							tenantDialogData
																								.current
																								.contactInfo
																								.address
																								.line1
																						}
																						onChange={(
																							e
																						) =>
																						(tenantDialogData.current.contactInfo.address.line1 =
																							e.target.value)
																						}
																						id="outlined-basic"
																						size="small"
																						label={
																							"Line 1"
																						}
																						fullWidth
																						variant="outlined"
																					/>
																					<TextField
																						defaultValue={
																							tenantDialogData
																								.current
																								.contactInfo
																								.address
																								.line2
																						}
																						onChange={(
																							e
																						) =>
																						(tenantDialogData.current.contactInfo.address.line2 =
																							e.target.value)
																						}
																						id="outlined-basic"
																						size="small"
																						label={
																							"Line 2"
																						}
																						fullWidth
																						variant="outlined"
																					/>
																				</div>
																				<div
																					style={{
																						width: "100%",
																						display:
																							"flex",
																						justifyContent:
																							"space-between",
																					}}
																				>
																					<TextField
																						defaultValue={
																							tenantDialogData
																								.current
																								.contactInfo
																								.address
																								.city
																						}
																						onChange={(
																							e
																						) =>
																						(tenantDialogData.current.contactInfo.address.city =
																							e.target.value)
																						}
																						id="outlined-basic"
																						size="small"
																						label="City"
																						variant="outlined"
																						className={
																							classes.tripleInput
																						}
																					/>
																					<TextField
																						defaultValue={
																							tenantDialogData
																								.current
																								.contactInfo
																								.address
																								.state
																						}
																						onChange={(
																							e
																						) =>
																						(tenantDialogData.current.contactInfo.address.state =
																							e.target.value)
																						}
																						id="outlined-basic"
																						size="small"
																						label="State"
																						variant="outlined"
																						className={
																							classes.tripleInput
																						}
																					/>
																					<TextField
																						defaultValue={
																							tenantDialogData
																								.current
																								.contactInfo
																								.address
																								.zip
																						}
																						type="number"
																						onChange={(
																							e
																						) =>
																						(tenantDialogData.current.contactInfo.address.zip =
																							e.target.value)
																						}
																						id="outlined-basic"
																						size="small"
																						label="Zip"
																						variant="outlined"
																						className={
																							classes.tripleInput
																						}
																					/>
																				</div>
																				<div
																					style={{
																						width: "100%",
																					}}
																				>
																					<TextField
																						defaultValue={
																							tenantDialogData
																								.current
																								.contactInfo
																								.address
																								.country
																						}
																						onChange={(
																							e
																						) =>
																						(tenantDialogData.current.contactInfo.address.country =
																							e.target.value)
																						}
																						id="outlined-basic"
																						size="small"
																						label="Counrty"
																						fullWidth
																						variant="outlined"
																					/>
																				</div>
																			</div>
																		</div>
																	</div>
																</Grid>
															</Grid>
														</>
													),
												}}
											/>
											<ExpandCard
												fields={{
													title: "Personal information",
													titleStyle: {
														backgroundColor:
															"rgb(26 145 218)",
														color: "white",
														border: "1px solid black",
													},
													body: (
														<>
															<Grid
																container
																spacing={2}
															>
																<Grid
																	item
																	xs={4}
																>
																	<MuiPickersUtilsProvider
																		utils={
																			DateFnsUtils
																		}
																	>
																		<KeyboardDatePicker
																			value={
																				tenantDateTemp
																			}
																			className={
																				classes.datePicker
																			}
																			margin="normal"
																			id="date-picker-dialog"
																			label="Date of Birth"
																			format="MM/dd/yyyy"
																			onChange={(
																				date
																			) => {
																				setTenantDateTemp(
																					date
																				);
																			}}
																			KeyboardButtonProps={{
																				"aria-label":
																					"change date",
																			}}
																		/>
																	</MuiPickersUtilsProvider>
																</Grid>
																<Grid
																	item
																	xs={8}
																>
																	<TextField
																		defaultValue={
																			tenantDialogData
																				.current
																				.personalInfo
																				.taxpayerID
																		}
																		onChange={(
																			e
																		) =>
																		(tenantDialogData.current.personalInfo.taxpayerID =
																			e.target.value)
																		}
																		label="Taxpayer ID"
																		fullWidth
																		variant="outlined"
																	/>
																</Grid>
																<Grid
																	item
																	xs={12}
																>
																	<Typography>
																		Comments
																	</Typography>
																	<TextareaAutosize
																		defaultValue={
																			tenantDialogData
																				.current
																				.personalInfo
																				.comments
																		}
																		onChange={(
																			e
																		) =>
																		(tenantDialogData.current.personalInfo.comments =
																			e.target.value)
																		}
																		style={{
																			width: "100%",
																		}}
																		aria-label="minimum height"
																		minRows={
																			5
																		}
																	/>
																</Grid>
															</Grid>
														</>
													),
												}}
											/>
											<ExpandCard
												fields={{
													title: "Emergency Contact",
													titleStyle: {
														backgroundColor:
															"rgb(26 145 218)",
														color: "white",
														border: "1px solid black",
													},
													body: (
														<>
															<Grid
																container
																spacing={2}
															>
																<Grid
																	item
																	xs={6}
																>
																	<Typography>
																		Contact
																		Name
																	</Typography>
																	<TextField
																		defaultValue={
																			tenantDialogData
																				.current
																				.emergencyContact
																				.contactName
																		}
																		variant="outlined"
																		onChange={(
																			e
																		) => {
																			tenantDialogData.current.emergencyContact.contactName =
																				e.target.value;
																		}}
																		fullWidth
																	/>
																</Grid>
																<Grid
																	item
																	xs={6}
																>
																	<Typography>
																		Relation
																		To
																		Tenant
																	</Typography>
																	<TextField
																		defaultValue={
																			tenantDialogData
																				.current
																				.emergencyContact
																				.relation
																		}
																		onChange={(
																			e
																		) => {
																			tenantDialogData.current.emergencyContact.relation =
																				e.target.value;
																		}}
																		variant="outlined"
																		fullWidth
																	/>
																</Grid>
																<Grid
																	item
																	xs={6}
																>
																	<Typography>
																		Email
																	</Typography>
																	<TextField
																		defaultValue={
																			tenantDialogData
																				.current
																				.emergencyContact
																				.email
																		}
																		onChange={(
																			e
																		) => {
																			tenantDialogData.current.emergencyContact.email =
																				e.target.value;
																		}}
																		variant="outlined"
																		fullWidth
																	/>
																</Grid>
																<Grid
																	item
																	xs={6}
																>
																	<Typography>
																		Phone
																	</Typography>
																	<TextField
																		defaultValue={
																			tenantDialogData
																				.current
																				.emergencyContact
																				.phoneNumber
																		}
																		onChange={(
																			e
																		) => {
																			tenantDialogData.current.emergencyContact.phoneNumber =
																				e.target.value;
																		}}
																		variant="outlined"
																		fullWidth
																	/>
																</Grid>
															</Grid>
														</>
													),
												}}
											/>
										</div>
									</DialogContent>
									<DialogActions>
										<Button
											onClick={handleTenantSubmit}
											color="primary"
											variant="contained"
										>
											Add Tenant
										</Button>
										<Button
											onClick={handleClose}
											color="primary"
											autoFocus
										>
											Cancel
										</Button>
									</DialogActions>
								</Dialog>
							</div>
							{tenants && (
								<div
									style={{
										display: "flex",
										padding: "1rem",
										border: "1px solid lightgray",
										margin: "0.5rem",
										marginTop: "1rem",
										borderRadius: "9px",
										justifyContent: "space-between",
									}}
								>
									<div>
										<Typography>Tenant</Typography>
										<Typography>{tenants.name}</Typography>
									</div>
									<div>
										<Typography>Email Address</Typography>
										<Typography>{tenants.email}</Typography>
									</div>
									<div>
										<Typography>Mobile Phone</Typography>
										<Typography>{tenants.phone}</Typography>
									</div>

									<div>
										<IconButton onClick={handleMenuClick}>
											<MoreVertIcon />
										</IconButton>
										<Menu
											id="simple-menu"
											anchorEl={anchorEl}
											keepMounted
											open={Boolean(anchorEl)}
											onClose={handleMenuClose}
										>
											<MenuItem
												onClick={() => {
													setOpenDialog(true);
													handleMenuClose();
												}}
											>
												Edit
											</MenuItem>
											<MenuItem
												onClick={() => {
													tenantDialogData.current = {
														contactInfo: {
															firstName: "",
															lastName: "",
															phoneNumber: "",
															email: "",
															address: {
																line1: "",
																line2: "",
																city: "",
																state: "",
																zip: "",
																country: "",
															},
														},
														personalInfo: {
															dob: "",
															taxpayerID: "",
															comments: "",
														},
														emergencyContact: {
															contactName: "",
															relation: "",
															email: "",
															phone: "",
														},
													};
													setTenants(null);
													handleMenuClose();
												}}
											>
												Remove
											</MenuItem>
										</Menu>
									</div>
								</div>
							)}
						</Grid>
						<Grid item xs={12}>
							<Divider />
						</Grid>
						<Grid item xs={12}>
							<Typography variant="h5">Rent</Typography>
						</Grid>
						<Grid item xs={12}>
							<FormControl
								variant="outlined"
								style={{ width: "100%" }}
							>
								<InputLabel id="demo-simple-select-outlined-label">
									Rent Cycle
								</InputLabel>
								<Select
									labelId="demo-simple-select-outlined-label"
									id="demo-simple-select-outlined"
									// onChange={handleChange}
									label="Rent Cycle"
									value={rentData.rentCycle}
									onChange={(e) =>
										handleSelectChange(
											setRentData,
											"rentCycle",
											e.target.value
										)
									}
									defaultValue={4}
								>
									<MenuItem value={1}>Daily</MenuItem>
									<MenuItem value={2}>Weekly</MenuItem>
									<MenuItem value={3}>Bi-Weekly</MenuItem>
									<MenuItem value={4}>Monthly</MenuItem>
									<MenuItem value={5}>
										Every Two Months
									</MenuItem>
									<MenuItem value={6}>Quarterly</MenuItem>
									<MenuItem value={7}>
										Every Six Months
									</MenuItem>
									<MenuItem value={8}>Yearly</MenuItem>
								</Select>
							</FormControl>
						</Grid>
						<Grid item xs={6} sm={4}>
							<TextField
								fullWidth
								type="number"
								value={rentData.amount}
								onChange={(e) =>
									handleSelectChange(
										setRentData,
										"amount",
										e.target.value
									)
								}
								variant="outlined"
								label="Amount"
							/>
						</Grid>
						<Grid item xs={6} sm={4}>
							<div
								style={{
									display: "flex",
									justifyContent: "center",
								}}
							>
								<MuiPickersUtilsProvider utils={DateFnsUtils}>
									<KeyboardDatePicker
										value={rentData.nextDueDate}
										className={classes.datePicker}
										margin="normal"
										id="due-date-picker"
										label="Next Due Date"
										format="MM/dd/yyyy"
										onChange={(date) => {
											handleSelectChange(
												setRentData,
												"nextDueDate",
												date
											);
										}}
										KeyboardButtonProps={{
											"aria-label": "change date",
										}}
									/>
								</MuiPickersUtilsProvider>
							</div>
						</Grid>
						<Grid item xs={6} sm={4}>
							<FormControl
								variant="outlined"
								className={classes.formControl}
								style={{ width: "100%" }}
							>
								<InputLabel id="demo-simple-select-outlined-label">
									Account*
								</InputLabel>
								<Select
									labelId="demo-simple-select-outlined-label"
									id="demo-simple-select-outlined"
									value={rentData.account}
									defaultValue={-1}
									onChange={(e) =>
										handleSelectChange(
											setRentData,
											"account",
											e.target.value
										)
									}
									label="Leasing Agent"
								>
									<MenuItem value={-1}>
										<em>Select One</em>
									</MenuItem>
									<ListSubheader>
										Income Accounts
									</ListSubheader>
									{incomeAccounts.map((item, idx) => (
										<MenuItem key={idx} value={item}>
											{item}
										</MenuItem>
									))}

									<ListSubheader>
										Liability accounts
									</ListSubheader>
									{liabilityAccounts.map((item, idx) => (
										<MenuItem key={idx} value={item}>
											{item}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								fullWidth
								value={rentData.memo}
								onChange={(e) =>
									handleSelectChange(
										setRentData,
										"memo",
										e.target.value
									)
								}
								variant="outlined"
								label="Memo"
								placeholder='If left blank, will show "Rent"'
							/>
						</Grid>
						<Grid item xs={12}>
							<Divider />
						</Grid>
						<Grid item xs={12}>
							<Typography variant="h5">
								Security deposit
							</Typography>
						</Grid>
						<Grid item xs={6} sm={4}>
							<TextField
								fullWidth
								value={securityDepositData.amount}
								onChange={(e) =>
									handleSelectChange(
										setSecurityDepositData,
										"amount",
										e.target.data
									)
								}
								variant="outlined"
								label="Amount"
							/>
						</Grid>
						<Grid item xs={6} sm={4}>
							<div
								style={{
									display: "flex",
									justifyContent: "center",
								}}
							>
								<MuiPickersUtilsProvider utils={DateFnsUtils}>
									<KeyboardDatePicker
										value={securityDepositData.nextDueDate}
										className={classes.datePicker}
										margin="normal"
										id="due-date-picker"
										label="Due Date"
										format="MM/dd/yyyy"
										onChange={(date) => {
											handleSelectChange(
												setSecurityDepositData,
												"nextDueDate",
												date
											);
										}}
										KeyboardButtonProps={{
											"aria-label": "change date",
										}}
									/>
								</MuiPickersUtilsProvider>
							</div>
						</Grid>
						<Grid item xs={12}>
							<Typography>
								Don't forget to record the payment once you have
								collected the deposit.
							</Typography>
						</Grid>
						<Grid item xs={12}>
							<Divider />
						</Grid>
						<Grid item xs={12}>
							<Typography variant="h5">
								One Time Payments
							</Typography>
						</Grid>
						{oneTimePayments.data.map((obj, idx) => (
							<>
								<Grid item xs={6} sm={4}>
									<TextField
										fullWidth
										value={obj.amount}
										type="number"
										onChange={(e) => {
											setOneTimePayments((prev) => {
												let data = prev.data;
												data[idx]["amount"] =
													e.target.value;
												return {
													data: data,
													length: prev.length,
												};
											});
										}}
										variant="outlined"
										label="Amount"
									/>
								</Grid>
								<Grid item xs={6} sm={4}>
									<div
										style={{
											display: "flex",
											justifyContent: "center",
										}}
									>
										<MuiPickersUtilsProvider
											utils={DateFnsUtils}
										>
											<KeyboardDatePicker
												value={obj.dueDate}
												className={classes.datePicker}
												margin="normal"
												id="due-date-picker"
												label="Next Due Date"
												format="MM/dd/yyyy"
												onChange={(date) => {
													setOneTimePayments(
														(prev) => {
															let data =
																prev.data;
															data[idx][
																"dueDate"
															] = date;
															return {
																data: data,
																length: prev.length,
															};
														}
													);
												}}
												KeyboardButtonProps={{
													"aria-label": "change date",
												}}
											/>
										</MuiPickersUtilsProvider>
									</div>
								</Grid>
								<Grid item xs={6} sm={4}>
									<FormControl
										variant="outlined"
										className={classes.formControl}
										style={{ width: "100%" }}
									>
										<InputLabel id="demo-simple-select-outlined-label">
											Account*
										</InputLabel>
										<Select
											labelId="demo-simple-select-outlined-label"
											id="demo-simple-select-outlined"
											value={obj.account}
											defaultValue={-1}
											onChange={(e) => {
												setOneTimePayments((prev) => {
													let data = prev.data;
													data[idx]["account"] =
														e.target.value;
													return {
														data: data,
														length: prev.length,
													};
												});
											}}
											label="Account"
										>
											<MenuItem value={-1}>
												<em>Select One</em>
											</MenuItem>
											<ListSubheader>
												Income Accounts
											</ListSubheader>
											{incomeAccounts.map((item, idx) => (
												<MenuItem
													key={idx}
													value={item}
												>
													{item}
												</MenuItem>
											))}

											<ListSubheader>
												Liability accounts
											</ListSubheader>
											{liabilityAccounts.map(
												(item, idx) => (
													<MenuItem
														key={idx}
														value={item}
													>
														{item}
													</MenuItem>
												)
											)}
										</Select>
									</FormControl>
								</Grid>
								<Grid item xs={12} sm={6}>
									<TextField
										fullWidth
										variant="outlined"
										label="Memo"
									/>
								</Grid>
								<Grid item xs={6} sm={4}>
									<div
										className={classes.link}
										style={
											oneTimePayments.length == 1
												? { display: "none" }
												: {
													display: "flex",
													alignItems: "center",
													height: "100%",
												}
										}
										onClick={() => {
											setOneTimePayments((prev) => {
												return {
													data: [
														...prev.data.slice(
															0,
															idx
														),
														...prev.data.slice(
															idx + 1
														),
													],
													length: prev.length - 1,
												};
											});
										}}
									>
										Remove [X]
									</div>
								</Grid>
								<Grid item xs={12}></Grid>
							</>
						))}
						<Grid item xs={12}>
							<div style={{ display: "flex", gap: "10px" }}>
								<AddIcon
									onClick={() => {
										setOneTimePayments((prev) => {
											return {
												data: [
													...prev.data,
													{
														amount: "",
														dueDate: Date.now(),
														account: "",
														memo: "",
													},
												],
												length: prev.length + 1,
											};
										});
									}}
								/>{" "}
								<Typography
									className={classes.link}
									onClick={() => {
										setOneTimePayments((prev) => {
											return {
												data: [
													...prev.data,
													{
														amount: "",
														dueDate: Date.now(),
														account: "",
														memo: "",
													},
												],
												length: prev.length + 1,
											};
										});
									}}
								>
									Add One Time Payment
								</Typography>
							</div>
						</Grid>
						<Grid item xs={12}>
							<Divider />
						</Grid>
						<Grid item xs={12}>
							<Typography variant="h5">
								Recurring Payments
							</Typography>
						</Grid>
						{recurringCharges.data.map((obj, idx) => (
							<>
								<Grid item xs={12}>
									<FormControl
										variant="outlined"
										style={{ width: "100%" }}
									>
										<InputLabel id="demo-simple-select-outlined-label">
											Rent Cycle
										</InputLabel>
										<Select
											labelId="demo-simple-select-outlined-label"
											id="demo-simple-select-outlined"
											// onChange={handleChange}
											label="Rent Cycle"
											value={obj.rentCycle}
											onChange={(e) =>
												setRecurringCharges((prev) => {
													let data = prev.data;
													data[idx]["rentCycle"] =
														e.target.value;
													return {
														data: data,
														length: prev.length,
													};
												})
											}
											defaultValue={4}
										>
											<MenuItem value={1}>Daily</MenuItem>
											<MenuItem value={2}>
												Weekly
											</MenuItem>
											<MenuItem value={3}>
												Bi-Weekly
											</MenuItem>
											<MenuItem value={4}>
												Monthly
											</MenuItem>
											<MenuItem value={5}>
												Every Two Months
											</MenuItem>
											<MenuItem value={6}>
												Quarterly
											</MenuItem>
											<MenuItem value={7}>
												Every Six Months
											</MenuItem>
											<MenuItem value={8}>
												Yearly
											</MenuItem>
										</Select>
									</FormControl>
								</Grid>
								<Grid item xs={6} sm={4}>
									<TextField
										fullWidth
										value={obj.amount}
										type="number"
										onChange={(e) => {
											setRecurringCharges((prev) => {
												let data = prev.data;
												data[idx]["amount"] =
													e.target.value;
												return {
													data: data,
													length: prev.length,
												};
											});
										}}
										variant="outlined"
										label="Amount"
									/>
								</Grid>
								<Grid item xs={6} sm={4}>
									<div
										style={{
											display: "flex",
											justifyContent: "center",
										}}
									>
										<MuiPickersUtilsProvider
											utils={DateFnsUtils}
										>
											<KeyboardDatePicker
												value={obj.dueDate}
												className={classes.datePicker}
												margin="normal"
												id="due-date-picker"
												label="Next Due Date"
												format="MM/dd/yyyy"
												onChange={(date) => {
													setRecurringCharges(
														(prev) => {
															let data =
																prev.data;
															data[idx][
																"dueDate"
															] = date;
															return {
																data: data,
																length: prev.length,
															};
														}
													);
												}}
												KeyboardButtonProps={{
													"aria-label": "change date",
												}}
											/>
										</MuiPickersUtilsProvider>
									</div>
								</Grid>
								<Grid item xs={6} sm={4}>
									<FormControl
										variant="outlined"
										className={classes.formControl}
										style={{ width: "100%" }}
									>
										<InputLabel id="demo-simple-select-outlined-label">
											Account*
										</InputLabel>
										<Select
											labelId="demo-simple-select-outlined-label"
											id="demo-simple-select-outlined"
											value={obj.account}
											defaultValue={-1}
											onChange={(e) => {
												setRecurringCharges((prev) => {
													let data = prev.data;
													data[idx]["account"] =
														e.target.value;
													return {
														data: data,
														length: prev.length,
													};
												});
											}}
											label="Leasing Agent"
										>
											<MenuItem value={-1}>
												<em>Select One</em>
											</MenuItem>
											<ListSubheader>
												Income Accounts
											</ListSubheader>
											{incomeAccounts.map((item, idx) => (
												<MenuItem
													key={idx}
													value={item}
												>
													{item}
												</MenuItem>
											))}

											<ListSubheader>
												Liability accounts
											</ListSubheader>
											{liabilityAccounts.map(
												(item, idx) => (
													<MenuItem
														key={idx}
														value={item}
													>
														{item}
													</MenuItem>
												)
											)}
										</Select>
									</FormControl>
								</Grid>
								<Grid item xs={12} sm={6}>
									<TextField
										fullWidth
										value={obj.memo}
										onChange={(e) => {
											setRecurringCharges((prev) => {
												let data = prev.data;
												data[idx]["memo"] =
													e.target.value;
												return {
													data: data,
													length: prev.length,
												};
											});
										}}
										variant="outlined"
										label="Memo"
									/>
								</Grid>
								<Grid item xs={6} sm={4}>
									<div
										className={classes.link}
										style={
											recurringCharges.length == 1
												? { display: "none" }
												: {
													display: "flex",
													alignItems: "center",
													height: "100%",
												}
										}
										onClick={() => {
											setRecurringCharges((prev) => {
												return {
													data: [
														...prev.data.slice(
															0,
															idx
														),
														...prev.data.slice(
															idx + 1
														),
													],
													length: prev.length - 1,
												};
											});
										}}
									>
										Remove [X]
									</div>
								</Grid>
								<Grid item xs={12}></Grid>
							</>
						))}
						<Grid item xs={12}>
							<div style={{ display: "flex", gap: "10px" }}>
								<AddIcon
									onClick={() => {
										setRecurringCharges((prev) => {
											return {
												data: [
													...prev.data,
													{
														amount: "",
														dueDate: Date.now(),
														account: "",
														memo: "",
														rentCycke: "",
													},
												],
												length: prev.length + 1,
											};
										});
									}}
								/>{" "}
								<Typography
									className={classes.link}
									onClick={() => {
										setRecurringCharges((prev) => {
											return {
												data: [
													...prev.data,
													{
														amount: "",
														dueDate: Date.now(),
														account: "",
														memo: "",
														rentCycke: "",
													},
												],
												length: prev.length + 1,
											};
										});
									}}
								>
									Add Reccuring Charges
								</Typography>
							</div>
						</Grid>
					</Grid>
				</Paper>
			</Paper>
		</div>
	);
}

export default LeaseEditPage;
