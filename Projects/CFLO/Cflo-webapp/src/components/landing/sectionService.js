import React, { useState, useRef, useEffect } from "react";
import { useTheme, makeStyles } from "@material-ui/core/styles";
import HeadingPrimary from "./HeadingPrimary";
import HeadingSecondary from "./HeadingSecondary";
import { Typography, useMediaQuery } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import EmailIcon from "@material-ui/icons/Email";
import appCreateImg2 from "../../Assets/landingPageAppImg/appImg3.png";
import SortIcon from "@material-ui/icons/Sort";

const useStyles = makeStyles((theme) => ({
	serviceCont: {
		display: "flex",
		justifyContent: "space-between",
		overflow: "hidden",
		borderTopLeftRadius: "100px",
		borderTopRightRadius: "100px",
		marginTop: "-400px",
		backgroundColor: "#2E73F8",
		color: "#ffffff",
		position: "relative",
		zIndex: "2",
		[theme.breakpoints.down("md")]: {
			borderTopLeftRadius: "50px",
			borderTopRightRadius: "50px",
			marginTop: "-400px",
		},
	},
	mailMainCont: {
		width: "100%",
		marginTop: "200px",
		[theme.breakpoints.down("md")]: {
			marginTop: "150px",
		},
	},
	mainMailCont2: {
		width: "100%",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		marginTop: "-150px",
		[theme.breakpoints.down("md")]: {
			marginTop: "-180px",
		},
	},
	mailCont: {
		width: "100%",
		display: "flex",
		justifyContent: "space-around",
		alignItems: "center",
		padding: "40px 20px",
		[theme.breakpoints.down("md")]: {
			width: "100%",
			flexDirection: "column",
		},
	},
	mailLeftBox: {
		width: "43%",
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		flexDirection: "column",
		[theme.breakpoints.down("md")]: {
			width: "100%",
		},
	},
	mailRightBox: {
		width: "43%",
		boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
		backgroundColor: "#ffffff",
		display: "flex",
		justifyContent: "space-around",
		alignItems: "center",
		flexDirection: "column",
		padding: "50px",
		[theme.breakpoints.down("md")]: {
			width: "100%",
			padding: "20px",
		},
	},
	mailImgStyle: {
		width: "100%",
		height: "auto",
	},
	appTagLine: {
		fontSize: "20px",
		fontFamily: "'Raleway', sans-serif",
		color: "black",
		marginBottom: "60px",
		[theme.breakpoints.down("md")]: {
			width: "100%",
			fontSize: "17px",
		},
	},
	mailIconeCont: {
		display: "flex",
	},
	btnFullCont: {
		width: "40%",
		fontSize: "25px",
		textDecoration: "none",
		[theme.breakpoints.down("sm")]: {
			width: "70%",
			fontSize: "17px",
		},
	},
	btnCont: {
		width: "90%",
		fontSize: "18px",
	},
}));

function SectionService(props) {
	const theme = useTheme();
	const classes = useStyles();
	const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

	const serviceSectionHeaderStyle = {
		marginTop: "80px",
		fontSize: isSmall ? "32px" : "64px",
		lineHeight: isSmall ? "36px" : "68px",
		letterSpacing: "4px",
		color: "#ffffff",
		fontWeight: "800",
		fontFamily: "'Righteous', cursive",
	};
	const serviceSectionSubHeaderStyle = {
		fontSize: isSmall ? "20px" : "24px",
		lineHeight: isSmall ? "28px" : "32px",
		color: "#ffffff",
		fontWeight: "500",
	};
	const serviceSectionBackgroundColor = "#2e73f8";

	return (
		<section
			className={classes.serviceCont}
			data-aos={"fade-up"}
			data-aos-once={false}
		>
			<div className="leftBox">&nbsp;</div>
			<div className="rightBox">
				<HeadingPrimary
					text="Service"
					styleBody={serviceSectionHeaderStyle}
				/>
				<HeadingSecondary
					text="We provide digital solutions for selected real estate businesses"
					styleBody={serviceSectionSubHeaderStyle}
					backgroundColorBullet={serviceSectionBackgroundColor}
				/>
				<div className={classes.mailMainCont}>
					<HeadingSecondary
						text=" "
						styleBody={serviceSectionSubHeaderStyle}
						backgroundColorBullet={serviceSectionBackgroundColor}
					/>
					<div className={classes.mainMailCont2}>
						<div
							data-aos={"zoom-in"}
							data-aos-once={false}
							className={classes.mailCont}
						>
							<div
								data-aos={"zoom-in-right"}
								data-aos-once={false}
								className={classes.mailLeftBox}
							>
								<img
									className={classes.mailImgStyle}
									src={appCreateImg2}
								/>
							</div>
							<div
								data-aos={"zoom-in-left"}
								data-aos-once={false}
								className={classes.mailRightBox}
							>
								<div>
									<Typography className={classes.appTagLine}>
										Get your own branded property management
										app, construction management app etc. We
										are here to help you build your digital brand.
									</Typography>
								</div>
								<a
									className={classes.btnFullCont}
									href="mailto:ranadebnath619@gmail.com"
								>
									<Button
										variant="contained"
										color="primary"
										endIcon={
											<div
												className={
													classes.mailIconeCont
												}
											>
												<SortIcon
													style={{
														fontSize: "30px",
														transform:
															"rotateY(180deg)",
													}}
												/>
												<EmailIcon
													style={{ fontSize: "30px" }}
												/>
											</div>
										}
										className={classes.btnCont}
									>
										Mail Us
									</Button>
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

export default SectionService;
