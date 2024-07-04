import React from "react";
import { useHistory } from "react-router-dom";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useMediaQuery, ButtonBase } from "@material-ui/core";
import MuiDrawer from "@material-ui/core/Drawer";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "../Navbar/NavBar";
import { changeUserAndReset } from "../organization/organization.utils";
import { drawerWidthTheme } from "../../utils/theme.js"

const drawerWidth = drawerWidthTheme?.width;
const foldedWidth = drawerWidthTheme?.smWidth;

const useStyles = makeStyles((theme) => ({
	buttonStyle: {
		width: "15rem",
		height: "3.4rem",
		padding: "0.5rem",
		textAlign: "center",
		borderRadius: "3%",
		boxShadow: "none",
		margin: "1rem",
		borderWidth: "1px",
		[theme.breakpoints.down("sm")]: {
			width: "5rem",
		},
	},
	drawer: {
		flexShrink: 0,
		flexGrow: 0,
		[theme.breakpoints.down("sm")]: {
			width: foldedWidth,
		},
	},
	drawerPaper: {
		width: drawerWidth,
		overflow: "hidden",
		[theme.breakpoints.down("sm")]: {
			width: foldedWidth,
			position: "relative",
			height: "100vh",
			zIndex: "1301",
		},
	},
	drawerContainer: {
		overflow: "auto",
	},
	logoImg: {
		height: "2.8rem",
		width: "2.8rem",
		marginTop: "8px",
		marginBottom: "50px",
		cursor: "pointer",
	},
	logoBox: {
		marginTop: "1rem",
	},
	userImage: {
		height: "1.9rem",
		width: "1.9rem",
	},
	imgStyle: {
		marginLeft: "2rem",
		color: theme.palette.primary.main,
	},
	textStyle: {
		fontSize: "1.2rem",
		fontWeight: "600",
		color: "#616161",
	},
	margin: {
		margin: "1rem",
	},
}));

export default function Drawer() {
	const classes = useStyles();
	const theme = useTheme();
	const history = useHistory();
	const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
	const dispatch = useDispatch();
	const { user, organizationIds, organizationDictionary, userProfile } =
		useSelector((state) => state.auth);
	const displayPicture =
		user?.displayPicture?.thumbUrl || user?.displayPicture?.url;
	const displayName = user && user.displayName ? user.displayName : null;
	return (
		<MuiDrawer
			className={classes.drawer}
			variant="permanent"
			classes={{
				paper: classes.drawerPaper,
				docked: null,
			}}
		>
			<Grid
				container
				alignItems="center"
				justify="center"
				flexDirection="column"
			>
				{/* <Fab className={classes.logoBox}> */}
				<img
					alt="Logo"
					className={classes.logoImg}
					onClick={() => { history.push("/") }}
					src={require("../../Assets/LogoV3.svg")}
				/>
				{/* </Fab> */}
			</Grid>


			<Navbar />

			{user.model === "Organization" ? (
				<ButtonBase
					border={1}
					className={classes.buttonStyle}
					onClick={() => {
						// console.log('Change user and reset getting called')
						history.push("/");
						changeUserAndReset(user, userProfile, dispatch);
					}}
				>
					<Grid
						container
						wrap="nowrap"
						justify="center"
						alignItems="center"
						// marginTop="2rem"
						spacing={2}
						className={classes.gridStyle}
					>
						{isSmall ? null : (
							<>
								<Grid item xs>
									<Typography className={classes.textStyle}>
										{userProfile?.displayName}
									</Typography>
								</Grid>
							</>
						)}
						<Grid item>
							<Avatar
								alt={userProfile?.displayName}
								className={classes.userImage}
								src={userProfile?.displayPicture?.thumbUrl}
							/>
						</Grid>
						<Grid item>
							<ArrowForwardIosIcon fontSize="inherit" />
						</Grid>
					</Grid>
				</ButtonBase>
			) : null}
			{/*

        {organizationIds.map(organizationId=>{
                var org= organizationDictionary[organizationId];
                var displayPicture = org&&org.displayPicture?org.displayPicture.thumbUrl:null
                var displayName = org&&org.displayName?org.displayName:null
                if(user._id===org._id){
                    return null
                }else{
                    return (
                        <ButtonBase  border={1} className={classes.buttonStyle} onClick={()=>{
                            //console.log('Change user and reset getting called')
                            history.push('/');
                            changeUserAndReset(user,org,dispatch);
                        }}>
                        <Grid container wrap="nowrap" justify="center" alignItems="center" spacing={1} className={classes.gridStyle}>

                            {isSmall?null:(
                            <>
                            <Grid item xs>
                                <Typography className={classes.textStyle}>{displayName}</Typography>

                            </Grid>

                            </>)}
                            <Grid item>

                                <Avatar alt="Logo" className={classes.userImage} src={displayPicture} />

                            </Grid>
                            <Grid item>
                                <ArrowForwardIosIcon fontSize="inherit" />
                            </Grid>
                        </Grid>
                    </ButtonBase>
                    )
                }

        })} */}
		</MuiDrawer>
	);
}
