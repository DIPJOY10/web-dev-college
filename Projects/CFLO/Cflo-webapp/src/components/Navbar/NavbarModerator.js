import React from "react";
import NavButton from "./NavButton";
import { useMediaQuery } from "@material-ui/core";
import MailIcon from "@material-ui/icons/Mail";
import HomeIcon from "@material-ui/icons/Home";
import ExploreIcon from "@material-ui/icons/Explore";
import AssessmentIcon from "@material-ui/icons/Assessment";
import PeopleIcon from "@material-ui/icons/People";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import HourglassEmptyIcon from "@material-ui/icons/HourglassEmpty";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import NavbuttonModeration from "./NavButtonModerator";
import CancelIcon from "@material-ui/icons/Cancel";
import InfoIcon from "@material-ui/icons/Info";
import WatchLaterIcon from "@material-ui/icons/WatchLater";

const NavButtonInfos = [
	// {
	//   icon: ExploreIcon,
	//   text: 'Explore',
	//   link: '/',
	// },
	{
		icon: PeopleIcon,
		text: "Members",
		link: "members",
	},
	{
		icon: WatchLaterIcon,
		text: "Requests",
		link: "requests",
	},
	{
		icon: InfoIcon,
		text: "About",
		link: "about",
	},
];

export default function NavbarModeration(props) {
	const theme = useTheme();
	const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
	return (
		<>
			{NavButtonInfos.map((NBInfo, index) => {
				return (
					<NavbuttonModeration
						key={NBInfo.text}
						text={NBInfo.text}
						icon={NBInfo.icon}
						index={index}
						link={NBInfo.link}
					/>
				);
			})}
		</>
	);
}
