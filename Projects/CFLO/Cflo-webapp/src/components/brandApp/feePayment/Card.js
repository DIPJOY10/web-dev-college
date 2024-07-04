import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory, useParams } from "react-router-dom";
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';


const useStyles = makeStyles((theme) => ({
  cardCont : {
    width : "300px",
    height : "450px",
    boxShadow: "rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px",
    backgroundColor : "white",
    borderRadius : "5px",
    display : "flex",
    flexDirection : "column",
    justifyContent : "space-around",
    alignItems : "center",
    marginBottom : "20px"
  },
  cardContH : {
    width : "300px",
    // height : "100%",
    height : "350px",
    padding : "10px",
    boxShadow: "rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px",
    backgroundColor : "white",
    borderRadius : "5px",
    display : "flex",
    flexDirection : "column",
    justifyContent : "space-around",
    alignItems : "center",
    marginBottom : "20px"
  },
  styleSubFCol : {
    display : "flex",
    flexDirection : "column",
  },
  styleSubFRow : {
    display : "flex",
    flexDirection : "row",
  }



}));

export default function Card(props) {
  const classes = useStyles();
  const history = useHistory();
  const { } = useParams();
  const { Title, Comicon, PricingRet, MainF, arrSub,colorbg, index, cardClick, card, displayGreeting, setAfterCoupon } = props;
  const { cardCont, cardContH, styleSubFRow, styleSubFCol } = classes;

  return (
    <div className={card?cardCont:cardContH}  >
       <Typography style={{color: colorbg, fontSize: "20px"}} >{Title}</Typography>
       <div>{Comicon}</div>
       <div style={{color: colorbg, fontSize: "17px"}} >{PricingRet}</div>
       <div style={{color: colorbg, fontSize: "14px"}} >{MainF}</div>
       {card ?
       <div>
         <ul>
           {arrSub.map((sub)=>(<li style={{color: colorbg}} >{sub}</li>))}
         </ul>
       </div>:
       null}
       {card?
       <div>
            <Button 
              size="small"
              variant="contained" 
              style={{
                  backgroundColor: colorbg, 
                  color : "white"
                  }} 
              onClick={()=>{cardClick(index)}}
            >CHOOSE</Button>
        </div> :
        <Button 
              size="small"
              variant="contained" 
              style={{
                  backgroundColor: colorbg, 
                  color : "white"
                  }} 
              onClick={()=>{
                displayGreeting(true)  
                setAfterCoupon(true)
                }}
        >CANCEL</Button>
        }
       </div>
  );
}
 