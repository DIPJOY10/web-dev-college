import {
	Avatar,
	Card,
	CardActionArea,
	CardContent,
	CardMedia,
	Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import AssignmentIcon from "@material-ui/icons/Assignment";
import BusinessIcon from "@material-ui/icons/Business";
import PersonIcon from "@material-ui/icons/Person";
import { useSelector, useDispatch } from "react-redux";

function DialogOptionSelect({ 
	noIcon = false, setTab,
	setParentProfileObject, setSelectedProfile,
	setBreadcrumbHistory, breadcrumbHistory
}) {
	
	const { user } = useSelector((state) => state.auth);
	// icons array should only contain mui icons or svgs. No image src file
    let items = ["Organisation", "Project", "Users"];
	let icons = [BusinessIcon, AssignmentIcon, PersonIcon];
    console.log(breadcrumbHistory,' is breadcrumb history')
    return (
		<div
			style={{
				display: "grid",
				gap: "15px",
				gridTemplateColumns: "repeat(auto-fill, minmax(158px, 1fr))",
				gridAutoRows: "1fr",
				gridAutoFlow: "column",
			}}
		>
			{/* {items.map((itemName, idx) => {
				const Imgtag = icons[idx];
				return (
					<Card style={{ height: "100%" }} key={idx}>
						<CardActionArea
							onClick={() => {
								if (setTab) {
									setTab(idx);
								}
							}}
							style={{
								padding: "1rem",
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								height: "100%",
								justifyContent: "space-around",
							}}
						>
							{!noIcon && (
								<Avatar alt="no">
									<Imgtag />
								</Avatar>
							)}
							<CardContent>
								<Typography
									variant="h6"
									component="h2"
									align="center"
								>
									{itemName}
								</Typography>
							</CardContent>
						</CardActionArea>
					</Card>
				);
			})} */}
			<Card style={{ height: "100%" }} key={'userorgs'}>
						<CardActionArea
							onClick={() => {
								if (setTab) {
									setTab(0);
								}
							}}
							style={{
								padding: "1rem",
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								height: "100%",
								justifyContent: "space-around",
							}}
						>
							
							<Avatar alt="no">
								<BusinessIcon />
							</Avatar>

							<CardContent>
								<Typography
									variant="h6"
									component="h2"
									align="center"
								>
									Organizations
								</Typography>
							</CardContent>
						</CardActionArea>
				</Card>
				<Card style={{ height: "100%" }} key={'userprojects'}>
						<CardActionArea
							onClick={() => {
								if (setTab) {
									setTab(1);
								}
							}}
							style={{
								padding: "1rem",
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								height: "100%",
								justifyContent: "space-around",
							}}
						>
							
							<Avatar alt="no">
								<AssignmentIcon />
							</Avatar>

							<CardContent>
								<Typography
									variant="h6"
									component="h2"
									align="center"
								>
									Projects
								</Typography>
							</CardContent>
						</CardActionArea>
				</Card>
				<Card style={{ height: "100%" }} key={'userprofile'}>
						<CardActionArea
							onClick={() => {
								setTab(2)
								setSelectedProfile(user?.profile)
				
								setBreadcrumbHistory([
									...breadcrumbHistory,'User',
									user?.displayName
								]);
								setParentProfileObject(user)
							}}
							style={{
								padding: "1rem",
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								height: "100%",
								justifyContent: "space-around",
							}}
						>
							
							<Avatar alt="no">
								<AssignmentIcon />
							</Avatar>

							<CardContent>
								<Typography
									variant="h6"
									component="h2"
									align="center"
								>
									My profile
								</Typography>
							</CardContent>
						</CardActionArea>
				</Card>
		</div>
	);
}

export default DialogOptionSelect;
