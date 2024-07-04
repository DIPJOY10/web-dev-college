import {
	Button,
	List,
	makeStyles,
	Typography,
} from "@material-ui/core";
import React, { useEffect, useState }  from "react";
import EntityListItem from "../share/team.list.item";
import SearchBar from "../share/searchbar";

function TeamSelect({ 
    teams, shared, setShared, placeholder='Search Organizations',
    setParentProfileObject
}) {
	// icons array should only contain mui icons or svgs. No image src file
	const [text, setText] = useState("");
	
    
    return (
			<List dense sx={{ width: "100%", bgcolor: "background.paper" }}>
				<SearchBar
					text={text}
					setText={setText}
					placeholder={placeholder}
					style={{ margin: 0, width: "100%" }}
				/>

				{teams.length === 0 ? (
					<Typography
						variant="subtitle1"
						component="div"
						align="center"
					>
						No Results Found
					</Typography>
				) : (
					teams
						.filter((team) => {
							if (text) {
								return (team?.parent?.displayName || "")
									.toLowerCase()
									.includes(text.toLocaleLowerCase());
							} else {
								return true;
							}
						})
						.map((team) => {
							return (
								<EntityListItem
									key={team?._id}
									radioMode={true}
									setParentObject={setParentProfileObject}
									entity={team}
									shared={shared}
									setShared={setShared}
								/>
							);
						})
				)}
			</List>

	);
}

export default TeamSelect;
