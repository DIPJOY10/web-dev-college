import React, { useState, useEffect } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { useParams, useHistory } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import ClearIcon from "@material-ui/icons/Clear";
import {
	Box,
	Divider,
	FormControl,
	Grid,
	IconButton,
	InputLabel,
	MenuItem,
	Select,
	Tab,
	Tabs,
	TextareaAutosize,
	Typography,
} from "@material-ui/core";
import PropTypes from "prop-types";
import AddNewUnit from "./AddNewUnit";
import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";
import tenant from "../../Assets/tenant.png";
import Avatar from "@material-ui/core/Avatar";
import moment from "moment";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import EditIcon from "@material-ui/icons/Edit";
import DescriptionIcon from "@material-ui/icons/Description";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import ChatIcon from "@material-ui/icons/Chat";
import AssignmentIndIcon from "@material-ui/icons/AssignmentInd";
import LessText from "../styled/CommonComponents/LessText";
import HouseIcon from "@material-ui/icons/House";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
	getRelationUnitsByProject,
	updateRentalUnit,
	getRelationUnitsById,
} from "./apiCall";
import KeySettings from "./KeySetting";
import PaymentSetting from "./PaymentSetting";
import DocumentSetting from "./DocumentsSetting";
import IssuesSetting from "./IssuesSetting";
import MessagingSetting from "./MessagingSetting";
import TenantDetails from "./TenantDetails";
import {
	KeyboardDatePicker,
	MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import LeaseEditPage from "./LeaseEditPage";
import LeaseViewPage from "./LeaseViewPage";

function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`scrollable-auto-tabpanel-${index}`}
			aria-labelledby={`scrollable-auto-tab-${index}`}
			{...other}
		>
			{value === index && <Box p={3}>{children}</Box>}
		</div>
	);
}

TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.any.isRequired,
	value: PropTypes.any.isRequired,
};

const useStyles = makeStyles((theme) => ({
	root: {
		marginTop: "66px",
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

export default function UnitRentalRelation(props) {
	const history = useHistory();
	const classes = useStyles();
	const { teamId } = useParams();
	const {
		setUnitPage,
		currentRentalRelationUnit,
		titleArr,
		reloadRentalRelationUnits,
		team,
		setTeam,
	} = props;

	const [open, setOpen] = useState(false);
	const [tabValue, setTabValue] = useState(0);

	const [createDialog, setCreateDialog] = useState(false);
	const [loadingBool, setLoadingBool] = useState(false);
	const [rentalUnitSettingPage, setRentalUnitSettingPage] =
		useState("tenantDetails");
	const [unitName, setUnitName] = useState("");
	const [currentRentalUnit, setCurrentRentalUnit] = useState();
	const [check, setCheck] = useState(false);
	const [stateChange, setStateChange] = useState(false);
	const [temp, setTemp] = useState(false);

	useEffect(() => {
		setLoadingBool(true);
		getRelationUnitsById({ relId: currentRentalRelationUnit?._id })
			.then((data) => {
				setCurrentRentalUnit(data);
				setLoadingBool(false);
			})
			.catch((err) => {
				console.log(err);
			});
	}, [currentRentalRelationUnit]);

	let EditComponent;

	switch (rentalUnitSettingPage) {
		case "tenantDetails":
			EditComponent = TenantDetails;
			break;
		case "messaging":
			EditComponent = MessagingSetting;
			break;
		case "issues":
			EditComponent = IssuesSetting;
			break;
		case "documents":
			EditComponent = DocumentSetting;
			break;
		case "payment":
			EditComponent = PaymentSetting;
			break;
		case "keys":
			EditComponent = KeySettings;
			break;
	}

	const onChangeUnitName = (value) => {
		setCheck(false);
		titleArr.map((title) => {
			if (title == value) {
				setCheck(true);
				return;
			}
		});
		setUnitName(value);
	};

	const finalUpdateUnitTitle = async () => {
		setStateChange(!stateChange);
		let unitId = currentRentalUnit?.unit?._id;

		await updateRentalUnit({
			rentalUnit: {
				_id: unitId,
				name: unitName,
			},
		})
			.then((data) => {
				console.log(data);

				let newRentalRelationUnit = {
					...currentRentalUnit,
					unit: data,
				};
				setCurrentRentalUnit(newRentalRelationUnit);

				setStateChange(!stateChange);
			})
			.catch((err) => {
				console.log(err);
			});

		setOpen(false);
	};

	const openEdit = (value) => {
		setUnitName(value);
		setOpen(true);
	};

	const goToFirstPage = async () => {
		setUnitPage("unitRowPage");
	};

	return (
		<div className={classes.root}>
			<div className={classes.unitEditHeader}>
				<div className={classes.showDisplayRow}>
					<KeyboardBackspaceIcon
						onClick={() => {
							goToFirstPage();
						}}
						className={classes.backIcon}
					/>
					<Typography
						className={classes.unitTitle}
						style={{ color: "#48A9F0", fontWeight: "500" }}
					>
						<LessText
							limit={10}
							string={team?.parent?.displayName || "Project Name"}
						/>
					</Typography>
					<Typography
						className={classes.unitTitle}
						style={{ marginLeft: "10px" }}
					>
						{currentRentalUnit?.unit?.name || "Unit Name"}
					</Typography>
					<EditIcon
						className={classes.editStyle}
						onClick={() => {
							openEdit(currentRentalUnit?.unit?.name);
						}}
					/>
				</div>
				<div className={classes.showDisplayRow}>
					<Button onClick={() => setTemp(!temp)}>
						{temp ? "View Page" : "Edit Page"}
					</Button>
					<Button
						variant="contained"
						color="primary"
						className={classes.buttonWithUnit}
						startIcon={<AddIcon />}
						onClick={() => {
							setCreateDialog(true);
						}}
					>
						Add New
					</Button>
					<AddNewUnit
						openCreateDialog={createDialog}
						setOpenCreateDialog={setCreateDialog}
						team={team}
						reloadUnits={reloadRentalRelationUnits}
					/>
				</div>
			</div>
			{/* <div className={classes.unitEditBody} >
                <div className={classes.sideNavBar} >
                    <div
                        className={rentalUnitSettingPage === "tenantDetails" ? classes.selectedSingleOption : classes.singleOption}
                        onClick={() => { setRentalUnitSettingPage("tenantDetails") }}
                    >
                        <div className={rentalUnitSettingPage === "tenantDetails" ? classes.sideBlue : classes.displayNone} ></div>
                        <AssignmentIndIcon className={classes.iconStyle} />
                        Tenant Details
                    </div>
                    <div
                        className={rentalUnitSettingPage === "messaging" ? classes.selectedSingleOption : classes.singleOption}
                        onClick={() => { setRentalUnitSettingPage("messaging") }}
                    >
                        <div className={rentalUnitSettingPage === "messaging" ? classes.sideBlue : classes.displayNone} ></div>
                        <ChatIcon className={classes.iconStyle} />
                        Messaging
                    </div>
                    <div
                        className={rentalUnitSettingPage === "issues" ? classes.selectedSingleOption : classes.singleOption}
                        onClick={() => { setRentalUnitSettingPage("issues") }}
                    >
                        <div className={rentalUnitSettingPage === "issues" ? classes.sideBlue : classes.displayNone} ></div>
                        <ErrorOutlineIcon className={classes.iconStyle} />
                        Issues
                    </div>
                    <div
                        className={rentalUnitSettingPage === "documents" ? classes.selectedSingleOption : classes.singleOption}
                        onClick={() => { setRentalUnitSettingPage("documents") }}
                    >
                        <div className={rentalUnitSettingPage === "documents" ? classes.sideBlue : classes.displayNone} ></div>
                        <DescriptionIcon className={classes.iconStyle} />
                        Documents
                    </div>
                    <div
                        className={rentalUnitSettingPage === "payment" ? classes.selectedSingleOption : classes.singleOption}
                        onClick={() => { setRentalUnitSettingPage("payment") }}
                    >
                        <div className={rentalUnitSettingPage === "payment" ? classes.sideBlue : classes.displayNone} ></div>
                        <AccountBalanceIcon className={classes.iconStyle} />
                        Payment
                    </div>
                    <div
                        className={rentalUnitSettingPage === "keys" ? classes.selectedSingleOption : classes.singleOption}
                        onClick={() => { setRentalUnitSettingPage("keys") }}
                    >
                        <div className={rentalUnitSettingPage === "keys" ? classes.sideBlue : classes.displayNone} ></div>
                        <VpnKeyIcon className={classes.iconStyle} style={{ transform: "rotate(60deg)" }} />
                        Keys
                    </div>
                </div>
                <div className={classes.editMainCont} >
                    <EditComponent
                        currentRentalUnit={currentRentalUnit}
                        setCurrentRentalUnit={setCurrentRentalUnit}
                        setRentalUnitSettingPage={setRentalUnitSettingPage}
                        setLoadingBool={setLoadingBool}
                        setUnitPage={setUnitPage}
                        team={team}
                        setTeam={setTeam}
                    />
                </div>
            </div> */}

			{temp ? (
				<div>
					{/* // edit page  */}
					<LeaseEditPage />
				</div>
			) : (
				<div>
					{/* view page  */}
					<LeaseViewPage />
				</div>
			)}
			<Dialog
				open={open}
				onClose={() => {
					setOpen(false);
				}}
				aria-labelledby="form-dialog-title"
			>
				<DialogContent>
					<TextField
						id="outlined-basic"
						size="small"
						label="New Unit Name"
						variant="outlined"
						style={{ width: "100%" }}
						value={unitName}
						onChange={(e) => {
							onChangeUnitName(e.target.value);
						}}
					/>
					{check && (
						<div style={{ color: "red", fontSize: "13px" }}>
							Same name is already exist
						</div>
					)}
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() => {
							setOpen(false);
						}}
						color="primary"
					>
						Cancel
					</Button>
					<Button
						onClick={() => {
							finalUpdateUnitTitle();
						}}
						color="primary"
					>
						Ok
					</Button>
				</DialogActions>
			</Dialog>
			{loadingBool && (
				<div className={classes.loaderCont}>
					<CircularProgress
						size={60}
						thickness={3}
						style={{ color: "rgb(92, 144, 242)" }}
					/>
				</div>
			)}
		</div>
	);
}
