import React, { useState, useEffect } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import { Paper, TextField, Typography } from "@material-ui/core";
import AddNewUnit from "./AddNewUnit";
import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";
import ProfileAppbar from "../profile/profile.appbar";
import tenant from "../../Assets/tenant.png";
import Avatar from "@material-ui/core/Avatar";
import moment from "moment";
import LessText from "../styled/CommonComponents/LessText";
import CircularProgress from "@material-ui/core/CircularProgress";
import { getRelationUnitsByProject } from "./apiCall";
import UnitRentalRelation from "./UnitRentalRelation";
import RentalUnitRows from "./RentalUnitRows";
import RentalUnitTable from "./RentalUnitTable";
import SettingsIcon from "@material-ui/icons/Settings";
import PolicyDialog from "./PolicyDialog";
import PolicySetupWizard from "./PolicySetupWizard";

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		width: "100%",
	},
	header: {
		width: "100%",
		position: "absolute",
		left: "0px",
		display: "flex",
		top: "0px",
		justifyContent: "space-between",
		alignItems: "center",
		padding: "5px 20px",
		marginTop: "0px",
		marginBottom: "0px",
		backgroundColor: "#ffffff",
		zIndex: "10",
		boxShadow: "rgba(0, 0, 0, 0.05) 0px 1px 2px 0px",
	},
	titleTop: {
		fontSize: "19px",
		fontWeight: "550",
	},
	titleButton: {
		fontSize: "15px",
		display: "flex",
		opacity: "0.7",
		justifyContent: "space-between",
		alignItems: "center",
	},
	emptyCont: {
		height: "calc(100vh - 250px)",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		flexDirection: "column",
	},
	tenantStyle: {
		width: "200px",
		height: "auto",
	},
	buttonWithOutUnit: {
		width: "300px",
		backgroundColor: "green",
	},
	progressCont: {
		width: "100%",
		height: "500px",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
	},
}));

export default function PropertyManagementHome(props) {
	const history = useHistory();
	const classes = useStyles();
	const { teamId } = useParams();

	const { auth } = useSelector((state) => state);
	const [team, setTeam] = useState();
	const [openSetup, setOpenSetup] = useState(false);
	const [rentalRelationUnits, setRentalRelationUnits] = useState([]);
	const [titleArr, setTitleArr] = useState([]);
	const [createDialog, setCreateDialog] = useState(false);
	const [policyDialogOpen, setPolicyDialogOpen] = useState(false);
	const [progressBool, setProgressBool] = useState(true);
	const [unitPage, setUnitPage] = useState("unitRowPage");
	const [currentRentalRelationUnit, setCurrentRentalRelationUnit] =
		useState();

	useEffect(() => {
		setProgressBool(true);
		getRelationUnitsByProject({ projectTeamId: teamId })
			.then((data) => {
				let rentalRelation = data?.rentalRelations;
				let team = data?.team;

				console.log(data);

				setTeam(team);
				setRentalRelationUnits(rentalRelation);
				setProgressBool(false);

				let titles = [];
				rentalRelation.map((unit) => {
					titles.push(unit?.unit?.name);
				});
				setTitleArr(titles);
			})
			.catch((err) => {
				console.log(err);
			});
	}, [teamId]);

	const reloadRentalRelationUnits = async () => {
		await getRelationUnitsByProject({ projectTeamId: teamId })
			.then((data) => {
				let rentalRelation = data?.rentalRelations;
				let team = data?.team;

				console.log(data);
				setTeam(team);
				setRentalRelationUnits(rentalRelation);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	return (
		<div className={classes.root}>
			{progressBool ? (
				<div className={classes.progressCont}>
					<CircularProgress />
				</div>
			) : (
				<>
					{unitPage === "unitEditPage" ? null : (
						<div>
							<ProfileAppbar
								name={
									team?.parent?.displayname ||
									"Property Management"
								}
								btns={
									<>
										<Button
											variant="contained"
											color="primary"
											className={classes.buttonWithUnit}
											startIcon={<SettingsIcon />}
											onClick={() =>
												setPolicyDialogOpen(true)
											}
										>
											Settings
										</Button>
									</>
								}
							/>
							<div>
								<>
									<PolicyDialog
										open={policyDialogOpen}
										projectTeamId={teamId}
										setOpen={setPolicyDialogOpen}
										team={team}
										reloadUnits={reloadRentalRelationUnits}
										numRentalUnits={
											rentalRelationUnits?.length
										}
									/>

									<AddNewUnit
										openCreateDialog={createDialog}
										setOpenCreateDialog={setCreateDialog}
										team={team}
										reloadUnits={reloadRentalRelationUnits}
										numRentalUnits={
											rentalRelationUnits?.length
										}
									/>
								</>
							</div>
						</div>
					)}
					<div>
						{rentalRelationUnits?.length === 0 ? (
							<>
								<div className={classes.emptyCont}>
									<img
										className={classes.tenantStyle}
										src={tenant}
										alt={"tenant"}
									/>
									<Typography
										style={{
											margin: "10px 0px",
											fontSize: "14px",
										}}
									>
										Let's create new units with the "Add
										New" button
									</Typography>
									<Button
										variant="contained"
										color="primary"
										className={classes.buttonWithOutUnit}
										startIcon={<AddIcon />}
										onClick={() => {
											setCreateDialog(true);
										}}
									>
										Add New
									</Button>
									<Button
										style={{ marginTop: "3rem" }}
										color="primary"
										variant="contained"
										onClick={() => {
											setOpenSetup(true);
										}}
									>
										Open Wizard
									</Button>
									<PolicySetupWizard
										open={openSetup}
										team={team}
										setOpen={setOpenSetup}
									/>
									<AddNewUnit
										openCreateDialog={createDialog}
										setOpenCreateDialog={setCreateDialog}
										team={team}
										reloadUnits={reloadRentalRelationUnits}
										numRentalUnits={
											rentalRelationUnits?.length
										}
									/>
								</div>
							</>
						) : unitPage === "unitRowPage" ? (
							<>
								{/* <Portfolio
                                            walletId={team?.wallet}
                                        /> */}
								{/* <RentalUnitRows
									setCurrentRentalRelationUnit={
										setCurrentRentalRelationUnit
									}
									setUnitPage={setUnitPage}
									allRelationUnits={rentalRelationUnits}
								/> */}
								<Paper style={{ marginTop: "4rem" }}>
									<div style={{ padding: "1rem" }}>
										<Typography
											gutterBottom
											variant="h4"
											style={{ fontWeight: "600" }}
										>
											Units and Leases
										</Typography>
										<div
											style={{
												display: "flex",
												flexWrap: "wrap",
												justifyContent: "space-between",
												margin: "1rem 0",
											}}
										>
											<TextField
												variant="outlined"
												placeholder="Enter unit title"
												label="Search"
												fullWidth
												style={{ flexBasis: "80%" }}
											/>
											<Button
												variant="contained"
												color="primary"
												style={{
													width: "100%",
													flexBasis: "14%",
												}}
												className={
													classes.buttonWithUnit
												}
												startIcon={<AddIcon />}
												onClick={() => {
													setCreateDialog(true);
												}}
											>
												Add New
											</Button>
										</div>
										<RentalUnitTable
											setCurrentRentalRelationUnit={
												setCurrentRentalRelationUnit
											}
											setUnitPage={setUnitPage}
											allRelationUnits={
												rentalRelationUnits
											}
										/>
									</div>
								</Paper>
							</>
						) : unitPage === "unitEditPage" ? (
							<UnitRentalRelation
								setUnitPage={setUnitPage}
								currentRentalRelationUnit={
									currentRentalRelationUnit
								}
								titleArr={titleArr}
								rentalRelationUnits={rentalRelationUnits}
								setRentalRelationUnits={setRentalRelationUnits}
								reloadRentalRelationUnits={
									reloadRentalRelationUnits
								}
								team={team}
								setTeam={setTeam}
							/>
						) : (
							<>Something went wrong!!!</>
						)}
					</div>
				</>
			)}
		</div>
	);
}
