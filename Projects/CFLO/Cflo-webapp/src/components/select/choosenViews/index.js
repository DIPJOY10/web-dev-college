import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";

import {
	Avatar,
	Button,
	Drawer,
	FormControl,
	FormControlLabel,
	Grid,
	IconButton,
	ListItem,
	ListItemAvatar,
	ListItemIcon,
	ListItemText,
	Radio,
	RadioGroup,
	Slide,
	TextField,
	Typography,
	useMediaQuery,
} from "@material-ui/core";
import IssueSvg from "../../Assets/issue.svg";
import EditIcon from "@material-ui/icons/Edit";
import CloseIcon from "@material-ui/icons/Close";
import SubjectIssue from "../select/choose";
// import SubjectIssue from "./subject.issue";
import docImage from "../../Assets/FileIcon/docs.png";
const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});
const ListDict = {
	// parentModel name to display Name
	Organization: "Organization",
	Project: "Project",
	Doc: "Documents",
	Issue: "Issues",
	RentalUnit: "Rental Units",
	FinanceRelation: "Contacts",
	Transaction: "Transactions",
};

const getSubjectText = (
	setParent,
	parentModel,
	parentObject,
	handleClickOpen
) => {
	const sendText = () => {
		switch (parentModel) {
			case "Issue":
				return (
					<ListItemText
						primary={parentObject?.title || " "}
						secondary={
							<>
								{`${parentObject?.template?.title ||
									"No Template"
									} `}
								<br />
								Issue
							</>
						}
					/>
				);
			case "Doc":
				return (
					<ListItemText
						primary={parentObject?.title || " "}
						secondary={ListDict[parentModel]}
					/>
				);
			case "RentalUnit":
				return (
					<ListItemText
						primary={parentObject?.name || " "}
						secondary={ListDict[parentModel]}
					/>
				);
			default:
				return (
					<ListItemText
						primary={parentObject?.displayName || " "}
						secondary={ListDict[parentModel]}
					/>
				);
		}
	};
	let html = (
		<ListItem
			style={{
				width: "max-content",
				alignItems: "center",
				border: "1px solid #c7c7c7",
				borderRadius: "12px",
			}}
		>
			<ListItemAvatar>
				<Avatar
					src={
						parentModel == "Issue"
							? IssueSvg
							: parentModel == "Doc"
								? docImage
								: parentObject?.displayPicture?.thumbUrl
					}
					style={{
						height: "1.6rem",
						width: "1.6rem",
						borderRadius: "0.8rem",
					}}
				/>
			</ListItemAvatar>
			{sendText()}
			<IconButton onClick={handleClickOpen}>
				<EditIcon />
			</IconButton>
			<IconButton
				onClick={() => {
					setParent(null);
				}}
			>
				<CloseIcon />
			</IconButton>
		</ListItem>
	);
	return html;
};



function EditProfileIssue(props) {

	return (
		<>

	
						{parent ? (
							getSubjectText(
								setParent,
								parentModel,
								parentObject,
								handleClickOpen
							)
						) : (
							<Button
								style={{ margin: "1rem" }}
								onClick={handleClickOpen}
								variant="contained"
								color="primary"
							>
								Choose Subject
							</Button>
						)}

						<SubjectIssue
							openDialog={openDialog}
							setOpenDialog={setOpenDialog}
							parent={parent}
							setParent={setParent}
							parentObject={parentObject}
							setParentObject={setParentObject}
							parentModel={parentModel}
							setParentModel={setParentModel}
						/>
		
		</>
	);
}
export default EditProfileIssue;
