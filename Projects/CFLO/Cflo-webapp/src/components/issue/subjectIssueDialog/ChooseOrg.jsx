import { List, Typography } from "@material-ui/core";
import SearchBar from "../../share/searchbar";
import React, { useEffect, useState } from "react";
import EntityListItem from "../../share/team.list.item";

const ChooseOrg = ({ orgTeams, parent, setParent, setParentObject }) => {
	const [text, setText] = useState("");

	return (
		<List dense sx={{ width: "100%", bgcolor: "background.paper" }}>
			<SearchBar
				text={text}
				setText={setText}
				placeholder={"Search Organizations"}
				shared={parent}
				setShared={setParent}
				style={{ margin: 0, width: "100%" }}
			/>

			{orgTeams.length === 0 ? (
				<Typography variant="subtitle1" component="div" align="center">
					No Results Found
				</Typography>
			) : (
				orgTeams.map((team) => {
					return (
						<EntityListItem
							key={team?._id}
							radioMode={true}
							setParentObject={setParentObject}
							entity={team}
							shared={parent}
							setShared={setParent}
						/>
					);
				})
			)}
		</List>
	);
};
export default ChooseOrg;
