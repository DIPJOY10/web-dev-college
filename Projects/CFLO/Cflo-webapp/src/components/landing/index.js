import React, { useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Top from "./top/index.js";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import LogoWhite from "../../Assets/LogoWhite.svg";
import LandingSections from "./LandingSections";
import Tooltip from "@material-ui/core/Tooltip";
import FacebookIcon from "@material-ui/icons/Facebook";
import TwitterIcon from "@material-ui/icons/Twitter";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import EmailIcon from "@material-ui/icons/Email";
import config from "../../config/index";
import LogoPrimary from "../../Assets/LogoPrimary.svg";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Loadinglogo } from "../../helpers/loadinglogo";
import Footer from "./footer/footer";

const useStyles = makeStyles((theme) => ({
	root: {
		flex: 1,
		display: "flex",
		flexDirection: "column",
		flexWrap: "wrap",
	},
	logoStyle: {
		height: "50px",
		marginLeft: "20px",
	},
	loaderCont: {
		position: "fixed",
		top: "0px",
		right: "0px",
		width: "100vw",
		height: "100vh",
		zIndex: "1000",
		backgroundColor: "rgba(0, 0, 0, 0.3)",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
	},
}));

export default function Landing() {
	const classes = useStyles();

	const softwareRef = useRef(null);
	const networkRef = useRef(null);
	const servicesRef = useRef(null);

	const [pos, setPos] = useState({
		software: softwareRef,
		network: networkRef,
		services: servicesRef,
	});

	const openInNewTab = (url) => {
		const newWindow = window.open(url, "_blank", "noopener,noreferrer");
		if (newWindow) newWindow.opener = null;
	};

	const [loadingBool, setLoadingBool] = useState(false);

	return (
		<div className={classes.root}>
			<Top pos={pos} setLoadingBool={setLoadingBool} />
			<LandingSections
				softwareRef={softwareRef}
				networkRef={networkRef}
				servicesRef={servicesRef}
			/>

			<Footer />


			{loadingBool && (
				<div className={classes.loaderCont}>
					<Loadinglogo />
				</div>
			)}
		</div>
	);
}
