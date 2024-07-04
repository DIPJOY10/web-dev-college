import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory, useLocation } from "react-router-dom";
import IssuePaperCard from "./issue.card";

import CreateButton from "../styled/actionBtns/create.btn";
import useGetProfile from "../profile/useGetProfile";
import CancelIcon from "@material-ui/icons/Cancel";
import SearchIcon from "@material-ui/icons/Search";
import AddIcon from "@material-ui/icons/Add";
import { useSelector } from "react-redux";
import {
	Button,
	CircularProgress,
	IconButton,
	InputAdornment,
	TextField,
} from "@material-ui/core";
import Api from "../../helpers/Api";
import IssuesTable from "./issue.table";

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

export default function IssueList(props) {
	const classes = useStyles();
	const {
		totalIssues,
		profileId,
		issueIds,
		issueDictionary,
		currentTemplate,
		profile,
		templateIds,
		templateDictionary,
	} = props;
	const history = useHistory();

	// get ids of currently selected templates
	const [searchQuery, setSearchQuery] = useState("");
	const [filterIssueIds, setFilterIssueIds] = useState([...issueIds]);
	
	useEffect(() => {
		setFilterIssueIds([...issueIds]);
	}, [issueIds]);

	return (
		<div className={classes.root}>
			<>
				<div style={{ display: "flex", marginBottom: "1rem" }}>
					<TextField
						label="Search"
						placeholder="Search By Title"
						type="text"
						variant="outlined"
						margin="normal"
						fullWidth
						style={{ flexBasis: "80%" }}
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
					
				</div>
				<IssuesTable
					totalIssues={totalIssues}
					issueIds={filterIssueIds}
					issueDictionary={issueDictionary}
					profileId={profileId}
					profile={profile}
					templateIds={templateIds}
					templateDictionary={templateDictionary}
					searchQuery={searchQuery}
				/>
			</>
		</div>
	);
}
