import {
	Breadcrumbs,
	Button,
	CircularProgress,
	List,
	makeStyles,
	Typography,
} from "@material-ui/core";
import TemplateListItem from "../listItems/template.list.item";
import SearchBar from "../../share/searchbar";

import React, { useEffect, useState } from "react";
import useProfileIssueData from "../../issue/useProfileIssueData";
import useGetTemplates from "../../issue/useGetTemplates";

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
		templateIds,
		templateDictionary,
		loading,
	} = useGetTemplates(selectedProfile || false);


    	
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
						) : templateIds.length === 0 ? (
							<Typography
								variant="subtitle1"
								component="div"
								align="center"
							>
								No Template Found
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
									{templateIds
										.filter((issue) => {
											if (text) {
												return (
													templateDictionary[issue]
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
												<TemplateListItem
													key={id}
													multiple={multiple}
													entity={templateDictionary[id]}
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
