import React, { useEffect, useState } from 'react'
import Api from '../../helpers/Api';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Checkbox, Paper, Pagination, Typography, Button, Input, TextField, IconButton, Backdrop, CircularProgress } from '@material-ui/core';
// import SearchBar from '../appbar/SimpleSearchBar';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import SearchUser from '../SearchUser';

const Userstyles = {
  paper: {
    height: "100vh",
    overflow: "scroll",
    width: "350px"
  },
  head: {
    padding: "10px",

    display: "flex",
    alignItems: "center",


  },
  img: {
    width: "10%",
    borderRadius: "100%",
    marginRight: "10px"
  },
  name: {
    width: "100%",

  },
  pagination: {
    position: "absolute",
    bottom: "0",
    margin: "10px",
    background: "white",
    width: "100%",

    overflow: "hidden",
    paddingTop: "20px",
    paddingBottom: "20px"
  },
  textArea: {
    height: "30px",
    margin: "10px"
  },
  searchBar: {
    marginBottom: "10px",
    height: "150px",
    padding: "20px"
  }
}
const useStyles2 = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: 'white',
    background:'#0001',
    position:"relative",
    height:"500px"
  },
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));
const useStyles = makeStyles((theme) => ({
  root: {
    '& > * + *': {
      marginTop: theme.spacing(3),
    },
  },
  inputPaper: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: '19rem',
    marginLeft: '1rem',
    marginBottom: '1rem',
    marginTop: '1rem',
    borderRadius: 10,
    paddingLeft: 10,
    [theme.breakpoints.down('sm')]: {
      width: '14rem',
    },
    [theme.breakpoints.down('xs')]: {
      width: '11rem',
      padding: 0,
    },
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    color: 'black',
    padding: 10,
  },
}));
export function UserList(props) {
  const [user, setUser] = useState([])
  const classes = useStyles();
  const [pages, setPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState({ search: '' });
  const [isSearchShowingInMobile, setSearchShowing] = useState(false);
  const [checkedBox, setCheckedBox] = useState(true)
  const { list, setList, Data, shared,type } = props
  const classes2 = useStyles2();
  const [openLoading, setOpenLoading] = React.useState(false);
  useEffect(() => {
    createProjectApi()

  }, [pages, searchTerm])
  useEffect(() => {
    selectedUser()

  }, [user])
  const selectedUser = () => {
    user.map((userData) => {
      Data.map((checkedData) => {
        if (checkedData.entity == userData.profile) {
          document.getElementById(checkedData.entity).checked = "true"

        }

      })
    })
  }
  const UserAleredyShare = () => {
    shared.map((shareDataList) => {
      if (document.getElementById(shareDataList.entity)) {
        document.getElementById(shareDataList.entity).checked = "true"
      }
    })
  }
  const createProjectApi = () => {
    setOpenLoading(true)
    Api.post('user/userList', { page: pages, name: searchTerm.search }).then((userData) => {
 
      setUser(userData.records)
      setOpenLoading(false)


    }).catch((err) => {
      console.log(err)
    });

  }

  const searchTarget = (e) => {
    setSearchTerm({ search: e.target.value })


  }
  const isChecked = (e) => {
    if (e.target.checked) {
      setList({
        entity: e.target.id,
        entityType: "Profile"
      })
      if(type=="doc")
      {
          Api.post(`/doc/update/${props.id}`,{ shared:{entity:e.target.id,entityType:"Profile"}}).then((res)=>
          {      
                  console.log(res)
                  
            })
      }
      else
      {

        Api.post(`/doc/folder/update/${props.id}`,{ shared:{entity:e.target.id,entityType:"Profile"}}).then((res)=>
        {      
                console.log(res)
                
          })
      }
 
    }
    else {

      // Data.pop()
      if(type=="doc")
      {
          Api.post(`/doc/delete/${props.id}`,{ shared:{entity:e.target.id,entityType:"Profile"}}).then((res)=>
          {      
                  console.log(res)
                  
            })
      }
      else
      {
        console.log("hiii")
        Api.post(`/doc/folder/delete/${props.id}`,{ shared:{entity:e.target.id,entityType:"Profile"}}).then((res)=>
        {      
                console.log(res)
                
          })
      }
 
      // document.getElementById(e.target.id).checked = "false"
    }
  }

  return (
    <>
      <Paper component="form" className={classes.inputPaper} >
        <IconButton className={classes.iconButton} aria-label="search">
          <SearchIcon />
        </IconButton>
        <InputBase
          className={classes.input}
          // onKeyDown={onKeyDown}
          onChange={searchTarget}
          placeholder="Search People"
          value={searchTerm.search}
        />

      </Paper>
      
      <Paper style={Userstyles.paper}>

        {user.map((userData, index) => {


          return (<>

            <div style={Userstyles.head} >
                <img style={Userstyles.img} src={userData.displayPicture.url} alt="img" />
                <span style={Userstyles.name}>{userData.displayName}</span>
                <div id={userData.displayName}>
                    <input 
                        type="checkbox" 
                        value={index} key={userData.index} 
                        id={userData.profile} 
                        onChange={isChecked} 
                      />
                </div>
            </div>

          </>)
        })}


        <div style={Userstyles.pagination}>
          <Button variant='contained' color='primary' onClick={() => pages == 1 ? setPages(1) : setPages(pages - 1)} >Prev</Button>
          {/* <TextField id="outlined-basic" label="Outlined" variant="outlined" style={Userstyles.textArea}/>
            */}
          <input style={Userstyles.textArea} type="number" value={pages} />
          <Button variant='contained' color='primary' onClick={() => pages == 2 ? setPages(2) : setPages(pages + 1)}>Next</Button>
        </div>
        <Backdrop className={classes2.backdrop} open={openLoading} >
        <CircularProgress color="inherit" />
      </Backdrop>
      </Paper>
    
      
    </>
  )
}
