import React, { useState,useEffect } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Checkbox from '@material-ui/core/Checkbox';
import Avatar from '@material-ui/core/Avatar';
import {useDebounce} from 'react-use';
import Api from "../../helpers/Api";
import AvatarLocal from '../profile/avatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import EntityListItem from './user.list.item';
import SearchBar from './searchbar';



export default function UserList(props) {
    const {
        shared, setShared 
    } = props;

    const [users, setUsers] = useState([])
    const [ text, setText] = useState('')


    const [ loading, setLoading] = useState(true)
    


    const getUserApi = async ()=>{

        setLoading(true)
        const res = await Api.post('shared/getUserData',{ name :text}) 
        const data = res?.data;

        if(data){
            setLoading(false)
            setUsers(data)

        }

    }


    useDebounce(()=>{
        getUserApi();

    }, 500, [text]);

    useEffect(() => {
        getUserApi()
    },[])

  return (
    <List dense sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
       
        <SearchBar 
            text={text}
            setText={setText}
            placeholder={'Search People'}
        />



        {loading?null:<>
            {users?.length>0?<>
                {users.map(user=>{
                    return <EntityListItem key={user?._id} entity={user} shared={shared} setShared={setShared} />
                })}
            
            </>:<></>}
    
        </>}

    </List>
  );
}