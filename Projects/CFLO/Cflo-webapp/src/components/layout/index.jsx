// Import modules
import React, { useState } from "react";
import PropTypes from "prop-types";

// Import components
import Appbar from "../appbar/Appbar";
import Drawer from "../drawer/Drawer";
import { PageContainer, RightWrapper, ContentWrapper } from "./layout.styled";
import { useMediaQuery, useTheme } from "@material-ui/core";
import BottomAppBar from "../BottomAppbar/BottomAppbar";
import DrawerModerator from "../drawer/ModeratorDrawer";
import BottomAppBarModerator from "../BottomAppbar/BottomAppbarModerator";

const Layout = ({
	hideDrawer,
	noAppbar,
	className,
	children,
	modDrawer,
	...props
}) => {
	const [drawerOpen, setDrawerOpen] = useState(!hideDrawer);
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

	return (
		<PageContainer className="page-container">
			{!hideDrawer &&
				(isMobile ? (
					<BottomAppBar />
				) : (
					<Drawer open={drawerOpen} className="drawer-wrapper" />
				))}
			{modDrawer &&
				(isMobile ? (
					<BottomAppBarModerator />
				) : (
					<DrawerModerator
						open={drawerOpen}
						className="drawer-wrapper"
					/>
				))}

			<RightWrapper
				drawerOpen={drawerOpen}
				className="page-content-wrapper"
			>
				{!noAppbar && (
					<Appbar
						drawerOpen={drawerOpen}
						setDrawerOpen={(o) => setDrawerOpen(!o)}
						hideDrawer={hideDrawer}
						hideToggle
					/>
				)}
				<ContentWrapper
					drawerOpen={drawerOpen}
					noAppbar={noAppbar}
					className={className}
					{...props}
				>
					{children}
				</ContentWrapper>
			</RightWrapper>
		</PageContainer>
	);
};

Layout.defaultProps = {
	hideDrawer: false,
	noAppbar: false,
	className: "",
};

Layout.propTypes = {
	/**
	 * To display Drawer
	 */
	hideDrawer: PropTypes.bool,

	/**
	 * To display Appbar
	 */
	noAppbar: PropTypes.bool,

	/**
	 * className for styling
	 */
	className: PropTypes.string,

	/**
	 * children of Layout
	 */
	children: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.node),
		PropTypes.node,
	]).isRequired,
};

export default Layout;
