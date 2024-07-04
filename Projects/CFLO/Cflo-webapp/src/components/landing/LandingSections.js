import React, { useState, useEffect } from "react";
import { useTheme, makeStyles } from "@material-ui/core/styles";
import ListItem from "./ListItem";
import HeadingPrimary from "./HeadingPrimary";
import HeadingSecondary from "./HeadingSecondary";
import SectionService from "./sectionService";
import "./landingStyle.css";
import { useMediaQuery } from "@material-ui/core";

import { contract } from "../../Assets/contract.png"


import AOS from "aos";
import "aos/dist/aos.css";

const useStyles = makeStyles((theme) => ({
	softwareCont: {
		display: "flex",
		justifyContent: "space-between",
		overflow: "hidden",
		borderTopLeftRadius: "100px",
		borderTopRightRadius: "100px",

		backgroundColor: "#2E73F8",
		color: "#ffffff",
		[theme.breakpoints.down("md")]: {
			borderTopLeftRadius: "50px",
			borderTopRightRadius: "50px",
		},
	},

	networkCont: {
		display: "flex",
		justifyContent: "space-between",
		color: "rgb(65, 65, 65)",
		overflow: "hidden",
		borderTopLeftRadius: "100px",
		borderTopRightRadius: "100px",

		paddingBottom: "300px",
		backgroundColor: "#ffffff",
		color: "#2E73F8",
		position: "relative",
		zIndex: "1",
		[theme.breakpoints.down("md")]: {
			borderTopLeftRadius: "50px",
			borderTopRightRadius: "50px",
		},
	},
}));

function LandingSections(props) {
	const classes = useStyles();
	const theme = useTheme();

	const {
		softwareRef,
		networkRef,
		servicesRef
	} = props

	const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

	useEffect(() => {
		AOS.init({
			duration: 1500,
			offset: 150,
			once: false,
		});
	}, []);

	// Software Section
	const softwareSectionHeaderStyle = {
		marginTop: "80px",
		fontSize: isSmall ? "32px" : "64px",
		lineHeight: isSmall ? "36px" : "68px",
		letterSpacing: "4px",
		color: "#ffffff",
		fontWeight: "800",
		fontFamily: "'Righteous', cursive",
	};
	const softwareSectionSubHeaderStyle = {
		fontSize: isSmall ? "20px" : "24px",
		lineHeight: isSmall ? "28px" : "32px",
		color: "#ffffff",
		opacity: "0.8",
		fontWeight: "500",
	};
	const softwareSectionListheadStyle = {
		fontSize: isSmall ? "20px" : "24px",
		lineHeight: isSmall ? "28px" : "32px",
		color: "#ffffff",
		fontWeight: "500",
	};
	const softwareSectionListsubHeaderStyle = {
		fontSize: isSmall ? "20px" : "24px",
		lineHeight: isSmall ? "28px" : "32px",
		color: "#D0F1F7",
		fontWeight: "500",
	};
	const softwareSectionListsubListStyle = {
		fontSize: isSmall ? "15px" : "18px",
		lineHeight: isSmall ? "22px" : "28px",
		color: "#ffffff",
		fontWeight: "500",
		opacity: "0.8",
	};
	const softwareSectionStrokeColor = "lightgray";
	const softwareSectionBackgroundColor = "#ffffff";

	// Network Section
	const networkSectionHeaderStyle = {
		marginTop: "80px",
		fontSize: isSmall ? "32px" : "64px",
		lineHeight: isSmall ? "36px" : "68px",
		letterSpacing: "4px",
		color: "#24292f",
		fontWeight: "800",
		fontFamily: "'Righteous', cursive",
	};
	const networkSectionSubHeaderStyle = {
		fontSize: isSmall ? "20px" : "24px",
		lineHeight: isSmall ? "28px" : "32px",
		color: "#040d21",
		fontWeight: "500",
	};
	const networkSectionListheadStyle = {
		fontSize: isSmall ? "20px" : "24px",
		lineHeight: isSmall ? "28px" : "32px",
		color: "#040d21",
		fontWeight: "500",
	};
	const networkSectionListsubHeaderStyle = {
		fontSize: isSmall ? "20px" : "24px",
		lineHeight: isSmall ? "28px" : "32px",
		color: "#627597",
		fontWeight: "500",
	};
	const networkSectionListsubListStyle = {
		fontSize: isSmall ? "15px" : "18px",
		lineHeight: isSmall ? "22px" : "28px",
		color: "#24292f",
		fontWeight: "500",
		opacity: "0.8",
	};
	const networkSectionStrokeColor = "lightgray";
	const networkSectionBackgroundColor = "#2e73f8";

	return (
		<div>
			{/* <div ref={softwareRef} data-aos={"fade-up"} data-aos-once={false}>
				<section className={classes.softwareCont}>
					<div className="leftBox">&nbsp;</div>
					<div className="rightBox">
						<HeadingPrimary
							text="Appstore"
							styleBody={softwareSectionHeaderStyle}
						/>
						<HeadingSecondary
							text="We provide you with a powerful Real Estate OS to operate your business productively along with transparency controls."
							styleBody={softwareSectionSubHeaderStyle}
							backgroundColorBullet={
								softwareSectionBackgroundColor
							}
						/>
						<ListItem
							heading="Issue tracking"
							text="- A flexible workflow system which can be
                configured according to your processes and use cases"
							imgSrc={[
								<img
									className="image"
									src={contract}
									alt="Issue Tracking Image1"
									style={{ width: "100%", height: "auto" }}
								/>,
								<img
									className="image"
									src={contract}
									alt="Issue Tracking Image2"
									style={{ width: "100%", height: "auto" }}
								/>,
							]}
							subList={[
								"Create and customize templates to manage issues pipeline. It will help you in modelling anything from investor/customer management to RFIs, punchlist, etc.",
								"Share issues across your project/organization teams and manage access levels.",
								"Add attachments such as invoices, bills, files, links, and comments for even more power to your tickets.",
							]}
							strokeColor={softwareSectionStrokeColor}
							backgroundColor={softwareSectionBackgroundColor}
							headStyle={softwareSectionListheadStyle}
							subHeaderStyle={softwareSectionListsubHeaderStyle}
							subListStyle={softwareSectionListsubListStyle}
						/>
						<ListItem
							heading="Accounting & Payments"
							text=" - We provide accounting solutions at par with market leaders. Collect & make payments to investors, vendors, tenants, etc."
							imgSrc={[
								<img
									className="image"
									src={contract}
									alt="Accounting & Payments Image1"
									style={{ width: "100%", height: "auto" }}
								/>,
								<img
									className="image"
									src={contract}
									alt="Accounting & Payments Image2"
									style={{ width: "100%", height: "auto" }}
								/>,
								<img
									className="image"
									src={contract}
									alt="Accounting & Payments Image3"
									style={{ width: "100%", height: "auto" }}
								/>,
							]}
							subList={[
								"Our accounting system is designed to work across companies/ projects as real estate accounting systems are sometimes project-specific.",
								"We support ACH payments (via Dwolla) and card payments (via Stripe).",
							]}
							strokeColor={softwareSectionStrokeColor}
							backgroundColor={softwareSectionBackgroundColor}
							headStyle={softwareSectionListheadStyle}
							subHeaderStyle={softwareSectionListsubHeaderStyle}
							subListStyle={softwareSectionListsubListStyle}
						/>
						<ListItem
							heading="Document Management"
							text=" - A powerful and secure system to manage all your documents."
							imgSrc={[
								<img
									className="image"
									src={contract}
									alt="Document Management Image1"
									style={{ width: "100%", height: "auto" }}
								/>,
								<img
									className="image"
									src={contract}
									alt="Document Management Image2"
									style={{ width: "100%", height: "auto" }}
								/>,
								<img
									className="image"
									src={contract}
									alt="Document Management Image3"
									style={{ width: "100%", height: "auto" }}
								/>,
							]}
							subList={[
								"Share docs and folders across your project/organization teams and manage access levels.",
								"Intuitive Google Drive like workflow makes it super easy to pick up.",
							]}
							strokeColor={softwareSectionStrokeColor}
							backgroundColor={softwareSectionBackgroundColor}
							headStyle={softwareSectionListheadStyle}
							subHeaderStyle={softwareSectionListsubHeaderStyle}
							subListStyle={softwareSectionListsubListStyle}
						/>
						<ListItem
							heading="Project Management"
							text=" - Create unlimited projects. Add team members and manage their access to your projects."
							imgSrc={[
								<img
									className="image"
									src={contract}
									alt="Project Management Image1"
									style={{ width: "100%", height: "auto" }}
								/>,
								<img
									className="image"
									src={contract}
									alt="Project Management Image2"
									style={{ width: "100%", height: "auto" }}
								/>,
							]}
							subList={[
								"Use all the above apps (issues, accounting, docs) in your projects.",
								" All the information and shareable reports about your projects on your fingertips.",
							]}
							strokeColor={softwareSectionStrokeColor}
							backgroundColor={softwareSectionBackgroundColor}
							headStyle={softwareSectionListheadStyle}
							subHeaderStyle={softwareSectionListsubHeaderStyle}
							subListStyle={softwareSectionListsubListStyle}
						/>
						<ListItem
							heading="Investment Analysis"
							text=" - Analyze your real estate investment opportunities and choose the best deals."
							imgSrc={[
								<img
									className="image"
									src={contract}
									alt="Investment Analysis Image1"
									style={{ width: "100%", height: "auto" }}
								/>,
								<img
									className="image"
									src={contract}
									alt="Investment Analysis Image2"
									style={{ width: "100%", height: "auto" }}
								/>,
								<img
									className="image"
									src={contract}
									alt="Investment Analysis Image3"
									style={{ width: "100%", height: "auto" }}
								/>,
							]}
							subList={[
								"Perform accurate property analysis using our powerful and user-friendly tools.",
								"Analyze cash flow and profit projections of your RE investments.",
								"Calculate deal offers based on your return requirements.",
							]}
							strokeColor={softwareSectionStrokeColor}
							backgroundColor={softwareSectionBackgroundColor}
							headStyle={softwareSectionListheadStyle}
							subHeaderStyle={softwareSectionListsubHeaderStyle}
							subListStyle={softwareSectionListsubListStyle}
						/>
					</div>
				</section>
			</div>

			<section
				data-aos={"fade-up"}
				data-aos-once={false}
				className={classes.networkCont}
				ref={networkRef}
			>
				<div className="leftBox">&nbsp;</div>
				<div className="rightBox">
					<HeadingPrimary
						text="Network"
						styleBody={networkSectionHeaderStyle}
					/>
					<HeadingSecondary
						text="In the real estate sector, work is important but network is super important. Follow other users and organizations on the platform. Grow your own following."
						styleBody={networkSectionSubHeaderStyle}
						strokeColorBullet={"lightgray"}
						backgroundColorBullet={networkSectionBackgroundColor}
					/>
					<ListItem
						heading="Invest"
						text=" - Find exciting new projects to invest in or syndicate deals with people in your network. "
						imgSrc={[
							<img
								className="image"
								src={contract}
								alt="Issue Tracking Image"
								style={{ width: "100%", height: "auto" }}
							/>,
						]}
						subList={[
							"Transparently track on ground progress and finances of your investments.",
							"Receive income streams from projects based on agreed waterfall frameworks.",
						]}
						strokeColor={networkSectionStrokeColor}
						backgroundColor={networkSectionBackgroundColor}
						headStyle={networkSectionListheadStyle}
						subHeaderStyle={networkSectionListsubHeaderStyle}
						subListStyle={networkSectionListsubListStyle}
					/>
					<ListItem
						heading="Jobs"
						text=" - Find and rate real estate professionals or apply for a job."
						imgSrc={[
							<img
								className="image"
								src={contract}
								alt="Job Image1"
								style={{ width: "100%", height: "auto" }}
							/>,
							<img
								className="image"
								src={contract}
								alt="Job Image2"
								style={{ width: "100%", height: "auto" }}
							/>,
							<img
								className="image"
								src={contract}
								alt="Job Image3"
								style={{ width: "100%", height: "auto" }}
							/>,
						]}
						subList={[
							"Create job pipelines to manage applicants according to your workflows.",
							"Share documents privately and integrate payments in the tender process if required.",
						]}
						strokeColor={networkSectionStrokeColor}
						backgroundColor={networkSectionBackgroundColor}
						headStyle={networkSectionListheadStyle}
						subHeaderStyle={networkSectionListsubHeaderStyle}
						subListStyle={networkSectionListsubListStyle}
					/>
					<ListItem
						heading="Forum"
						text=" - Share and discuss with your real estate peeps."
						imgSrc={[
							<img
								className="image"
								src={contract}
								alt="Fourm Imag1"
								style={{ width: "100%", height: "auto" }}
							/>,
							<img
								className="image"
								src={contract}
								alt="Fourm Imag2"
								style={{ width: "100%", height: "auto" }}
							/>,
						]}
						subList={[
							"Create, join and moderate communities according to your interest.",
							"Grow your real estate network.",
						]}
						strokeColor={networkSectionStrokeColor}
						backgroundColor={networkSectionBackgroundColor}
						headStyle={networkSectionListheadStyle}
						subHeaderStyle={networkSectionListsubHeaderStyle}
						subListStyle={networkSectionListsubListStyle}
					/>
				</div>
			</section>
			<div ref={servicesRef}>
				<SectionService />
			</div> */}
		</div>
	);
}

export default LandingSections;
