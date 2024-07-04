import {  LinearProgress, makeStyles, Paper } from '@material-ui/core'
import { NavigateBefore, NavigateNext, Visibility } from '@material-ui/icons';

import React, { useEffect, useState } from 'react'

import { useSelector } from 'react-redux';
import ProfileSuggestionCard from '../cards/profileSuggestionCard';

const items = [
    {
        name: "Have you added Your education ?",
        description: "Members who include education receive up to 3.5 times as many profile views.",
        button:"add Education"
    },
    {
        name: "Have you added Your language ?",
        description: "Members who include at least one language receive up to 3.5 times as many profile views.",
        button:"add Language"
    },
    {
        name: "Have You added Your Experience ?",
        description: "Members who include at least one experience receive up to 3.5 times as many profile views.",
        button:"add Experience"
    },
    
]

const useStyles = makeStyles((theme)=>({
    main:{
        display:'flex',
        flexDirection:'column',
        alignItems:'start',
        borderRadius:'.5rem',
        marginTop:'1rem',
        height:'22rem',
        [theme.breakpoints.down("xs")]: {
           height:'35rem'
        },
    },
    heading:{
       display:'flex',
       flexDirection:'column',
       justifyContent:'space-between',
       alignItems:'start'
    },
    subHeading:{
        display:'flex',
        flexDirection:'row',
        paddingLeft:'2rem',
        
    },
    topHead:{
        paddingLeft:'2rem',
        paddingTop:'1rem',
        color:'black',
        fontWeight:'400',
        fontSize:'1.5rem',
        fontFamily:'Sans-serif'
    },
    eyeIcon:{
    color:'gray',
    },
    privateText:{
      paddingLeft:'.2rem'
    },
    progressBar:{
        paddingLeft:'2rem',
        width:'90%',
        marginTop:'1rem'
    },
    progressHead:{
        color:'black',
        fontWeight:'300',
        fontSize:'1.1rem',
        fontFamily:'Sans-serif'
    },
    progressLine:{
        marginTop:'.5rem'
    },
    progressBaseline:{
        marginTop:'.8rem',
        color:'black',
        fontSize:'.9rem',
        fontFamily:'Sans-serif'
    },
    suggestionCard:{
       display:'flex',
       flexDirection:'row',
       alignItems:'center',
       justifyContent:'space-between',
       width:'100%',
       paddingLeft:'2rem',
       paddingTop:'1rem',
       wordWrap:'break-word',
       [theme.breakpoints.down("xs")]: {
        width:'90%',
        fontSize:'10px',
        height:'180px',
        marginTop:'.8rem',
        flexDirection:'column',
    },
    [theme.breakpoints.down("sm")]: {
        fontSize:'12px',
        height:'150px',
        marginTop:'.5rem',
    },
    [theme.breakpoints.down("md")]: {
        fontSize:'12px',
        height:'150px',
        marginTop:'.5rem'
    },
    },
    
}))

const IncompleteProfile = ({setShowExperience,setDialog,setShowEducation,setShowSkill,isEducation,progress,setProgress,dialog}) => {

    const classes = useStyles();
    const {main,heading,subHeading,topHead,eyeIcon,privateText,progressBar,progressHead
    ,progressLine,progressBaseline,suggestionCard} = classes
    const {user} = useSelector((state)=> state.auth)

    useEffect(()=>{
        if((user?.experience && user?.experience.length!=0) && (user?.education && user?.education.length !=0) && (user?.languages.length!=0)){
             setProgress(100);
        }
    },[dialog])

    useEffect(()=>{
        if(user?.education.length!=0 && user?.languages.length!=0 && user?.experience.length==0){
            setProgress(70)
        }else if(user?.education.length!=0 && user?.languages.length!=0 && user?.experience.length!=0){
            setProgress(100);
        }else if(user?.education.length!=0 || user?.experience.length!=0 || user?.languages.length!=0){
            setProgress(40)
        } else if(user?.education.length==0 && user?.experience.length==0 && user?.languages.length==0){
            setProgress(10)
        }
            
        
    },[user?.education.length,user?.experience.length,user?.languages.length])
    
  return (
    <Paper className={main}>
       <div className={heading}>
           <div className={topHead}>Suggested for you</div>
           <div className={subHeading}>
           <div className={eyeIcon}><Visibility fontSize='small'/></div>
            <div className={privateText}>Private to you</div>
           </div>
       </div>
       <div className={progressBar}>
       <div className={progressHead}>
        Beginner
       </div>
        <div className={progressLine}>
        <LinearProgress variant='determinate' value={
          progress
        } style={{height:'.5rem',borderRadius:'.5rem'}}/>
        </div>
        <div className={progressBaseline}>
            Complete Few Steps to Complete
        </div>
       </div>
       <div className={suggestionCard}>
          {items.map((data)=>(
            <ProfileSuggestionCard setDialog={setDialog} setShowExperience={setShowExperience} setShowEducation={setShowEducation} setShowSkill={setShowSkill} heading={data.name} button={data.button} description={data.description}/>
          ))}
       </div>
    </Paper>
  )
}

export default IncompleteProfile