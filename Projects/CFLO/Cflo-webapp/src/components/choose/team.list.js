import React, { useState, useEffect } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Checkbox from "@material-ui/core/Checkbox";
import Avatar from "@material-ui/core/Avatar";
import { useDebounce } from "react-use";
import Api from "../../helpers/Api";
import AvatarLocal from "../profile/avatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import EntityListItem from "./team.list.item";
import SearchBar from "./searchbar";

export default function TeamList(props) {
	const { choosen, setChoosen, teams, model } = props;

	const [users, setUsers] = useState([]);
	const [text, setText] = useState("");

	const [loading, setLoading] = useState(true);

	return (
		<List
			dense
			sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
		>
			<SearchBar
				text={text}
				setText={setText}
				placeholder={"Search Organizations"}
				choosen={choosen}
				setChoosen={setChoosen}
			/>

			{teams.map((team) => {
				return (
					<EntityListItem
						key={team?._id}
						entity={team}
						choosen={choosen}
						setChoosen={setChoosen}
						model={model}
					/>
				);
			})}
		</List>
	);
}
