import { List, Typography } from "@material-ui/core";
import SearchBar from "../share/searchbar";
import React, { useEffect, useState } from "react";
import UserListItem from "./listItems/user.list.item";
import Api from "../../helpers/Api";
import { useDebounce } from 'react-use';


const ChooseUser = ({ selectedDict, setSelectedDict, 
	selectedIds,setSelectedIds, multiple  }) => {
	const [ text, setText ] = useState("");
    const [ users, setUsers ] = useState([])

    const getUser = async () =>{
        const resData = await Api.post('search/users', {name:text});
        const data = resData?.data;
        const newUsers = data || []
        setUsers(newUsers)
    }

    useDebounce(() => {
        getUser()    
    }, 1500, [text]);

    useEffect(() => {
        getUser()
    }, [])
    
	console.log(users,'are the users')

	return (
		<List dense sx={{ width: "100%", bgcolor: "background.paper" }}>
			<SearchBar
				text={text}
				setText={setText}
				placeholder={"Search Users"}
				style={{ margin: 0, width: "100%" }}
			/>

			{users.length === 0 ? (
				<Typography variant="subtitle1" component="div" align="center">
					No Results Found
				</Typography>
			) : (
				users.map((user) => {
					return (
						<UserListItem
							key={user?._id}
							entity={user}
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
export default ChooseUser;
