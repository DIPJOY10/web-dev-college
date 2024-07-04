import {
	Button,
	Divider,
	Grid,
	makeStyles,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from "@material-ui/core";
import React from "react";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";

const useStyles = makeStyles((theme) => ({
	root: {
		marginTop: "66px",
	},
	margin: {
		margin: theme.spacing(1),
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
function LeaseViewPage() {
	const classes = useStyles();
	const [showTable, setShowTable] = React.useState(false);
	return (
		<Paper square style={{ padding: "2rem" }}>
			<Grid container spacing={2}>
				<Grid item xs={12}>
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							padding: "1rem 1.5rem",
							backgroundColor: "rgb(232, 244, 253)",
							borderRadius: "15px",
						}}
					>
						<div>
							<Typography varaint="h6">
								Unit is currently vacant
							</Typography>

							<Typography variant="subtitle2">
								To attach a lease to this unit click here
							</Typography>
						</div>
						<Button
							size="small"
							className={classes.margin}
							variant="contained"
							color="primary"
						>
							Draft Lease
						</Button>
					</div>
				</Grid>
				{/* <Grid item xs={12}>
					<Typography variant="h5">Tenant Information</Typography>
				</Grid>
				<Grid item xs={12}>
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
							<Typography>Sankalp Srivastava</Typography>
						</div>
						<div>
							<Typography>Email Address</Typography>
							<Typography>
								raunaksrivastava22@gmail.com
							</Typography>
						</div>
						<div>
							<Typography>Mobile Phone</Typography>
							<Typography>8299169670</Typography>
						</div>
					</div>
				</Grid> */}
				<Grid item xs={12}>
					<Typography variant="h5">Unit Details</Typography>
				</Grid>

				<Grid
					item
					xs={12}
					sm={3}
					style={{
						display: "flex",
						alignItems: "center",
					}}
				>
					<Typography variant="h4" className={classes.text}>
						Address
					</Typography>
				</Grid>
				<Grid item xs={12} sm={9}>
					<Typography>
						some add, varanasi, up, India - 221010
					</Typography>
				</Grid>
				<Grid
					item
					xs={12}
					sm={3}
					style={{
						display: "flex",
						alignItems: "center",
					}}
				>
					<Typography variant="h4" className={classes.text}>
						Beds/Baths
					</Typography>
				</Grid>
				<Grid item xs={12} sm={9}>
					<Typography>3 Beds/2 Baths</Typography>
				</Grid>
				<Grid
					item
					xs={12}
					sm={3}
					style={{
						display: "flex",
						alignItems: "center",
					}}
				>
					<Typography variant="h4" className={classes.text}>
						Area
					</Typography>
				</Grid>
				<Grid item xs={12} sm={9}>
					<Typography>3000 sq km</Typography>
				</Grid>
				<Grid
					item
					xs={12}
					sm={3}
					style={{
						display: "flex",
						alignItems: "center",
					}}
				>
					<Typography variant="h4" className={classes.text}>
						vacancy
					</Typography>
				</Grid>
				<Grid item xs={12} sm={9}>
					<Typography>vacant</Typography>
				</Grid>
				<Grid
					item
					xs={12}
					sm={3}
					style={{
						display: "flex",
						alignItems: "center",
					}}
				>
					<Typography variant="h4" className={classes.text}>
						Documents
					</Typography>
				</Grid>
				<Grid item xs={12} sm={9}>
					<Typography>(show docs here)</Typography>
				</Grid>
				<Grid item xs={12}>
					<Divider />
				</Grid>
				<Grid item xs={12}>
					<Typography variant="h5">Lease Details</Typography>
				</Grid>
				<Grid
					item
					xs={12}
					sm={3}
					style={{
						display: "flex",
						alignItems: "center",
					}}
				>
					<Typography variant="h4" className={classes.text}>
						Lease Type
					</Typography>
				</Grid>
				<Grid item xs={12} sm={9}>
					<Typography>Fixed</Typography>
				</Grid>
				<Grid
					item
					xs={12}
					sm={3}
					style={{
						display: "flex",
						alignItems: "center",
					}}
				>
					<Typography variant="h4" className={classes.text}>
						Signature Status
					</Typography>
				</Grid>
				<Grid item xs={12} sm={9}>
					<Typography>Unsigned</Typography>
				</Grid>
				<Grid
					item
					xs={12}
					sm={3}
					style={{
						display: "flex",
						alignItems: "center",
					}}
				>
					<Typography variant="h4" className={classes.text}>
						Start Date
					</Typography>
				</Grid>
				<Grid item xs={12} sm={9}>
					<Typography>10 October 2022</Typography>
				</Grid>
				<Grid
					item
					xs={12}
					sm={3}
					style={{
						display: "flex",
						alignItems: "center",
					}}
				>
					<Typography variant="h4" className={classes.text}>
						End Date
					</Typography>
				</Grid>
				<Grid item xs={12} sm={9}>
					<Typography>10 November 2023</Typography>
				</Grid>
				<Grid
					item
					xs={12}
					sm={3}
					style={{
						display: "flex",
						alignItems: "center",
					}}
				>
					<Typography variant="h4" className={classes.text}>
						Lease Agent
					</Typography>
				</Grid>
				<Grid item xs={12} sm={9}>
					<Typography>Som Ahirwar</Typography>
				</Grid>
				<Grid item xs={12}>
					<Divider />
				</Grid>
				<Grid item xs={12}>
					<Typography variant="h5">Rent Details</Typography>
				</Grid>
				<Grid
					item
					xs={12}
					sm={3}
					style={{
						display: "flex",
						alignItems: "center",
					}}
				>
					<Typography variant="h4" className={classes.text}>
						Rent Amount
					</Typography>
				</Grid>
				<Grid item xs={12} sm={9}>
					<Typography>$400</Typography>
				</Grid>
				<Grid
					item
					xs={12}
					sm={3}
					style={{
						display: "flex",
						alignItems: "center",
					}}
				>
					<Typography variant="h4" className={classes.text}>
						Rent Cycle
					</Typography>
				</Grid>
				<Grid item xs={12} sm={9}>
					<Typography>Monthly</Typography>
				</Grid>
				<Grid
					item
					xs={12}
					sm={3}
					style={{
						display: "flex",
						alignItems: "center",
					}}
				>
					<Typography variant="h4" className={classes.text}>
						Security Deposit
					</Typography>
				</Grid>
				<Grid item xs={12} sm={9}>
					<Typography>$100</Typography>
				</Grid>
				<>
					<Grid
						item
						xs={12}
						sm={3}
						style={
							showTable
								? { display: "flex", alignItems: "center" }
								: { display: "none" }
						}
					>
						<Typography variant="h4" className={classes.text}>
							Rent Details
						</Typography>
					</Grid>
					<Grid
						item
						xs={12}
						style={showTable ? {} : { display: "none" }}
					>
						<TableContainer component={Paper}>
							<Table
								className={classes.table}
								aria-label="spanning table"
							>
								<TableHead>
									<TableRow>
										<TableCell>Description</TableCell>
										<TableCell align="right">
											Account
										</TableCell>
										<TableCell align="right">
											Payment Date
										</TableCell>
										<TableCell align="right">
											Amount
										</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									<TableRow>
										<TableCell>Rent Bill</TableCell>
										<TableCell align="right">
											Rental Account
										</TableCell>
										<TableCell align="right">
											11-30-2022
										</TableCell>
										<TableCell align="right">
											$4500
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>Security Deposit</TableCell>
										<TableCell align="right">
											Rental Account
										</TableCell>
										<TableCell align="right">
											11-30-2022
										</TableCell>
										<TableCell align="right">
											$500
										</TableCell>
									</TableRow>

									<TableRow>
										<TableCell rowSpan={3} />
										<TableCell colSpan={2}>
											Subtotal
										</TableCell>
										<TableCell align="right">
											$5000
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>Tax</TableCell>
										<TableCell align="right">{`12%`}</TableCell>
										<TableCell align="right">
											$600
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell colSpan={2}>Total</TableCell>
										<TableCell align="right">
											$5600
										</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</TableContainer>
					</Grid>
				</>
				<Grid item xs={12}>
					<div
						style={{ display: "flex", gap: "10px" }}
						className={classes.link}
						onClick={() => setShowTable((prev) => !prev)}
					>
						{showTable ? (
							<KeyboardArrowUpIcon />
						) : (
							<KeyboardArrowDownIcon />
						)}{" "}
						<Typography>
							{showTable
								? "Hide Transactions"
								: "Show Transactions"}
						</Typography>
					</div>
				</Grid>
			</Grid>
		</Paper>
	);
}

export default LeaseViewPage;
