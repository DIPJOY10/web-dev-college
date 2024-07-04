import React, { useState, useEffect } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { Typography } from "@material-ui/core";
import AddNewUnit from "./AddNewUnit";
import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import moment from "moment";
import LessText from "../styled/CommonComponents/LessText";
import HouseIcon from "@material-ui/icons/House";
import CircularProgress from "@material-ui/core/CircularProgress";
import { getRelationUnitsByProject } from "./apiCall";
import UnitRentalRelation from "./UnitRentalRelation";
import GetPicByAlphabet from "../styled/CommonComponents/GetPicByAlphabet";
import Grid from "@material-ui/core/Grid";
import PersonIcon from "@material-ui/icons/Person";
import PhoneIcon from "@material-ui/icons/Phone";
import MailIcon from "@material-ui/icons/Mail";

const useStyles = makeStyles((theme) => ({
	allUnitsCont: {
		display: "flex",
		width: "100%",
		padding: "20px",
		display: "flex",
		justifyContent: "space-around",
		flexWrap: "wrap",
		marginTop: "56px",
		[theme.breakpoints.down("xs")]: {
			flexDirection: "column",
		},
	},
	unitCont: {
		width: "30%",
		height: "200px",
		border: "1px solid #E1E2E5",
		marginBottom: "30px",
		padding: "10px",
		backgroundColor: "#ffffff",
		position: "relative",
		boxShadow:
			"rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
		cursor: "pointer",
		[theme.breakpoints.down("md")]: {
			width: "47%",
		},
		[theme.breakpoints.down("xs")]: {
			width: "100%",
		},
	},
	homeUnitCont: {
		display: "flex",
		alignItems: "center",
		width: "250px",
	},
	unitNameStyle: {
		marginBottom: "10px",
		borderBottom: `1px solid ${theme.palette.primary.main}`,
	},
	nextDateStyle: {
		fontSize: "15px",
		fontWeight: "510",
		position: "absolute",
		bottom: "5px",
		right: "10px",
	},
	lineTextStyle: {
		width: "100%",
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
	},
	rentalLine: {
		width: "calc(50% - 34px)",
		height: "1px",
		backgroundColor: theme.palette.primary.main,
	},
	unitNameOnly: {
		padding: "0px 10px",
		fontSize: "16px",
		fontWeight: "550",
	},
	iconInfoCont: {
		width: "250px",
		display: "flex",
		alignItems: "center",
		marginTop: "8px",
		marginLeft: "9px",
	},
	infoIconStyle: {
		marginRight: "10px",
		color: "white",
		backgroundColor: theme.palette.primary.main,
		padding: "3px",
		fontSize: "30px",
		borderRadius: "50%",
	},
	tenantImg: {
		position: "absolute",
		top: "11px",
		right: "11px",
	},
}));

export default function RentalUnitRows(props) {
	const history = useHistory();
	const classes = useStyles();
	const { teamId } = useParams();
	const theme = useTheme();
	const [relationUnits, setRelationUnits] = useState([]);
	const { setCurrentRentalRelationUnit, setUnitPage, allRelationUnits } =
		props;

	useEffect(() => {
		setRelationUnits(allRelationUnits);
	}, [allRelationUnits]);

	return (
		<div className={classes.allUnitsCont}>
			{(relationUnits || []).length > 0 &&
				relationUnits.map((unit, i) => (
					<div
						key={i}
						className={classes.unitCont}
						onClick={() => {
							setCurrentRentalRelationUnit(unit);
							setUnitPage("unitEditPage");
						}}
					>
						<div className={classes.homeUnitCont}>
							<HouseIcon
								style={{
									fontSize: "50px",
									opacity: "0.6",
									marginRight: "10px",
									color: theme.palette.primary.main,
								}}
							/>
							<div className={classes.unitNameStyle}>
								<Typography className={classes.unitNameOnly}>
									<LessText
										limit={20}
										string={unit?.unit?.name || "Unit Name"}
									/>
								</Typography>
								{/* <div className={classes.lineTextStyle} >
                                <div className={classes.rentalLine} ></div>
                                <Typography style={{ fontSize: "10px" }}>Rental Unit</Typography>
                                <div className={classes.rentalLine} ></div>
                            </div> */}
							</div>
						</div>
						<div className={classes.iconInfoCont}>
							<PersonIcon className={classes.infoIconStyle} />
							<Typography>
								<LessText
									limit={16}
									string={
										unit?.tenantFullInfo?.fullName ||
										"Name not added"
									}
								/>
							</Typography>
						</div>
						<div className={classes.iconInfoCont}>
							<PhoneIcon className={classes.infoIconStyle} />
							<Typography>
								<LessText
									limit={16}
									string={
										unit?.tenantFullInfo?.contactNumber ||
										"Phone not added"
									}
								/>
							</Typography>
						</div>
						<div className={classes.iconInfoCont}>
							<MailIcon className={classes.infoIconStyle} />
							<Typography>
								<LessText
									limit={16}
									string={
										unit?.tenantFullInfo?.mailId ||
										"Email not added"
									}
								/>
							</Typography>
						</div>
						<div className={classes.tenantImg}>
							<GetPicByAlphabet
								dpUrl={
									unit?.tenant?.parent?.displayPicture
										?.thumbUrl
								}
								nameStr={unit?.tenantFullInfo?.fullName}
							/>
						</div>
						<Typography className={classes.nextDateStyle}>
							{moment(unit?.nextDate).format("LL") || "Next Date"}
						</Typography>
					</div>
				))}
		</div>
	);
}
