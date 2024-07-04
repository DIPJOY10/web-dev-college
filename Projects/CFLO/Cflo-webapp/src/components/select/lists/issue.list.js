import {
	Breadcrumbs,
	Button,
	CircularProgress,
	List,
	makeStyles,
	Typography,
} from "@material-ui/core";
import IssueListItem from "../listItems/issue.list.item";
import SearchBar from "../../share/searchbar";

import React, { useEffect, useState } from "react";
import useProfileIssueData from "../../issue/useProfileIssueData";

const useStyles = makeStyles((theme) => ({
	hoverUnderline: {
		"&:hover": {
			textDecoration: "underline",
			color: "blue",
			cursor: "pointer",
		},
	},
}));

const IssueList = ({
    // profile from where data is retrieved
    selectedProfile,

    setSelected,
	selectedDict, setSelectedDict, 
	selectedIds,setSelectedIds, multiple
}) => {


    const [text, setText] = useState('')

	const {
		issueIds,
		issueDictionary,
		loading,
	} = useProfileIssueData(selectedProfile || false);


    	
	return (

					<List
						dense
						sx={{ width: "100%", bgcolor: "background.paper" }}
					>
						<SearchBar
							text={text}
							setText={setText}
							placeholder={"Search Issues"}
							style={{ margin: 0, width: "100%" }}
						/>

						{loading ? (
							<div
								style={{
									display: "flex",
									justifyContent: "center",
								}}
							>
								<CircularProgress />
							</div>
						) : issueIds.length === 0 ? (
							<Typography
								variant="subtitle1"
								component="div"
								align="center"
							>
								No Issue Found
							</Typography>
						) : (
							<List
								dense
								sx={{
									width: "100%",
									bgcolor: "background.paper",
								}}
							>
								<>
									{issueIds
										.filter((issue) => {
											if (text) {
												return (
													issueDictionary[issue]
														?.title || ""
												)
													.toLowerCase()
													.includes(
														text.toLocaleLowerCase()
													);
											} else {
												return true;
											}
										})
										.map((id) => {
											return (
												<IssueListItem
													key={id}
													multiple={multiple}
													entity={issueDictionary[id]}
													selectedIds={selectedIds}
													setSelectedIds={setSelectedIds}
													selectedDict={selectedDict}
													setSelectedDict={setSelectedDict}
												/>
											);
										})}
								</>
							</List>
						)}
					</List>
			
	);
};

export default IssueList;
