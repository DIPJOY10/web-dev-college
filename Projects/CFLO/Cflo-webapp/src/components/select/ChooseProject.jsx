import { List, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import SearchBar from "../share/searchbar";
import EntityListItem from "./listItems/team.list.item";


const ChooseProject = ({
	projectTeams, selectedDict, setSelectedDict, 
	selectedIds,setSelectedIds, multiple 
}) => {
	const [text, setText] = useState("");
	const [currentProjectObj, setCurrentProjectObj] = useState({});

	return (
		<List dense sx={{ width: "100%", bgcolor: "background.paper" }}>
			<SearchBar
				text={text}
				setText={setText}
				placeholder={"Search Projects"}
				style={{ margin: 0, width: "100%" }}
			/>

			{projectTeams.length === 0 ? (
				<Typography variant="subtitle1" component="div" align="center">
					No Results Found
				</Typography>
			) : (
				projectTeams.map((team) => {
					return (
						<EntityListItem
							key={team?._id}
							entity={team}
							multiple={multiple}
							selectedDict={selectedDict}
							setSelectedDict={setSelectedDict}
							setSelectedIds={setSelectedIds}
							selectedIds={selectedIds}
					/>
					);
				})
			)}
		</List>
	);
};

export default ChooseProject;
