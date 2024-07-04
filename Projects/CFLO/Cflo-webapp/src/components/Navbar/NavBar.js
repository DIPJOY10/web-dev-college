import React from "react";
import NavButton from "./NavButton";
import { useMediaQuery } from "@material-ui/core";
import MailIcon from "@material-ui/icons/Mail";
import HomeIcon from "@material-ui/icons/Home";
import ExploreIcon from "@material-ui/icons/Explore";
import AssessmentIcon from "@material-ui/icons/Assessment";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import ForumIcon from "@material-ui/icons/Forum";
import FolderIcon from "@material-ui/icons/Folder";
import BusinessIcon from "@material-ui/icons/Business";

import { makeStyles, useTheme } from "@material-ui/core/styles";

const NavButtonInfos = [
  // {
  //   icon: ExploreIcon,
  //   text: 'Explore',
  //   link: '/',
  // },

  {
    icon: AssessmentIcon,
    text: "Dashboard",
    link: "/",
  },
  {
    icon: FolderIcon,
    text: "Projects",
    link: "/projects",
  },
  {
    icon: MailIcon,
    text: "Messages",
    link: "/messages",
  },
  {
    icon: ExploreIcon,
    text: "Feeds",
    link: "/feed",
  },
  {
    icon: AccountBoxIcon,
    text: "Account",
    link: "/account",
  },
];

export default function Navbar(props) {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <>
      {NavButtonInfos.map((NBInfo, index) => {
        return (
          <NavButton
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
