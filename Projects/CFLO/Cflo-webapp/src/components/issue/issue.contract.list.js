import React, { useState } from "react";
import CancelIcon from "@material-ui/icons/Cancel";
import SearchIcon from "@material-ui/icons/Search";
import {
	Button,
	IconButton,
	InputAdornment,
	makeStyles,
	TextField,
	useMediaQuery,
} from "@material-ui/core";
import CreateButton from "../styled/actionBtns/create.btn";
import { useHistory } from "react-router-dom";
import AddIcon from "@material-ui/icons/Add";
import IssuesContractTable from "./issue.contract.table";
import LaunchIcon from "@material-ui/icons/Launch";

const useStyles = makeStyles((theme) => ({
	root: {
		flex: "1",
		display: "flex",
		padding: "1rem",
		paddingTop: "0",
		minHeight: "8rem",
		textAlign: "right",
		marginLeft: "1rem",
		flexDirection: "column",
	},
}));

function IssueContractList({ profileId, projectArray }) {
	const history = useHistory();
	const [searchQuery, setSearchQuery] = useState("");
	const classes = useStyles();
	const smallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

	console.log("project = ", projectArray);
	return (
		<div className={classes.root}>
			<div
				style={
					smallScreen
						? {
								display: "flex",
								marginBottom: "1rem",
								flexWrap: "wrap",
								justifyContent: "center",
						  }
						: {
								display: "flex",
								marginBottom: "1rem",
						  }
				}
			>
				<TextField
					label="Search"
					placeholder="Search By Title"
					type="text"
					variant="outlined"
					margin="normal"
					fullWidth
					style={smallScreen ? {} : { flexBasis: "70%" }}
					onChange={(e) => setSearchQuery(e.target.value)}
					value={searchQuery}
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								<SearchIcon />
							</InputAdornment>
						),
						endAdornment: searchQuery && (
							<IconButton onClick={() => setSearchQuery("")}>
								<CancelIcon />
							</IconButton>
						),
					}}
				/>
				<div
					style={
						smallScreen
							? {
									display: "flex",
									gap: "0.5rem",
									padding: " 1rem 0px 1rem 0.7rem",
							  }
							: {
									flexBasis: "30%",
									display: "flex",
									gap: "0.5rem",
									padding: " 1rem 0px 1rem 0.7rem",
							  }
					}
				>
					<Button
						variant="contained"
						color="primary"
						style={{ width: "50%" }}
						startIcon={<LaunchIcon />}
						onClick={() => {
							history.push("/issue/timeline/" + profileId);
						}}
					>
						Dashboard
					</Button>
					<Button
						variant="contained"
						color="primary"
						style={{ width: "50%" }}
						startIcon={<AddIcon />}
						onClick={() => {
							history.push(
								"/issue/timeline/" + profileId + "/new"
							);
						}}
					>
						Task Maps
					</Button>
				</div>
			</div>
			<IssuesContractTable
				projectArray={projectArray}
				searchQuery={searchQuery}
				profileId={profileId}
			/>
		</div>
	);
}

export default IssueContractList;
