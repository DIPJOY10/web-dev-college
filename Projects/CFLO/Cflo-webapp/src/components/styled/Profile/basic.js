// import React, { useState, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux'
// import { makeStyles } from '@material-ui/core/styles';
// import { ButtonBase } from '@material-ui/core';
// import Typography from '@material-ui/core/Typography';
// import { useParams, useHistory } from "react-router-dom";

// import Avatar from '@material-ui/core/Avatar';
// import Paper from '@material-ui/core/Paper';
// import IconButton from '@material-ui/core/IconButton';
// import EditIcon from '@material-ui/icons/Edit';
// import CreateBtn from "../actionBtns/create.btn";
// import TitleInput from "../title.input";
// import DescriptionInput from "../description.input";
// import DP from "./dP";

// const useStyles = makeStyles((theme) => ({
//     root:{
//         display:'flex',
//         flex:1,
//         flexDirection:'column',
//         marginTop:'7rem'
//     },
//     row:{
//         flex:1,
//         flexDirection:'row',
//         display:'flex'
//     },
//     entityDivStyle:{
//         display:'flex',
//         flex:1,
//         flexDirection:'row',
//         maxHeight:'12rem',
//         maxWidth:'30rem'
//     },
//     avatarDivStyle:{
//         display:'flex',
//         alignItems:'center',
//         justifyContent:'center',
//         margin:'0.7rem'
//     },
//     nameAndAboutDiv:{
//         display:'flex',
//         flex:1,
//         flexDirection:'column',
//         justifyContent:'center'
//     },
//     imgStyle:{
//         marginLeft:'2rem',
//         height:'4.8rem',
//         width:'4.8rem',
//         margin:'1rem',
//         marginTop:'1rem',

//     },
//     nameStyle:{


//         marginLeft:'-2rem',
//         fontFamily:'ovo',
//         fontSize:'1.4rem',
//         color:'black',
//         textAlign:'center',
//         [theme.breakpoints.down("sm")]: {
//             fontSize:'1rem',
//         }
//     },

//     descriptionText:{
//         fontSize:'0.9rem',
//         color:'#424242'
//     },
//     editButtonDiv:{
//         display:'flex',
//         justifyContent:'flex-end',
//         width:'5rem',
//         height:'5rem',
//         margin:'1rem'
//     }

// }))

// const Account = (props)=>{
//     const { entity, updateApi, fileUpdateApi } = props
//     const [title, setTitle] = useState(entity?.displayName)
//     const [description, setDescription] = useState(entity?.description)
//     const dispatch = useDispatch()
//     const classes = useStyles();

//     const [ editMode, setEditMode ] = useState(false)
//     const [ model, setModel] = useState(entity.model)

//     useEffect(() => {
//         if(entity.profile){

//         }else{

//         }
//     }, [entity])

//     var entityDiv = (
//         <Paper className={classes.entityDivStyle}>
//             <div className={classes.avatarDivStyle}>
//                 <Avatar alt={entity.displayName+"'s profile picture"} className={classes.imgStyle} src={entity.displayPicture.url} />
//             </div>
//             <div className={classes.nameAndAboutDiv}>
//                 <Typography>
//                     {entity.displayName}
//                 </Typography>
//                 <Typography className={classes.descriptionText}>
//                     {entity?.description&&entity.description.length>0?entity.description:'Add information about yourself'}
//                 </Typography>
//             </div>
//             <div className={classes.editButtonDiv}>
//                 <IconButton onClick={()=>{
//                         setEditMode(true)
//                     }}><EditIcon />
//                 </IconButton>
//             </div>
//         </Paper>

//     )

//     var placeholder = 'Change the description'

//     switch (model) {
//         case 'User':
//             placeholder = 'Write about you work experience'
//             break;

//         case 'Project':
//             placeholder = 'Describe the project'
//             break;

//         case 'Organization':
//             placeholder = 'Write about your organization'
//             break;

//         default:
//             break;
//     }

//     var EditView = (
//         <Paper>


//             <DP
//                 height={'6rem'}
//                 width={'6rem'}
//                 file={entity?.displayPicture}
//                 fileUpdateApi={fileUpdateApi}
//                 parent={entity._id}
//                 parentModelName={model}
//             />


//             <TitleInput
//                 title={title}
//                 placeholder={`Change Display Name`}
//                 setTitle={setTitle}
//              />

//             <DescriptionInput
//                 description={description}
//                 placeholder={placeholder}
//                 setDescription={setDescription}

//             />

//             <CreateBtn onClick={()=>{
//                     updateApi({
//                         _id:entity._id,
//                         displayName: title,
//                         description
//                     })

//                     setEditMode(false)

//                 }}>
//                 Save
//             </CreateBtn>
//         </Paper>
//     )

//     return (
//         <>
//             {editMode?EditView:entityDiv}
//         </>
//     );
// }

// export default Account;
