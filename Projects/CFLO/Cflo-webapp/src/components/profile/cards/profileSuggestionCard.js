import { Button, makeStyles, Paper } from '@material-ui/core'
import { Close } from '@material-ui/icons';
import React from 'react'
const useStyles = makeStyles((theme)=>({
    root:{
      width:'20rem',
      height:'10rem',
      paddingLeft:'.5rem',
      paddingTop:'1rem',
      display:'flex',
      flexDirection:'column',
      alignItems:'start',
      justifyContent:'space-evenly',
      [theme.breakpoints.down("xs")]: {
        alignItems:'center',
        justifyContent:'space-between',
        padding:'1.2rem',
        margin:'.5rem',
        height:'15rem'
    },
    [theme.breakpoints.down("sm")]: {
      alignItems:'center',
      justifyContent:'space-evenly',
      padding:'0.5rem',
      margin:'.3rem'
  },
  [theme.breakpoints.down("md")]: {
    alignItems:'center',
    justifyContent:'space-evenly',
    padding:'0.5rem',
    margin:'.3rem'
},
    },
    btn:{
      [theme.breakpoints.down("xs")]: {
        width:'100%',

    },
    [theme.breakpoints.down("sm")]: {
      width:'100%',

  },
  [theme.breakpoints.down("md")]: {
    width:'100%',

},
    },
    buttonStyle:{
        borderRadius:'10px',
        [theme.breakpoints.down("xs")]: {
          fontSize:'10px',
          borderRadius:'5px',
          width:'100%'
      },
      [theme.breakpoints.down("sm")]: {
        fontSize:'10px',
        width:'100%',
    },
    [theme.breakpoints.down("md")]: {
      fontSize:'10px',
      width:'100%',
  },
    }
}))
const ProfileSuggestionCard = ({heading,description,button,setShowExperience,setDialog,setShowEducation,setShowSkill}) => {
    const classes = useStyles();
    const {root,buttonStyle,btn} = classes
    const handleClick = ()=>{
      
        if(heading === "Have You added Your Experience ?"){
          setDialog("experience")
          setShowExperience(true)
        }else if(heading === "Have you added Your language ?"){
          setDialog("languages")
          setShowSkill(true);
        }else if(heading === "Have you added Your education ?"){
          setDialog("education")
          setShowEducation(true)
        }
      
    }
  return (
    <>
     <Paper className={root} >
            <div>
                <div><h3>{heading}</h3></div>
            </div>
            <div>{description}</div>
            <div className={btn}><Button className={buttonStyle} onClick={handleClick} color='primary' variant='outlined'>
                {button}
            </Button></div>
     </Paper>
    </>
  )
}

export default ProfileSuggestionCard